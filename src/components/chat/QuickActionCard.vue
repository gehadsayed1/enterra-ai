<template>
  <div
    class="bg-white rounded-2xl shadow-sm py-6 px-8 border border-gray-200 hover:shadow-md transition cursor-pointer flex flex-col gap-5"
  >
    <div class="flex justify-between it">
      <div
        class="w-12 h-12 flex items-center justify-center rounded-xl text-white text-2xl shadow"
        :style="{ background: color }"
      >
        <component :is="icon" class="w-6 h-6 text-white" />
      </div>

      <h3 class="text-gray-800 font-bold text-lg leading-tight">
        {{ title }}
      </h3>
    </div>

    <p class="text-gray-500 text-sm leading-6">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  color: String,
  icon: Object,
  title: String,
  subtitle: String,
});
</script>
