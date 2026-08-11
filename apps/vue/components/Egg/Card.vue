<script setup lang="ts">
const props = defineProps(['egg']);
</script>

<template>
  <div class="w-full h-screen flex flex-col items-center justify-center">
    <div
      class="flex flex-col items-center justify-center border border-black shadow-xl bg-white p-4 m-4 my-32 w-full md:max-w-md text-center"
    >
      <vLabel box="0 0 600 100" class="w-1/2">{{ egg.title }}</vLabel>
      <span class="w-3/4 sm:w-1/3">
        <img v-if="egg.image" :src="egg.image" :alt="egg.title" class="w-full h-auto my-2" />
        <EggImage :id="egg.id" v-else :color="egg.color" />
      </span>
      <br />
      <vSubtitle>
        {{ egg.description }} 
        {{ egg.points === 1 ? `+${egg.points}pt.` : `+${egg.points}pts.` }}
      </vSubtitle>
      <p class="mb-8">
        {{ egg.description }}
      </p>
    </div>
  </div>
</template>
