// Canvas-compatible self profile: GET /api/v1/users/self
import type { EventHandler } from 'h3'

const handler: EventHandler = defineEventHandler(() => {
  // TODO: Auth.js session -> Drizzle users row.
  return { id: 'u1', name: 'Demo Learner', email: 'learner@demo.local', roles: ['student'] }
})

export default handler
