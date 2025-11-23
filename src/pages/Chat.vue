<template>
  <div class="min-h-screen flex chat-dotted-bg">
    <ChatSidebar />

    <div class="flex-1 flex flex-col">
      <ChatHeader />

      <div
        ref="scrollArea"
        class="flex-1 overflow-y-auto max-h-[calc(100vh-300px)]"
      >
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

import { ref, watch, nextTick } from "vue";

const chat = useChatStore();

const scrollArea = ref(null);

function scrollToBottom() {
  const el = scrollArea.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}

watch(
  () => chat.messages.length,
  async () => {
    await nextTick();
    scrollToBottom();
  }
);
</script>
