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
        @click="toggleRecording"
        :class="`w-12 h-12 text-white flex items-center cursor-pointer justify-center rounded-xl ml-3 shrink-0 ${
          isRecording ? 'bg-black animate-pulse' : 'bg-primary'
        }`"
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
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 3l18 18"
          />
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
      <span class="text-gray-400 text-xs"> {{ text.length }}/1500 </span>

      <button
        class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition px-2 py-1 rounded-md hover:bg-gray-100"
        title="Export Chat to Word"
        @click="exportChat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        <span>Export Chat</span>
      </button>
    </div>
  </div>

  <p class="text-center mt-2 text-gray-600 text-md">
    ENTERRA may display inaccurate info, so please double check the response.
    Your Privacy & ENTERRA AI
  </p>
</template>
<script setup>
import { onMounted, onUnmounted, ref, nextTick } from "vue";
import { useChatStore } from "@/stores/chatStore";
import { chatService } from "@/services/chatService";
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';


const chat = useChatStore();
const text = ref("");
const isRecording = ref(false);

const recognition = ref(null);
let baseText = "";

function toggleRecording() {
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
  
  baseText = text.value ? text.value + " " : "";
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
    alert("⚠️ المتصفح لا يدعم التعرف على الصوت");
    return false;
  }

  recognition.value = new SpeechRecognition();
  recognition.value.lang = 'ar-SA';
  recognition.value.continuous = true;
  recognition.value.interimResults = true;

  recognition.value.onstart = () => {
    isRecording.value = true;
  };

  recognition.value.onend = () => {
    isRecording.value = false;
  };

  recognition.value.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }
    
    let fullTranscript = '';
    for (let i = 0; i < event.results.length; i++) {
       fullTranscript += event.results[i][0].transcript;
    }
    
    text.value = baseText + fullTranscript;
  };
  
  recognition.value.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    if (event.error === 'not-allowed') {
       alert("⚠️ يرجى السماح بالوصول للميكروفون");
    }
    isRecording.value = false;
  };

  return true;
}


async function submit() {
  if (!text.value.trim()) return;

  const msg = text.value;
  text.value = "";
  
  await nextTick(); // Ensure UI updates immediately

  // The chat store now handles the message adding, loading state, and API call sequence
  await chat.sendMessageToAPI(msg);
}



async function exportChat() {
  const element = document.getElementById('chat-content-area');
  if (!element) {
    alert("Could not find chat content to export.");
    return;
  }
  
  // Show loading state if needed, or simply wait
  try {
     // Configure to skip fonts or handle CORS if needed
     const dataUrl = await toPng(element, { 
        backgroundColor: '#ffffff',
        cacheBust: true,
     });
     
     const pdf = new jsPDF({
       orientation: 'p',
       unit: 'mm',
       format: 'a4',
     });
     
     const imgProps = pdf.getImageProperties(dataUrl);
     const pdfWidth = pdf.internal.pageSize.getWidth();
     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
     
     pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
     pdf.save(`enterra_chat_${new Date().toISOString().slice(0,10)}.pdf`);
     
  } catch (error) {
     console.error("PDF Export failed:", error);
     alert("Failed to create PDF. Please use browser print instead.");
  }
}
</script>
