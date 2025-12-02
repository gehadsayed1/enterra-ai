import { defineStore } from "pinia";
import { ref, watch } from "vue";
import axios from "axios";
import { CONFIG } from "@/config";
import { useToast } from "vue-toastification";


export const useFilesStore = defineStore("filesStore", () => {
  const files = ref(JSON.parse(localStorage.getItem("ent-files") || "[]"));
const toast = useToast();

  async function addFile(file, metadata = {}) {
    console.log("📂 [DEBUG] Preparing to upload file:", file);
    console.log("📄 [DEBUG] File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    try {
      const formData = new FormData();
      formData.append("files", file);
      
      if (metadata.departmentId) formData.append("departmentId", metadata.departmentId);
      if (metadata.roleId) formData.append("roleId", metadata.roleId);

      console.log("🚀 [DEBUG] Sending POST request to:", `${CONFIG.API_BASE_URL}/upload`);

      const res = await axios.post(`${CONFIG.API_BASE_URL}/upload`, formData);

      console.log("✅ [DEBUG] Upload success. Response:", res);
      console.log("📦 [DEBUG] Response Data:", res.data.message);
      toast.success("File uploaded successfully!");

      files.value.push({
        id: Date.now(),
        name: file.name,
        size: file.size,
        date: new Date(),
        type: "file",
        apiResponse: res.data.message,
        departmentId: metadata.departmentId,
        roleId: metadata.roleId
      });

      return res.data;
    } catch (err) {
      console.error("❌ [DEBUG] Upload failed:", err);
      if (err.response) {
        console.error("❌ [DEBUG] Error Response Data:", err.response.data);
        console.error("❌ [DEBUG] Error Status:", err.response.status);
      }
    }
  }


 
  async function addMultipleURLs(urlList, metadata = {}) {
     console.log("📤 Sending URLs to backend:", urlList);
    try {
      if (!Array.isArray(urlList) || urlList.length === 0) return;

      const res = await axios.post(
        `${CONFIG.API_BASE_URL}/process-url`,
        {
          urls: urlList,
          departmentId: metadata.departmentId,
          roleId: metadata.roleId
        }
      );
   toast.success(res.data.message || "URL processed successfully!");
      urlList.forEach((url) => {
        files.value.push({
          id: Date.now(),
          name: url,
          size: null,
          date: new Date(),
          type: "url",
          apiResponse: res.data,
          departmentId: metadata.departmentId,
          roleId: metadata.roleId
        });
      });
    } catch (err) {
      console.error("Multiple URLs upload error:", err);
       toast.error("Failed to process URL");
    }
  }

  function deleteFile(id) {
    files.value = files.value.filter((f) => f.id !== id);
  }

  async function addDatabase(tables, metadata = {}) {
    try {
      // Try API call but don't block UI on failure for testing
      try {
        await axios.post(`${CONFIG.API_BASE_URL}/datasource/db/select-tables`, {
          tables: tables,
          departmentId: metadata.departmentId,
          roleId: metadata.roleId
        });
        toast.success("Selected tables saved successfully!");
      } catch (apiError) {
        console.warn("API call failed, saving locally for preview:", apiError);
        toast.info("Saved to session (API unavailable)");
      }
      
      files.value.push({
        id: Date.now(),
        name: `Database Tables (${tables.length})`,
        details: tables.join(", "),
        size: null,
        date: new Date(),
        type: "database",
        departmentId: metadata.departmentId,
        roleId: metadata.roleId
      });
    } catch (error) {
      console.error("Database save error:", error);
      toast.error("Unexpected error saving database tables.");
    }
  }

  async function addFolder(path, metadata = {}) {
    try {
      // Try API call but don't block UI on failure for testing
      try {
        await axios.post(`${CONFIG.API_BASE_URL}/datasource/folder`, {
          path: path,
          departmentId: metadata.departmentId,
          roleId: metadata.roleId
        });
        toast.success("Folder path saved successfully!");
      } catch (apiError) {
        console.warn("API call failed, saving locally for preview:", apiError);
        toast.info("Saved locally (API unavailable)");
      }

      files.value.push({
        id: Date.now(),
        name: path,
        size: null,
        date: new Date(),
        type: "folder",
        departmentId: metadata.departmentId,
        roleId: metadata.roleId
      });
    } catch (error) {
      console.error("Folder save error:", error);
      toast.error("Unexpected error saving folder path.");
    }
  }

  watch(
    files,
    () => {
      localStorage.setItem("ent-files", JSON.stringify(files.value));
    },
    { deep: true }
  );

  return {
    files,
    addFile,
    addMultipleURLs,
    deleteFile,
    addDatabase,
    addFolder
  };
});
