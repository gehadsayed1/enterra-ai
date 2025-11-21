<template>
  <div class="overflow-hidden rounded-xl border border-gray-200">
    <table class="w-full text-center">
      <thead class="bg-primary/50 text-white">
        <tr>
          <th
            v-for="head in headers"
            :key="head"
            class="p-4 text-lg font-semibold"
          >
            {{ head }}
          </th>
        </tr>
      </thead>

      <tbody>
        <slot></slot>
      </tbody>

    </table>
  </div>
</template>

<script setup>
defineProps({
  headers: Array
})
</script>
