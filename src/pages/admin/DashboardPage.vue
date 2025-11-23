<template>
  <div class="space-y-10">
    <!-- Header with gradient text -->
    <div class="space-y-2">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-900 bg-clip-text text-transparent">
        Dashboard Overview
      </h1>
      <p class="text-gray-600 text-sm">Monitor your system statistics and activity</p>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Files Card -->
      <div class="group relative p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-purple-700 uppercase tracking-wide">Total Files</p>
          </div>
          <h2 class="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            {{ totalFiles }}
          </h2>
        </div>
      </div>

      <!-- Total Users Card -->
      <div class="group relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total Users</p>
          </div>
          <h2 class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {{ totalUsers }}
          </h2>
        </div>
      </div>
      
      <!-- Last File Card -->
      <div class="group relative p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border border-amber-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-amber-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-amber-700 uppercase tracking-wide">Latest File</p>
          </div>
          <h2 class="text-base font-semibold text-amber-800 truncate" :title="lastFile || 'No files yet'">
            {{ lastFile || "No files yet" }}
          </h2>
        </div>
      </div>

      <!-- Latest User Card -->
      <div class="group relative p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.502 20.118a7.5 7.5 0 0114.996 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.498-1.632z" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Latest User</p>
          </div>
          <h2 class="text-base font-semibold text-emerald-800 truncate" :title="lastUser || 'No users yet'">
            {{ lastUser || "No users yet" }}
          </h2>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Activity Chart</h2>
          <p class="text-sm text-gray-500 mt-1">Weekly overview of files and users</p>
        </div>
        <div class="flex gap-4">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-purple-600"></div>
            <span class="text-sm text-gray-600">Files</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-blue-600"></div>
            <span class="text-sm text-gray-600">Users</span>
          </div>
        </div>
      </div>
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

  // Create gradient for Files line
  const filesGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
  filesGradient.addColorStop(0, 'rgba(98, 16, 159, 0.3)');
  filesGradient.addColorStop(1, 'rgba(98, 16, 159, 0.01)');

  // Create gradient for Users line
  const usersGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
  usersGradient.addColorStop(0, 'rgba(37, 99, 235, 0.3)');
  usersGradient.addColorStop(1, 'rgba(37, 99, 235, 0.01)');

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Files",
          data: [2, 4, 3, 6, 5, totalFiles.value, totalFiles.value + 1],
          borderColor: "#7209b7",
          backgroundColor: filesGradient,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#7209b7",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "#9d4edd",
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 3,
        },
        {
          label: "Users",
          data: [1, 2, 2, 3, 4, totalUsers.value, totalUsers.value + 2],
          borderColor: "#2563eb",
          backgroundColor: usersGradient,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#2563eb",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "#3b82f6",
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          display: false, // We have custom legend in the template
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          titleColor: '#fff',
          bodyColor: '#fff',
          titleFont: {
            size: 14,
            weight: 'bold',
          },
          bodyFont: {
            size: 13,
          },
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#6b7280",
            font: {
              size: 12,
              weight: '500',
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false,
          },
          ticks: {
            color: "#6b7280",
            font: {
              size: 12,
              weight: '500',
            },
            padding: 10,
          },
        },
      },
    },
  });
});
</script>
