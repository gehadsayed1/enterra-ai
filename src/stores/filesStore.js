import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useFilesStore = defineStore("filesStore", () => {
  const files = ref(JSON.parse(localStorage.getItem("ent-files") || "[]"));

  function addFile(file) {
    files.value.push({
      id: Date.now(),
      name: file.name,
      size: file.size,
      date: Date.now(),
      type: "file",
    });
  }

  function addURL(url) {
    files.value.push({
      id: Date.now(),
      name: url,
      size: 0,
      date: Date.now(),
      type: "url",
    });
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

  return { files, addFile, addURL, deleteFile };
});
