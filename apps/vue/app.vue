<script setup>
useHead({
  title: 'EggFinder',
  meta: [{ name: 'Egg Finder', content: "Jeremiah's Egg Finder -- Geolocation client for easter eggs." }],
});
</script>
<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
