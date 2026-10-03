<template>
  <div class="lesson-player">
    <!-- fluid-player wrapper mounts here; src = videoCdn or /mock-video -->
    <div ref="playerEl" data-testid="lesson-player" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ src: string }>()
import type { Ref } from 'vue'
const playerEl: Ref<HTMLElement | null> = ref<HTMLElement | null>(null)
// TODO: init fluid-player (npm, MIT) onMounted(playerEl, { layoutControls: { src: props.src } })
</script>
