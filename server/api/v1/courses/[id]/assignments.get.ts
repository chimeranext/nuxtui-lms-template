import type { EventHandler } from 'h3'

// Canvas-compatible assignments shim.
const handler: EventHandler = defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return [{ id: 'a1', course_id: id, name: 'Demo assignment', points_possible: 100 }]
})

export default handler
