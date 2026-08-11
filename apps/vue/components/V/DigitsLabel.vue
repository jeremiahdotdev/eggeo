<script setup lang="ts">
const { label } = defineProps<{ label: string }>();
const getWords = (label: string) => label.toUpperCase().split(' ');
const getDigits = (word: string) => word.toUpperCase().split('');

const isSmall = (digit: string) => ['I'].includes(digit);
</script>
<template>
  <div class="flex flex-col items-center justify-center md:flex-row md:gap-6">
    <span v-for="word of getWords(label)" class="flex h-fit p-0 m-0">
      <vLabel
        v-for="digit of getDigits(word)"
        :key="`${digit}-of-${word}`"
        :box="isSmall(digit) ? '0 -10 25 60' : '0 -10 50 60'"
        :styles="`${isSmall(digit) ? 'w-8' : 'w-16'} h-min font-comic-sans `"
      >
        {{ digit }}
      </vLabel>
    </span>
  </div>
</template>
