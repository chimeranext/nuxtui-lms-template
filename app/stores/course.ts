import { defineStore } from 'pinia'
import type { StoreDefinition } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

export interface CourseStoreState {
  completed: Record<string, boolean>
  lastLesson: Record<string, string>
}

export interface CourseStoreActions {
  progressOf: (courseId: string, total: number) => number
  completeLesson: (courseId: string, lessonId: string) => void
}

interface CourseSetup {
  completed: Ref<Record<string, boolean>>
  lastLesson: Ref<Record<string, string>>
  progressOf: (courseId: string, total: number) => number
  completeLesson: (courseId: string, lessonId: string) => void
}

function courseSetup(): CourseSetup {
  const completed: Ref<Record<string, boolean>> = ref({})
  const lastLesson: Ref<Record<string, string>> = ref({})

  function progressOf(courseId: string, total: number): number {
    if (total <= 0) return 0
    const done = Object.keys(completed.value).filter(
      (k) => k.startsWith(`${courseId}:`) && completed.value[k] === true,
    ).length
    return Math.min(100, Math.round((done / total) * 100))
  }

  function completeLesson(courseId: string, lessonId: string): void {
    completed.value[`${courseId}:${lessonId}`] = true
    lastLesson.value[courseId] = lessonId
  }

  return { completed, lastLesson, progressOf, completeLesson }
}

// Academy overrides/adds stores (useAcademyStore) — never edits this file.
export const useCourseStore: StoreDefinition<
  'course',
  Pick<CourseSetup, 'completed' | 'lastLesson'>,
  Record<string, never>,
  CourseStoreActions
> = defineStore('course', courseSetup)
