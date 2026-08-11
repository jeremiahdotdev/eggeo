<script setup>
import { useRoutes } from '~/globals/Routes.ts';
const { status } = await useAuth();

const isOpen = ref(false);
const signedIn = status.value === 'authenticated';
const options = useRoutes().reduce((a, b, c) => (c % 3 ? a[a.length - 1].push(b) : a.push([b]), a), []);
</script>

<template>
  <footer class="shadow-t-xl border-t border-black bg-white flex flex-wrap items-center justify-center gap-1 md:gap-0">
    <template v-if="signedIn">
      <span v-for="(chunk, i) of options" class="flex items-center justify-center py-2 sm:py-4">
        <template v-for="(option, j) of chunk">
          <NavLink :route="option" variant="FOOTER" />
          <vLabel v-if="j < chunk.length - 1" box="0 -15 40 40" class="w-4 h-6"> | </vLabel>
        </template>
        <vLabel v-if="i < options.length - 1" box="0 -15 40 40" class="w-4 h-6 hidden sm:block"> | </vLabel>
      </span>
    </template>
    <template v-else>
      <NavLink route="SIGNIN" variant="FOOTER" />
    </template>
  </footer>
</template>

<style>
@media print {
  footer {
    visibility: hidden;
    display: none;
  }
}
</style>
