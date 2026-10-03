# Spec: pcb-generator

## ADDED Requirements

### Requirement: Obstacle-aware trace routing
The generator SHALL route 45°-bend traces between chips (rect obstacles with
`top/left/width/height`), avoiding overlap, in the style of
sch0penheimer/PCB-Circuit_Generator (recursive routing with depth guard).

#### Scenario: Chip avoidance
- **WHEN** a trace path crosses a chip rect
- **THEN** it re-routes around it (never through) within bounded recursion.

### Requirement: Ratsnest-to-routed animation
Unrouted connections SHALL first render as straight ratsnest guides, then
animate into routed traces (GSAP MotionPath or Anime.js), telling the
"mess → order" story of shared services.

#### Scenario: Scroll routing
- **WHEN** the stack section enters viewport
- **THEN** ratsnest lines draw first, then morph into routed traces with vias.

### Requirement: Trace visual language (buildwithtrace concepts)
Traces SHALL use 45° bends, vias on layer switches, differential-pair parallel
runs for paired items, and DRC-like minimum clearance (no overlapping traces).

#### Scenario: Clearance
- **WHEN** two traces would overlap
- **THEN** the second is re-routed or the frame is rejected and regenerated.
