<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div
      class="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl border border-gray-200"
    >
      <h3 class="text-xl font-bold text-gray-800 mb-4">Select Role & Department</h3>
      
      <p class="text-gray-600 text-sm mb-6">
        Please select the department and role to associate with this data source.
      </p>

      <RoleSelector
        v-model:departmentId="departmentId"
        v-model:roleId="roleId"
      />

      <div class="flex justify-end gap-3 mt-8">
        <button
          class="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
          @click="close"
        >
          Cancel
        </button>

        <button
          class="bg-primary text-white px-6 py-2 rounded-md shadow hover:bg-purple-900 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          @click="confirm"
          :disabled="!roleId || loading"
        >
          <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import RoleSelector from "@/components/admin/RoleSelector.vue";

const props = defineProps({
  modelValue: Boolean,
  loading: Boolean,
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const departmentId = ref(null);
const roleId = ref(null);

watch(() => props.modelValue, (val) => {
  if (val) {
    // Reset selection when modal opens
    departmentId.value = null;
    roleId.value = null;
  }
});

function close() {
  emit("update:modelValue", false);
}

function confirm() {
  if (!roleId.value) return;
  emit("confirm", { departmentId: departmentId.value, roleId: roleId.value });
}
</script>
