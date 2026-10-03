// Canvas-compatible enrollment creation: POST /api/v1/courses/:id/enrollments
import type { EventHandler } from 'h3'

const handler: EventHandler = defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ user_id?: string; type?: string }>(event)
  // TODO: persist via Drizzle enrollments.
  return { id: 'e-new', course_id: id, user_id: body?.user_id ?? 'u1', type: body?.type ?? 'StudentEnrollment', role: 'student' }
})

export default handler
