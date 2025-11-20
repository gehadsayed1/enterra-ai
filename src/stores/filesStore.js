import { defineStore } from 'pinia'
import { ref } from 'vue'
import { save, load } from '@/utils/storage'

export const useFilesStore = defineStore('files', () => {
  const files = ref(load("superai_files", []))

  function upload(file) {
    const item = {
      id: Date.now(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      createdAt: new Date().toISOString()
    }

    files.value.push(item)
    save("superai_files", files.value)
  }

  function deleteFile(id) {
    files.value = files.value.filter(f => f.id !== id)
    save("superai_files", files.value)
  }

  return {
    files,
    upload,
    deleteFile
  }
})
