// Canvas-style quiz attempt: POST /api/v1/courses/:id/quizzes/:qid/attempts
import type { EventHandler } from 'h3'

const handler: EventHandler = defineEventHandler(async (event) => {
  const courseId = getRouterParam(event, 'id')
  const quizId = getRouterParam(event, 'qid')
  const body = await readBody<{ answers?: Record<string, string> }>(event)
  const answers = body?.answers ?? {}
  // TODO: grade against quiz key in Drizzle; persist attempt.
  const total = Math.max(1, Object.keys(answers).length)
  const correct = Object.values(answers).filter((a) => a === 'correct').length
  return { id: 'att-new', course_id: courseId, quiz_id: quizId, score: Math.round((correct / total) * 100), finished_at: new Date().toISOString() }
})

export default handler
