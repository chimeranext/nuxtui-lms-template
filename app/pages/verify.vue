<template>
  <UContainer>
    <h1>Verify credential</h1>
    <CertificateView v-if="credential" :credential="credential" />
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: credential } = await useAsyncData('verify', () =>
  $fetch(`/api/credentials/${route.query.id}`),
)
</script>
