<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 100 100"
    width="100"
    height="100"
  >
    <!-- Larger Pulse -->
    <circle cx="50" cy="50" r="15" fill="none" stroke="#0074D9" stroke-width="2" />

    <circle cx="50" cy="50" r="15" fill="none" stroke="#0074D9" stroke-width="2" stroke-opacity="0.5">
      <animate attributeName="r" values="15;35;15" dur="2s" repeatCount="indefinite" />
      <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
    </circle>

    <!-- Smaller Pulse -->
    <circle cx="50" cy="50" r="5" fill="#0074D9" />

    <circle cx="50" cy="50" r="5" fill="#0074D9" stroke="#0074D9" stroke-width="2" stroke-opacity="1">
      <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite" />
      <animate attributeName="stroke-opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
</template>
