import { defineStore } from "pinia";
import { ref, watch } from "vue";
import axios from "axios";
import { CONFIG } from "@/config";
import { useToast } from "vue-toastification";


export const useFilesStore = defineStore("filesStore", () => {
  const files = ref(JSON.parse(localStorage.getItem("ent-files") || "[]"));
const toast = useToast();

async function addFile(file) {
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

    console.log("🚀 [DEBUG] Sending POST request to:", `${CONFIG.API_BASE_URL}/upload/`);

    const res = await axios.post(`${CONFIG.API_BASE_URL}/upload/`, formData);

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


 
  async function addMultipleURLs(urlList) {
     console.log("📤 Sending URLs to backend:", urlList);
    try {
      if (!Array.isArray(urlList) || urlList.length === 0) return;

      const res = await axios.post(
        `${CONFIG.API_BASE_URL}/process-url/`,
        {
          urls: urlList,
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
  };
});
