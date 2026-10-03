<template>
  <UCard class="badge-card">
    <template #header>{{ badge.name }}</template>
    <p>{{ badge.criteria }}</p>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{ badge: { name: string; criteria: string } }>()
</script>
