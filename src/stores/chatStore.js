import { defineStore } from "pinia";
import { ref } from "vue";
import { save, load } from "@/utils/storage";
import { chatService } from "@/services/chatService";
import { useFilesStore } from "./filesStore";
import { useToast } from "vue-toastification";

export const useChatStore = defineStore("chat", () => {
  const messages = ref(load("superai_chat", []));
  const history = ref(load("superai_chat_history", []));

  // Session management
  const threadId = ref(
    localStorage.getItem("ent-thread-id") || `thread_${Date.now()}`
  );
  const userId = ref(
    localStorage.getItem("ent-user-id") || `user_${Date.now()}`
  );

  if (!localStorage.getItem("ent-thread-id"))
    localStorage.setItem("ent-thread-id", threadId.value);
  if (!localStorage.getItem("ent-user-id"))
    localStorage.setItem("ent-user-id", userId.value);

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

  function replaceBotLoading(replyText, options = {}) {
    const msg = messages.value.find(
      (m) => m.loading === true && m.role === "bot"
    );
    if (msg) {
      msg.loading = false;
      msg.text = replyText;
      msg.hasVoicePlayback = true;
      msg.shouldPlay = true;
      if (options.audio) {
        msg.audio = options.audio; // Can be Base64 string now
      }
      if (options.citations) {
        msg.citations = options.citations;
      }
    }

    save("superai_chat", messages.value);
  }

  function replaceVoiceLoading(transcript) {
    const msg = messages.value.find(
      (m) => m.loading === true && m.role === "user"
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
      // Create a lightweight version of messages for history (remove audio/heavy data)
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

      // Keep only last 20 chats to prevent overflowing storage
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

  async function sendMessageToAPI(userText, isVoice = false) {
    addMessage({ role: "user", text: userText });

    addBotLoading();
    console.log(userText);

    const filesStore = useFilesStore();
    const docSetId = filesStore.currentDocSetId;

    if (!docSetId) {
      replaceBotLoading("⚠️ Please upload a document to start the chat.");
      return;
    }

    try {
      // isVoice is ignored for logic now as we treat all as chat message,
      // but response might have audio if server generates it.

      const data = await chatService.sendMessage(
        userText,
        docSetId,
        threadId.value,
        userId.value
      );
      console.log(data);

      replaceBotLoading(data.answer || "No reply found.", {
        isVoice,
        audio: data.audio,
        citations: data.citations,
      });
    } catch (err) {
      console.log("rerror:", err);

      replaceBotLoading(
        err.response?.data?.detail || "Error occurred while fetching response.",
        { isVoice }
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
    const toast = useToast(); // Ensure toast is initialized or available

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
        threadId.value
      );

      // Remove loading toast
      toast.dismiss(toastId);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `enterra_chat_${new Date().toISOString().slice(0, 10)}.docx`
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

  function clearHistory() {
    history.value = [];
    save("superai_chat_history", []);
  }

  // Initialize: ensure no messages auto-play on reload
  messages.value.forEach((m) => (m.shouldPlay = false));

  return {
    messages,
    history,
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
  };
});
