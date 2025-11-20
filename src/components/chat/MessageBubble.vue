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
          : 'bg-white text-gray-800 rounded-bl-none'
      ]"
    >
      <!-- Loading bubbles -->
      <div v-if="msg.loading" class="flex items-center gap-1">
        <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
        <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
        <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
      </div>

      <!-- Normal message -->
      <div v-else>
        {{ msg.text }}
      </div>

      <!-- Tail -->
      <span
        v-if="msg.role === 'user'"
        class="absolute w-3 h-3 bg-primary right-0 bottom-0 translate-x-0 translate-y-0 -rotate-90"
      ></span>

      <span
        v-else
        class="absolute w-3 h-3  left-0 bottom-0 -translate-x-1 translate-y-1 rotate-90"
      ></span>
    </div>
  </div>
</template>


<script setup>
defineProps(["msg"])
</script>

<style scoped>
.bg-primary {
  background-color: #62109F;
}
</style>
