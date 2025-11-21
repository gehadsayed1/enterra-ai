<template>
  <div class="flex min-h-screen bg-gray-50">
    <AdminSidebar />

    <div class="flex-1 flex flex-col">
      <AdminHeader />

      <div class="p-6">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminHeader from "@/components/admin/AdminHeader.vue";
</script>
