<template>
  <div class="bg-white rounded-xl shadow-md p-5 mx-10 border border-gray-200">
    <div class="relative flex items-start">
      <textarea
        v-model="text"
        rows="3"
        maxlength="1500"
        placeholder="Ask me anything..."
        class="flex-1 resize-none outline-none text-gray-700 placeholder-gray-400 bg-transparent px-1 pt-1"
      ></textarea>
      <div
        @click="isMuted = !isMuted"
        :class="`w-12 h-12  text-white flex items-center cursor-pointer justify-center rounded-xl ml-3 shrink-0 relative ${
          isMuted ? 'bg-gray-400' : 'bg-primary'
        }`"
      >
        <svg
          v-if="!isMuted"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 1.5a3 3 0 00-3 3V12a3 3 0 006 0V4.5a3 3 0 00-3-3zM19.5 10.5a7.5 7.5 0 01-15 0M12 21v-3"
          />
        </svg>

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 1.5a3 3 0 00-3 3V12a3 3 0 006 0V4.5a3 3 0 00-3-3zM19.5 10.5a7.5 7.5 0 01-15 0M12 21v-3"
          />
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 20L20 4" />
        </svg>
      </div>

      <button
        class="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-xl ml-3 shrink-0"
        @click="submit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 -rotate-50"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
      </button>
    </div>

    <div
      class="flex items-center justify-between gap-6 mt-4 text-sm text-gray-500"
    >
      <div class="flex items-center gap-6">
        <!-- Add Attachment -->
        <div
          class="flex items-center gap-2 cursor-pointer text-primary"
          @click="fileInput.click()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add Attachment
        </div>

        <!-- Use Image -->
        <div
          class="flex items-center gap-2 cursor-pointer text-primary"
          @click="imageInput.click()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5l6-6 4 4 8.5-8.5M21 15v4.5A1.5 1.5 0 0119.5 21H4.5A1.5 1.5 0 013 19.5V4.5A1.5 1.5 0 014.5 3H15"
            />
          </svg>
          Use Image
        </div>
      </div>

      <span class="text-gray-400 text-xs"> {{ text.length }}/1500 </span>
    </div>
  </div>
  <p class="text-center mt-2 text-gray-600 text-md">
    Centra may display inaccurate info, so please double check the response.
    Your Privacy & Centra AI
  </p>

  <input
    type="file"
    ref="fileInput"
    class="hidden"
    @change="handleFileSelect"
  />

  <input
    type="file"
    accept="image/*"
    ref="imageInput"
    class="hidden"
    @change="handleImageSelect"
  />
</template>
<script setup>
import { useChatStore } from "@/stores/chatStore";
import { ref } from "vue";

const text = ref("");
const chat = useChatStore();
const isMuted = ref(false);
const fileInput = ref(null);
const imageInput = ref(null);

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  chat.addMessage({
    role: "user",
    text: `📎 Attached file: ${file.name}`,
  });
}

function handleImageSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  chat.addMessage({
    role: "user",
    text: ` Attached image: ${file.name}`,
  });
}

function submit() {
  if (!text.value.trim()) return;

  chat.addMessage({
    role: "user",
    text: text.value,
  });

  text.value = "";

  chat.addBotLoading();

  setTimeout(() => {
    chat.replaceBotLoading("تمام… قولّي عايز تعمل إيه؟");
  }, 1500);
}
</script>
