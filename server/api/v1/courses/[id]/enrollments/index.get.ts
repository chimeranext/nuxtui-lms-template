// Canvas-compatible enrollments: GET /api/v1/courses/:id/enrollments
import type { EventHandler } from 'h3'

const handler: EventHandler = defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  // TODO: Drizzle enrollments filtered by course.
  return [{ id: 'e1', course_id: id, user_id: 'u1', type: 'StudentEnrollment', role: 'student' }]
})

export default handler
