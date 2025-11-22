import { defineStore } from "pinia";
import { ref } from "vue";
import { save, load } from "@/utils/storage";

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

  function replaceBotLoading(replyText) {
    const msg = messages.value.find((m) => m.loading === true);
    if (msg) {
      msg.loading = false;
      msg.text = replyText;
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

  function clearChat() {
    messages.value = [];
    save("superai_chat", []);
  }

  return {
    messages,
    history,
    addMessage,
    addBotLoading,
    replaceBotLoading,
    newChat,
    loadChat,
    clearChat,
  };
});
