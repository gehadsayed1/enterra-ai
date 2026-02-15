<template>
  <div
    class="flex"
    :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
  >
    <div
      :class="[
        'relative max-w-xl px-6 py-4 rounded-2xl shadow-sm overflow-hidden break-words',
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
        <!-- Normal Text (Hidden if it's an export confirmation) -->
        <div v-if="!isExportMessage" class="markdown-body" :dir="messageDirection" v-html="formattedText"></div>
        
        <!-- Alternate Text for Export -->
        <div v-else class="text-gray-800 font-medium pb-2">
           You can download the file from here:
        </div>

        <!-- Citations Section -->
        <!-- Citations Section (Collapsible) -->
        <div v-if="msg.citations && msg.citations.length > 0" class="mt-3 pt-2 border-t border-gray-100">
            <button 
              @click="toggleSources"
              class="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-primary transition-colors focus:outline-none"
            >
              <span>Sources ({{ msg.citations.length }})</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': showSources }"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <ul v-if="showSources" class="mt-2 text-xs text-gray-600 space-y-1 pl-1">
                <li v-for="(cite, idx) in msg.citations" :key="idx" class="flex gap-2 items-start">
                    <span class="text-primary mt-0.5">•</span>
                    <span class="font-medium break-all">{{ cite.source }}</span>
                    <span v-if="cite.page" class="text-gray-400 whitespace-nowrap">(p. {{ cite.page }})</span>
                </li>
            </ul>
        </div>
        
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
        
        <!-- Download Export Button (If detected) -->
        <div v-if="isExportMessage" class="mt-3 pt-2 border-t border-gray-100">
           <button 
             @click="downloadExport"
             class="flex items-center gap-2 bg-purple-50 text-primary px-3 py-2 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors w-full justify-center"
           >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
               <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
             </svg>
             Download Word File
           </button>
        </div>

        <div v-if="hasPptDownload" class="mt-3 pt-3 border-t border-gray-100">
          <div class="mb-2 text-xs font-semibold text-orange-700">
            Presentation ready
          </div>
          <button
            type="button"
            @click="downloadPptx"
            class="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-colors w-full justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v2.25A2.25 2.25 0 0 1 17.25 18.75H6.75A2.25 2.25 0 0 1 4.5 16.5v-2.25m7.5-9v9m0 0 3-3m-3 3-3-3" />
            </svg>
            Download PowerPoint
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
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useChatStore } from "@/stores/chatStore";
import { chatService } from "@/services/chatService";
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const props = defineProps(["msg"]);
const chat = useChatStore();
const isPlaying = ref(false);
const showSources = ref(false);
let audioObj = null; // Store Audio instance

function toggleSources() {
  showSources.value = !showSources.value;
}

