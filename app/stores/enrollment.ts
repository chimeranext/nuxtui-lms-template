import { defineStore } from 'pinia'
import type { StoreDefinition } from 'pinia'
import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'

export interface Enrollment {
  id: string
  course_id: string
  user_id: string
  type: string
  role: string
}

interface EnrollmentSetup {
  items: Ref<Enrollment[]>
  forCourse: (courseId: string) => Enrollment[]
  enrolledCourseIds: ComputedRef<string[]>
  fetchEnrollments: (courseId: string) => Promise<void>
  enroll: (courseId: string, userId: string) => Promise<void>
}

function enrollmentSetup(): EnrollmentSetup {
  const items: Ref<Enrollment[]> = ref([])

  function forCourse(courseId: string): Enrollment[] {
    return items.value.filter((e) => e.course_id === courseId)
  }

  const enrolledCourseIds: ComputedRef<string[]> = computed(() =>
    [...new Set(items.value.map((e) => e.course_id))],
  )

  async function fetchEnrollments(courseId: string): Promise<void> {
    const rows = await $fetch<Enrollment[]>(`/api/v1/courses/${courseId}/enrollments`)
    const others = items.value.filter((e) => e.course_id !== courseId)
    items.value = [...others, ...rows]
  }

  async function enroll(courseId: string, userId: string): Promise<void> {
    const row = await $fetch<Enrollment>(`/api/v1/courses/${courseId}/enrollments`, {
      method: 'POST',
      body: { user_id: userId, type: 'StudentEnrollment' },
    })
    items.value = [...items.value.filter((e) => e.id !== row.id), row]
  }

  return { items, forCourse, enrolledCourseIds, fetchEnrollments, enroll }
}

export const useEnrollmentStore: StoreDefinition<
  'enrollment',
  Pick<EnrollmentSetup, 'items'>,
  Pick<EnrollmentSetup, 'enrolledCourseIds'>,
  Pick<EnrollmentSetup, 'forCourse' | 'fetchEnrollments' | 'enroll'>
> = defineStore('enrollment', enrollmentSetup)
