<script setup>
import { ChartBarIcon, DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import QuickActionCard from './QuickActionCard.vue'


</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-7 md:px-60">

    <QuickActionCard
      color="#3B82F6"
      :icon="DocumentTextIcon"
      title="Summarize Uploaded Files"
      subtitle="Generate a clear and concise summary with highlighted key points from uploaded documents."
    />

    <QuickActionCard
      color="#C026D3"
      :icon="MagnifyingGlassIcon"
      title="Extract Key Insights"
      subtitle="Identify important details, numbers, dates, and structured information with high accuracy."
    />

    <QuickActionCard
      color="#F59E0B"
      :icon="ChartBarIcon"
      title="Analyze Document Content"
      subtitle="Get deep AI-powered analysis: topics, reasoning, sentiment, and full context understanding."
    />

  </div>
</template>
