<template>
  <div class="space-y-10">
    <h1 class="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="stat-card">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div class="icon bg-purple-100 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-7 h-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
          <p class="subtitle">Total Files</p>
        </div>
        <h2 class="value">{{ totalFiles }}</h2>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div class="icon bg-blue-100 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-7 h-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 20h5V4H2v16h5m0 0v1.5m10-1.5v1.5m-8-8h6"
              />
            </svg>
          </div>
          <div class="subtitle">Total Users</div>
        </div>

        <h2 class="value">{{ totalUsers }}</h2>
      </div>
      
      <div class="stat-card">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div class="icon bg-yellow-100 text-yellow-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-7 h-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 7.5h18M3 12h18m-9 4.5h9"
              />
            </svg>
          </div>

          <p class="subtitle">Last Uploaded File</p>
        </div>
        <h2 class="text-base text-primary">
          {{ lastFile || "No files yet" }}
        </h2>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div class="icon bg-green-100 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-7 h-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 
                     3.75 3.75 0 017.5 0zM4.5 20.625a8.25 8.25 0 0116.5 0"
              />
            </svg>
          </div>

          <p class="subtitle">Latest User</p>
        </div>
        <h2 class="text-base text-primary">
          {{ lastUser || "No users yet" }}
        </h2>
      </div>
    </div>

    <div class="bg-white rounded-2xl p-6 shadow border border-gray-200">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Activity Chart</h2>
      <canvas id="dashboardChart" height="80"></canvas>
    </div>
  </div>
</template>
<script setup>
import Chart from "chart.js/auto";
import { onMounted, computed } from "vue";
import { useFilesStore } from "@/stores/filesStore";
import { useUsersStore } from "@/stores/usersStore";

const filesStore = useFilesStore();
const usersStore = useUsersStore();

// Stats
const totalFiles = computed(() => filesStore.files.length);
const totalUsers = computed(() => usersStore.users.length);

const lastFile = computed(() =>
  filesStore.files.length ? filesStore.files.at(-1).name : null
);

const lastUser = computed(() =>
  usersStore.users.length ? usersStore.users.at(-1).email : null
);

onMounted(() => {
  const ctx = document.getElementById("dashboardChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Files",
          data: [2, 4, 3, 6, 5, totalFiles.value, totalFiles.value + 1],
          borderColor: "#62109F",
          tension: 0.4,
        },
        {
          label: "Users",
          data: [1, 2, 2, 3, 4, totalUsers.value, totalUsers.value + 2],
          borderColor: "#2563eb",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: "#333" } },
      },
      scales: {
        x: { ticks: { color: "#555" } },
        y: { ticks: { color: "#555" } },
      },
    },
  });
});
</script>
