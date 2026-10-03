import { defineConfig } from 'golar/unstable'
import '@golar/vue'

export default defineConfig({
  typecheck: {
    include: [
      'app/**/*',
      'server/**/*',
      'shared/**/*',
      'nuxt.config.ts',
      'template.config.ts',
    ],
    exclude: ['node_modules', '.nuxt', '.output', 'dist'],
  },
})
