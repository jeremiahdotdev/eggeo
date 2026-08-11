<script setup lang="ts">
const foundEggs = useState('foundEggs');
</script>

<template>
  <main class="relative overflow-hidden flex flex-col items-center justify-center max-w-screen w-full h-full py-32">
    <vLabel class="w-full sm:w-1/3 md:w-1/4 lg:w-1/5">Jeremiah's</vLabel>
    <vDigitsLabel label="Eggeo" />
    <div class="relative max-w-screen-sm w-full md:w-1/2 lg:w-1/3">
      <EggImage styles="bubble-icon" :showBush="true" />
      <div
        v-if="!!foundEggs || foundEggs === 0"
        class="absolute top-0 flex flex-col justify-center items-center w-full h-full mt-8"
      >
        <vLabel class="w-full h-fit" color="fill-white" box="0 0 260 130">{{ foundEggs }}</vLabel>
      </div>
    </div>
  </main>
</template>
