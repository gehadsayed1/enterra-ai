<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-primary">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
      Website URLs
    </h2>

    <div class="w-full mx-auto">
      <div class="space-y-3">
        <div v-for="(field, i) in urlFields" :key="i" class="flex items-center gap-3">
          <input v-model="field.value" type="text" placeholder="Enter URL…"
            class="flex-1 p-3 border-2 rounded-xl outline-none border-purple-200 focus:border-purple-400 transition-all duration-200 bg-white focus:shadow-md" />

          <button v-if="i === urlFields.length - 1" @click="addUrlField"
            class="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 font-bold text-xl">
            +
          </button>

          <button v-if="urlFields.length > 1" @click="removeUrlField(i)"
            class="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 font-bold text-xl">
            −
          </button>
        </div>
      </div>

      <button @click="handleSave" :disabled="!hasValidUrls"
        class="mt-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
        Upload All URLs
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['save']);

const urlFields = ref([{ value: "" }]);

const hasValidUrls = computed(() => {
  return urlFields.value.some(f => f.value.trim() !== "");
});

function addUrlField() {
  urlFields.value.push({ value: "" });
}

function removeUrlField(index) {
  if (urlFields.value.length > 1) {
    urlFields.value.splice(index, 1);
  }
}

function handleSave() {
  const urls = urlFields.value
    .map((f) => f.value.trim())
    .filter((v) => v !== "");

  if (!urls.length) return;
  
  emit('save', { urls });
}

defineExpose({
  reset: () => {
    urlFields.value = [{ value: "" }];
  }
});
</script>