const formattedText = computed(() => {
  if (!props.msg.text) return '';
  
  // Hide the download URL/server path from the display text and keep only cleaned content.
  let textToProcess = props.msg.text;
  textToProcess = textToProcess.replace(/Download it here:\s*`?(\/opt\/[^`\s]+\.pptx)`?/gi, '');
  textToProcess = textToProcess.replace(/`?(\/opt\/[^`\s]+\.pptx)`?/gi, ''); // Fallback for raw server paths
  textToProcess = textToProcess.replace(/Download it here:\s*(https?:\/\/[^\s<>"]+\.pptx)/gi, '');
  textToProcess = textToProcess.replace(/(https?:\/\/[^\s<>"]+\.pptx)/gi, ''); // Fallback for raw URLs
  if (props.msg.downloadUrl) {
    textToProcess = textToProcess.replace(props.msg.downloadUrl, '');
  }
  if (props.msg.serverFilePath) {
    textToProcess = textToProcess.replace(props.msg.serverFilePath, '');
  }
  
  const rawHtml = marked.parse(textToProcess);
  return DOMPurify.sanitize(rawHtml);
});

const hasPptDownload = computed(() => {
  return Boolean(props.msg.serverFilePath || props.msg.downloadUrl || props.msg.pptReady);
});

const messageDirection = computed(() => {
  if (!props.msg.text) return 'ltr';
  return detectLanguage(props.msg.text) === 'ar-SA' ? 'rtl' : 'ltr';
});

function detectLanguage(text) {
  const arabicPattern = /[\u0600-\u06FF]/;
  const frenchPattern = /[àâçéèêëîïôûùüÿñæœ]/i;
  
  if (arabicPattern.test(text)) return 'ar-SA';
  if (frenchPattern.test(text)) return 'fr-FR';
  return 'en-US';
}

const isExportMessage = computed(() => {
  const txt = props.msg.text?.toLowerCase() || '';
  // Check for keywords indicating a file was created
  return txt.includes('exported') && (txt.includes('word file') || txt.includes('.docx'));
});

function downloadExport() {
  if (chat && typeof chat.exportChatToWord === 'function') {
    chat.exportChatToWord();
  } else {
    console.error("Export function not found in chat store");
    alert("Function not available, please reload page.");
  }
}

function downloadPptx() {
  const filePathOrUrl = props.msg.serverFilePath || props.msg.downloadUrl;
  if (filePathOrUrl) {
    chat.downloadLocalFile(filePathOrUrl);
  }
}

function cleanTextForSpeech(text) {
  if (!text) return '';

  return text
    .replace(/[#*_`~>-]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getFemaleVoice(lang) {
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = lang.split('-')[0];
  const langVoices = voices.filter(v => v.lang.startsWith(langPrefix));
  
  if (langVoices.length === 0) return null;
  const femaleKeywords = ['female', 'woman', 'hoda', 'zira', 'samantha', 'google', 'amelie', 'hortense', 'monica', 'fiona', 'karen'];
  
  const femaleVoice = langVoices.find(v => {
    const name = v.name.toLowerCase();
    return femaleKeywords.some(k => name.includes(k));
  });

  return femaleVoice || langVoices[0];
}

async function playAudio() {
  stopAudio();

  if (props.msg.audio) {
    // 1. Play already stored server-provided audio
    try {
      const audioSrc = `data:audio/mp3;base64,${props.msg.audio}`;
      audioObj = new Audio(audioSrc);
      
      audioObj.onplay = () => { isPlaying.value = true; };
      audioObj.onended = () => { isPlaying.value = false; audioObj = null; };
      audioObj.onerror = (e) => { console.error("Audio error", e); isPlaying.value = false; audioObj = null; };
      audioObj.play();
    } catch (e) {
      console.error("Error creating audio object:", e);
    }
  } else {
    // 2. Try to fetch from Server TTS first
    try {
      isPlaying.value = true;
      const data = await chatService.speech(cleanTextForSpeech(props.msg.text));
      if (data && data.audio) {
        // Cache it back to the message object so we don't fetch again
        props.msg.audio = data.audio;
        // Recursive call to play the new audio
        return playAudio();
      }
    } catch (err) {
      console.warn("Server TTS failed, falling back to Browser TTS", err);
    }

    // 3. Fallback to Browser TTS
    window.speechSynthesis.cancel(); 
    
    const text = cleanTextForSpeech(props.msg.text);
    const lang = detectLanguage(text);
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    
    const voice = getFemaleVoice(lang);
    if (voice) utter.voice = voice;
    
    utter.onstart = () => { isPlaying.value = true; };
    utter.onend = () => { isPlaying.value = false; };
    utter.onerror = () => { isPlaying.value = false; };
    
    window.speechSynthesis.speak(utter);
  }

  if (props.msg.shouldPlay) {
    chat.markAsPlayed(props.msg.id);
  }
}

function stopAudio() {
  if (audioObj) {
    audioObj.pause();
    audioObj.currentTime = 0;
    audioObj = null;
  }
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

:deep(.markdown-body) {
  line-height: 1.6;
  font-size: 0.95rem;
}

:deep(.markdown-body p) {
  margin-bottom: 0.5em;
}

:deep(.markdown-body p:last-child) {
  margin-bottom: 0;
}

:deep(.markdown-body ul), :deep(.markdown-body ol) {
  padding-inline-start: 1.5em;
  margin-bottom: 0.5em;
}

:deep(.markdown-body ul) {
  list-style-type: disc;
}

:deep(.markdown-body ol) {
  list-style-type: decimal;
}

:deep(.markdown-body pre) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.5em;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 0.5em;
}

:deep(.markdown-body code) {
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.9em;
}

:deep(.markdown-body pre code) {
  background-color: transparent;
  padding: 0;
}

:deep(.markdown-body strong) {
  font-weight: 600;
}

:deep(.markdown-body em) {
  font-style: italic;
}

:deep(.markdown-body a) {
  text-decoration: underline;
  color: inherit;
}
</style>
