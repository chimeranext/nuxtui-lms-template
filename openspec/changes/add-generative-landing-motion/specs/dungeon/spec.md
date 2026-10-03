# Spec: dungeon-generator

## ADDED Requirements

### Requirement: Seeded dungeon topology
The generator SHALL produce rooms + corridors on an integer grid from a numeric
seed, so renders are deterministic (same seed = same dungeon for SSR/SSG).

#### Scenario: Deterministic render
- **WHEN** `generateDungeon({ seed: 42, rooms: 8 })` runs twice (server + client)
- **THEN** both outputs are cell-identical (hydration-safe).

### Requirement: Tiendil pipeline stages
The generator SHALL implement room growth (block accretion), hole rejection
(BFS ring check), spiral placement with 1-cell corridor gap, door flags, and
shortest-corridor room connection, exposing each stage for scroll-scrubbed
storytelling (steps 1–6).

#### Scenario: Scroll narrative
- **WHEN** the user scrolls the "Learning path" section
- **THEN** stages render progressively (blocks → rooms → corridors → polish).

### Requirement: Academy palette binding
Rooms SHALL fill ink/gold/parchment, corridors arcane, doors gold; boss rooms
blood. No legacy neon inside dungeon renders.

#### Scenario: Palette audit
- **WHEN** a dungeon frame renders
- **THEN** every fill/stroke resolves to a `--color-*` academy token.
