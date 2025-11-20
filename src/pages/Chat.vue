<template>
  <div class="min-h-screen flex bg-[#f9f8fc]">

    <!-- Sidebar -->
    <ChatSidebar />

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col">

      <ChatHeader />

      <div class="flex-1 overflow-y-auto">

        <!-- Greeting appears only when no messages -->
        <ChatGreeting v-if="!chat.messages.length" />

        <ChatWindow />
      </div>

      <div class="p-6">
        <ChatInput />
      </div>

    </div>
  </div>
</template>
<script setup>


import ChatInput from '@/components/chat/ChatInput.vue'
import { useChatStore } from '@/stores/chatStore'
import ChatSidebar from '@/components/chat/ChatSidebar.vue'
import ChatHeader from '@/components/chat/ChatHeader.vue'
import ChatGreeting from '@/components/chat/ChatGreeting.vue'
import ChatWindow from '@/components/chat/ChatWindow.vue'

const chat = useChatStore()
</script>
