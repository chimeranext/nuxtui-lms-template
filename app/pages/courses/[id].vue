<template>
  <UContainer>
    <h1>{{ course?.name }}</h1>
    <p>{{ course?.course_code }}</p>
    <LessonPlayer :src="playerSrc" />
    <ProgressRing :progress="25" />
  </UContainer>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue'

interface CanvasCourse {
  id: string
  name: string
  course_code: string
  workflow_state: string
}

const route = useRoute()
const config = useRuntimeConfig()
const { data: courses } = await useAsyncData<CanvasCourse[]>(
  `course-${String(route.params.id)}`,
  () => $fetch<CanvasCourse[]>('/api/v1/courses'),
)
const course: ComputedRef<CanvasCourse | undefined> = computed(() => courses.value?.[0])
const playerSrc: ComputedRef<string> = computed(
  () => `${String(config.public.videoCdn)}/demo.mp4`,
)
useSeoMeta({ title: 'Course' })
</script>
