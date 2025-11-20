<template>
  <div class="px-10 pb-6 pt-3 flex flex-col gap-4">
    <MessageBubble 
      v-for="msg in messages" 
      :key="msg.id" 
      :msg="msg" 
    />
  </div>
</template>

<script setup> 
 import { computed } from 'vue';
import MessageBubble from './MessageBubble.vue'
import { useChatStore } from '@/stores/chatStore'

const chat = useChatStore()


const messages = computed(() => chat.messages)
</script>

