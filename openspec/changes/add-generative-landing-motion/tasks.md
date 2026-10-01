# Tasks: generative landing motion

- [ ] `lib/generative/dungeon.ts` — seeded grid generator (rooms, BFS hole check, spiral placement, doors, corridors) + stage snapshots
- [ ] `lib/generative/pcb.ts` — chips, obstacle-aware 45° router with depth guard, clearance check, ratsnest export
- [ ] `lib/generative/adapters.ts` — Anime.js custom adapter for dungeon/PCB models
- [ ] `DungeonCanvas.vue` + `PcbCanvas.vue` — canvas renderers with seeded-SSR SVG preview prop
- [ ] `GriffinMascot.vue` — `@rive-app/canvas` + state machine + `.gitattributes`
- [ ] `useScrollTheater.ts` — scoped GSAP context helper (scrub/pin/refresh/kill)
- [ ] Landing section wiring (hero, paths, stack, stats, CTA) per design map
- [ ] Perf pass: lazy GPU, reduced-motion, 60fps audit, <150KB budget check
- [ ] Deps pinned in `package.json` (`gsap`, `motion`, `three`, `vgpu`, `animejs@4`, `@rive-app/canvas`)
- [ ] Academy override: bind rooms→courses/enrollments, chips→services (`academy/specs/overrides/`)
