# Design: generative landing motion

## Section map (website landing × academy)

| Section | Style | Driver | Notes |
|---|---|---|---|
| Hero | Dungeon flythrough (Motion+three) + Rive griffin + GSAP SplitText | `motion/three`, `@rive-app/canvas`, gsap-core/timeline | GPU lazy; static SVG fallback for `static` preset |
| Learning paths / Ventures | Dungeon generator, scroll-scrubbed stages | GSAP ScrollTrigger + custom Anime.js adapter | Rooms = modules/ventures; corridors = prereqs |
| Stack / Shared services | PCB generator, ratsnest→routed | Anime.js + GSAP MotionPath | Chips = services; fractal zoom-out on scroll end |
| Stats / Certificates | Arcane counters + meter draws | gsap-utils (snap, mapRange) | 60fps, transform-only |
| CTA | ScrambleText + magnetic button | gsap-plugins / anime text | Reduced-motion: instant final |

## Library install (tasks execute; versions pinned at implement time)
`gsap` (free, all plugins) · `motion` · `three` · `vgpu` · `animejs@4`
· `@rive-app/canvas` (+ `.gitattributes *.riv binary`).

## Nuxt integration
- `app/components/motion/DungeonCanvas.vue`, `PcbCanvas.vue`, `GriffinMascot.vue`
  (client-only wrappers; SSR renders seeded static SVG preview).
- `app/composables/useScrollTheater.ts` — one `gsap.context()` per section,
  ScrollTrigger scrub/pin, `refresh()` on content change, kill on unmount.
- `lib/generative/` — framework-free TS: `dungeon.ts` (tiendil pipeline),
  `pcb.ts` (trace router), `adapters.ts` (anime custom adapters).
- RouteRules impact: GPU sections `ssr: false` islands; static demo excludes
  `motion/three|vgpu` via build alias to SVG fallback.
- Academy binds rooms/chips to Drizzle data (courses, enrollments); template
  uses seeded demo data.

## Perf contract
GPU behind IntersectionObserver; `autoResize: false` surfaces; uniform writes
batched in Motion frameloop; `prefers-reduced-motion` short-circuits to final
frame. Budget: <150KB gz extra JS on landing (GSAP+Motion core; three/vgpu
route-split).
