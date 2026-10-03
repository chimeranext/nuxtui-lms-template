import { PiniaColada } from '@pinia/colada'
import type { Plugin } from 'nuxt/app'

const piniaColada: Plugin = defineNuxtPlugin((nuxtApp) => {
  // Pinia itself comes from @pinia/nuxt (module, registered in nuxt.config).
  nuxtApp.vueApp.use(PiniaColada)
})

export default piniaColada
