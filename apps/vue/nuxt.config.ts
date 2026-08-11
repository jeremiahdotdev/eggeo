// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@sidebase/nuxt-auth', '@vueuse/nuxt', '@vite-pwa/nuxt'],
  build: {
    transpile: ['@eggeo/db', '@eggeo/validation'],
  },

  pwa: {
    disable: process.env.ENABLE_PWA !== 'true',
    manifest: {
      name: "Jeremiah's Eggeo",
      short_name: 'Eggeo',
      description: "Jeremiah's Eggeo -- A geolocation client for eggs.",
      theme_color: '#FFFFFF',
      background_color: '#FFFFFF',
      icons: [
        {
          src: '/pwa/pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: '/pwa/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/pwa/maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/pwa/apple-touch-icon-180x180.png',
          sizes: '180x180',
          type: 'image/png',
        },
      ],
      screenshots: [
        {
          src: '/pwa/mobile.png',
          sizes: '400x800',
          type: 'image/png',
          form_factor: 'narrow',
          label: 'Application',
        },
        {
          src: '/pwa/desktop.png',
          sizes: '1280x920',
          type: 'image/png',
          form_factor: 'wide',
          label: 'Application',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      'tailwindcss/nesting': {},
      'postcss-nested': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    authSecret: '',
    public: {
      url: '',
      mapsApiKey: '',
      maxEggsPerUser: '',
    },
  },

  auth: {
    provider: {
      type: 'authjs',
    },
    globalAppMiddleware: true,
  },

  compatibilityDate: '2025-04-19',
});
