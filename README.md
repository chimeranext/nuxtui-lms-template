# nuxtui-lms-template

White-label Nuxt UI LMS template. Vendible standalone (Envato): demo data, local video mock, offline docs.

## Academy relationship

`academy/` is a **thin wrapper** — it overrides via `academy.config.ts`, never forks this code.
Sync is one-way: template -> academy (`opsx.yaml` remotes, deltas in `academy/specs/overrides/`).

## Quickstart

```bash
cp .env.example .env
pnpm install
pnpm dev            # template demo (Neon demo-template project)
NUXT_PRESET=static pnpm build:static  # Envato demo bundle
```

## Docs (offline, Envato-safe)

- `docs/white-label.md` — rebrand checklist (tokens, logo, issuer keys).
- OpenAPI stub: `openapi/academy.openapi.yaml` (regenerate with `pnpm openapi`).
