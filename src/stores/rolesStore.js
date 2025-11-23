import { defineStore } from "pinia";
import { ref } from "vue";

export const useRolesStore = defineStore("roles", () => {
  const departments = ref([
    {
      id: 1,
      name: "IT & Engineering",
      description: "Manage technical resources and development",
      head: "Ahmed Ali",
    },
    {
      id: 2,
      name: "HR & Operations",
      description: "Human resources and daily operations",
      head: "Sarah Smith",
    },
    {
      id: 3,
      name: "Sales & Marketing",
      description: "Customer acquisition and brand management",
      head: "John Doe",
    },
  ]);

  const roles = ref([
    {
      id: 1,
      departmentId: 1,
      name: "Super Admin",
      description: "Full access to everything",
      permissions: ["voice", "uploadFiles", "uploadImages", "unlimitedMessages", "fileSearch", "multiChats"],
    },
    {
      id: 2,
      departmentId: 2,
      name: "Standard User",
      description: "Basic access",
      permissions: ["voice", "uploadFiles", "fileSearch"],
    },
    {
      id: 3,
      departmentId: 3,
      name: "Viewer",
      description: "Read only access",
      permissions: ["fileSearch"],
    },
  ]);

  const availablePermissions = ref([
    {
      category: "Chat Features",
      items: [
        { id: "voice", label: "Send Voice Messages" },
        { id: "unlimitedMessages", label: "Unlimited Messages" },
        { id: "multiChats", label: "Multiple Chats" },
      ],
    },
    {
      category: "File Operations",
      items: [
        { id: "uploadFiles", label: "Upload Files" },
        { id: "uploadImages", label: "Upload Images" },
        { id: "fileSearch", label: "File Search" },
      ],
    },
  ]);

  function addDepartment(dept) {
    departments.value.push({
      id: Date.now(),
      ...dept,
    });
  }

  function updateDepartment(id, data) {
    const index = departments.value.findIndex((d) => d.id === id);
    if (index !== -1) {
      departments.value[index] = { ...departments.value[index], ...data };
    }
  }

  function deleteDepartment(id) {
    departments.value = departments.value.filter((d) => d.id !== id);
    roles.value = roles.value.filter((r) => r.departmentId !== id); 
  }

  function addRole(role) {
    roles.value.push({
      id: Date.now(),
      permissions: [],
      ...role,
    });
  }

  function updateRole(id, data) {
    const index = roles.value.findIndex((r) => r.id === id);
    if (index !== -1) {
      roles.value[index] = { ...roles.value[index], ...data };
    }
  }

  function deleteRole(id) {
    roles.value = roles.value.filter((r) => r.id !== id);
  }

  return {
    departments,
    roles,
    availablePermissions,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addRole,
    updateRole,
    deleteRole,
  };
});
