import { defineStore } from "pinia";
import { ref } from "vue";
import { save, load } from "@/utils/storage";
import { chatService } from "@/services/chatService";


export const useChatStore = defineStore("chat", () => {
  const messages = ref(load("superai_chat", []));

  const history = ref(load("superai_chat_history", []));

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

  function replaceBotLoading(replyText) {
    const msg = messages.value.find((m) => m.loading === true && m.role === "bot");
    if (msg) {
      msg.loading = false;
      msg.text = replyText;
    }

    save("superai_chat", messages.value);
  }

  function replaceVoiceLoading(transcript) {
    const msg = messages.value.find((m) => m.loading === true && m.role === "user");
    if (msg) {
      msg.loading = false;
      msg.text = transcript;
      msg.type = "text"; 
    }
    save("superai_chat", messages.value);
  }

  function newChat() {
    if (messages.value.length > 0) {
      history.value.push({
        id: Date.now(),
        title: messages.value[0]?.text?.slice(0, 30) || "New Chat",
        messages: [...messages.value],
        createdAt: new Date().toISOString(),
      });

      save("superai_chat_history", history.value);
    }

    messages.value = [];
    save("superai_chat", []);
  }

  function loadChat(chatId) {
    const prev = history.value.find((h) => h.id === chatId);
    if (!prev) return;

    messages.value = [...prev.messages];

    save("superai_chat", messages.value);
  }
async function sendMessageToAPI(userText) {
  addMessage({ role: "user", text: userText });

  addBotLoading();
console.log(userText);

  try {
    const data = await chatService.sendMessage(userText);
    console.log(data);
    

    replaceBotLoading(data.answer || "No reply found.");
  } catch (err) {

    console.log("rerror:", err);
    
    replaceBotLoading(
      err.response?.data?.detail || "Error occurred while fetching response."
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

  function clearHistory() {
    history.value = [];
    save("superai_chat_history", []);
  }

  return {
    messages,
    history,
    addMessage,
    addBotLoading,
    addVoiceLoading,
    replaceBotLoading,
    replaceVoiceLoading,
    sendMessageToAPI,
    newChat,
    loadChat,
    clearChat,
    deleteChat,
    clearHistory,
  };
});
