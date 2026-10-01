// White-label base config. Academy NEVER edits this file —
// it overrides via academy.config.ts in the academy repo.
import type { NuxtConfig } from 'nuxt/schema'

const config: NuxtConfig = defineNuxtConfig({
  compatibilityDate: '2026-09-30',
  future: { compatibilityVersion: 4 },
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxtjs/seo', '@pinia/nuxt'],
  typescript: { strict: true },
  // NOTE: isolatedDeclarations is enforced via tsconfig (TS 7 strict).
  // Nuxt routeRules: hybrid SSR/SSG/SPA.
  routeRules: {
    '/': { prerender: true },
    '/courses/**': { isr: 3600 },
    '/dashboard/**': { ssr: false },
    '/.well-known/openbadges/issuer.json': { prerender: true },
  },
  nitro: {
    // Academy preset: node-server. Envato demo preset: static.
    // preset: process.env.NUXT_PRESET === 'static' ? 'static' : 'node-server',
    // TODO: Nitro OpenAPI (/api/_openapi.json) — enable + prerender once the
    // openapi route is wired; see openapi/academy.openapi.yaml.
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    authSecret: process.env.NUXT_AUTH_SECRET,
    public: {
      videoCdn: process.env.NUXT_PUBLIC_VIDEO_CDN ?? '/mock-video',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    },
  },
})

export default config
