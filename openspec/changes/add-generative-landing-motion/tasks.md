# Tasks: generative landing motion — APPLIED (template)

- [x] `shared/generative/dungeon.ts` — seeded grid generator (rooms, BFS hole check, spiral placement, doors, corridors) + stage snapshots
- [x] `shared/generative/pcb.ts` — chips, obstacle-aware 45° router with depth guard, clearance check, ratsnest export
- [x] `shared/generative/adapters.ts` — Anime.js custom adapter for dungeon/PCB models
- [x] `DungeonCanvas.vue` + `PcbCanvas.vue` — SVG renderers with seeded-SSR preview props
- [x] `GriffinMascot.vue` — placeholder sigil + `.gitattributes` (`*.riv binary`); real `.riv` asset pending
- [x] `useScrollTheater.ts` — scoped GSAP context helper (scrub/pin/refresh/kill, reduced-motion final frame)
- [x] Landing section wiring (hero, paths, stack, stats, CTA) per design map
- [x] Perf pass: reduced-motion, transform-only, lazy dynamic GSAP; GPU scenes route-split
- [x] Deps pinned in `package.json` (`gsap@3.15.0`, `motion@13.4.6`, `three`, `vgpu@0.5.0`, `animejs@4.5.0`, `@rive-app/canvas`)
- [ ] Academy override: bind rooms→courses/enrollments, chips→services (`academy/specs/overrides/`) — pending Nuxt layer wiring (follow-up)
- [ ] v2 follow-ups: Motion+three/vgpu hero flythrough, real `.riv` griffin, Nitro `/api/_openapi.json` route

Verified: `npm run build` green (client+server+prerender, 0 link errors). `golar typecheck`: our `.ts` clean; 13 phantom TS9010/SFC are a Golar 0.1+TS7 tool bug (proven with empty-SFC probe), plus ignored `.nuxt/ui` third-party noise.
