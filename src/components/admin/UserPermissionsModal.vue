<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div
      class="bg-white p-8 rounded-2xl w-full max-w-xl shadow-xl border border-gray-200"
    >
      <h2 class="text-2xl font-bold mb-6 text-gray-800">
        {{ isEdit ? "Edit User" : "Add User" }}
      </h2>

      <div class="space-y-4">
        <input
          v-model="form.name"
          type="text"
          placeholder="Name"
          class="input"
        />

        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          class="input"
        />

        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          class="input"
        />

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select v-model="selectedDeptId" class="input">
                    <option :value="null" disabled>Select Department</option>
                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                        {{ dept.name }}
                    </option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select v-model="form.roleId" class="input" :disabled="!selectedDeptId">
                    <option :value="null" disabled>Select Role</option>
                    <option v-for="role in deptRoles" :key="role.id" :value="role.id">
                        {{ role.name }}
                    </option>
                </select>
            </div>
        </div>

        <div v-if="selectedRole" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Permissions for {{ selectedRole.name }}:</h4>
            <div class="flex flex-wrap gap-2">
                <span v-for="perm in selectedRole.permissions" :key="perm" class="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">
                    {{ perm }}
                </span>
            </div>
        </div>

      </div>

      <div class="flex justify-end gap-3 mt-8">
        <button
          class="px-4 py-2 rounded-md"
          @click="$emit('update:modelValue', false)"
        >
          Cancel
        </button>

        <button
          class="bg-primary text-white px-8 py-2 rounded-md shadow hover:bg-purple-900 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          @click="submit"
          :disabled="!form.roleId || loading"
        >
          <Spinner v-if="loading" />
          {{ isEdit ? "Save Changes" : "Add User" }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, reactive, watch, ref } from "vue";
import { useRolesStore } from "@/stores/rolesStore";
import Spinner from "@/components/ui/Spinner.vue";

const props = defineProps({
  modelValue: Boolean,
  userData: { type: Object, default: null },
  loading: Boolean,
});

const emit = defineEmits(["update:modelValue", "save"]);

const rolesStore = useRolesStore();
const departments = computed(() => rolesStore.departments);

const selectedDeptId = ref(null);
const deptRoles = computed(() => 
    rolesStore.roles.filter(r => r.departmentId === selectedDeptId.value)
);

const isEdit = computed(() => !!props.userData);

const form = reactive({
  name: "",
  email: "",
  password: "",
  roleId: null,
  role: "",   
  departmentId: null,
  permissions: {},
});

const selectedRole = computed(() => 
    rolesStore.roles.find(r => r.id === form.roleId)
);

watch(
  () => props.userData,
  (val) => {
    if (!val) {
        form.name = "";
        form.email = "";
        form.password = "";
        form.roleId = null;
        selectedDeptId.value = null;
        return;
    }
    
    form.name = val.name;
    form.email = val.email;
    form.password = val.password;
    form.departmentId = val.departmentId;
    form.roleId = val.roleId;
    
    if (val.departmentId) {
        selectedDeptId.value = val.departmentId;
    } else if (val.roleId) {
        const role = rolesStore.roles.find(r => r.id === val.roleId);
        if (role) selectedDeptId.value = role.departmentId;
    }
  },
  { immediate: true }
);

function submit() {
  if (!form.name || !form.email || !form.password || !form.roleId) return;

  const role = selectedRole.value;
  if (role) {
      form.role = role.name;
      form.departmentId = selectedDeptId.value;
      
      const permsObj = {};
      role.permissions.forEach(p => {
          permsObj[p] = true;
      });
      form.permissions = permsObj;
  }

  emit("save", JSON.parse(JSON.stringify(form)));
  emit("update:modelValue", false);
}
</script>

<style>
input[type="checkbox"] {
  accent-color: var(--color-primary);
}
</style>
