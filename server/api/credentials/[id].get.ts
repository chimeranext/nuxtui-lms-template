// GET /api/credentials/[id] — fetch issued AchievementCredential + credentialStatus.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  // TODO: drizzle lookup on credentials_issued by statusId; honor revoked flag.
  return { id, status: 'not-implemented' }
})
