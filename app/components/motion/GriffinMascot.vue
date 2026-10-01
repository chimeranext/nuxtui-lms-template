<template>
  <div class="griffin-mascot" :data-state="state">
    <!-- Placeholder until the Rive (.riv) griffin asset lands.
         Runtime wiring: @rive-app/canvas + state machine idle/hover/enrolled. -->
    <canvas ref="canvasEl" width="240" height="240" aria-label="Griffin mascot" />
    <p class="mascot-caption">Rive griffin: {{ state }} (.riv TODO)</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'

const props = withDefaults(defineProps<{ state?: string }>(), { state: 'idle' })
const canvasEl: Ref<HTMLCanvasElement | null> = ref<HTMLCanvasElement | null>(null)

onMounted(async () => {
  // TODO: load .riv via @rive-app/canvas, drive state machine from props.state.
  // import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas'
  const el = canvasEl.value
  if (el === null) return
  const ctx = el.getContext('2d')
  if (ctx === null) return
  // Static placeholder sigil (gold diamond on ink) until asset exists.
  ctx.fillStyle = '#0B1526'
  ctx.fillRect(0, 0, 240, 240)
  ctx.fillStyle = '#B78E3B'
  ctx.beginPath()
  ctx.moveTo(120, 40)
  ctx.lineTo(200, 120)
  ctx.lineTo(120, 200)
  ctx.lineTo(40, 120)
  ctx.closePath()
  ctx.fill()
  void props.state
})
</script>

<style scoped>
.griffin-mascot { display: inline-block; text-align: center; }
.mascot-caption { font-size: 12px; opacity: 0.6; }
</style>
