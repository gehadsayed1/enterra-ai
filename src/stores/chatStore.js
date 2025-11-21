import { defineStore } from 'pinia'
import { ref } from 'vue'
import { save, load } from '@/utils/storage'

export const useChatStore = defineStore('chat', () => {
  const messages = ref(load("superai_chat", []))

  function addMessage(msg) {
    messages.value.push({
      id: Date.now(),
      role: msg.role,
      text: msg.text || "",
      file: msg.file || null,
      loading: msg.loading || false,
      createdAt: new Date().toISOString()
    })

    save("superai_chat", messages.value)
  }


  function addBotLoading() {
    messages.value.push({
      id: Date.now(),
      role: "bot",
      text: "",
      file: null,
      loading: true,
      createdAt: new Date().toISOString()
    })

    save("superai_chat", messages.value)
  }

 
  function replaceBotLoading(replyText) {
    const msg = messages.value.find(m => m.loading === true)
    if (msg) {
      msg.loading = false
      msg.text = replyText
    }

    save("superai_chat", messages.value)
  }

  function clearChat() {
    messages.value = []
    save("superai_chat", [])
  }

  return {
    messages,
    addMessage,
    addBotLoading,
    replaceBotLoading,
    clearChat
  }
})
