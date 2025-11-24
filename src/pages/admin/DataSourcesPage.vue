<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-2">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-900 bg-clip-text text-transparent">
        Data Sources
      </h1>
      <p class="text-gray-600 text-sm">Manage your database connections and local file sources</p>
    </div>

    <!-- Data Sources Component -->
    <DataSources />
  </div>
</template>

<script setup>
import DataSources from "@/components/admin/DataSources.vue";
</script>
