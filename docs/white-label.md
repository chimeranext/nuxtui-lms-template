# White-label checklist (offline)

1. Copy `template.config.ts` values into your wrapper config (academy: `academy.config.ts`).
2. Replace brand tokens (name, logo, primary), video CDN (`NUXT_PUBLIC_VIDEO_CDN`), site URL.
3. Swap Neon `DATABASE_URL` to your project (demo-template vs academy-prod).
4. Replace issuer Ed25519 keypair (`did:web:<your-domain>`); update `public/.well-known/openbadges/issuer.json`.
5. `pnpm build:static` for the Envato demo bundle (no secrets inside).
