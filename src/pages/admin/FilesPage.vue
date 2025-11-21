<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div
        class="border-2 border-dashed border-primary/40 bg-white rounded-2xl p-4 w-[600px] mx-auto text-center cursor-pointer hover:border-primary transition"
        @click="openPicker"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="{1.5}"
          stroke="currentColor"
          class="w-25 h-25 mx-auto text-primary"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
          />
        </svg>

        <p class="text-gray-700 font-semibold text-lg">
          Drag & drop files <span class="text-primary">or Browse</span>
        </p>

        <p class="text-gray-500 text-sm mt-2">
          Supported formats: PDF, PNG, JPG, TXT, DOCX
        </p>

        <input
          ref="fileInput"
          type="file"
          class="hidden"
          @change="handleUpload"
        />
      </div>
    </div>

    <div class="mt-6 w-[600px] mx-auto text-center">
      <input
        v-model="urlInput"
        type="text"
        placeholder="Enter URL here..."
        class="w-full p-3 border rounded-xl outline-none border-primary/40 focus:border-primary"
      />

      <button
        @click="submitURL"
        class="mt-3 bg-primary text-white px-8 py-2 rounded-md hover:bg-purple-900 transition"
      >
        Add URL
      </button>
    </div>

    <div class="bg-white shadow-sm rounded-2xl border border-gray-200 p-8">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg font-semibold text-gray-700">Uploaded Files</h2>
        <span class="text-sm text-gray-500"> Total: {{ files.length }} </span>
      </div>

      <div class="overflow-hidden rounded-xl border border-gray-200">
        <table class="w-full text-center">
          <thead class="bg-primary/50 text-white text-center">
            <tr>
              <th class="p-4 text-lg font-semibold">Name</th>
              <th class="p-4 text-lg font-semibold">Size</th>
              <th class="p-4 text-lg font-semibold">Date</th>
              <th class="p-4 text-lg font-semibold">Type</th>
              <th class="p-4 text-lg font-semibold"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="file in files"
              :key="file.id"
              class="border-t border-gray-300 hover:bg-gray-50 transition"
            >
              <td class="p-4 text-gray-800">
                <span v-if="file.type === 'file'">{{ file.name }}</span>
                <a
                  v-else
                  :href="file.name"
                  target="_blank"
                  class="text-primary underline"
                >
                  {{ file.name }}
                </a>
              </td>

            
              <td class="p-4 text-gray-600">
                <span v-if="file.type === 'file'">{{
                  formatSize(file.size)
                }}</span>
                <span v-else>—</span>
              </td>

              
              <td class="p-4 text-gray-600">{{ formatDate(file.date) }}</td>

         
              <td class="p-4">
                <span
                  class="px-3 py-1 rounded-md text-sm font-medium"
                  :class="
                    file.type === 'file'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  "
                >
                  {{ file.type.toUpperCase() }}
                </span>
              </td>

              <td class="p-4 text-right">
                <button
                  class="text-red-500 hover:text-red-700 font-medium"
                  @click="openDelete(file)"
                >
                  <svg
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
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09
                      1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </td>
            </tr>

            <tr v-if="files.length === 0">
              <td colspan="5" class="p-6 text-center text-gray-500 italic">
                لا توجد ملفات بعد.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ConfirmDelete
      :show="confirmOpen"
      :message="`Are you sure you want to delete ${selectedFile?.name}?`"
      @cancel="confirmOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
<script setup>
import ConfirmDelete from "@/components/admin/ConfirmDelete.vue";
import { ref, computed } from "vue";
import { useFilesStore } from "@/stores/filesStore";

const filesStore = useFilesStore();
const files = computed(() => filesStore.files);

const fileInput = ref(null);
const urlInput = ref("");


const confirmOpen = ref(false);
const selectedFile = ref(null);

function openDelete(file) {
  selectedFile.value = file;
  confirmOpen.value = true;
}

function confirmDelete() {
  filesStore.deleteFile(selectedFile.value.id);
  confirmOpen.value = false;
}

function submitURL() {
  if (!urlInput.value.trim()) return;
  filesStore.addURL(urlInput.value);
  urlInput.value = "";
}

function openPicker() {
  fileInput.value.click();
}

function handleUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  filesStore.addFile(file);
}

function handleDrop(e) {
  const file = e.dataTransfer.files[0];
  if (!file) return;
  filesStore.addFile(file);
}

function formatSize(bytes) {
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + " KB";
  return (kb / 1024).toFixed(1) + " MB";
}

function formatDate(date) {
  return new Date(date).toLocaleString();
}
</script>

<style scoped>
.bg-primary {
  background-color: #62109f;
}
</style>
