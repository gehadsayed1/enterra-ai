<template>
  <div class="bg-white rounded-xl shadow-md p-5 mx-10 border border-gray-200 relative overflow-hidden transition-all duration-300">
    <!-- Mode Switcher -->
    <div class="mb-5 flex justify-center">
      <div class="bg-gray-100 p-1 rounded-xl inline-flex gap-1 shadow-inner">
        <button
          type="button"
          @click="setMode('chat')"
          :class="[
            'px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
            !isPptMode 
              ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50',
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.678 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clip-rule="evenodd" />
          </svg>
          Chat
        </button>
        <button
          type="button"
          @click="setMode('ppt')"
          :class="[
            'px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
            isPptMode 
              ? 'bg-white text-orange-600 shadow-sm ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50',
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z" clip-rule="evenodd" />
            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
          </svg>
          PPT Agent
        </button>
      </div>
    </div>

    <!-- PPT Mode Hint -->
    <div
      v-if="isPptMode"
      class="mb-4 rounded-xl border border-orange-100 bg-orange-50/50 px-4 py-3 flex items-start gap-3"
    >
      <div class="p-1.5 bg-orange-100 text-orange-600 rounded-lg shrink-0 mt-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="text-sm text-orange-800">
        <p class="font-medium">Design your presentation</p>
        <p class="text-orange-600/80 text-xs mt-1">Describe the topic, audience, slide count, and style. The agent will generate a complete .pptx file for you.</p>
      </div>
    </div>

    <div class="relative flex items-end group">
      <textarea
        v-model="text"
        :rows="isPptMode ? 5 : 3"
        :maxlength="isPptMode ? 4000 : 1500"
        :placeholder="
          isPptMode
            ? 'E.g., Create a 10-slide pitch deck for a fintech startup targeting Gen Z. Clean, modern style with blue accents...'
            : 'Type your message here...'
        "
        :disabled="isGeneratingPpt"
        class="flex-1 resize-none outline-none text-gray-700 placeholder-gray-400 bg-transparent px-2 py-2 disabled:opacity-50 transition-all mb-1"
        :class="{'min-h-[120px]': isPptMode}"
      ></textarea>

      <!-- Recording Button -->
      <div
        v-if="!isPptMode"
        @click="toggleRecording"
        :class="`w-10 h-10 flex items-center justify-center rounded-xl ml-3 shrink-0 cursor-pointer transition-all duration-300 ${
          isRecording 
            ? 'bg-red-500 shadow-red-200 shadow-lg animate-pulse text-white' 
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
        } ${isGeneratingPpt ? 'opacity-50 pointer-events-none' : ''}`"
        title="Voice Input"
      >
        <svg v-if="!isRecording" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
           <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
           <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
        </svg>
        <div v-else class="w-3 h-3 bg-white rounded-sm animate-spin"></div>
      </div>

      <!-- Submit Button -->
      <button
        type="button"
        class="w-10 h-10 ml-2 flex items-center justify-center rounded-xl shrink-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5"
        :class="isPptMode ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-orange-200' : 'bg-primary text-white shadow-purple-200'"
        :disabled="isGeneratingPpt || !text.trim()"
        @click="submit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-5 h-5 -rotate-50"
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
      class="flex items-center justify-between gap-6 mt-3 pt-3 border-t border-gray-100"
    >
      <span class="text-gray-400 text-xs font-mono">
        {{ text.length }}/{{ isPptMode ? 4000 : 1500 }} chars
      </span>

      <div v-if="isGeneratingPpt" class="flex items-center gap-2 text-xs font-medium text-orange-600 animate-pulse">
        <svg class="animate-spin h-3 w-3 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>AI is working...</span>
      </div>

      <!-- <button
        v-else-if="!isPptMode"
        type="button"
        class="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary hover:bg-purple-50 transition-colors px-2.5 py-1.5 rounded-lg"
        title="Export Chat to Word"
        @click="exportChat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        <span>Export to Word</span>
      </button> -->
    </div>

    <!-- Progress Indicator -->
    <div
      v-if="isGeneratingPpt"
      class="mt-5 rounded-xl border border-orange-200 bg-white p-5 shadow-sm relative overflow-hidden"
    >
      <!-- Background Abstract Shape -->
      <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-100 rounded-full opacity-50 blur-xl"></div>
    
      <div class="flex items-center justify-between text-sm font-bold text-gray-800 mb-3 relative z-10">
        <div class="flex items-center gap-2">
            <div class="p-1.5 bg-orange-100 rounded-lg text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                    <path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z" clip-rule="evenodd" />
                    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
            </div>
            <span>Generating Presentation...</span>
        </div>
        <span class="text-orange-600 font-mono">{{ progressValue }}%</span>
      </div>

      <div class="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden relative z-10">
        <div
          class="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
          :style="{ width: `${progressValue}%` }"
        >
            <div class="w-full h-full opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)50%,rgba(255,255,255,0.2)75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-bar-stripes_1s_linear_infinite]"></div>
        </div>
      </div>
      
      <div class="mt-3 flex gap-3 overflow-hidden relative z-10">
          <div v-for="(step, idx) in progressSteps" :key="idx" 
               class="flex-1 flex flex-col gap-1 transition-opacity duration-300"
               :class="idx === progressIndex ? 'opacity-100' : 'opacity-40 blur-[0.5px] scale-95 origin-left'">
               <div class="h-1 w-8 rounded-full transition-colors duration-300" 
                    :class="idx <= progressIndex ? 'bg-orange-500' : 'bg-gray-200'"></div>
               <span class="text-[10px] font-medium text-gray-600 leading-tight" 
                     :class="{'text-orange-700 font-bold': idx === progressIndex}">
                   {{ step }}
               </span>
          </div>
      </div>
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
