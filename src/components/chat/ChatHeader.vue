<template>
  <div
    class="flex items-center justify-end px-10 py-4 gap-2 shadow-md bg-white"
  >
    <button
      @click="handleNewChat"
      class="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-gray-900 transition cursor-pointer"
    >
      <span class="text-xl leading-none">+</span>
      <span class="text-sm">New Chat</span>
    </button>
  </div>
</template>
<script setup>
import { useChatStore } from '@/stores/chatStore';

const chat = useChatStore()

function handleNewChat() {
  chat.newChat()    // يعمل حفظ الشات القديم ويفتح واحد جديدة
}
</script>
