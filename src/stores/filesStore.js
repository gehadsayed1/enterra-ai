import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { ragService } from "@/services/ragService";
import { useToast } from "vue-toastification";

export const useFilesStore = defineStore("filesStore", () => {
  const files = ref(JSON.parse(localStorage.getItem("ent-files") || "[]"));
  const currentDocSetId = ref(localStorage.getItem("ent-doc-set-id") || null);
  const stats = ref(JSON.parse(localStorage.getItem("ent-rag-stats") || "{}"));
  const toast = useToast();

  async function addFile(file, metadata = {}) {
    console.log("📂 [DEBUG] Preparing to ingest file:", file);

    try {
      const data = await ragService.ingestDocuments(file);

      console.log("✅ [DEBUG] Ingest success. Response:", data);

      if (data.doc_set_id) {
        currentDocSetId.value = data.doc_set_id;
        localStorage.setItem("ent-doc-set-id", data.doc_set_id);
      }

      if (data.stats) {
        stats.value = data.stats;
        localStorage.setItem("ent-rag-stats", JSON.stringify(data.stats));
      }

      toast.success("File and context prepared successfully");

      files.value.push({
        id: Date.now(),
        name: file.name,
        size: file.size,
        date: new Date(),
        type: "file",
        apiResponse: data.message,
        docSetId: data.doc_set_id,
        summary: data.document_summary,
      });

      return data;
    } catch (err) {
      console.error("❌ [DEBUG] Upload failed:", err);
      toast.error(err.response?.data?.message || "Upload failed");
      throw err;
    }
  }

  async function resetKnowledgeBase() {
    try {
      await ragService.resetKB();
      files.value = [];
      currentDocSetId.value = null;
      stats.value = {};
      localStorage.removeItem("ent-doc-set-id");
      localStorage.removeItem("ent-files");
      localStorage.removeItem("ent-rag-stats");
      toast.success("Knowledge base cleared successfully.");
    } catch (err) {
      console.error("Reset failed:", err);
      toast.error("Failed to reset knowledge base.");
      throw err;
    }
  }

  function deleteFile(id) {
    files.value = files.value.filter((f) => f.id !== id);
  }

  // Legacy/Placeholder
  async function addMultipleURLs(urlList, metadata = {}) {}
  async function addDatabase(tables, metadata = {}) {}
  async function addFolder(path, metadata = {}) {}

  watch(
    files,
    () => {
      localStorage.setItem("ent-files", JSON.stringify(files.value));
    },
    { deep: true },
  );

  return {
    files,
    currentDocSetId,
    stats,
    addFile,
    addMultipleURLs,
    deleteFile,
    addDatabase,
    addFolder,
    resetKnowledgeBase,
  };
});
