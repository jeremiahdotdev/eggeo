<script setup>
const { status } = await useAuth();

const isOpen = ref(false);

const buttonClasses = computed(() => {
  return isOpen.value
    ? 'inline-flex items-center justify-center p-2 rounded-md hover:text-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
    : 'inline-flex items-center justify-center p-2 rounded-md hover:text-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white';
});

const signedIn = status.value === 'authenticated';
</script>

<template>
  <nav class="shadow-xl border-b border-black">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NavLogo />

        <!-- Desktop Menu -->
        <div class="hidden md:block">
          <NavLink v-if="!signedIn" route="SIGNIN" variant="HEADER" class="border-none" />
          <NavLinkGroup v-else />
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <NavLink v-if="!signedIn" route="SIGNIN" variant="HEADER" class="border-none" />
          <button v-else @click.native="isOpen = !isOpen" :class="buttonClasses" aria-expanded="false">
            <span class="sr-only">Open main menu</span>
            <vHamburger v-if="!isOpen" />
            <vClose v-else />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="signedIn"
      :class="{ absolute: isOpen, hidden: !isOpen }"
      class="bg-white border-1 border-black z-50 right-0 mt-[1px] shadow-xl md:hidden"
    >
      <NavLinkGroup />
    </div>
  </nav>
</template>

<style>
@media print {
  nav {
    visibility: hidden;
    display: none;
  }
}
</style>
