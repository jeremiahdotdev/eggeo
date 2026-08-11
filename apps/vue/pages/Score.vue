<script setup lang="ts">
import { $deleteScore } from '~/composables/gateway/egg';
const foundEggs = useState<number>('foundEggs');
const active = ref<boolean>();

const handleDelete = async () => {
  active.value = true;
  const [response, error] = await $deleteScore();
  if (!error) foundEggs.value = 0;
  active.value = false;
};
</script>

<template>
  <main class="overflow-hidden flex flex-col items-center justify-center max-w-screen w-full h-full py-32">
    <vLabel class="w-full h-fit" color="fill-white" box="0 0 600 100">{{ foundEggs }}</vLabel>
    <button
      @click="handleDelete"
      :class="`bg-red-600 text-white border-black border-2 shadow-xl p-4 text-xl ${active ? 'opacity-80' : ''}`"
    >
      RESET SCORE
    </button>
  </main>
</template>
