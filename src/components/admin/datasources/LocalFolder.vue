<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-primary">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
      Local Folder Path
    </h2>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Folder Path</label>
      <div class="flex gap-2">
        <input 
          type="text" 
          v-model="folderPath" 
          placeholder="C:/Docs/Manuals" 
          class="flex-1 p-3 border-2 rounded-xl outline-none border-purple-200 focus:border-purple-400 transition-all duration-200 bg-white focus:shadow-md" 
        />
        <button
          @click="handleSave"
          :disabled="!folderPath"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
        >
          Save Folder
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-1">Enter the absolute path to the folder on your local machine.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const emit = defineEmits(['save']);

const folderPath = ref('');

const handleSave = () => {
  if (!folderPath.value) {
    toast.warning("Please enter a folder path.");
    return;
  }
  emit('save', { path: folderPath.value });
};
</script>
