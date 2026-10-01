<template>
  <UMeter :value="progress" :max="100" class="progress-ring" />
</template>

<script setup lang="ts">
defineProps<{ progress: number }>()
</script>
