// Canvas OAuth2 shim -> Auth.js: GET /login/oauth2/auth, POST /login/oauth2/token.
export default defineEventHandler(async (event) => {
  // TODO: redirect to Auth.js provider with state; issue 1h access + refresh_token.
  return { status: 'not-implemented', flow: 'authorization_code + refresh_token (1h)' }
})
