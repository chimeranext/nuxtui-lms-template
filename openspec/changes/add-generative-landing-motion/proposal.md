# Proposal: Generative landing motion (dungeon × PCB)

## Why
The website landing and the Academy need a visual identity that is unmistakably
ChimeraNext: dungeon-fantasy (brand) fused with engineering precision (studio).
Two researched generative styles give us infinite, on-brand, code-driven art
instead of stock illustrations:
- **Dungeon-maze** (tiendil.org dungeon-generation tutorial): rooms + corridors
  on a grid, tree topology, configurable room count/size/branching.
- **PCB-circuit** (sch0penheimer/PCB-Circuit_Generator): procedural traces with
  obstacle (chip) avoidance, fractal zoom-out, zero-dependency JS.
Plus a library matrix verified against current docs (2026-09-30).

## What
1. `DungeonCanvas` + `PcbCanvas` generative Vue components (seeded, deterministic).
2. Motion architecture: GSAP timelines + ScrollTrigger orchestrate; Motion
   (`motion/three`, `motion/vgpu`) drives GPU scenes in the same sequences;
   Anime.js v4 (Three adapter + custom adapters) for object tweens; Rive for the
   griffin mascot with state machines.
3. Section mapping for website landing AND academy (hero, paths, stack, CTAs).
4. Budgets: 60fps, `prefers-reduced-motion` kill-switch, lazy GPU, no layout thrash.

## Non-goals
- No Three.js/WebGPU on the Envato static demo (CSS/SVG fallback only).
- No Rive editor assets in this change (only runtime wiring + placeholder `.riv`).
- No website (Astro) implementation — website adopts the system as follow-up.

## Academy override (delta lives in `academy/specs/overrides/`)
Dungeon rooms bind to real course modules + enrollment progress; PCB chips bind
to shared-services nodes. Same components, data-driven.
