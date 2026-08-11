<script setup lang="ts">
import isUUID from 'validator/lib/isUUID';
import { QrcodeStream } from 'vue-qrcode-reader';
import { parseEggFromLink } from '~/composables/parseEggFromLink';

const emit = defineEmits(['onDetect']);

const onDetect = (value: Array<any>) => {
  const uuid = value?.[0]?.rawValue;
  const uuidFromLink = parseEggFromLink(uuid);
  if (isUUID(uuid)) {
    emit('onDetect', uuid);
  } else if (isUUID(uuidFromLink)) {
    emit('onDetect', uuidFromLink);
  }
};
</script>

<template>
  <div class="w-full h-auto relative flex items-center justify-center z-20">
    <QrcodeStream
      @detect="onDetect"
      class="w-full max-w-screen-sm aspect-square shadow-xl border-2 border-black bg-white"
    />
    <QRCodeOutline class="absolute top-0 w-full max-w-screen-sm aspect-square" />
  </div>
</template>
