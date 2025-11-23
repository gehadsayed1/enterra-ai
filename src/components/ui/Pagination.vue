<template>
  <div class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">

    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-700">Show</span>
      <select :value="perPage" @change="$emit('update:perPage', Number($event.target.value))"
        class="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
        <option :value="4">4</option>
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
      </select>
      <span class="text-sm text-gray-700">entries</span>
    </div>


    <div class="flex items-center gap-4">
      <span class="text-sm text-gray-700">
        Showing {{ startItem }} to {{ endItem }} of {{ total }} entries
      </span>

      <div class="flex gap-1">

        <button @click="$emit('update:currentPage', 1)" :disabled="currentPage === 1"
          class="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd"
              d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L5.832 10l3.938 3.71a.75.75 0 01.02 1.06z"
              clip-rule="evenodd" />
          </svg>
        </button>


        <button @click="$emit('update:currentPage', currentPage - 1)" :disabled="currentPage === 1"
          class="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clip-rule="evenodd" />
          </svg>
        </button>

        <button v-for="page in visiblePages" :key="page" @click="$emit('update:currentPage', page)" :class="[
          'px-3 py-1 rounded border text-sm transition',
          page === currentPage
            ? 'bg-primary text-white border-primary'
            : 'border-gray-300 hover:bg-gray-50'
        ]">
          {{ page }}
        </button>

        <button @click="$emit('update:currentPage', currentPage + 1)" :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clip-rule="evenodd" />
          </svg>
        </button>


        <button @click="$emit('update:currentPage', totalPages)" :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd"
              d="M10.21 14.77a.75.75 0 01.02-1.06L14.168 10 10.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02zm-6 0a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

defineEmits(['update:currentPage', 'update:perPage']);

const totalPages = computed(() => Math.ceil(props.total / props.perPage));

const startItem = computed(() => {
  if (props.total === 0) return 0;
  return (props.currentPage - 1) * props.perPage + 1;
});

const endItem = computed(() => {
  const end = props.currentPage * props.perPage;
  return end > props.total ? props.total : end;
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});
</script>
