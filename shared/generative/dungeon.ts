// Seeded dungeon generator — tiendil pipeline (blocks → rooms → doors → corridors).
// Framework-free: pure data + stage snapshots for scroll-scrubbed storytelling.
export interface DungeonOptions {
  seed: number
  rooms?: number
  minBlocks?: number
  maxBlocks?: number
  doorsPerRoom?: number
}

export interface Cell {
  x: number
  y: number
}

export interface Room {
  id: number
  cells: Cell[]
  color: string
  doors: Cell[]
}

export interface Corridor {
  from: Cell
  to: Cell
  path: Cell[]
}

export interface Dungeon {
  rooms: Room[]
  corridors: Corridor[]
  bounds: { w: number; h: number }
  stages: { blocks: Cell[][]; rooms: Room[]; corridors: Corridor[] }
}

// Mulberry32 — deterministic RNG (same seed = same dungeon, SSR-safe).
export function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const key = (c: Cell): string => `${c.x},${c.y}`
const neighbors = (c: Cell): Cell[] => [
  { x: c.x + 1, y: c.y },
  { x: c.x - 1, y: c.y },
  { x: c.x, y: c.y + 1 },
  { x: c.x, y: c.y - 1 },
]

const PALETTE = ['#B78E3B', '#7C5CFF', '#3B82F6', '#22D3EE', '#EC4899', '#A67E34']

function growRoom(rand: () => number, blocks: number): Cell[] {
  for (let attempt = 0; attempt < 24; attempt++) {
    const cells = new Map<string, Cell>()
    const start: Cell = { x: 0, y: 0 }
    cells.set(key(start), start)
    while (cells.size < blocks) {
      const frontier = new Map<string, Cell>()
      for (const c of cells.values()) {
        for (const n of neighbors(c)) {
          if (!cells.has(key(n))) frontier.set(key(n), n)
        }
      }
      const opts = [...frontier.values()]
      const pick = opts[Math.floor(rand() * opts.length)]!
      cells.set(key(pick), pick)
    }
    if (!hasHoles(cells)) return [...cells.values()]
  }
  return [{ x: 0, y: 0 }]
}

// BFS ring check: flood-fill the bounding rect + 1 ring; unreachable empties = holes.
function hasHoles(cells: Map<string, Cell>): boolean {
  const xs = [...cells.values()].map((c) => c.x)
  const ys = [...cells.values()].map((c) => c.y)
  const x0 = Math.min(...xs) - 1
  const x1 = Math.max(...xs) + 1
  const y0 = Math.min(...ys) - 1
  const y1 = Math.max(...ys) + 1
  const seen = new Set<string>()
  const queue: Cell[] = [{ x: x0, y: y0 }]
  while (queue.length > 0) {
    const c = queue.pop()!
    const k = key(c)
    if (seen.has(k) || cells.has(k)) continue
    if (c.x < x0 || c.x > x1 || c.y < y0 || c.y > y1) continue
    seen.add(k)
    queue.push(...neighbors(c))
  }
  const total = (x1 - x0 + 1) * (y1 - y0 + 1) - cells.size
  return seen.size !== total
}

function manhattan(a: Cell, b: Cell): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function straightPath(from: Cell, to: Cell): Cell[] {
  const path: Cell[] = []
  let { x, y } = from
  while (x !== to.x) {
    x += Math.sign(to.x - x)
    path.push({ x, y })
  }
  while (y !== to.y) {
    y += Math.sign(to.y - y)
    path.push({ x, y })
  }
  return path
}

export function generateDungeon(opts: DungeonOptions): Dungeon {
  const rand = rng(opts.seed)
  const roomCount = opts.rooms ?? 8
  const minB = opts.minBlocks ?? 8
  const maxB = opts.maxBlocks ?? 24
  const doorsN = opts.doorsPerRoom ?? 2
  const rooms: Room[] = []
  const occupied = new Set<string>()

  for (let i = 0; i < roomCount; i++) {
    const size = minB + Math.floor(rand() * (maxB - minB))
    const grown = growRoom(rand, size)
    // Spiral placement: first room at origin, others at nearest free ring.
    let dx = 0
    let dy = 0
    if (i > 0) {
      let placed = false
      for (let ring = 2; ring < 60 && !placed; ring++) {
        for (let px = -ring; px <= ring && !placed; px++) {
          for (const py of [-ring, ring]) {
            if (grown.every((c) => !occupied.has(key({ x: c.x + px, y: c.y + py })))) {
              dx = px
              dy = py
              placed = true
            }
          }
        }
      }
    }
    const cells = grown.map((c) => ({ x: c.x + dx, y: c.y + dy }))
    for (const c of cells) occupied.add(key(c))
    const doorIdx = new Set<number>()
    while (doorIdx.size < Math.min(doorsN, cells.length)) {
      doorIdx.add(Math.floor(rand() * cells.length))
    }
    rooms.push({
      id: i,
      cells,
      color: PALETTE[i % PALETTE.length]!,
      doors: [...doorIdx].map((d) => cells[d]!),
    })
  }

  // Connect each room to the previous via shortest door-to-door corridor (tree).
  const corridors: Corridor[] = []
  for (let i = 1; i < rooms.length; i++) {
    let best: Corridor | null = null
    for (const a of rooms[i - 1]!.doors) {
      for (const b of rooms[i]!.doors) {
        const path = straightPath(a, b)
        if (best === null || path.length < best.path.length) {
          best = { from: a, to: b, path }
        }
      }
    }
    if (best !== null) corridors.push(best)
  }

  const allX = [...occupied].map((k) => Number(k.split(',')[0]))
  const allY = [...occupied].map((k) => Number(k.split(',')[1]))
  void manhattan
  return {
    rooms,
    corridors,
    bounds: {
      w: Math.max(...allX) - Math.min(...allX) + 1,
      h: Math.max(...allY) - Math.min(...allY) + 1,
    },
    stages: {
      blocks: rooms.map((r) => r.cells),
      rooms,
      corridors,
    },
  }
}
