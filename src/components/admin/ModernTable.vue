<template>
  <div class="bg-white shadow-xl rounded-2xl border border-gray-100 p-8  transition-shadow duration-300">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">{{ title }}</h2>
        <p class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
      </div>
      <div class="flex items-center gap-4">
        <slot name="extra-actions"></slot>
        <div v-if="showCount" class="bg-gradient-to-r from-purple-100 to-purple-200 px-4 py-2 rounded-lg">
          <span class="text-purple-800 font-bold text-lg">{{ total }}</span>
        </div>
      </div>
    </div>

    
    <div class="overflow-hidden rounded-xl border-2 border-gray-200">
      <table class="w-full text-center">
        <thead class="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <tr>
            <th 
              v-for="header in headers" 
              :key="header"
              class="p-4 text-base font-bold uppercase tracking-wide"
            >
              {{ header }}
            </th>
          </tr>
        </thead>

        <tbody>
          <slot></slot>
        </tbody>
      </table>
    </div>

  
    <Pagination 
      v-if="total > 0" 
      v-model:currentPage="currentPageModel" 
      v-model:perPage="perPageModel" 
      :total="total" 
    />
  </div>
</template>

<script setup>
import Pagination from "@/components/ui/Pagination.vue";
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
  headers: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  perPage: {
    type: Number,
    default: 10,
  },
  showCount: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:currentPage", "update:perPage"]);

const currentPageModel = computed({
  get: () => props.currentPage,
  set: (value) => emit("update:currentPage", value),
});

const perPageModel = computed({
  get: () => props.perPage,
  set: (value) => emit("update:perPage", value),
});
</script>
