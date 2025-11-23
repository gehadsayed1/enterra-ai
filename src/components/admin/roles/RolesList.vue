<template>
  <div class="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
    <div v-if="selectedDept" class="h-full flex flex-col">
      <div class="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
        <div>
          <h2 class="text-xl font-bold text-gray-800">
            {{ selectedDept.name }}
          </h2>
          <p class="text-gray-500 text-sm mt-1">
            {{ selectedDept.description }}
          </p>
          <div class="flex items-center gap-2 mt-3 text-xs text-gray-400">
            <span class="bg-gray-200 px-2 py-0.5 rounded text-gray-600">Head: {{ selectedDept.head }}</span>
            <span>•</span>
            <span>{{ roles.length }} Roles</span>
          </div>
        </div>
        <button
          @click="$emit('add-role')"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm font-medium"
        >
          + Add New Role
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        <div class="space-y-4">
          <div
            v-for="role in roles"
            :key="role.id"
            class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md"
          >
            <div
              @click="toggleRole(role.id)"
              class="p-4 flex items-center justify-between cursor-pointer bg-white hover:bg-gray-50"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-2 h-10 rounded-full"
                  :class="expandedRoleId === role.id ? 'bg-primary' : 'bg-gray-300'"
                ></div>
                <div>
                  <h3 class="font-bold text-gray-800">{{ role.name }}</h3>
                  <p class="text-xs text-gray-500">{{ role.description }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded">
                    {{ role.permissions.length }} Permissions
                </span>
                <button @click.stop="$emit('edit-role', role)" class="text-gray-400 hover:text-blue-600 transition">
                    Edit
                </button>
                <button @click.stop="$emit('delete-role', role)" class="text-gray-400 hover:text-red-600 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                      <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                    </svg>
                </button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-5 h-5 text-gray-400 transition-transform duration-300"
                  :class="expandedRoleId === role.id ? 'rotate-180' : ''"
                >
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <div v-if="expandedRoleId === role.id" class="border-t border-gray-100 p-6 bg-gray-50 animate-fade-in">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="category in availablePermissions" :key="category.category" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h4 class="font-semibold text-gray-700 mb-3 border-b pb-2 text-sm uppercase tracking-wider">{{ category.category }}</h4>
                        <div class="space-y-2">
                            <label v-for="perm in category.items" :key="perm.id" class="flex items-center gap-3 cursor-pointer group">
                                <div class="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        :checked="role.permissions.includes(perm.id)"
                                        @change="togglePermission(role, perm.id)"
                                        class="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all checked:border-primary checked:bg-primary hover:border-primary"
                                    />
                                    <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                    </span>
                                </div>
                                <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{{ perm.label }}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mb-4 opacity-50">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
        <p class="text-lg font-medium">Select a Department</p>
        <p class="text-sm">Choose a department from the left to manage its roles.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRolesStore } from "@/stores/rolesStore";

const props = defineProps({
  selectedDept: Object,
  roles: Array,
  availablePermissions: Array,
});

const emit = defineEmits(['add-role', 'edit-role', 'delete-role']);

const rolesStore = useRolesStore();
const expandedRoleId = ref(null);

function toggleRole(id) {
    if (expandedRoleId.value === id) {
        expandedRoleId.value = null;
    } else {
        expandedRoleId.value = id;
    }
}

function togglePermission(role, permId) {
    const perms = new Set(role.permissions);
    if (perms.has(permId)) {
        perms.delete(permId);
    } else {
        perms.add(permId);
    }
    rolesStore.updateRole(role.id, { permissions: Array.from(perms) });
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
