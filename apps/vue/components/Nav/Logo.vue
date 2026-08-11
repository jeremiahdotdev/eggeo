<script setup lang="ts">
import { useGetFoundEggs } from '~/composables/gateway/egg';
const foundEggs = useState<number>('foundEggs');

const [_r, _e, refresh] = useGetFoundEggs();

useIntervalFn(refresh, 1000 * 60 * 2);
</script>

<template>
  <NuxtLink to="/" ariaLabel="Home">
    <span class="flex items-center justify-center gap-1 bubble-group">
      <EggImage :strokeWidth="10" :dimensions="{ width: 25 }" styles="bubble-icon" />
      <span v-if="!!foundEggs || foundEggs === 0" class="flex">
        <vLabel v-if="foundEggs < 99" box="0 -5 80 60" styles="w-8 ">{{ foundEggs }}</vLabel>
        <vLabel v-else box="0 -5 120 60" styles="w-8 ">99+</vLabel>
      </span>
      <vLabel v-else box="20 -10 300 200" variant="HEADER">Eggeo</vLabel>
    </span>
  </NuxtLink>
</template>
