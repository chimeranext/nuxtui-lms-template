<template>
  <UCard class="course-card">
    <template #header>{{ course.title }}</template>
    <p>{{ course.description }}</p>
    <template #footer>
      <UButton :to="`/courses/${course.slug}`">Start {{ course.title }}</UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
interface CourseCardCourse {
  slug: string
  title: string
  description: string
}
defineProps<{ course: CourseCardCourse }>()
</script>
