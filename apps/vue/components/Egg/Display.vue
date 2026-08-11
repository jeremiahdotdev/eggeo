<script setup lang="ts">
import { $deleteEgg } from '~/composables/gateway/egg';
import { parseLinkFromEgg } from '~/composables/parseLinkFromEgg';
import QrcodeVue from 'qrcode.vue';
import type { Egg } from '~/types/egg';
import type { Level, RenderAs } from 'qrcode.vue';
import { randomTailwindBackgroundColor } from '~/composables/colors/randomPastelColors';

const props = defineProps<{
  egg: Egg;
}>();
const level = ref<Level>('M');
const renderAs = ref<RenderAs>('svg');
const deleted = ref<boolean>();
const active = ref<boolean>();
const color = randomTailwindBackgroundColor();

const handleDelete = async () => {
  active.value = true;
  const [response, error] = await $deleteEgg(props.egg);
  deleted.value = !error;
};
</script>

<template>
  <div v-if="!deleted" class="w-64 flex flex-col items-center justify-center gap-4">
    <vSubtitle class="w-32">{{ egg.title }}</vSubtitle>
    <span
      class="relative m-4 mt-0 p-4 border-black border-2 shadow-xl flex flex-col items-center justify-center"
      :style="`background-color: ${egg.color ?? '#ffffff'}`"
    >
    <span
        id="delete"
        :class="`flex align-center items-center absolute w-8 h-8 border border-black shadow-xl aspect-square rounded-full fixed -top-4 -right-4 bg-white`"
      >
        <button
          @click="handleDelete"
          :class="`flex rounded-full w-full h-full align-center items-center ${active ? 'opacity-70' : ''} ${color}`"
        >
          <vClose class="w-full" />
        </button>
      </span>
      <span class="border border-black bg-white p-4">
        <qrcode-vue :value="parseLinkFromEgg(egg.id ?? '')" :level="level" :render-as="renderAs" />
      </span>
    </span>
  </div>
</template>

<style>
@media print {
  #delete {
    display: none;
  }
}
</style>
