<script setup lang="ts">
const props = defineProps<{
  label?: string;
}>();
</script>
<template>
  <span class="w-full flex flex-col items-center align-center px-4">
    <vLabel v-if="label" box="0 0 1200 100" class="w-3/4 sm:w-1/2">{{ label }}:</vLabel>
    <slot></slot>
  </span>
</template>
