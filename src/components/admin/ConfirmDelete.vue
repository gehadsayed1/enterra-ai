<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6 text-red-600">
            <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title || 'Confirm Delete' }}</h3>
          <p class="text-gray-600 text-sm">{{ message }}</p>
        </div>
      </div>
      
      <div class="flex justify-end gap-3 mt-6">
        <button 
          @click="$emit('cancel')" 
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          Cancel
        </button>
        <button 
          @click="$emit('confirm')" 
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  message: String,
});

defineEmits(["cancel", "confirm"]);
</script>
