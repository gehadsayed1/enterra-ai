<template>
  <div class="bg-white px-6 py-4 rounded-2xl shadow-md flex items-center gap-3">
    <!-- Input box like screenshot -->
    <div class="flex-1 relative">
      <input
        v-model="text"
        class="0 outline-none"
        placeholder="Ask me anything..."
        @keyup.enter="submit"
      />

      <!-- Counter like screenshot -->
      <span class="absolute bottom-3 right-4 text-gray-400 text-xs">
        {{ text.length }}/1500
      </span>
    </div>

    <!-- Send button icon style -->
    <button
      class="w-12 h-12 cursor-pointer bg-primary text-white flex items-center justify-center rounded-xl"
      @click="submit"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6 -rotate-50"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
        />
      </svg>
    </button>
  </div>
</template>
<script setup>
import { useChatStore } from "@/stores/chatStore";
import { ref } from "vue";

const text = ref("");
const chat = useChatStore();

function submit() {
  if (!text.value.trim()) return;

  // 1) رسالة اليوزر
  chat.addMessage({
    role: "user",
    text: text.value,
  });

  // امسح الانبوت
  text.value = "";

  // 2) أضف رسالة لودينج للبوت
  chat.addBotLoading();

  // 3) رد تلقائي بعد 1.5 ثانية
  setTimeout(() => {
    chat.replaceBotLoading("تمام، وصلني الكلام… أقدر أساعدك إزاي؟");
  }, 1500);
}
</script>
