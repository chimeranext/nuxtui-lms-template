<template>
  <UCard class="quiz">
    <p>{{ question }}</p>
    <URadioGroup v-model="answer" :options="options" />
    <UButton @click="$emit('submit', answer)">Submit</UButton>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{ question: string; options: { label: string; value: string }[] }>()
const answer = ref<string>('')
defineEmits<{ submit: [value: string] }>()
</script>
