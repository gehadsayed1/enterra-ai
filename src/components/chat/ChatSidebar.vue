<template>
  <div
    :class="[
      'h-screen bg-white shadow-md transition-all duration-300 flex flex-col justify-between',
      isOpen ? 'w-60' : 'w-16',
    ]"
  >
    <div class="mt-6 px-2 flex flex-col gap-2">
      <button
        @click="isOpen = !isOpen"
        :class="[
          'p-2  cursor-pointer mb-3  flex  transition-all',
          isOpen ? 'justify-between' : 'justify-center ',
        ]"
      >
     
        <span v-if="isOpen" class="text-primary text-2xl font-bold">
          ENTERRA AI</span
        >
        <svg
          width="25"
          height="25"
          viewBox="0 0 20 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          data-rtl-flip=""
          class="max-md:hidden"
        >
          <path
            d="M6.83496 3.99992C6.38353 4.00411 6.01421 4.0122 5.69824 4.03801C5.31232 4.06954 5.03904 4.12266 4.82227 4.20012L4.62207 4.28606C4.18264 4.50996 3.81498 4.85035 3.55859 5.26848L3.45605 5.45207C3.33013 5.69922 3.25006 6.01354 3.20801 6.52824C3.16533 7.05065 3.16504 7.71885 3.16504 8.66301V11.3271C3.16504 12.2712 3.16533 12.9394 3.20801 13.4618C3.25006 13.9766 3.33013 14.2909 3.45605 14.538L3.55859 14.7216C3.81498 15.1397 4.18266 15.4801 4.62207 15.704L4.82227 15.79C5.03904 15.8674 5.31234 15.9205 5.69824 15.9521C6.01398 15.9779 6.383 15.986 6.83398 15.9902L6.83496 3.99992ZM18.165 11.3271C18.165 12.2493 18.1653 12.9811 18.1172 13.5702C18.0745 14.0924 17.9916 14.5472 17.8125 14.9648L17.7295 15.1415C17.394 15.8 16.8834 16.3511 16.2568 16.7353L15.9814 16.8896C15.5157 17.1268 15.0069 17.2285 14.4102 17.2773C13.821 17.3254 13.0893 17.3251 12.167 17.3251H7.83301C6.91071 17.3251 6.17898 17.3254 5.58984 17.2773C5.06757 17.2346 4.61294 17.1508 4.19531 16.9716L4.01855 16.8896C3.36014 16.5541 2.80898 16.0434 2.4248 15.4169L2.27051 15.1415C2.03328 14.6758 1.93158 14.167 1.88281 13.5702C1.83468 12.9811 1.83496 12.2493 1.83496 11.3271V8.66301C1.83496 7.74072 1.83468 7.00898 1.88281 6.41985C1.93157 5.82309 2.03329 5.31432 2.27051 4.84856L2.4248 4.57317C2.80898 3.94666 3.36012 3.436 4.01855 3.10051L4.19531 3.0175C4.61285 2.83843 5.06771 2.75548 5.58984 2.71281C6.17898 2.66468 6.91071 2.66496 7.83301 2.66496H12.167C13.0893 2.66496 13.821 2.66468 14.4102 2.71281C15.0069 2.76157 15.5157 2.86329 15.9814 3.10051L16.2568 3.25481C16.8833 3.63898 17.394 4.19012 17.7295 4.84856L17.8125 5.02531C17.9916 5.44285 18.0745 5.89771 18.1172 6.41985C18.1653 7.00898 18.165 7.74072 18.165 8.66301V11.3271ZM8.16406 15.995H12.167C13.1112 15.995 13.7794 15.9947 14.3018 15.9521C14.8164 15.91 15.1308 15.8299 15.3779 15.704L15.5615 15.6015C15.9797 15.3451 16.32 14.9774 16.5439 14.538L16.6299 14.3378C16.7074 14.121 16.7605 13.8478 16.792 13.4618C16.8347 12.9394 16.835 12.2712 16.835 11.3271V8.66301C16.835 7.71885 16.8347 7.05065 16.792 6.52824C16.7605 6.14232 16.7073 5.86904 16.6299 5.65227L16.5439 5.45207C16.32 5.01264 15.9796 4.64498 15.5615 4.3886L15.3779 4.28606C15.1308 4.16013 14.8165 4.08006 14.3018 4.03801C13.7794 3.99533 13.1112 3.99504 12.167 3.99504H8.16406C8.16407 3.99667 8.16504 3.99829 8.16504 3.99992L8.16406 15.995Z"
          ></path>
        </svg>
      </button>

      <div
        class="menu-item flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
      >
        <HomeIcon class="w-6 h-6 text-primary" />
        <span v-if="isOpen" class="text-gray-700 font-medium">Home</span>
      </div>

      <div
        class="menu-item flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
      >
        <ChatBubbleLeftRightIcon class="w-6 h-6 text-primary" />
        <span v-if="isOpen" class="text-gray-700 font-medium">Chat</span>
      </div>

      <div
        class="menu-item flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
      >
        <DocumentIcon class="w-6 h-6 text-primary" />
        <span v-if="isOpen" class="text-gray-700 font-medium">Files</span>
      </div>

    </div>

    <div class="p-3 mt-auto mb-4">
      <div class="relative">
        <div class="flex items-center gap-3 cursor-pointer" @click="toggleMenu">
          <img
            v-if="isOpen"
            src="https://i.pravatar.cc/100"
            class="w-10 h-10 rounded-full object-cover"
          />

          <img
            v-else
            src="https://i.pravatar.cc/100"
            class="w-8 h-8 rounded-full object-cover mx-auto"
          />

          <div v-if="isOpen" class="flex-1">
            <p>{{ auth.user.email.split("@")[0] }}</p>
            <p>{{ auth.user.email }}</p>
          </div>

          <svg
            v-if="isOpen"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="w-6 h-6 text-gray-500"
          >
            <circle cx="5" cy="12" r="2"></circle>
            <circle cx="12" cy="12" r="2"></circle>
            <circle cx="19" cy="12" r="2"></circle>
          </svg>
        </div>

        <div
          v-if="showMenu"
          class="absolute right-0 bottom-14 bg-white shadow-lg rounded-xl border border-gray-200 w-36 py-2 z-50 animate-fade"
        >
          <button
            @click="logout"
            class="w-full text-left px-4 py-2 text-red-600 cursor-pointer flex items-center gap-2"
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
        </div>
      </div>
    </div>
  </div>
 
</template>
<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  HomeIcon,
  UserIcon,
  DocumentIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const showMenu = ref(false);
const router = useRouter();
const auth = useAuthStore();

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

function logout() {
  auth.logout();
  router.push("/login");
}

function handleClickOutside(e) {
  if (!e.target.closest(".relative")) {
    showMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const isOpen = ref(true);
</script>

<style scoped>
.animate-fade {
  animation: fadeIn 0.15s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
