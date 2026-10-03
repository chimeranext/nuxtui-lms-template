// Canvas-compatible modules: GET /api/v1/courses/:id/modules
import type { EventHandler } from 'h3'

const handler: EventHandler = defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  // TODO: Drizzle query on course modules.
  return [
    { id: 'm1', course_id: id, name: 'Forja básica', position: 1, items_count: 3 },
    { id: 'm2', course_id: id, name: 'Mazmorras intermedias', position: 2, items_count: 5 },
  ]
})

export default handler
