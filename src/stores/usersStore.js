import { defineStore } from 'pinia'
import { ref } from 'vue'
import { save, load } from '@/utils/storage'

export const useUsersStore = defineStore('users', () => {
  const users = ref(load("superai_users", []))

  function addUser(email, role = "user") {
    users.value.push({
      id: Date.now(),
      email,
      role,
      createdAt: new Date().toISOString()
    })
    save("superai_users", users.value)
  }

  function deleteUser(id) {
    users.value = users.value.filter(u => u.id !== id)
    save("superai_users", users.value)
  }

  function setRole(id, role) {
    const u = users.value.find(u => u.id === id)
    if (u) {
      u.role = role
      save("superai_users", users.value)
    }
  }

  return {
    users,
    addUser,
    deleteUser,
    setRole
  }
})
