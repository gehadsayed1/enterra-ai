<template>
  <div
    class="w-full h-16 bg-white shadow-sm px-6 flex items-center justify-between"
  >
    <h1 class="text-lg font-semibold text-gray-700">Admin Dashboard</h1>

    <div class="flex items-center gap-5">
      <button
        @click="goChat"
         class="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold shadow-sm hover:bg-gray-200 transition cursor-pointer"
      title="Go to Dashboard"
      >
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
</svg>

       <span class="text-sm"> Chat</span>
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
