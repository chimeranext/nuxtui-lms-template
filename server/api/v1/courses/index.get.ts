// Canvas-compatible course listing shim -> internal courses.
// Canvas: GET /api/v1/courses (Bearer, Accept: application/json+canvas-string-ids)
export default defineEventHandler(async (event) => {
  // TODO: drizzle query on courses; demo data until DB wired.
  return [
    { id: '1', name: 'Demo Course', course_code: 'DEMO-101', workflow_state: 'available' },
  ]
})
