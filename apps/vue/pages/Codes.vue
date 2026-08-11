<script setup lang="ts">
import { useGetUserEggs } from '~/composables/gateway/egg';
import { randomTailwindBackgroundColor } from '~/composables/colors/randomPastelColors';

const [eggs, error] = useGetUserEggs();
const color = randomTailwindBackgroundColor();
const handlePrint = () => {
  window.print();
};
</script>

<template>
  <button
    @click="handlePrint"
    id="printer"
    :class="`z-10 w-16 h-16 p-2 border border-black shadow-xl aspect-square rounded-full fixed top-24 right-6 active:opacity-80 ${color}`"
  >
    <vPrinter />
  </button>
  <section id="item-pane" class="h-fit flex flex-wrap gap-4 my-24 items-center justify-center">
    <EggDisplay v-for="egg in eggs" :key="egg.id" :egg="egg" id="item" />
  </section>
</template>

<style>
@media print {
  #printer {
    display: none;
  }
  #item-pane {
    padding: 0;
    gap: 2rem;
    margin: 0;
    break-inside: avoid-page;
    height: fit-content;
    padding-bottom: 100px;
  }
  #item {
    break-inside: avoid-page !important;
    break-before: always;
    print-color-adjust: exact;
    box-shadow: none;
  }
}
</style>
