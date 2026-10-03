import { defineStore } from 'pinia'
import type { StoreDefinition } from 'pinia'
import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'

export interface Assignment {
  id: string
  course_id: string
  name: string
  points_possible: number
}

export interface Submission {
  id: string
  course_id: string
  assignment_id: string
  user_id: string
  score: number | null
  grade: string | null
  submitted_at: string | null
}

interface AssignmentSetup {
  assignments: Ref<Record<string, Assignment[]>>
  submissions: Ref<Record<string, Submission[]>>
  gradebook: ComputedRef<Record<string, number | null>>
  fetchAssignments: (courseId: string) => Promise<void>
  fetchSubmissions: (courseId: string, assignmentId: string) => Promise<void>
  submit: (courseId: string, assignmentId: string, body: string) => Promise<void>
}

function key(courseId: string, assignmentId: string): string {
  return `${courseId}:${assignmentId}`
}

function assignmentSetup(): AssignmentSetup {
  const assignments: Ref<Record<string, Assignment[]>> = ref({})
  const submissions: Ref<Record<string, Submission[]>> = ref({})

  // Gradebook slice: average scored submission per assignment (null = ungraded).
  const gradebook: ComputedRef<Record<string, number | null>> = computed(() => {
    const out: Record<string, number | null> = {}
    for (const [k, rows] of Object.entries(submissions.value)) {
      const scored = rows.filter((r) => r.score !== null).map((r) => r.score as number)
      out[k] = scored.length > 0 ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length) : null
    }
    return out
  })

  async function fetchAssignments(courseId: string): Promise<void> {
    const rows = await $fetch<Assignment[]>(`/api/v1/courses/${courseId}/assignments`)
    assignments.value = { ...assignments.value, [courseId]: rows }
  }

  async function fetchSubmissions(courseId: string, assignmentId: string): Promise<void> {
    const rows = await $fetch<Submission[]>(
      `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions`,
    )
    submissions.value = { ...submissions.value, [key(courseId, assignmentId)]: rows }
  }

  async function submit(courseId: string, assignmentId: string, body: string): Promise<void> {
    const row = await $fetch<Submission>(
      `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions`,
      { method: 'POST', body: { body } },
    )
    const k = key(courseId, assignmentId)
    submissions.value = { ...submissions.value, [k]: [...(submissions.value[k] ?? []), row] }
  }

  return { assignments, submissions, gradebook, fetchAssignments, fetchSubmissions, submit }
}

export const useAssignmentStore: StoreDefinition<
  'assignment',
  Pick<AssignmentSetup, 'assignments' | 'submissions'>,
  Pick<AssignmentSetup, 'gradebook'>,
  Pick<AssignmentSetup, 'fetchAssignments' | 'fetchSubmissions' | 'submit'>
> = defineStore('assignment', assignmentSetup)
