<template>
  <div
    class="flex items-center justify-end px-10 py-4 gap-2 shadow-md bg-white"
  >

    <button
      @click="goToDashboard"
      class="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-gray-200 transition cursor-pointer"
      title="Go to Dashboard"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z" clip-rule="evenodd" />
      </svg>
      <span class="text-sm">Dashboard</span>
    </button>

    <button
      @click="handleNewChat"
      class="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-primary/80 transition cursor-pointer"
    >
      <span class="text-xl leading-none">+</span>
      <span class="text-sm">New Chat</span>
    </button>
  </div>
</template>
<script setup>
import { useChatStore } from '@/stores/chatStore';
import { useRouter } from 'vue-router';

const chat = useChatStore();
const router = useRouter();

function handleNewChat() {
  chat.newChat();
}

function goToDashboard() {
  router.push('/admin/dashboard');
}
</script>
