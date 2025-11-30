<template>
  <div
    class="flex"
    :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
  >
    <div
      :class="[
        'relative max-w-xl px-4 py-3 rounded-2xl shadow-sm',
        msg.role === 'user'
          ? 'bg-primary text-white rounded-br-none'
          : 'bg-white text-gray-800 rounded-bl-none',
      ]"
    >
      <div v-if="msg.loading">
        <div v-if="msg.role === 'user'" class="flex items-center gap-1 h-6">
          <span class="w-1 bg-white rounded-full animate-voice-1"></span>
          <span class="w-1 bg-white rounded-full animate-voice-2"></span>
          <span class="w-1 bg-white rounded-full animate-voice-3"></span>
          <span class="w-1 bg-white rounded-full animate-voice-2"></span>
          <span class="w-1 bg-white rounded-full animate-voice-1"></span>
        </div>

        <div v-else class="flex items-center gap-1">
          <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
          <span
            class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"
          ></span>
          <span
            class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"
          ></span>
        </div>
      </div>

      <div v-else>
        {{ msg.text }}
        
        <div v-if="msg.hasVoicePlayback" class="mt-2 border-t border-gray-100 pt-2">
          <button 
            v-if="isPlaying"
            @click="stopAudio" 
            class="text-xs text-red-500 flex items-center gap-1 hover:text-red-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM9 8.25a.75.75 0 00-.75.75v6c0 .414.336.75.75.75h6a.75.75 0 00.75-.75v-6a.75.75 0 00-.75-.75H9z" clip-rule="evenodd" />
            </svg>
            Stop Audio
          </button>
          
          <button 
            v-else
            @click="playAudio" 
            class="text-xs text-primary flex items-center gap-1 hover:text-purple-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clip-rule="evenodd" />
            </svg>
            Play Audio
          </button>
        </div>
      </div>

      <span
        v-if="msg.role === 'user'"
        class="absolute w-3 h-3 bg-primary right-0 bottom-0 translate-x-0 translate-y-0 -rotate-90"
      ></span>

      <span
        v-else
        class="absolute w-3 h-3 left-0 bottom-0 -translate-x-1 translate-y-1 rotate-90"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useChatStore } from "@/stores/chatStore";

const props = defineProps(["msg"]);
const chat = useChatStore();
const isPlaying = ref(false);

function detectLanguage(text) {
  const arabicPattern = /[\u0600-\u06FF]/;
  const frenchPattern = /[àâçéèêëîïôûùüÿñæœ]/i;
  
  if (arabicPattern.test(text)) return 'ar-SA';
  if (frenchPattern.test(text)) return 'fr-FR';
  return 'en-US';
}

function getFemaleVoice(lang) {
  const voices = window.speechSynthesis.getVoices();
  // Match language code (e.g. 'ar' matches 'ar-SA', 'ar-EG')
  const langPrefix = lang.split('-')[0];
  const langVoices = voices.filter(v => v.lang.startsWith(langPrefix));
  
  if (langVoices.length === 0) return null;

  // Heuristic for female voices
  const femaleKeywords = ['female', 'woman', 'hoda', 'zira', 'samantha', 'google', 'amelie', 'hortense', 'monica', 'fiona', 'karen'];
  
  const femaleVoice = langVoices.find(v => {
    const name = v.name.toLowerCase();
    return femaleKeywords.some(k => name.includes(k));
  });

  return femaleVoice || langVoices[0];
}

function playAudio() {
  window.speechSynthesis.cancel(); // Stop any previous
  
  const text = props.msg.text;
  const lang = detectLanguage(text);
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  
  // Ensure voices are loaded
  let voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      const voice = getFemaleVoice(lang);
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
      window.speechSynthesis.onvoiceschanged = null; // Clean up
    };
  } else {
    const voice = getFemaleVoice(lang);
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  }
  
  utter.onstart = () => {
    isPlaying.value = true;
  };
  
  utter.onend = () => {
    isPlaying.value = false;
  };
  
  utter.onerror = () => {
    isPlaying.value = false;
  };

  // Mark as played so it doesn't auto-play again on reload/remount
  if (props.msg.shouldPlay) {
    chat.markAsPlayed(props.msg.id);
  }
}

function stopAudio() {
  window.speechSynthesis.cancel();
  isPlaying.value = false;
}

onMounted(() => {
  if (props.msg.shouldPlay) {
    playAudio();
  }
});

import { watch } from 'vue';

watch(() => props.msg.shouldPlay, (newVal) => {
  if (newVal) {
    playAudio();
  }
});

onUnmounted(() => {
  if (isPlaying.value) {
    stopAudio();
  }
});
</script>

<style scoped>
.bg-primary {
  background-color: #62109f;
}

@keyframes voice {
  0%, 100% { height: 4px; }
  50% { height: 16px; }
}

.animate-voice-1 {
  animation: voice 1s infinite ease-in-out;
}

.animate-voice-2 {
  animation: voice 1s infinite ease-in-out 0.2s;
}

.animate-voice-3 {
  animation: voice 1s infinite ease-in-out 0.4s;
}
</style>
