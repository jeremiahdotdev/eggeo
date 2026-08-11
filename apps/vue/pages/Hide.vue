<script setup lang="ts">
const { coords } = useGeolocation();

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
    <vLabel v-if="!isShown" styles="w-72">Hide</vLabel>
    <QRCodeScanner v-if="!isShown" @onDetect="onDetect" />
    <HidePopUp v-if="isShown" :uuid="uuid" :hide="hide" :location="{ lat: coords.latitude, lng: coords.longitude }" />
  </div>
</template>
