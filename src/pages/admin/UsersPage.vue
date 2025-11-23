<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-800">Users</h1>

      <button
        @click="showModal = true"
        class="border border-primary px-5 py-2.5 cursor-pointer rounded shadow text-primary hover:bg-primary hover:!text-white transition"
      >
        + Add User
      </button>
    </div>

    <DataTable :headers="['Name', 'Email', 'Role', 'Permissions', '']">
      <tr
        v-for="u in paginatedUsers"
        :key="u.id"
        class="border-t border-gray-300 hover:bg-gray-50 transition"
      >
        <td class="p-4">{{ u.name }}</td>
        <td class="p-4">{{ u.email }}</td>

        <td class="p-4">
          <span
            :class="roleStyle(u.role)"
            class="px-3 py-1 rounded-md text-sm font-medium"
          >
            {{ u.role }}
          </span>
        </td>

        <td class="p-4">
          <div class="flex flex-wrap gap-2 justify-center">
             <template v-for="(perm, index) in getUserPermissions(u)" :key="perm.id">
                <span 
                    v-if="index < 3"
                    class="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200"
                >
                    {{ perm.label }}
                </span>
             </template>
             
             <div v-if="getUserPermissions(u).length > 3" class="relative group">
                <span class="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-700 cursor-help">
                    +{{ getUserPermissions(u).length - 3 }} more
                </span>
                
                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-gray-800 text-white text-xs rounded p-2 z-10 shadow-lg">
                    <div class="flex flex-col gap-1">
                        <span v-for="perm in getUserPermissions(u).slice(3)" :key="perm.id">
                            • {{ perm.label }}
                        </span>
                    </div>
                </div>
             </div>
          </div>
        </td>

        <td class="p-4">
          <button
            class="text-red-500 hover:text-red-700"
            @click="openDelete(u)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09
                      1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </td>
      </tr>

      <tr v-if="users.length === 0">
        <td colspan="5" class="p-6 text-center text-gray-500 italic">
          No users added yet.
        </td>
      </tr>
    </DataTable>

    <Pagination
      v-if="users.length > 0"
      :currentPage="currentPage"
      :perPage="perPage"
      :total="users.length"
      @update:currentPage="currentPage = $event"
      @update:perPage="perPage = $event; currentPage = 1"
    />

    <UserPermissionsModal 
        v-model="showModal" 
        :userData="selectedUser"
        :loading="loading"
        @save="handleNewUser" 
    />

    <ConfirmDelete
      :show="confirmOpen"
      title="Delete User"
      :message="`Are you sure you want to delete ${selectedUser?.name}?`"
      @cancel="confirmOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
<script setup>
import { useUsersStore } from "@/stores/usersStore";
import { useRolesStore } from "@/stores/rolesStore";
import DataTable from "@/components/admin/DataTable.vue";
import ConfirmDelete from "@/components/admin/ConfirmDelete.vue";
import UserPermissionsModal from "@/components/admin/UserPermissionsModal.vue";
import Pagination from "@/components/ui/Pagination.vue";
import { ref, computed } from "vue";

const usersStore = useUsersStore();
const rolesStore = useRolesStore();

const users = computed(() => usersStore.users);
const availablePermissions = computed(() => rolesStore.availablePermissions);

const showModal = ref(false);
const loading = ref(false);

const confirmOpen = ref(false);
const selectedUser = ref(null);

    
const currentPage = ref(1);
const perPage = ref(10);

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return users.value.slice(start, end);
});

function openDelete(user) {
  selectedUser.value = user;
  confirmOpen.value = true;
}

function confirmDelete() {
  usersStore.deleteUser(selectedUser.value.id);
  confirmOpen.value = false;
}

async function handleNewUser(data) {
  loading.value = true;
  await new Promise(resolve => setTimeout(resolve, 600));
  usersStore.addUser(data);
  loading.value = false;
  showModal.value = false;
}

function roleStyle(role) {
  return {
    admin: "bg-purple-100 text-purple-700",
    user: "bg-blue-100 text-blue-700",
    viewer: "bg-gray-200 text-gray-700",
  }[role] || "bg-indigo-100 text-indigo-700";
}

function getUserPermissions(user) {
    if (!user.permissions) return [];
    
    const allPerms = availablePermissions.value.flatMap(cat => cat.items);
    
    return Object.keys(user.permissions)
        .filter(key => user.permissions[key])
        .map(key => {
            const found = allPerms.find(p => p.id === key);
            return found ? { id: key, label: found.label } : { id: key, label: key };
        });
}
</script>
