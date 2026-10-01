<template>
  <UContainer>
    <UAlert color="red" variant="soft">
      <template #title>{{ error?.statusCode }} — {{ error?.message }}</template>
    </UAlert>
    <UButton to="/">Home</UButton>
  </UContainer>
</template>

<script setup lang="ts">
defineProps<{ error: { statusCode: number; message: string } }>()
</script>
