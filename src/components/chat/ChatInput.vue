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
    </div>
  </div>

  <p class="text-center mt-2 text-gray-600 text-md">
    Centra may display inaccurate info, so please double check the response.
    Your Privacy & Centra AI
  </p>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useChatStore } from "@/stores/chatStore";
import { chatService } from "@/services/chatService";

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

  chat.addMessage({ role: "user", text: msg });
  chat.addBotLoading();

  try {
    const data = await chatService.sendMessage(msg);
    const { answer, audioUrl } = data;

    chat.replaceBotLoading(answer || "No reply found.");

    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        await audio.play();
        
        audio.onended = () => URL.revokeObjectURL(audioUrl);
      } catch (audioError) {
        console.error("Failed to play audio:", audioError);
      }
    }
  } catch (error) {
    console.error("Chat error:", error);
    chat.replaceBotLoading(
      error.response?.data?.detail || "عذراً، حدث خطأ في الاتصال بالخادم."
    );
  }
}

</script>
