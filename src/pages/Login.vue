<template>
  <div class="min-h-screen flex bg-gradient-to-br from-[#3e0a6e] to-[#0D0126]">
<div class="hidden md:flex w-1/2 items-center justify-center p-10 flex-col relative">
  <img src="../assets/logo.png" alt="Enterra AI" class="max-w-4xl" />

  <h1
    class="text-4xl font-extrabold text-center text-white mt-6 w-full"
    style="position: static !important;"
  >
    الهيئة الهندسية للقوات المسلحة
  </h1>
</div>



    <div class="w-full md:w-1/2 flex items-center justify-center p-10">
      <div
        class="w-full max-w-xl rounded-2xl p-14 transition min-h-[600px] relative overflow-hidden bg-white/10 dark:bg-white/5 backdrop-blur-3xl border border-white/20 shadow-[0_0_40px_rgba(98,16,159,0.35)]"
      >
        <div
          class="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-br from-primary/50 via-purple-500/30 to-blue-500/20 blur-[120px] opacity-70"
        ></div>

        <h1
          class="text-3xl font-extrabold text-center mb-20 text-white"
        >
          ENTERRA AI
        </h1>

        <div class="flex flex-col gap-4">
          <div class="relative">
            <EnvelopeIcon
              class="w-5 h-5 absolute left-3 top-3.5 text-gray-400 dark:text-gray-600"
            />
            <input
              v-model="email"
              type="email"
              placeholder="Enter Your Email"
              class="w-full pl-10 p-3 border rounded-lg bg-gray-50 text-gray-800 dark:text-gray-400 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div class="relative">
            <LockClosedIcon
              class="w-5 h-5 absolute left-3 top-3.5 text-gray-400 dark:text-gray-600"
            />
            <input
              v-model="password"
              type="password"
              placeholder="Enter Your Password"
              class="w-full pl-10 p-3 border rounded-lg bg-gray-50 text-gray-800 dark:text-gray-400 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p v-if="error" class="text-red-500 text-sm mt-2 text-center">
              {{ error }}
            </p>
          </div>

          <button
            @click="submit"
            :disabled="loading"
            class="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 mt-7 bg-primary hover:bg-purple-900 transition disabled:opacity-50"
          >
            <span v-if="!loading">Login</span>

            <svg
              v-else
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </button>
        </div>

        <p class="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
          Don't have an account?
          <a href="/register" class="text-white hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAuthStore } from "@/stores/authStore";
import { ref } from "vue";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function submit() {
  error.value = "";

  if (!email.value.trim() || !password.value.trim()) {
    error.value = "Please enter email & password";
    return;
  }

  loading.value = true;

  setTimeout(() => {
    const result = auth.login(email.value, password.value);

    if (!result.success) {
      error.value = "Invalid email or password";
      loading.value = false;
      return;
    }

    if (result.role === "admin") router.push("/admin/dashboard");
    else router.push("/chat");

    loading.value = false;
  }, 700);
}
</script>
