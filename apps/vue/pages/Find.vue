<script setup lang="ts">
const uuid = ref<string>();
const isShown = ref<boolean>();
const onDetect = (val: string) => {
  uuid.value = val;
  isShown.value = true;
};
const hide = () => {
  uuid.value = undefined;
  isShown.value = false;
};
</script>

<template>
  <div class="h-screen w-full py-16 flex flex-col items-center justify-center">
    <vLabel v-if="!isShown" styles="w-72">Find</vLabel>
    <QRCodeScanner v-if="!isShown" @onDetect="onDetect" />
    <FindPopUp v-if="isShown" :uuid="uuid" :hide="hide" />
  </div>
</template>
