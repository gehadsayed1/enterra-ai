import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

export const useUsersStore = defineStore('usersStore', () => {

  const users = ref(JSON.parse(localStorage.getItem('ent-users') || '[]'));

  function addUser(user) {
    users.value.push({
      id: Date.now(),
      name: user.name,
      email: user.email,
      password: user.password, 
      role: user.role,
      permissions: user.permissions ?? {},
    });
  }

  function getUserByEmail(email) {
    return users.value.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  function deleteUser(id) {
    users.value = users.value.filter(u => u.id !== id);
  }

  watch(users, () => {
    localStorage.setItem('ent-users', JSON.stringify(users.value));
  }, { deep: true });

  return { users, addUser, deleteUser, getUserByEmail };
});
