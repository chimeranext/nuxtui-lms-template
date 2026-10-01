<template>
  <UContainer>
    <h1>Demo LMS</h1>
    <CourseCard
      v-for="c in courses"
      :key="c.slug"
      :course="c"
    />
  </UContainer>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Demo LMS', description: 'White-label LMS template demo.' })
const courses = [{ slug: 'demo-101', title: 'Demo Course', description: 'Offline demo data.' }]
</script>
