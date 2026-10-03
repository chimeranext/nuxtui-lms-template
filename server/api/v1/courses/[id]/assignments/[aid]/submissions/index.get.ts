// Canvas-compatible submissions: GET /api/v1/courses/:id/assignments/:aid/submissions
import type { EventHandler } from 'h3'

const handler: EventHandler = defineEventHandler((event) => {
  const courseId = getRouterParam(event, 'id')
  const assignmentId = getRouterParam(event, 'aid')
  // TODO: Drizzle submissions (gradebook slice lives in the assignment store).
  return [{ id: 's1', course_id: courseId, assignment_id: assignmentId, user_id: 'u1', score: null, grade: null, submitted_at: null }]
})

export default handler
