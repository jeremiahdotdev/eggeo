<script setup lang="ts">
const left = ref(); // Initial position
const top = ref(); // Initial position

const randomOpacity = Math.random();

const cloudVariations = [
  // Variation 1
  [
    { cx: 22, cy: 26, r: 18 },
    { cx: 42, cy: 27, r: 19 },
    { cx: 45, cy: 30, r: 19 },
    { cx: 62, cy: 24, r: 21 },
    { cx: 14, cy: 18, r: 16 },
    { cx: 82, cy: 22, r: 17 },
  ],
  // Variation 2
  [
    { cx: 30, cy: 24, r: 19 },
    { cx: 50, cy: 23, r: 18 },
    { cx: 70, cy: 25, r: 20 },
    { cx: 45, cy: 30, r: 20 },
    { cx: 12, cy: 22, r: 15 },
    { cx: 78, cy: 19, r: 16 },
  ],
  // Variation 3
  [
    { cx: 27, cy: 22, r: 17 },
    { cx: 48, cy: 28, r: 18 },
    { cx: 68, cy: 27, r: 19 },
    { cx: 60, cy: 35, r: 19 },
    { cx: 16, cy: 20, r: 16 },
    { cx: 84, cy: 24, r: 15 },
  ],
  // Variation 4
  [
    { cx: 24, cy: 26, r: 20 },
    { cx: 44, cy: 23, r: 19 },
    { cx: 64, cy: 25, r: 21 },
    { cx: 40, cy: 30, r: 21 },
    { cx: 18, cy: 18, r: 15 },
    { cx: 80, cy: 21, r: 16 },
  ],
  // Variation 5
  [
    { cx: 35, cy: 27, r: 19 },
    { cx: 52, cy: 24, r: 18 },
    { cx: 52, cy: 30, r: 18 },
    { cx: 72, cy: 22, r: 20 },
    { cx: 11, cy: 25, r: 17 },
    { cx: 75, cy: 20, r: 16 },
  ],
  // Variation 6
  [
    { cx: 20, cy: 25, r: 18 },
    { cx: 40, cy: 22, r: 17 },
    { cx: 60, cy: 28, r: 19 },
    { cx: 37, cy: 35, r: 19 },
    { cx: 13, cy: 21, r: 15 },
    { cx: 79, cy: 24, r: 16 },
  ],
  // Variation 7
  [
    { cx: 28, cy: 23, r: 20 },
    { cx: 47, cy: 26, r: 18 },
    { cx: 67, cy: 24, r: 19 },
    { cx: 15, cy: 19, r: 16 },
    { cx: 20, cy: 30, r: 16 },
    { cx: 81, cy: 22, r: 15 },
  ],
  // Variation 8
  [
    { cx: 32, cy: 22, r: 19 },
    { cx: 54, cy: 28, r: 18 },
    { cx: 65, cy: 25, r: 20 },
    { cx: 17, cy: 24, r: 15 },
    { cx: 29, cy: 30, r: 15 },
    { cx: 76, cy: 20, r: 16 },
  ],
  // Variation 9
  [
    { cx: 26, cy: 27, r: 17 },
    { cx: 49, cy: 23, r: 18 },
    { cx: 40, cy: 30, r: 18 },
    { cx: 50, cy: 30, r: 18 },
    { cx: 69, cy: 26, r: 19 },
    { cx: 19, cy: 20, r: 16 },
    { cx: 83, cy: 25, r: 15 },
  ],
  // Variation 10
  [
    { cx: 34, cy: 24, r: 20 },
    { cx: 46, cy: 27, r: 19 },
    { cx: 63, cy: 30, r: 21 },
    { cx: 63, cy: 20, r: 21 },
    { cx: 68, cy: 30, r: 21 },
    { cx: 21, cy: 22, r: 15 },
    { cx: 77, cy: 21, r: 16 },
  ],
];

const randomCloudVariation = cloudVariations[Math.floor(Math.random() * cloudVariations.length)];

onMounted(() => {
  top.value = Math.random() * window.innerHeight - 200;
  left.value = Math.random() * window.innerWidth - 200;
  // Animate cloud to move across the screen
  setInterval(() => {
    left.value += 1; // Change horizontal position
    if (left.value > window.innerWidth + 100) {
      left.value = -200; // Reset position once it goes beyond the screen width
    }
  }, 50); // Adjust speed of animation as needed
});
</script>

<template>
  <div
    id="cloud"
    class="absolute animate-cloud overflow-hidden"
    :style="`left: ${left}px; top: ${top}px; opacity: ${randomOpacity}`"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" width="400" height="200">
      <circle
        v-for="(circle, index) of randomCloudVariation"
        :key="index"
        :cx="circle.cx"
        :cy="circle.cy"
        :r="circle.r"
        fill="#ffffff"
      />
    </svg>
  </div>
</template>

<style>
@media print {
  #cloud {
    visibility: hidden;
    display: none;
  }
}
</style>
