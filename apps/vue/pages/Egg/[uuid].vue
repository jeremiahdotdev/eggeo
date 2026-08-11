<script setup>
import { useGetEgg } from '~/composables/gateway/egg';
const route = useRoute();
const [egg, error] = useGetEgg({ id: route.params.uuid });
</script>

<template>
  <EggCard v-if="egg" :egg="egg" />
</template>
