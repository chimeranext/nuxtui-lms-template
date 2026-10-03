import { defineStore } from 'pinia'
import type { StoreDefinition } from 'pinia'
import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'

export type AttemptStatus = 'idle' | 'active' | 'submitted' | 'graded'

export interface QuizAttempt {
  id: string | null
  quizId: string
  status: AttemptStatus
  answers: Record<string, string>
  score: number | null
  startedAt: string | null
}

interface QuizSetup {
  attempt: Ref<QuizAttempt>
  answeredCount: ComputedRef<number>
  start: (quizId: string) => void
  answer: (questionId: string, value: string) => void
  finish: (courseId: string) => Promise<void>
  reset: () => void
}

const idleAttempt = (): QuizAttempt => ({
  id: null,
  quizId: '',
  status: 'idle',
  answers: {},
  score: null,
  startedAt: null,
})

function quizSetup(): QuizSetup {
  const attempt: Ref<QuizAttempt> = ref(idleAttempt())

  const answeredCount: ComputedRef<number> = computed(
    () => Object.keys(attempt.value.answers).length,
  )

  function start(quizId: string): void {
    attempt.value = { ...idleAttempt(), quizId, status: 'active', startedAt: new Date().toISOString() }
  }

  function answer(questionId: string, value: string): void {
    if (attempt.value.status !== 'active') return
    attempt.value = { ...attempt.value, answers: { ...attempt.value.answers, [questionId]: value } }
  }

  async function finish(courseId: string): Promise<void> {
    if (attempt.value.status !== 'active') return
    const res = await $fetch<{ id: string; score: number }>(
      `/api/v1/courses/${courseId}/quizzes/${attempt.value.quizId}/attempts`,
      { method: 'POST', body: { answers: attempt.value.answers } },
    )
    attempt.value = { ...attempt.value, id: res.id, score: res.score, status: 'graded' }
  }

  function reset(): void {
    attempt.value = idleAttempt()
  }

  return { attempt, answeredCount, start, answer, finish, reset }
}

export const useQuizStore: StoreDefinition<
  'quiz',
  Pick<QuizSetup, 'attempt'>,
  Pick<QuizSetup, 'answeredCount'>,
  Pick<QuizSetup, 'start' | 'answer' | 'finish' | 'reset'>
> = defineStore('quiz', quizSetup)
