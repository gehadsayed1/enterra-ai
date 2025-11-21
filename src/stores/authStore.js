import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { load, save } from "../utils/storage";
import { useUsersStore } from "@/stores/usersStore";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(load("superai_user", null));
  const usersStore = useUsersStore();

  const isAuthenticated = computed(() => user.value !== null);
  const role = computed(() => user.value?.role || "user");

  function login(email, password) {
    const registeredUser = usersStore.getUserByEmail(email);

    if (registeredUser) {
      if (registeredUser.password === password) {
        user.value = registeredUser;
        save("superai_user", registeredUser);
        return { success: true, role: registeredUser.role };
      } else {
        return { success: false, message: "Incorrect password" };
      }
    }

    if (email === "admin@enterra.ai" && password === "admin123") {
      const adminData = {
        email,
        name: "Admin",
        role: "admin",
      };
      user.value = adminData;
      save("superai_user", adminData);
      return { success: true, role: "admin" };
    }

    if (email === "user@enterra.ai" && password === "user123") {
      const userData = {
        email,
        name: "User",
        role: "user",
      };
      user.value = userData;
      save("superai_user", userData);
      return { success: true, role: "user" };
    }

    return { success: false, message: "User not found" };
  }

  function logout() {
    user.value = null;
    save("superai_user", null);
  }

  return {
    user,
    role,
    isAuthenticated,
    login,
    logout,
  };
});
