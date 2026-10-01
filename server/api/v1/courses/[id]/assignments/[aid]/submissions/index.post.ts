// Canvas-compatible submission: POST .../submissions (gradebook write path)
import type { EventHandler } from 'h3'

const handler: EventHandler = defineEventHandler(async (event) => {
  const courseId = getRouterParam(event, 'id')
  const assignmentId = getRouterParam(event, 'aid')
  const body = await readBody<{ body?: string; score?: number }>(event)
  // TODO: persist submission + recompute gradebook via Drizzle.
  return { id: 's-new', course_id: courseId, assignment_id: assignmentId, user_id: 'u1', score: body?.score ?? null, grade: null, submitted_at: new Date().toISOString(), echo: body?.body ?? '' }
})

export default handler
