<template>
  <div class="space-y-6">
    <FileUpload ref="fileUploadRef" @save="(data) => handleRequestSave('file', data)" />
    <DatabaseConnection @save="(data) => handleRequestSave('db', data)" />
    <LocalFolder @save="(data) => handleRequestSave('folder', data)" />
    
    <WebsiteUrls ref="websiteUrlsRef" @save="(data) => handleRequestSave('url', data)" />

    <RoleSelectionModal
      v-model="showRoleModal"
      :loading="isProcessing"
      @confirm="handleRoleConfirm"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { CONFIG } from '@/config';
import { useFilesStore } from "@/stores/filesStore";

import DatabaseConnection from "@/components/admin/datasources/DatabaseConnection.vue";
import LocalFolder from "@/components/admin/datasources/LocalFolder.vue";
import FileUpload from "@/components/admin/datasources/FileUpload.vue";
import WebsiteUrls from "@/components/admin/datasources/WebsiteUrls.vue";
import RoleSelectionModal from "@/components/admin/datasources/RoleSelectionModal.vue";

const toast = useToast();
const filesStore = useFilesStore();

const showRoleModal = ref(false);
const isProcessing = ref(false);

const pendingAction = ref(null);
const pendingData = ref(null);

const fileUploadRef = ref(null);
const websiteUrlsRef = ref(null);

function handleRequestSave(action, data) {
  pendingAction.value = action;
  pendingData.value = data;
  showRoleModal.value = true;
}

async function handleRoleConfirm({ departmentId, roleId }) {
  if (!pendingAction.value || !pendingData.value) return;

  isProcessing.value = true;
  const data = pendingData.value;

  try {
    if (pendingAction.value === 'db') {
      await filesStore.addDatabase(data.tables, {
        departmentId,
        roleId
      });
    } 
    else if (pendingAction.value === 'folder') {
      await filesStore.addFolder(data.path, {
        departmentId,
        roleId
      });
    }
    else if (pendingAction.value === 'file') {
      await filesStore.addFile(data.file, {
        departmentId,
        roleId
      });
      // Reset file input
      if (fileUploadRef.value) fileUploadRef.value.reset();
    }
    else if (pendingAction.value === 'url') {
      await filesStore.addMultipleURLs(data.urls, {
        departmentId,
        roleId
      });
      // Reset url fields
      if (websiteUrlsRef.value) websiteUrlsRef.value.reset();
    }
  } catch (error) {
    console.error(`Error processing ${pendingAction.value}:`, error);
    toast.error(error.response?.data?.message || "An error occurred.");
  } finally {
    isProcessing.value = false;
    showRoleModal.value = false;
    pendingAction.value = null;
    pendingData.value = null;
  }
}
</script>
