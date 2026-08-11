<script setup>
import { useRoutes } from '~/globals/Routes.ts';
const routes = useRoutes();
</script>
<template>
  <div class="flex flex-col md:flex-row">
    <NavLink
      v-for="route of routes"
      :route="route"
      variant="HEADER"
      class="border-black border-b border-l h-full md:border-none md:p-0"
    />
  </div>
</template>
