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
          <template v-if="!chat.messages.length">
            <ChatGreeting v-if="chat.activeMode !== 'ppt'" />
            <QuickActions v-if="chat.activeMode !== 'ppt'" />

            <div
              v-else
              class="max-w-2xl mx-auto text-center bg-white border border-orange-200 rounded-2xl shadow-sm p-8"
            >
              <h3 class="text-2xl font-semibold text-gray-800">
                PPT Agent Ready
              </h3>
              <p class="mt-3 text-gray-600">
                Write a detailed brief in the input below, then wait for the generated PowerPoint download link.
              </p>
            </div>
          </template>
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

import { ref, watch, nextTick, onMounted } from "vue";

const chat = useChatStore();

onMounted(() => {
  chat.newChat();
});

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
