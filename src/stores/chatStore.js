import { defineStore } from "pinia";
import { ref } from "vue";
import { save, load } from "@/utils/storage";
import { chatService } from "@/services/chatService";
import { useFilesStore } from "./filesStore";
import { useToast } from "vue-toastification";
import { CONFIG } from "@/config";

export const useChatStore = defineStore("chat", () => {
  const messages = ref(load("superai_chat", []));
  const history = ref(load("superai_chat_history", []));
  const activeMode = ref(load("superai_chat_mode", "chat"));

  const threadId = ref(
    localStorage.getItem("ent-thread-id") || `thread_${Date.now()}`,
  );
  const userId = ref(
    localStorage.getItem("ent-user-id") || `user_${Date.now()}`,
  );

  if (!localStorage.getItem("ent-thread-id")) {
    localStorage.setItem("ent-thread-id", threadId.value);
  }
  if (!localStorage.getItem("ent-user-id")) {
    localStorage.setItem("ent-user-id", userId.value);
  }

  function setActiveMode(mode) {
    activeMode.value = mode === "ppt" ? "ppt" : "chat";
    save("superai_chat_mode", activeMode.value);
  }

  function addMessage(msg) {
    const isFirstMessage = messages.value.length === 0;

    messages.value.push({
      id: Date.now(),
      role: msg.role,
      text: msg.text || "",
      file: msg.file || null,
      loading: msg.loading || false,
      title: isFirstMessage ? msg.text?.slice(0, 25) || "New Chat" : null,
      createdAt: new Date().toISOString(),
    });

    save("superai_chat", messages.value);
  }

  function addBotLoading() {
    messages.value.push({
      id: Date.now(),
      role: "bot",
      text: "",
      file: null,
      loading: true,
      createdAt: new Date().toISOString(),
    });

    save("superai_chat", messages.value);
  }

  function addVoiceLoading() {
    messages.value.push({
      id: Date.now(),
      role: "user",
      text: "",
      type: "voice",
      loading: true,
      createdAt: new Date().toISOString(),
    });
    save("superai_chat", messages.value);
  }

  function buildPptPrompt(userText) {
    return [
      "Make a PowerPoint presentation about:",
      userText,
      "",
      "Return a direct download link for the generated .pptx file.",
    ].join("\n");
  }

  function detectPptDownloadTarget(replyText = "") {
    const protocolRelativeMatch = replyText.match(
      /(\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?\/[^\s)]+\.pptx)/i,
    );
    if (protocolRelativeMatch) {
      return {
        serverFilePath: null,
        downloadUrl: normalizeDownloadUrl(protocolRelativeMatch[1]),
      };
    }

    const pathMatch = replyText.match(/`?(\/(?!\/)[^`\s]+\.pptx)`?/i);
    if (pathMatch) {
      return { serverFilePath: pathMatch[1], downloadUrl: null };
    }

    const markdownLinkMatch = replyText.match(
      /\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/i,
    );
    if (markdownLinkMatch) {
      return {
        serverFilePath: null,
        downloadUrl: normalizeDownloadUrl(markdownLinkMatch[1]),
      };
    }

    const urlMatch = replyText.match(/(https?:\/\/[^\s<>"]+)/i);
    if (urlMatch) {
      return {
        serverFilePath: null,
        downloadUrl: normalizeDownloadUrl(urlMatch[1]),
      };
    }

    return { serverFilePath: null, downloadUrl: null };
  }

  function normalizeDownloadUrl(rawUrl) {
    if (!rawUrl) return rawUrl;
    try {
      const productionBase = new URL(CONFIG.API_BASE_URL);
      const withScheme = rawUrl.startsWith("//")
        ? `${productionBase.protocol}${rawUrl}`
        : rawUrl;
      const url = new URL(withScheme);
      const isLocalHost =
        url.hostname === "localhost" ||
        url.hostname === "127.0.0.1" ||
        url.hostname === "0.0.0.0";
      if (!isLocalHost) return withScheme;

      return `${productionBase.origin}${url.pathname}${url.search}${url.hash}`;
    } catch {
      return rawUrl;
    }
  }

  function replaceBotLoading(replyText, options = {}) {
    const msg = messages.value.find(
      (m) => m.loading === true && m.role === "bot",
    );
    if (msg) {
      msg.loading = false;
      msg.text = replyText;
      msg.hasVoicePlayback = true;
      msg.shouldPlay = true;
      if (options.audio) {
        msg.audio = options.audio;
      }
      if (options.citations) {
        msg.citations = options.citations;
      }

      const { serverFilePath, downloadUrl } =
        detectPptDownloadTarget(replyText);
      if (serverFilePath) {
        msg.serverFilePath = serverFilePath;
      }
      if (downloadUrl) {
        msg.downloadUrl = downloadUrl;
      }
      if (serverFilePath || downloadUrl) {
        msg.pptReady = true;
      }
    }

    save("superai_chat", messages.value);
  }

  function replaceVoiceLoading(transcript) {
    const msg = messages.value.find(
      (m) => m.loading === true && m.role === "user",
    );
    if (msg) {
      msg.loading = false;
      msg.text = transcript;
      msg.type = "text";
    }
    save("superai_chat", messages.value);
  }

  function markAsPlayed(messageId) {
    const msg = messages.value.find((m) => m.id === messageId);
    if (msg) {
      msg.shouldPlay = false;
      save("superai_chat", messages.value);
    }
  }

  function newChat() {
    if (messages.value.length > 0) {
      const lightweightMessages = messages.value.map((m) => {
        const { audio, ...rest } = m;
        return rest;
      });

      history.value.push({
        id: Date.now(),
        title: messages.value[0]?.text?.slice(0, 30) || "New Chat",
        messages: lightweightMessages,
        createdAt: new Date().toISOString(),
      });

      if (history.value.length > 20) {
        history.value = history.value.slice(-20);
      }

      save("superai_chat_history", history.value);
    }

    messages.value = [];
    threadId.value = `thread_${Date.now()}`;
    localStorage.setItem("ent-thread-id", threadId.value);
    save("superai_chat", []);
  }

  function loadChat(chatId) {
    const prev = history.value.find((h) => h.id === chatId);
    if (!prev) return;

    messages.value = prev.messages.map((m) => ({ ...m, shouldPlay: false }));
    save("superai_chat", messages.value);
  }

  async function sendMessageToAPI(userText, isVoice = false, options = {}) {
    const mode = options.mode === "ppt" ? "ppt" : "chat";
    addMessage({ role: "user", text: userText });
    addBotLoading();

    const filesStore = useFilesStore();
    const docSetId = filesStore.currentDocSetId;

    if (!docSetId) {
      replaceBotLoading("Please upload a document first to start chatting.");
      return;
    }

    try {
      const messageToSend =
        mode === "ppt" ? buildPptPrompt(userText) : userText;
      const data = await chatService.sendMessage(
        messageToSend,
        docSetId,
        threadId.value,
        userId.value,
        { timeoutMs: mode === "ppt" ? 180000 : 60000 },
      );

      replaceBotLoading(data.answer || "No reply found.", {
        isVoice,
        audio: data.audio,
        citations: data.citations,
      });
    } catch (err) {
      replaceBotLoading(
        err.response?.data?.detail || "Error occurred while fetching response.",
        { isVoice },
      );
    }
  }

  function clearChat() {
    messages.value = [];
    save("superai_chat", []);
  }

  function deleteChat(chatId) {
    history.value = history.value.filter((h) => h.id !== chatId);
    save("superai_chat_history", history.value);
  }

  async function exportChatToWord() {
    const filesStore = useFilesStore();
    const toast = useToast();

    if (!filesStore.currentDocSetId) {
      toast.warning("No active document set used in this chat to export.");
      return;
    }

    if (messages.value.length === 0) {
      toast.info("Start a conversation first before exporting.");
      return;
    }

    const toastId = toast.info("Generating Word document...", {
      timeout: false,
    });

    try {
      const blob = await chatService.exportDocx(
        filesStore.currentDocSetId,
        threadId.value,
      );

      toast.dismiss(toastId);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `enterra_chat_${new Date().toISOString().slice(0, 10)}.docx`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      toast.success("Export downloaded successfully!");
    } catch (e) {
      toast.dismiss(toastId);
      console.error("Export failed", e);
      toast.error("Failed to export chat. Please try again.");
    }
  }

  async function downloadLocalFile(filePathOrUrl) {
    const toast = useToast();
    const toastId = toast.info("Downloading file...", { timeout: false });

    try {
      const pptMatch =
        filePathOrUrl &&
        filePathOrUrl.match(/(?:^|[\\/])([^\\/?#]+\.pptx)(?:[?#]|$)/i);

      if (pptMatch) {
        const filename = pptMatch[1];

        try {
          const response = await fetch(
            `${CONFIG.API_BASE_URL}/ppt-downloads-url/${filename}`,
          );

          if (!response.ok) {
            throw new Error(
              `Failed to fetch PPT download URL: ${response.statusText}`,
            );
          }

          const data = await response.json();

          if (data.download_url) {
            try {
              const pptRes = await fetch(data.download_url);
              if (!pptRes.ok)
                throw new Error(`Failed to download PPT: ${pptRes.statusText}`);
              const blob = await pptRes.blob();
              const url = window.URL.createObjectURL(blob);

              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", filename);
              document.body.appendChild(link);
              link.click();
              link.parentNode.removeChild(link);
              window.URL.revokeObjectURL(url);

              toast.dismiss(toastId);
              toast.success("Download started successfully!");
              return;
            } catch (pptErr) {
              console.error("PPT blob download failed", pptErr);
              throw pptErr;
            }
          }
        } catch (err) {
          console.error("PPT download resolution failed", err);
          throw err;
        }
      }

      const normalizedInput = normalizeDownloadUrl(filePathOrUrl);
      const productionBase = new URL(CONFIG.API_BASE_URL);

      if (
        normalizedInput.startsWith("/ppt-downloads/") ||
        normalizedInput.startsWith(`${productionBase.origin}/ppt-downloads/`)
      ) {
        const directUrl = normalizedInput.startsWith("http")
          ? normalizedInput
          : `${productionBase.origin}${normalizedInput}`;
        const fileName = directUrl.split("/").pop();
        const link = document.createElement("a");
        link.href = directUrl;
        link.setAttribute("download", fileName);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        toast.dismiss(toastId);
        toast.success("Download started successfully!");
        return;
      }

      if (normalizedInput.startsWith("/")) {
        const blob = await chatService.downloadFile(normalizedInput);
        const fileName = normalizedInput.split("/").pop();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const fileName = normalizedInput.split("/").pop();
        const link = document.createElement("a");
        link.href = normalizedInput;
        link.setAttribute("download", fileName);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }

      toast.dismiss(toastId);
      toast.success("Download started successfully!");
    } catch (e) {
      toast.dismiss(toastId);
      console.error("Download failed", e);
      toast.error("Failed to download file from server.");
    }
  }

  function clearHistory() {
    history.value = [];
    save("superai_chat_history", []);
  }

  messages.value.forEach((m) => (m.shouldPlay = false));

  return {
    messages,
    history,
    activeMode,
    setActiveMode,
    addMessage,
    addBotLoading,
    addVoiceLoading,
    replaceBotLoading,
    replaceVoiceLoading,
    sendMessageToAPI,
    markAsPlayed,
    newChat,
    loadChat,
    clearChat,
    deleteChat,
    clearHistory,
    exportChatToWord,
    downloadLocalFile,
  };
});
