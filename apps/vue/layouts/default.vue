<template>
  <div id="page" class="max-w-full overflow-x-hidden">
    <NavHeader id="nav" class="fixed bg-white w-full top-0 z-50" />
    <main id="content" class="relative bg-sky-200 min-h-screen max-w-full overflow-x-hidden">
      <slot></slot>
    </main>
    <NavFooter id="footer" class="relative bg-white w-full min-h-12 bottom-0 z-50" />
  </div>
</template>

<style>
@media print {
  #nav,
  #footer {
    display: hidden;
  }
  #content {
    overflow: visible;
    height: auto;
  }
  html,
  body {
    font: normal;
    font-size: 12px;
    padding: 0;
    margin: 0;
  }
}
</style>
