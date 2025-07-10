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

  runtimeConfig: {
    public: {
      apiUrl: process.env.FLUENT_API_URL || 'https://api.fluent.ai',
      cdnUrl: process.env.FLUENT_CDN_URL || 'https://cdn.fluent.ai',
      version: process.env.npm_package_version
    }
  },

  devServer: {
    port: 3001
  },

  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-05-15',

  nitro: {
    output: {
      dir: 'dist'
    }
  },

  vite: {
    plugins: [
      tailwindcss()
    ],
    build: {
      rollupOptions: {
        external: [],
        output: {
          format: 'iife',
          name: 'FluentChatWidget',
          globals: {}
        }
      }
    }
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
