// OB3.0 discovery gateway: /ims/ob/v3p0/{credentials,profile,discovery} -> internal OB3.
export default defineEventHandler(async (event) => {
  return {
    issuer: 'did:web:academy.chimeranext.dev',
    endpoints: ['/ims/ob/v3p0/credentials', '/ims/ob/v3p0/profile', '/ims/ob/v3p0/discovery'],
    status: 'not-implemented',
  }
})
