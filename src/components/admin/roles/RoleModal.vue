<template>
    <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 class="text-xl font-bold mb-4 text-gray-800">{{ isEdit ? 'Edit Role' : 'New Role' }}</h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                    <input v-model="form.name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" placeholder="e.g. Senior Manager">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea v-model="form.description" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" rows="3" placeholder="Role responsibilities..."></textarea>
                </div>
            </div>
            <div class="flex justify-end gap-3 mt-6">
                <button @click="$emit('update:modelValue', false)" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
                <button 
                    @click="save" 
                    class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition shadow flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    :disabled="loading"
                >
                    <Spinner v-if="loading" />
                    Save
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue';
import Spinner from "@/components/ui/Spinner.vue";

const props = defineProps({
    modelValue: Boolean,
    roleData: Object,
    loading: Boolean,
});

const emit = defineEmits(['update:modelValue', 'save']);

const isEdit = computed(() => !!props.roleData);

const form = reactive({ name: '', description: '' });

watch(() => props.roleData, (val) => {
    if (val) {
        Object.assign(form, val);
    } else {
        Object.assign(form, { name: '', description: '' });
    }
}, { immediate: true });

function save() {
    emit('save', { ...form });
}
</script>
