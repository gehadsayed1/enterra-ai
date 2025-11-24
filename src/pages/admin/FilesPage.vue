<template>
  <div class="space-y-8">
    <ModernTable title="Data Registry" :subtitle="`Total: ${files.length} items`"
      :headers="['Name', 'Size', 'Date', 'Type', 'Actions']" :total="files.length" v-model:currentPage="currentPage"
      v-model:perPage="perPage">
      <tr v-for="file in paginatedFiles" :key="file.id"
        class="border-t-2 border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 transition-all duration-200 group">
        <td class="p-4 text-gray-800 font-medium">
          <a v-if="file.type === 'url'" :href="file.name" target="_blank"
            class="text-purple-600 hover:text-purple-800 underline font-semibold">
            {{ file.name }}
          </a>
          <div v-else class="flex flex-col">
            <span class="group-hover:text-purple-700 transition-colors">{{ file.name }}</span>
            <span v-if="file.details" class="text-xs text-gray-500 mt-1">{{ file.details }}</span>
          </div>
        </td>

        <td class="p-4 text-gray-600 font-medium">
          <span v-if="file.type === 'file'">{{
            formatSize(file.size)
          }}</span>
          <span v-else class="text-gray-400">—</span>
        </td>

        <td class="p-4 text-gray-600 font-medium">{{ formatDate(file.date) }}</td>

        <td class="p-4">
          <span class="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 inline-block" :class="getTypeClass(file.type)">
            {{ file.type.toUpperCase() }}
          </span>
        </td>

        <td class="p-4 text-right">
          <button
            class="text-red-500 hover:text-red-700 font-medium transition-all duration-200 hover:scale-110 transform"
            @click="openDelete(file)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09
                1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </td>
      </tr>

      <tr v-if="files.length === 0">
        <td colspan="5" class="p-8 text-center text-gray-500 italic text-lg">
          لا توجد ملفات بعد.
        </td>
      </tr>
    </ModernTable>

    <ConfirmDelete :show="confirmOpen" title="Delete File"
      :message="`Are you sure you want to delete ${selectedFile?.name}?`" @cancel="confirmOpen = false"
      @confirm="confirmDelete" />
  </div>
</template>
<script setup>
import ConfirmDelete from "@/components/admin/ConfirmDelete.vue";
import ModernTable from "@/components/admin/ModernTable.vue";
import { ref, computed, watch } from "vue";
import { useFilesStore } from "@/stores/filesStore";

const filesStore = useFilesStore();
const files = computed(() => filesStore.files);

const confirmOpen = ref(false);
const selectedFile = ref(null);

const currentPage = ref(1);
const perPage = ref(10);

watch(perPage, () => {
  currentPage.value = 1;
});

const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return files.value.slice(start, end);
});

function openDelete(file) {
  selectedFile.value = file;
  confirmOpen.value = true;
}

function confirmDelete() {
  filesStore.deleteFile(selectedFile.value.id);
  confirmOpen.value = false;
}

function formatSize(bytes) {
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + " KB";
  return (kb / 1024).toFixed(1) + " MB";
}

function formatDate(date) {
  return new Date(date).toLocaleString();
}

function getTypeClass(type) {
  switch (type) {
    case 'file':
      return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 group-hover:from-blue-200 group-hover:to-blue-300';
    case 'url':
      return 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 group-hover:from-emerald-200 group-hover:to-emerald-300';
    case 'database':
      return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 group-hover:from-purple-200 group-hover:to-purple-300';
    case 'folder':
      return 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 group-hover:from-amber-200 group-hover:to-amber-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
</script>
