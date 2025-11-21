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

        <select v-model="form.role" class="input">
          <option value="user">User</option>
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>

        <h3 class="text-gray-800 font-semibold mt-6">Permissions</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label class="perm">
            <input type="checkbox" v-model="form.permissions.voice" />
            Send Voice Messages
          </label>

          <label class="perm">
            <input type="checkbox" v-model="form.permissions.uploadFiles" />
            Upload Files
          </label>

          <label class="perm">
            <input type="checkbox" v-model="form.permissions.uploadImages" />
            Upload Images
          </label>

          <label class="perm">
            <input
              type="checkbox"
              v-model="form.permissions.unlimitedMessages"
            />
            Unlimited Messages
          </label>

          <label class="perm">
            <input type="checkbox" v-model="form.permissions.fileSearch" />
            File Search
          </label>

          <label class="perm">
            <input type="checkbox" v-model="form.permissions.multiChats" />
            Multiple Chats
          </label>
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
          class="bg-primary text-white px-8 py-2 rounded-md shadow hover:bg-purple-900"
          @click="submit"
        >
          {{ isEdit ? "Save Changes" : "Add User" }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, reactive, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  userData: { type: Object, default: null },
});

const emit = defineEmits(["update:modelValue", "save"]);

const isEdit = computed(() => !!props.userData);

const form = reactive({
  name: "",
  email: "",
  password: "",
  role: "user",
  permissions: {
    voice: false,
    uploadFiles: true,
    uploadImages: true,
    unlimitedMessages: false,
    fileSearch: true,
    multiChats: true,
  },
});

watch(
  () => props.userData,
  (val) => {
    if (!val) return;
    Object.assign(form, JSON.parse(JSON.stringify(val)));
  },
  { immediate: true }
);

function submit() {
  if (!form.name || !form.email || !form.password) return;

  emit("save", JSON.parse(JSON.stringify(form)));

  emit("update:modelValue", false);
}
</script>

<style>
input[type="checkbox"] {
  accent-color: var(--color-primary);
}
</style>
