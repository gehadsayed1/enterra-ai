<template>
  <div class="space-y-8">

    <div class="flex items-center justify-between">
      <div
        class="relative border-2 border-dashed rounded-2xl p-8 w-[600px] mx-auto text-center cursor-pointer transition-all duration-300 overflow-hidden group
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
              <button @click.stop="uploadSelectedFile" :disabled="uploadingFile"
                class="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-semibold">
                <span v-if="!uploadingFile">Upload File</span>
                <svg v-else class="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="mt-6 w-[600px] mx-auto">
      <div class="space-y-3">
        <div v-for="(field, i) in urlFields" :key="i" class="flex items-center gap-3">
          <input v-model="field.value" type="text" placeholder="Enter URL…"
            class="flex-1 p-3 border-2 rounded-xl outline-none border-purple-200 focus:border-purple-500 transition-all duration-200 bg-white focus:shadow-lg" />

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

      <button @click="uploadAllUrls" :disabled="uploadingURL"
        class="mt-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-semibold">
        <span v-if="!uploadingURL">Upload All URLs</span>
        <svg v-else class="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4l3-3-3-3v4a8 8 0 0 0-8 8h4z"></path>
        </svg>
      </button>
    </div>

    <ModernTable title="Uploaded Files" :subtitle="`Total: ${files.length} files`"
      :headers="['Name', 'Size', 'Date', 'Type', 'Actions']" :total="files.length" v-model:currentPage="currentPage"
      v-model:perPage="perPage">
      <tr v-for="file in paginatedFiles" :key="file.id"
        class="border-t-2 border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 transition-all duration-200 group">
        <td class="p-4 text-gray-800 font-medium">
          <span v-if="file.type === 'file'" class="group-hover:text-purple-700 transition-colors">{{ file.name }}</span>
          <a v-else :href="file.name" target="_blank"
            class="text-purple-600 hover:text-purple-800 underline font-semibold">
            {{ file.name }}
          </a>
        </td>

        <td class="p-4 text-gray-600 font-medium">
          <span v-if="file.type === 'file'">{{
            formatSize(file.size)
          }}</span>
          <span v-else class="text-gray-400">—</span>
        </td>

        <td class="p-4 text-gray-600 font-medium">{{ formatDate(file.date) }}</td>

        <td class="p-4">
          <span class="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 inline-block" :class="file.type === 'file'
            ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 group-hover:from-blue-200 group-hover:to-blue-300'
            : 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 group-hover:from-emerald-200 group-hover:to-emerald-300'
            ">
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
const selectedLocalFile = ref(null);
const urlInput = ref("");

const fileInput = ref(null);
const uploadingFile = ref(false);
const uploadingURL = ref(false);

const confirmOpen = ref(false);
const selectedFile = ref(null);
const urlFields = ref([{ value: "" }]);


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

function submitURL() {
  if (!urlInput.value.trim()) return;

  pendingUrls.value.push(urlInput.value.trim());
  urlInput.value = "";
}

function removeUrl(index) {
  pendingUrls.value.splice(index, 1);
}

function addUrlField() {
  urlFields.value.push({ value: "" });
}

function removeUrlField(index) {
  if (urlFields.value.length > 1) {
    urlFields.value.splice(index, 1);
  }
}
async function uploadAllUrls() {
  const urls = urlFields.value
    .map((f) => f.value.trim())
    .filter((v) => v !== "");

  if (!urls.length) return;

  uploadingURL.value = true;

  await filesStore.addMultipleURLs(urls);

  uploadingURL.value = false;


  urlFields.value = [{ value: "" }];
}

function openDelete(file) {
  selectedFile.value = file;
  confirmOpen.value = true;
}

function confirmDelete() {
  filesStore.deleteFile(selectedFile.value.id);
  confirmOpen.value = false;
}

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

async function uploadSelectedFile() {
  if (!selectedLocalFile.value) return;

  uploadingFile.value = true;

  await filesStore.addFile(selectedLocalFile.value);

  uploadingFile.value = false;
  selectedLocalFile.value = null;
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
