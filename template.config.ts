/// <reference types="node" />
// Template defaults: brand-neutral, demo data, local mocks.
// Academy overrides via academy.config.ts (tokens Chimera, real content, prod keys).
export interface TemplateConfig {
  brand: { name: string; logo: string; primary: string }
  video: { cdn: string; mock: boolean }
  demo: boolean
}

export const templateConfig: TemplateConfig = {
  brand: { name: 'Acme LMS', logo: '/logo.svg', primary: '#00DC82' },
  video: { cdn: process.env.NUXT_PUBLIC_VIDEO_CDN ?? '/mock-video', mock: true },
  demo: true,
}
