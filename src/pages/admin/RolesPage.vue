<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">
          Roles & Permissions
        </h1>
        <p class="text-gray-500 text-sm mt-1">
          Manage access levels, departments, and granular permissions across the
          system.
        </p>
      </div>
      <button @click="openDeptModal()"
        class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 cursor-pointer transition flex items-center gap-2 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        New Department
      </button>
    </div>

    <div class="flex-1 flex gap-6 overflow-hidden">
      <DepartmentsSidebar :departments="departments" :selectedDeptId="selectedDeptId" @select="selectedDeptId = $event"
        @edit="openDeptModal" @delete="confirmDeleteDept" />

      <RolesList :selectedDept="selectedDept" :roles="deptRoles" :availablePermissions="availablePermissions"
        @add-role="openRoleModal" @edit-role="openRoleModal" @delete-role="confirmDeleteRole" />
    </div>


    <DepartmentModal v-model="showDeptModal" :deptData="editingDept" :loading="deptLoading" @save="saveDept" />

    <RoleModal v-model="showRoleModal" :roleData="editingRole" :loading="roleLoading" @save="saveRole" />


    <ConfirmDelete :show="showDeleteDeptConfirm" title="Delete Department"
      :message="`Are you sure you want to delete '${deletingDept?.name}'? All roles in this department will also be deleted.`"
      @cancel="showDeleteDeptConfirm = false" @confirm="deleteDept" />

    <ConfirmDelete :show="showDeleteRoleConfirm" title="Delete Role"
      :message="`Are you sure you want to delete the role '${deletingRole?.name}'?`"
      @cancel="showDeleteRoleConfirm = false" @confirm="deleteRole" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRolesStore } from "@/stores/rolesStore";
import DepartmentsSidebar from "@/components/admin/roles/DepartmentsSidebar.vue";
import RolesList from "@/components/admin/roles/RolesList.vue";
import DepartmentModal from "@/components/admin/roles/DepartmentModal.vue";
import RoleModal from "@/components/admin/roles/RoleModal.vue";
import ConfirmDelete from "@/components/admin/ConfirmDelete.vue";

const rolesStore = useRolesStore();

const departments = computed(() => rolesStore.departments);
const availablePermissions = computed(() => rolesStore.availablePermissions);

const selectedDeptId = ref(null);
const selectedDept = computed(() =>
  departments.value.find(d => d.id === selectedDeptId.value)
);

const deptRoles = computed(() =>
  rolesStore.roles.filter(r => r.departmentId === selectedDeptId.value)
);


const showDeptModal = ref(false);
const editingDept = ref(null);
const deptLoading = ref(false);

function openDeptModal(dept = null) {
  editingDept.value = dept;
  showDeptModal.value = true;
}

async function saveDept(deptForm) {
  deptLoading.value = true;

  await new Promise(resolve => setTimeout(resolve, 600));

  if (editingDept.value) {
    rolesStore.updateDepartment(editingDept.value.id, deptForm);
  } else {
    rolesStore.addDepartment(deptForm);
  }
  deptLoading.value = false;
  showDeptModal.value = false;
}

const showDeleteDeptConfirm = ref(false);
const deletingDept = ref(null);

function confirmDeleteDept(dept) {
  deletingDept.value = dept;
  showDeleteDeptConfirm.value = true;
}

function deleteDept() {
  if (deletingDept.value) {
    rolesStore.deleteDepartment(deletingDept.value.id);
    if (selectedDeptId.value === deletingDept.value.id) {
      selectedDeptId.value = departments.value.length > 0 ? departments.value[0].id : null;
    }
  }
  showDeleteDeptConfirm.value = false;
  deletingDept.value = null;
}

const showRoleModal = ref(false);
const editingRole = ref(null);
const roleLoading = ref(false);

function openRoleModal(role = null) {
  editingRole.value = role;
  showRoleModal.value = true;
}

async function saveRole(roleForm) {
  roleLoading.value = true;

  await new Promise(resolve => setTimeout(resolve, 600));

  if (editingRole.value) {
    rolesStore.updateRole(editingRole.value.id, roleForm);
  } else {
    rolesStore.addRole({
      ...roleForm,
      departmentId: selectedDeptId.value
    });
  }
  roleLoading.value = false;
  showRoleModal.value = false;
}

const showDeleteRoleConfirm = ref(false);
const deletingRole = ref(null);

function confirmDeleteRole(role) {
  deletingRole.value = role;
  showDeleteRoleConfirm.value = true;
}

function deleteRole() {
  if (deletingRole.value) {
    rolesStore.deleteRole(deletingRole.value.id);
  }
  showDeleteRoleConfirm.value = false;
  deletingRole.value = null;
}

if (departments.value.length > 0) {
  selectedDeptId.value = departments.value[0].id;
}
</script>
