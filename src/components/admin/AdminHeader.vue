<template>
  <div
    class="w-full h-16 bg-white shadow-sm px-6 flex items-center justify-between"
  >
    <h1 class="text-lg font-semibold text-gray-700">Admin Dashboard</h1>

    <div class="flex items-center gap-5">
      <button
        @click="goChat"
        class="flex items-center gap-1 text-primary hover:text-purple-900 font-medium transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 4.5h7.5m-10.5 6h13.5m-10.5 6h7.5"
          />
        </svg>
        Chat
      </button>

      <button
        @click="logout"
        class="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
          />
        </svg>
        Logout
      </button>

      <div class="w-10 h-10 rounded-full bg-gray-300">
        <img
          src="https://i.pravatar.cc/100"
          class="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push("/login");
}

function goChat() {
  router.push("/chat");
}
</script>
