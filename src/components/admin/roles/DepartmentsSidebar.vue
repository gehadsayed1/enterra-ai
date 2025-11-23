<template>
    <div class="w-1/4 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        <div class="p-4 border-b border-gray-100 bg-gray-50">
            <h2 class="font-semibold text-gray-700">Departments</h2>
        </div>
        <div class="flex-1 overflow-y-auto p-2 space-y-2">
            <div v-for="dept in departments" :key="dept.id" @click="$emit('select', dept.id)"
                class="p-3 rounded-lg cursor-pointer transition-all border group relative" :class="selectedDeptId === dept.id
                        ? 'bg-primary/5 border-primary shadow-sm'
                        : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                    ">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-medium" :class="selectedDeptId === dept.id
                                ? 'text-primary'
                                : 'text-gray-800'
                            ">
                            {{ dept.name }}
                        </h3>
                        <p class="text-xs text-gray-500 mt-1 line-clamp-1">
                            {{ dept.description }}
                        </p>
                    </div>
                </div>

                <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button @click.stop="$emit('edit', dept)" class="p-1 hover:bg-gray-200 rounded text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                            <path
                                d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            <path
                                d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                        </svg>
                    </button>
                    <button @click.stop="$emit('delete', dept)" class="p-1 hover:bg-red-100 rounded text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                            <path fill-rule="evenodd"
                                d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    departments: Array,
    selectedDeptId: Number,
});

defineEmits(['select', 'edit', 'delete']);
</script>
