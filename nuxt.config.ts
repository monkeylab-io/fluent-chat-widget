import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    'shadcn-nuxt'
  ],

  devtools: { enabled: true },

  css: [
    '~/assets/css/main.css'
  ],

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: ''
  },

  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-05-15',

  vite: {
    plugins: [
      tailwindcss()
    ]
  },

  typescript: { shim: false },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
        quotes: 'single'
      }
    }
  },

  shadcn: {
    prefix: '',
    componentDir: '~/components/ui'
  }
})