<template>
  <UCard class="certificate-view">
    <template #header>Certificate — {{ credential.id }}</template>
    <pre>{{ credential }}</pre>
    <UButton :to="`/verify?id=${credential.id}`">Verify</UButton>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{ credential: { id: string } }>()
</script>
