<script setup lang="ts">
import { useSetupRoutes } from '~/globals/Routes.ts';
const routes = useSetupRoutes();
</script>

<template>
  <div class="h-screen w-full flex flex-col justify-center items-center">
    <div class="flex flex-col bg-white border-black border rounded-xl shadow-xl p-4">
      <NavLink v-for="route of routes" :route="route" variant="PANEL" />
    </div>
  </div>
</template>
