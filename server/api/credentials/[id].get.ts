import type { EventHandler } from 'h3'

// GET /api/credentials/[id] — fetch issued AchievementCredential + credentialStatus.
const handler: EventHandler = defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  // TODO: drizzle lookup on credentials_issued by statusId; honor revoked flag.
  return { id, status: 'not-implemented' }
})

export default handler
