<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-primary">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
      Upload Files
    </h2>

    <div
      class="relative border-2 border-dashed rounded-2xl p-8 w-full mx-auto text-center cursor-pointer transition-all duration-300 overflow-hidden group
             border-purple-300 bg-gradient-to-br from-white to-purple-50 hover:border-purple-500 hover:shadow-2xl hover:-translate-y-1"
      @click="openPicker" @dragover.prevent @drop.prevent="handleDrop">
      <div class="relative z-10">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
          stroke="currentColor"
          class="w-20 h-20 mx-auto text-purple-600 group-hover:scale-110 transition-transform duration-300">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
        </svg>

        <p class="text-gray-800 font-bold text-xl mt-4">
          Drag & drop files <span
            class="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">or Browse</span>
        </p>

        <p class="text-gray-500 text-sm mt-2">
          Supported formats: PDF, PNG, JPG, TXT, DOCX
        </p>

        <p v-if="selectedLocalFile"
          class="text-purple-700 font-semibold mt-3 bg-purple-100 rounded-lg py-2 px-4 inline-block">
          {{ selectedLocalFile?.name }}
        </p>

        <input ref="fileInput" type="file" class="hidden" @change="handleUpload" />

        <div v-if="selectedLocalFile">
          <div class="flex items-center justify-center mt-4">
            <button @click.stop="handleSave"
              class="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              Upload File
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['save']);

const fileInput = ref(null);
const selectedLocalFile = ref(null);

function openPicker() {
  fileInput.value.click();
}

function handleUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  selectedLocalFile.value = file;
}

function handleDrop(e) {
  const file = e.dataTransfer.files[0];
  if (!file) return;
  selectedLocalFile.value = file;
}

function handleSave() {
  if (!selectedLocalFile.value) return;
  emit('save', { file: selectedLocalFile.value });
  // Note: We don't clear the file here immediately. 
  // The parent component should handle the success and maybe we can expose a reset method or watch a prop.
  // For now, let's assume the parent handles the upload and we can reset manually if needed, 
  // but to keep it simple, we'll clear it after emit, assuming the user will confirm in the modal.
  // Actually, better to wait. But since the modal is a separate step, we can keep the file selected until the action is done.
}

defineExpose({
  reset: () => {
    selectedLocalFile.value = null;
    if (fileInput.value) fileInput.value.value = '';
  }
});
</script>
