<template>
  <router-link
    :to="to"
    class="flex items-center gap-3 p-3 rounded-lg transition cursor-pointer"
    :class="[
      isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100',
      open ? 'justify-start' : 'justify-center',
    ]"
  >
    <component
      :is="iconComponent"
      class="w-6 h-6"
      :class="isActive ? 'text-white' : 'text-primary'"
    />

    <span v-if="open" class="font-medium">
      {{ title }}
    </span>
  </router-link>
</template>
<script setup>
import { computed } from "vue";

import {
  HomeIcon,
  DocumentIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/vue/24/outline";
import { useRoute } from "vue-router";

const props = defineProps({
  icon: String,
  title: String,
  to: String,
  open: Boolean,
});

const route = useRoute();

const isActive = computed(() => route.path === props.to);

const iconComponent = computed(() => {
  return {
    home: HomeIcon,
    document: DocumentIcon,
    users: UsersIcon,
    chat: ChatBubbleLeftRightIcon,
  }[props.icon];
});
</script>


