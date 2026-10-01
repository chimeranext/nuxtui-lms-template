<template>
  <UCard class="course-card">
    <template #header>{{ course.title }}</template>
    <p>{{ course.description }}</p>
    <template #footer>
      <UButton :to="`/courses/${course.slug}`">Start</UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{ course: { slug: string; title: string; description: string } }>()
</script>
