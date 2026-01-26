<template>
  <div class="space-y-10">
    <!-- Header with gradient text -->
    <div class="space-y-2">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-900 bg-clip-text text-transparent">
        System Evaluation Dashboard
      </h1>
      <p class="text-gray-600 text-sm">Real-time performance metrics and RAG quality scores</p>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Overall Score Card -->
      <div class="group relative p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-purple-700 uppercase tracking-wide">Overall Score</p>
          </div>
          <h2 class="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            {{ formatPercent(evalData.overall_score) }}
          </h2>
        </div>
      </div>

      <!-- Retrieval precision Card -->
      <div class="group relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-blue-700 uppercase tracking-wide">Retrieval Precision</p>
          </div>
          <h2 class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {{ formatPercent(evalData.retrieval_precision) }}
          </h2>
        </div>
      </div>
      
      <!-- Answer Relevancy Card -->
      <div class="group relative p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border border-amber-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-amber-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-amber-700 uppercase tracking-wide">Answer Relevancy</p>
          </div>
          <h2 class="text-5xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            {{ formatPercent(evalData.answer_relevance) }}
          </h2>
        </div>
      </div>

      <!-- Passed/Failed Card -->
      <div class="group relative p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Evaluation Results</p>
          </div>
          <div class="flex items-end gap-2">
            <h2 class="text-4xl font-bold text-emerald-600">{{ evalData.passed || 0 }}</h2>
            <span class="text-gray-400 mb-1 text-lg">/ {{ evalData.total_examples || 0 }} Passed</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts and Logic Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Quality Chart -->
      <div class="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">Quality Metrics</h2>
            <p class="text-sm text-gray-500 mt-1">Breakdown of RAG performance scores</p>
          </div>
        </div>
        <canvas id="qualityChart" height="200"></canvas>
      </div>

      <!-- Graph Visualization -->
      <div class="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-center overflow-hidden">
        <div class="w-full flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">Agent Flow</h2>
            <p class="text-sm text-gray-500 mt-1">LangGraph execution architecture</p>
          </div>
          <button @click="refreshGraph" class="p-2 text-gray-400 hover:text-purple-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
        <div class="relative w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden group">
          <img 
            :src="graphUrl" 
            alt="Agent Graph" 
            class="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
            @error="handleImgError"
          />
          <div v-if="imgError" class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mb-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6.75a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v12.75a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <p class="text-sm">Graph visualization not available</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Chart from "chart.js/auto";
import { onMounted, ref } from "vue";
import { ragService } from "@/services/ragService";

const evalData = ref({});
const graphUrl = ref(ragService.getGraphUrl());
const imgError = ref(false);

function formatPercent(val) {
  if (val === undefined || val === null) return "0%";
  return Math.round(val * 100) + "%";
}

function handleImgError() {
  imgError.value = true;
}

function refreshGraph() {
  imgError.value = false;
  graphUrl.value = ragService.getGraphUrl();
}

onMounted(async () => {
  try {
    const data = await ragService.evaluate();
    evalData.value = data;
    
    // Initialize Chart
    const ctx = document.getElementById("qualityChart");
    new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["Precision", "Recall", "Correctness", "Relevance"],
        datasets: [{
          label: "RAG Evaluation",
          data: [
            data.retrieval_precision || 0,
            data.retrieval_recall || 0,
            data.answer_correctness || 0,
            data.answer_relevance || 0,
          ],
          fill: true,
          backgroundColor: 'rgba(98, 16, 159, 0.2)',
          borderColor: '#62109f',
          pointBackgroundColor: '#62109f',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#62109f'
        }]
      },
      options: {
        elements: {
          line: {
            borderWidth: 3
          }
        },
        scales: {
          r: {
            angleLines: { display: false },
            suggestedMin: 0,
            suggestedMax: 1,
            ticks: { display: false }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });

  } catch (error) {
    console.error("Failed to fetch evaluation metrics:", error);
  }
});
</script>
