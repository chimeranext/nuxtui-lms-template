# Spec: motion-architecture

## ADDED Requirements

### Requirement: GSAP orchestration
Scroll-driven sections SHALL use GSAP timelines + ScrollTrigger (scrub, pin,
`ScrollTrigger.refresh()` after layout; `gsap.context()` cleanup per
gsap-skills gsap-frameworks). SplitText (now free) for hero title reveals.

#### Scenario: Section timeline
- **WHEN** a landing section mounts/unmounts
- **THEN** exactly one scoped timeline exists; unmount reverts it (no leaks).

### Requirement: Motion GPU scenes
Hero/3D moments SHALL use `motion` + `motion/three` (`threeEffect`) or
`motion/vgpu` (`vgpuEffect`), mixing DOM + GPU subjects in one `animate()`
sequence; `surface({ autoResize: false })` + ResizeObserver (no per-frame
layout reads).

#### Scenario: Mixed sequence
- **WHEN** the hero plays
- **THEN** DOM title, three.js camera, and shader uniforms share one timeline.

### Requirement: Anime.js adapters
Three.js objects SHALL animate via `animejs/adapters/three`; dungeon/PCB model
objects SHALL get a custom `registerAdapter()` (target + property resolvers)
so generators tween with the standard `animate()`/timeline API.

#### Scenario: Custom adapter
- **WHEN** a room's `progress` tweens 0→1
- **THEN** the adapter setter drives redraw (no direct property pokes).

### Requirement: Rive mascot
The griffin SHALL load via `@rive-app/canvas` (or webgl2 per canvas-vs-webgl
guidance), driven by a state machine (idle/hover/click), with
`*.riv binary` in `.gitattributes`.

#### Scenario: Interaction
- **WHEN** the user hovers the mascot
- **THEN** the state machine transitions idle→greet without reload.

### Requirement: Motion budgets
Every animated section SHALL respect `prefers-reduced-motion` (static final
frame), hold 60fps on mid-tier mobile (GPU scenes lazy + IntersectionObserver
gated), and animate transforms/opacity only (gsap-performance).

#### Scenario: Reduced motion
- **WHEN** the OS requests reduced motion
- **THEN** no tween runs; final composited frame shows immediately.
