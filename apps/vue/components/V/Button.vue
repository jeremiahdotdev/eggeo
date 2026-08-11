<script setup lang="ts">
import { randomTailwindBackgroundColor } from '~/composables/colors/randomPastelColors';
defineProps<{ label?: string; a11y?: string; disabled?: boolean }>();
</script>
<template>
  <button
    :disabled="disabled"
    :class="`font-comic-sans text-lg tracking-tighter font-semibold text-center p-2 shadow-xl border border-black hover:border-2 my-1 hover:m-0 active:bg-opacity-70 
      ${randomTailwindBackgroundColor()} 
      ${disabled ? 'opacity-50' : ''}
    `"
    :ariaLabel="a11y ?? label"
  >
    <vLabel :hideHover="true" box="0 0 600 100" styles="w-32" color="white">
      {{ label }}
    </vLabel>
  </button>
</template>
