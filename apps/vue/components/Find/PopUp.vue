<script setup lang="ts">
import { useFindEgg, $collectEgg } from '~/composables/gateway/egg';
import { useGetFoundEggs } from '~/composables/gateway/egg';
const props = defineProps<{
  uuid?: string;
  hide?: () => void;
}>();
const [foundEgg, errorFinding] = useFindEgg({ id: props.uuid });
const foundEggs = useState<number>('foundEggs');
const wasCollected = ref<boolean>();
const isCollecting = ref<boolean>();
const error = ref<string>();

watch(()=>foundEgg.value, (value) => {
  foundEggs.value = foundEggs.value + value.Egg?.points ?? 0;
})

const collectEgg = async () => {
  isCollecting.value = true;
  const [data, errorCollecting] = await $collectEgg({ id: props.uuid });
  if (data && !errorCollecting) wasCollected.value = true;
  else error.value = errorCollecting;
};

const disabled = computed(() => errorFinding || wasCollected.value || !foundEgg.value || isCollecting.value);

const handleClose = () => {
  foundEgg.value = undefined;
  error.value = undefined;
  wasCollected.value = undefined;
  isCollecting.value = undefined;
  if (props.hide) props.hide();
};
</script>

<template>
  <vModal @close="handleClose">
    <vLabel box="0 0 550 100" styles="w-32">
      <template v-if="!!error">Error: {{ error }}</template>
      <template v-else-if="!!wasCollected">Egg Collected!</template>
      <template v-else-if="!!isCollecting">Collecting egg...</template>
      <template v-else-if="!!foundEgg">Egg found!</template>
      <template v-else>Finding egg...</template>
    </vLabel>
    <span v-if="foundEgg" class="flex flex-col items-center justify-center">
      <p>
        {{ foundEgg.Egg.title }} |
        {{ foundEgg.Egg.points === 1 ? `+${foundEgg.Egg.points}pt.` : `+${foundEgg.Egg.points}pts.` }}
      </p>
      <p>
        {{ foundEgg.Egg.description }}
      </p>
    </span>
    <EggImage id="findpopup" :dimensions="{ width: 200, height: 200 }" :color="foundEgg?.Egg?.color" />
    <span class="w-full flex flex-wrap justify-around pt-2">
      <vButton :disabled="disabled" @click="collectEgg" label="Collect Egg Now" />
      <vButton :disabled="disabled" @click="handleClose" label="Leave Egg Hidden" />
    </span>
  </vModal>
</template>
