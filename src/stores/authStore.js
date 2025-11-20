import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { load , save } from '../utils/storage'


export const useAuthStore = defineStore('auth', () => {
  const user = ref(load("superai_user", null))

  const isAuthenticated = computed(() => user.value !== null)
  const role = computed(() => user.value?.role || "user")

  function login(email) {
    const data = {
      email,
      role: email.includes("admin") ? "admin" : "user"
    }

    user.value = data
    save("superai_user", data)
  }

  function logout() {
    user.value = null
    save("superai_user", null)
  }

  return {
    user,
    role,
    isAuthenticated,
    login,
    logout
  }
})
