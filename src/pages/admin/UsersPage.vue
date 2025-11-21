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
        v-for="u in users"
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
            <span v-if="u.permissions?.voice" class="tag purple">Voice</span>
            <span v-if="u.permissions?.uploadFiles" class="tag blue"
              >Files</span
            >
            <span v-if="u.permissions?.uploadImages" class="tag pink"
              >Images</span
            >
            <span v-if="u.permissions?.unlimitedMessages" class="tag green"
              >Unlimited</span
            >
            <span v-if="u.permissions?.fileSearch" class="tag yellow"
              >Search</span
            >
            <span v-if="u.permissions?.multiChats" class="tag gray">Multi</span>
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

    <UserPermissionsModal v-model="showModal" @save="handleNewUser" />

    <ConfirmDelete
      :show="confirmOpen"
      :message="`Are you sure you want to delete ${selectedUser?.name}?`"
      @cancel="confirmOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
<script setup>
import { useUsersStore } from "@/stores/usersStore";
import DataTable from "@/components/admin/DataTable.vue";
import ConfirmDelete from "@/components/admin/ConfirmDelete.vue";
import UserPermissionsModal from "@/components/admin/UserPermissionsModal.vue";
import { ref, computed } from "vue";

const usersStore = useUsersStore();
const users = computed(() => usersStore.users);

const showModal = ref(false);

const confirmOpen = ref(false);
const selectedUser = ref(null);

function openDelete(user) {
  selectedUser.value = user;
  confirmOpen.value = true;
}

function confirmDelete() {
  usersStore.deleteUser(selectedUser.value.id);
  confirmOpen.value = false;
}

function handleNewUser(data) {
  usersStore.addUser(data);
}

function roleStyle(role) {
  return {
    admin: "bg-purple-100 text-purple-700",
    user: "bg-blue-100 text-blue-700",
    viewer: "bg-gray-200 text-gray-700",
  }[role];
}
</script>

<style scoped>
.tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.purple {
  background: #f3e8ff;
  color: #7e22ce;
}
.blue {
  background: #dbeafe;
  color: #1e40af;
}
.pink {
  background: #fce7f3;
  color: #be185d;
}
.green {
  background: #dcfce7;
  color: #166534;
}
.yellow {
  background: #fef9c3;
  color: #a16207;
}
.gray {
  background: #f3f4f6;
  color: #374151;
}
</style>
