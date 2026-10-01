import { useQuery } from '@pinia/colada'
import type { Ref } from 'vue'

export interface CanvasCourse {
  id: string
  name: string
  course_code: string
  workflow_state: string
}

export interface CoursesQuery {
  courses: Ref<CanvasCourse[] | undefined>
  isPending: Ref<boolean>
}

// Cached + deduped course list (SSR-safe). Replaces ad-hoc $fetch caching.
export function useCourses(): CoursesQuery {
  const { data: courses, isPending } = useQuery({
    key: () => ['courses'],
    query: () => $fetch<CanvasCourse[]>('/api/v1/courses'),
  })
  return { courses, isPending }
}
