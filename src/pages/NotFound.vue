<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-6">
    <div class="max-w-3xl w-full    p-8 md:p-12 text-center">
     
      <div class="max-w-xl mx-auto mb-8">
     
        <img
          src="@/assets/not.png"
          alt="Not found illustration"
          class="w-full h-70 object-contain"
        />
      </div>

    
      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-800  mb-3">
        Oops — Page not found
      </h1>

      
      <p class="mb-6 text-lg md:text-xl text-gray-500 ">
        We couldn't find the page you're looking for. It might have been moved or the link is incorrect.
      </p>

 
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          @click="goHome"
          class="px-8 py-3 rounded-xl bg-primary text-white font-semibold shadow hover:bg-purple-900 transition"
        >
          Go to Chat
        </button>

      </div>


      <p class="mt-6 text-sm text-gray-400">
        Or check the URL and try again.
      </p>
    </div>
  </main>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

function goHome() {
  router.push('/')
}


</script>


