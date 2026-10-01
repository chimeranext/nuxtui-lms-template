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
  fetchCatalog: () => Promise<void>
  fetchModules: (courseId: string) => Promise<void>
}

export interface CanvasCourse {
  id: string
  name: string
  course_code: string
  workflow_state: string
}

export interface CourseModule {
  id: string
  course_id: string
  name: string
  position: number
  items_count: number
}

interface CourseSetup {
  completed: Ref<Record<string, boolean>>
  lastLesson: Ref<Record<string, string>>
  catalog: Ref<CanvasCourse[]>
  modules: Ref<Record<string, CourseModule[]>>
  progressOf: (courseId: string, total: number) => number
  completeLesson: (courseId: string, lessonId: string) => void
  fetchCatalog: () => Promise<void>
  fetchModules: (courseId: string) => Promise<void>
}

function courseSetup(): CourseSetup {
  const completed: Ref<Record<string, boolean>> = ref({})
  const lastLesson: Ref<Record<string, string>> = ref({})
  const catalog: Ref<CanvasCourse[]> = ref([])
  const modules: Ref<Record<string, CourseModule[]>> = ref({})

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

  async function fetchCatalog(): Promise<void> {
    catalog.value = await $fetch<CanvasCourse[]>('/api/v1/courses')
  }

  async function fetchModules(courseId: string): Promise<void> {
    const rows = await $fetch<CourseModule[]>(`/api/v1/courses/${courseId}/modules`)
    modules.value = { ...modules.value, [courseId]: rows }
  }

  return { completed, lastLesson, catalog, modules, progressOf, completeLesson, fetchCatalog, fetchModules }
}

// Academy overrides/adds stores (useAcademyStore) — never edits this file.
export const useCourseStore: StoreDefinition<
  'course',
  Pick<CourseSetup, 'completed' | 'lastLesson' | 'catalog' | 'modules'>,
  Record<string, never>,
  CourseStoreActions
> = defineStore('course', courseSetup)
