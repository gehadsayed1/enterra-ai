<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div
        class="border-2 border-dashed border-primary/40 bg-white rounded-2xl p-4 w-[600px] mx-auto text-center cursor-pointer hover:border-primary transition"
        @click="openPicker" @dragover.prevent @drop.prevent="handleDrop">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="{1.5}"
          stroke="currentColor" class="w-25 h-25 mx-auto text-primary">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
        </svg>

        <p class="text-gray-700 font-semibold text-lg">
          Drag & drop files <span class="text-primary">or Browse</span>
        </p>

        <p class="text-gray-500 text-sm mt-2">
          Supported formats: PDF, PNG, JPG, TXT, DOCX
        </p>
        <p class="text-gray-600">{{ selectedLocalFile?.name }}</p>

        <input ref="fileInput" type="file" class="hidden" @change="handleUpload" />

        <div v-if="selectedLocalFile">
          <div class="flex items-center justify-end mt-3">
            <button @click.stop="uploadSelectedFile" :disabled="uploadingFile"
              class="bg-primary text-white px-6 py-1.5 rounded-lg hover:bg-purple-900 transition flex items-center gap-2 disabled:opacity-50">
              <span v-if="!uploadingFile">Upload</span>
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

    <div class="mt-6 w-[600px] mx-auto text-center">
      <div class="space-y-3">
        <div v-for="(field, i) in urlFields" :key="i" class="flex items-center gap-3">
          <input v-model="field.value" type="text" placeholder="Enter URL…"
            class="flex-1 p-3 border rounded-xl outline-none border-primary/40 focus:border-primary" />


          <button v-if="i === urlFields.length - 1" @click="addUrlField"
            class="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-xl hover:bg-green-600">
            +
          </button>


          <button v-if="urlFields.length > 1" @click="removeUrlField(i)"
            class="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-xl hover:bg-red-600">
            -
          </button>
        </div>
      </div>

      <button @click="uploadAllUrls" :disabled="uploadingURL"
        class="mt-4 bg-primary text-white px-8 py-2 rounded-md hover:bg-purple-900 transition flex items-center gap-2 disabled:opacity-50">
        <span v-if="!uploadingURL">Upload All URLs</span>
        <svg v-else class="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4l3-3-3-3v4a8 8 0 0 0-8 8h4z"></path>
        </svg>
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
            <tr v-for="file in paginatedFiles" :key="file.id"
              class="border-t border-gray-300 hover:bg-gray-50 transition">
              <td class="p-4 text-gray-800">
                <span v-if="file.type === 'file'">{{ file.name }}</span>
                <a v-else :href="file.name" target="_blank" class="text-primary underline">
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
                <span class="px-3 py-1 rounded-md text-sm font-medium" :class="file.type === 'file'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                  ">
                  {{ file.type.toUpperCase() }}
                </span>
              </td>

              <td class="p-4 text-right">
                <button class="text-red-500 hover:text-red-700 font-medium" @click="openDelete(file)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09
                      1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
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

      <Pagination v-if="files.length > 0" :currentPage="currentPage" :perPage="perPage" :total="files.length"
        @update:currentPage="currentPage = $event" @update:perPage="perPage = $event; currentPage = 1" />
    </div>

    <ConfirmDelete :show="confirmOpen" title="Delete File"
      :message="`Are you sure you want to delete ${selectedFile?.name}?`" @cancel="confirmOpen = false"
      @confirm="confirmDelete" />
  </div>
</template>
<script setup>
import ConfirmDelete from "@/components/admin/ConfirmDelete.vue";
import Pagination from "@/components/ui/Pagination.vue";
import { ref, computed } from "vue";
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
