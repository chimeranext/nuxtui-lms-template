<template>
  <UContainer>
    <h1>Verify credential</h1>
    <CertificateView v-if="credential !== undefined && credential !== null" :credential="credential" />
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: credential } = await useAsyncData<{ id: string } | null>(
  'verify',
  async () => {
    const id = route.query.id
    if (typeof id !== 'string') return null
    return $fetch<{ id: string }>(`/api/credentials/${id}`)
  },
)
</script>
