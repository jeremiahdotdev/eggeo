<script setup>
const { error } = useError();
</script>

<template>
  <div class="flex flex-col items-center justify-center justify-center h-screen">
    <h1 class="text-2xl font-bold">Oops! Something went wrong.</h1>
    <p class="text-gray-600 mt-2">Error: {{ error.message }}</p>
    <NuxtLink to="/" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md inline-block">Go Back to Home</NuxtLink>
  </div>
</template>
