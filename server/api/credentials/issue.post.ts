// OB3.0 internal issuer: POST /api/credentials/issue
// Signs AchievementCredential (VC 2.0 + JSON-LD, Ed25519) and stores JWT.
export default defineEventHandler(async (event) => {
  const body = await readBody<{ userId: string; courseId: string }>(event)
  if (!body?.userId || !body?.courseId) {
    throw createError({ statusCode: 400, message: 'userId + courseId required' })
  }
  // TODO: build credential, sign with Ed25519 (did:web:academy.chimeranext.dev),
  // persist to credentials_issued, return credential + verify URL.
  return { status: 'not-implemented', ...body }
})
