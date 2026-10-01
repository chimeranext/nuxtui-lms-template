<template>
  <div class="lesson-player">
    <!-- fluid-player wrapper mounts here; src = videoCdn or /mock-video -->
    <div ref="playerEl" data-testid="lesson-player" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ src: string }>()
const playerEl = ref<HTMLElement | null>(null)
// TODO: init fluid-player pinned fork onMounted(playerEl, { layoutControls: { src: props.src } })
</script>
