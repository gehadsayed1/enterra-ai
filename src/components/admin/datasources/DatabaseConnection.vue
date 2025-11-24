<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-primary">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
      Database Connection
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">DB Type</label>
        <select v-model="dbForm.db_type" class="w-full p-3 border-2 rounded-xl outline-none border-purple-200 focus:border-purple-400 transition-all duration-200 bg-white focus:shadow-md">
          <option value="" disabled>Select DB Type</option>
          <option value="MySQL">MySQL</option>
          <option value="PostgreSQL">PostgreSQL</option>
          <option value="MongoDB">MongoDB</option>
          <option value="SQL Server">SQL Server</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Host</label>
        <input type="text" v-model="dbForm.host" placeholder="localhost" class="w-full p-3 border-2 rounded-xl outline-none border-purple-200 focus:border-purple-400 transition-all duration-200 bg-white focus:shadow-md" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Port</label>
        <input type="number" v-model="dbForm.port" placeholder="5432" class="w-full p-3 border-2 rounded-xl outline-none border-purple-200 focus:border-purple-400 transition-all duration-200 bg-white focus:shadow-md" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
        <input type="text" v-model="dbForm.database" placeholder="my_database" class="w-full p-3 border-2 rounded-xl outline-none border-purple-200 focus:border-purple-400 transition-all duration-200 bg-white focus:shadow-md" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input type="text" v-model="dbForm.username" placeholder="root" class="w-full p-3 border-2 rounded-xl outline-none border-purple-200 focus:border-purple-400 transition-all duration-200 bg-white focus:shadow-md" />
      </div>


      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" v-model="dbForm.password" placeholder="••••••" class="w-full p-3 border-2 rounded-xl outline-none border-purple-200 focus:border-purple-400 transition-all duration-200 bg-white focus:shadow-md" />
      </div>
    </div>

    <div class="mt-4 flex justify-end">
      <button
        @click="fetchTables"
        :disabled="isFetchingTables || !dbForm.db_type || !dbForm.host || !dbForm.port || !dbForm.username || !dbForm.database || !dbForm.password"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
      >
        <span v-if="isFetchingTables" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
        {{ isFetchingTables ? 'Fetching...' : 'Fetch Tables' }}
      </button>
    </div>

    
    <div v-if="tables.length > 0" class="mt-6 border-t border-gray-100 pt-4">
      <h3 class="text-lg font-medium text-gray-800 mb-2">Select Tables</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
        <label v-for="table in tables" :key="table" class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
          <input type="checkbox" :value="table" v-model="selectedTables" class="rounded text-primary focus:ring-primary" />
          <span class="text-sm text-gray-700">{{ table }}</span>
        </label>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          @click="handleSave"
          :disabled="selectedTables.length === 0"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          Save Selected Tables
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { CONFIG } from '@/config';

const toast = useToast();
const emit = defineEmits(['save']);

const dbForm = reactive({
  db_type: '',
  host: '',
  port: null,
  username: '',
  password: '',
  database: ''
});

const tables = ref([]);
const selectedTables = ref([]);
const isFetchingTables = ref(false);

const fetchTables = async () => {
  if (!dbForm.db_type || !dbForm.host || !dbForm.username || !dbForm.database) {
    toast.error("Please fill in all required database fields.");
    return;
  }

  isFetchingTables.value = true;
  tables.value = [];
  selectedTables.value = [];

  try {
    const response = await axios.post(`${CONFIG.API_BASE_URL}/datasource/db/connect`, dbForm);
    if (response.data && response.data.tables) {
      tables.value = response.data.tables;
      toast.success("Tables fetched successfully!");
    } else {
      toast.warning("No tables found or invalid response format.");
    }
  } catch (error) {
    console.error("Error fetching tables:", error);
    // Mock data for UI verification as requested
    console.warn("Using mock data for testing purposes");
    tables.value = ['users', 'products', 'orders', 'inventory', 'logs'];
    toast.info("Backend unavailable. Showing dummy tables for preview.");
  } finally {
    isFetchingTables.value = false;
  }
};

const handleSave = () => {
  emit('save', { tables: selectedTables.value });
};
</script>
