import { defineStore } from "pinia";
import { ref, watch } from "vue";
import axios from "axios";
import { CONFIG } from "@/config";
import { useToast } from "vue-toastification";

export const useFilesStore = defineStore("filesStore", () => {
  const files = ref(JSON.parse(localStorage.getItem("ent-files") || "[]"));
  const currentDocSetId = ref(localStorage.getItem("ent-doc-set-id") || null);
  const toast = useToast();

  async function addFile(file, metadata = {}) {
    console.log("📂 [DEBUG] Preparing to ingest file:", file);

    try {
      const formData = new FormData();
      formData.append("files", file);
      console.log(
        "🚀 [DEBUG] Sending POST request to:",
        `${CONFIG.API_BASE_URL}/ingest`
      );

      const res = await axios.post(`${CONFIG.API_BASE_URL}/ingest`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ [DEBUG] Ingest success. Response:", res.data);

      if (res.data.doc_set_id) {
        currentDocSetId.value = res.data.doc_set_id;
        localStorage.setItem("ent-doc-set-id", res.data.doc_set_id);
      }

      toast.success("File and context prepared successfully");

      files.value.push({
        id: Date.now(),
        name: file.name,
        size: file.size,
        date: new Date(),
        type: "file",
        apiResponse: res.data.message,
        docSetId: res.data.doc_set_id,
        summary: res.data.document_summary,
      });

      return res.data;
    } catch (err) {
      console.error("❌ [DEBUG] Upload failed:", err);
      if (err.response) {
        toast.error(`Error: ${err.response.data.detail || "Upload failed"}`);
      } else {
        toast.error("Network error during upload.");
      }
      throw err;
    }
  }

  // Keeping other methods but they might fail if backend doesn't support them.
  // The user only specified the new API for ingest/chat/tts.

  async function addMultipleURLs(urlList, metadata = {}) {
    // Implementation kept as placeholder or legacy
    console.warn("addMultipleURLs might not be supported by the new backend.");
  }

  function deleteFile(id) {
    files.value = files.value.filter((f) => f.id !== id);
  }

  // Legacy/Placeholder
  async function addDatabase(tables, metadata = {}) {}
  async function addFolder(path, metadata = {}) {}

  watch(
    files,
    () => {
      localStorage.setItem("ent-files", JSON.stringify(files.value));
    },
    { deep: true }
  );

  return {
    files,
    currentDocSetId,
    addFile,
    addMultipleURLs,
    deleteFile,
    addDatabase,
    addFolder,
  };
});
