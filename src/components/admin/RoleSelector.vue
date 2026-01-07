<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
      <select 
        :value="departmentId" 
        @input="$emit('update:departmentId', $event.target.value ? Number($event.target.value) : null)"
        class="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
      >
        <option :value="null" disabled>Select Department</option>
        <option v-for="dept in departments" :key="dept.id" :value="dept.id">
          {{ dept.name }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
      <select 
        :value="roleId" 
        @input="$emit('update:roleId', $event.target.value ? Number($event.target.value) : null)"
        class="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
        :disabled="!departmentId"
      >
        <option :value="null" disabled>
          {{ departmentId ? 'Select Role' : 'Select Department First...' }}
        </option>
        <option v-for="role in deptRoles" :key="role.id" :value="role.id">
          {{ role.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRolesStore } from "@/stores/rolesStore";

const props = defineProps({
  departmentId: Number,
  roleId: Number,
});

const emit = defineEmits(["update:departmentId", "update:roleId"]);

const rolesStore = useRolesStore();
const departments = computed(() => rolesStore.departments);

const deptRoles = computed(() => 
  rolesStore.roles.filter(r => r.departmentId === props.departmentId)
);
</script>
