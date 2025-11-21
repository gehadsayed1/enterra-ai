<template>
  <div class="min-h-screen flex chat-dotted-bg">
    <ChatSidebar />

    <div class="flex-1 flex flex-col">
      <ChatHeader />

      <div class="flex-1 overflow-y-auto">
        <div class="flex flex-col items-center justify-center mt-10 mb-6 gap-8">
          <ChatGreeting v-if="!chat.messages.length" />
          <QuickActions v-if="!chat.messages.length" />
        </div>

        <ChatWindow />
      </div>

      <div class="p-6">
        <ChatInput />
      </div>
    </div>
  </div>
</template>
<script setup>
import ChatInput from "@/components/chat/ChatInput.vue";
import { useChatStore } from "@/stores/chatStore";
import ChatSidebar from "@/components/chat/ChatSidebar.vue";
import ChatHeader from "@/components/chat/ChatHeader.vue";
import ChatGreeting from "@/components/chat/ChatGreeting.vue";
import ChatWindow from "@/components/chat/ChatWindow.vue";
import QuickActions from "@/components/chat/QuickActions.vue";

const chat = useChatStore();
</script>
