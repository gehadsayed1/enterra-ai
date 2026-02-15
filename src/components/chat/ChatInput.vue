<template>
  <div class="bg-white rounded-xl shadow-md p-5 mx-10 border border-gray-200">
    <div class="mb-4 flex items-center gap-2 bg-gray-100 rounded-xl p-1 w-fit">
      <button
        type="button"
        @click="setMode('chat')"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-semibold transition',
          !isPptMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900',
        ]"
      >
        Chat
      </button>
      <button
        type="button"
        @click="setMode('ppt')"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-semibold transition',
          isPptMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900',
        ]"
      >
        PPT Agent
      </button>
    </div>

    <div
      v-if="isPptMode"
      class="mb-3 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-700"
    >
      Describe the presentation you want, and the agent will generate a downloadable PPT file.
    </div>

    <div class="relative flex items-start">
      <textarea
        v-model="text"
        :rows="isPptMode ? 6 : 3"
        :maxlength="isPptMode ? 4000 : 1500"
        :placeholder="
          isPptMode
            ? 'Describe your PPT in detail: title, audience, slide structure, tone, and key points...'
            : 'Ask me anything...'
        "
        :disabled="isGeneratingPpt"
        class="flex-1 resize-none outline-none text-gray-700 placeholder-gray-400 bg-transparent px-1 pt-1 disabled:opacity-70"
      ></textarea>

      <div
        v-if="!isPptMode"
        @click="toggleRecording"
        :class="`w-12 h-12 text-white flex items-center cursor-pointer justify-center rounded-xl ml-3 shrink-0 ${
          isRecording ? 'bg-black animate-pulse' : 'bg-primary'
        } ${isGeneratingPpt ? 'opacity-50 pointer-events-none' : ''}`"
      >
        <svg
          v-if="!isRecording"
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
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" />
        </svg>
      </div>

      <button
        type="button"
        class="w-12 h-12 bg-primary cursor-pointer text-white flex items-center justify-center rounded-xl ml-3 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isGeneratingPpt"
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
      <span class="text-gray-400 text-xs">
        {{ text.length }}/{{ isPptMode ? 4000 : 1500 }}
      </span>

      <div v-if="isGeneratingPpt" class="flex items-center gap-2 text-xs text-orange-700">
        <span class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
        <span>{{ currentProgressLabel }}</span>
      </div>

      <button
        v-else-if="!isPptMode"
        type="button"
        class="flex items-center gap-1.5 text-xs cursor-pointer text-gray-500 hover:text-primary transition px-2 py-1 rounded-md hover:bg-gray-100"
        title="Export Chat to Word"
        @click="exportChat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        <span>Export Chat</span>
      </button>
    </div>

    <div
      v-if="isGeneratingPpt"
      class="mt-4 rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-4"
    >
      <div class="flex items-center justify-between text-xs font-semibold text-orange-700">
        <span>Generating Presentation</span>
        <span>{{ progressValue }}%</span>
      </div>
      <div class="mt-2 h-2 w-full rounded-full bg-orange-100 overflow-hidden">
        <div
          class="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-500"
          :style="{ width: `${progressValue}%` }"
        ></div>
      </div>
      <p class="mt-2 text-xs text-orange-700">{{ currentProgressLabel }}</p>
    </div>
  </div>

  <p class="text-center mt-2 text-gray-600 text-md">
    ENTERRA may display inaccurate info, so please double check the response.
    Your Privacy & ENTERRA AI
  </p>
</template>

<script setup>
import { computed, nextTick, onUnmounted, ref } from "vue";
import { useChatStore } from "@/stores/chatStore";

const chat = useChatStore();
const text = ref("");
const isRecording = ref(false);
const recognition = ref(null);
const isGeneratingPpt = ref(false);
const progressValue = ref(0);
const progressIndex = ref(0);

const progressSteps = [
  "Reading prompt and planning slides...",
  "Building slide storyline...",
  "Generating content and layout...",
  "Finalizing and preparing download link...",
];

const activeMode = computed(() => chat.activeMode);
const isPptMode = computed(() => activeMode.value === "ppt");
const currentProgressLabel = computed(
  () => progressSteps[Math.min(progressIndex.value, progressSteps.length - 1)],
);

let baseText = "";
let progressTimer = null;

function setMode(mode) {
  if (isGeneratingPpt.value) return;
  chat.setActiveMode(mode);
  text.value = "";
  if (isRecording.value) {
    stopRecording();
  }
}

function toggleRecording() {
  if (isGeneratingPpt.value || isPptMode.value) return;
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
}

function startRecording() {
  if (!recognition.value) {
    if (!initSpeechRecognition()) return;
  }

  baseText = text.value ? `${text.value} ` : "";
  recognition.value.start();
}

function stopRecording() {
  if (recognition.value) {
    recognition.value.stop();
  }
}

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Your browser does not support speech recognition.");
    return false;
  }

  recognition.value = new SpeechRecognition();
  recognition.value.lang = "ar-SA";
  recognition.value.continuous = true;
  recognition.value.interimResults = true;

  recognition.value.onstart = () => {
    isRecording.value = true;
  };

  recognition.value.onend = () => {
    isRecording.value = false;
  };

  recognition.value.onresult = (event) => {
    let fullTranscript = "";
    for (let i = 0; i < event.results.length; i += 1) {
      fullTranscript += event.results[i][0].transcript;
    }
    text.value = baseText + fullTranscript;
  };

  recognition.value.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    if (event.error === "not-allowed") {
      alert("Please allow microphone access.");
    }
    isRecording.value = false;
  };

  return true;
}

function startFakeProgress() {
  stopFakeProgress(false);
  isGeneratingPpt.value = true;
  progressValue.value = 8;
  progressIndex.value = 0;

  progressTimer = setInterval(() => {
    if (progressValue.value < 92) {
      const increment = Math.floor(Math.random() * 7) + 2;
      progressValue.value = Math.min(92, progressValue.value + increment);
    }

    if (progressValue.value >= 25) progressIndex.value = 1;
    if (progressValue.value >= 50) progressIndex.value = 2;
    if (progressValue.value >= 75) progressIndex.value = 3;
  }, 900);
}

function stopFakeProgress(success = true) {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }

  if (success) {
    progressValue.value = 100;
    progressIndex.value = progressSteps.length - 1;
  } else {
    progressValue.value = 0;
    progressIndex.value = 0;
    isGeneratingPpt.value = false;
  }
}

async function submit() {
  if (!text.value.trim() || isGeneratingPpt.value) return;

  const msg = text.value.trim();
  text.value = "";
  await nextTick();

  const sendingPpt = isPptMode.value;
  if (sendingPpt) {
    startFakeProgress();
  }

  try {
    await chat.sendMessageToAPI(msg, false, { mode: activeMode.value });
  } finally {
    if (sendingPpt) {
      stopFakeProgress(true);
      setTimeout(() => {
        isGeneratingPpt.value = false;
        progressValue.value = 0;
        progressIndex.value = 0;
      }, 700);
    }
  }
}

async function exportChat() {
  await chat.exportChatToWord();
}

onUnmounted(() => {
  stopFakeProgress(false);
  if (recognition.value && isRecording.value) {
    recognition.value.stop();
  }
});
</script>
