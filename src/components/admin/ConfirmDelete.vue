<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-xl p-8 max-w-xl shadow-lg text-center">

      <h2 class="text-xl font-bold text-gray-800 mb-3">
        Confirm Delete
      </h2>

      <p class="text-gray-600 text-sm mb-6">
        {{ message }}
      </p>

      <div class="flex items-center justify-between gap-3">
        <button
          @click="$emit('cancel')"
          class="w-1/2 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          @click="$emit('confirm')"
          class="w-1/2 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String
});
defineEmits(["cancel", "confirm"]);
</script>
