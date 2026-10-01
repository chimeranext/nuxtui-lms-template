<template>
  <UContainer>
    <h1>{{ course?.title }}</h1>
    <LessonPlayer :src="playerSrc" />
    <ProgressRing :progress="25" />
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const { data: course } = await useAsyncData(`course-${route.params.id}`, () =>
  $fetch(`/api/v1/courses`),
)
const playerSrc = computed(() => `${config.public.videoCdn}/demo.mp4`)
useSeoMeta({ title: 'Course' })
</script>
