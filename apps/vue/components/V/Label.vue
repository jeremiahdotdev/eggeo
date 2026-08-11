<script setup lang="ts">
import { randomTailwindFillColor } from '~/composables/colors/randomPastelColors';
import { LabelVariant } from '~/types/global';

const props = defineProps<{
  variant?: LabelVariant;
  styles?: string;
  box?: string;
  color?: string;
  hideHover?: boolean;
}>();

const labelVariant = (variant: LabelVariant) => {
  switch (variant) {
    case LabelVariant.HEADER:
      return {
        style: 'w-24 py-2 md:max-w-28 md:w-fit md:min-w-24',
      };
    case LabelVariant.FOOTER:
      return {
        style: 'w-24',
      };
    case LabelVariant.PANEL:
      return {
        style: 'w-36',
        box: '0 0 400 200',
      };
    default:
      return {
        style: '',
      };
  }
};

const option = labelVariant(props.variant);
</script>
<template>
  <svg
    :viewBox="box ?? option.box ?? '0 0 380 100'"
    preserveAspectRatio="xMinYMin meet"
    :class="[styles, option.style, 'bubble-svg']"
  >
    <text
      x="50%"
      y="51%"
      dominant-baseline="middle"
      text-anchor="middle"
      :class="[color ?? randomTailwindFillColor(), hideHover ? '' : 'bubble-text-hover', 'bubble-text']"
    >
      <slot></slot>
    </text>
  </svg>
</template>
