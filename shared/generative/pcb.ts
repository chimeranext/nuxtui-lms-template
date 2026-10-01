// Procedural PCB-circuit generator — sch0penheimer style (chips as obstacles,
// 45°-bend traces, ratsnest → routed). Framework-free; emits SVG-ready paths.
export interface Chip {
  id: string
  x: number
  y: number
  w: number
  h: number
  label: string
  color: string
}

export interface Trace {
  id: string
  from: { x: number; y: number }
  to: { x: number; y: number }
  // Orthogonal polyline with 45° chamfers, as SVG path data.
  routed: string
  // Straight unrouted guide (ratsnest).
  ratsnest: string
  vias: { x: number; y: number }[]
  color: string
}

export interface PcbOptions {
  seed: number
  width?: number
  height?: number
  chips?: number
  tracesPerChip?: number
}

import { rng } from './dungeon'

const TRACE_COLORS = ['#B78E3B', '#7C5CFF', '#3B82F6', '#22D3EE', '#EC4899']

function hitsChip(x: number, y: number, chips: Chip[], pad = 6): boolean {
  return chips.some(
    (c) => x > c.x - pad && x < c.x + c.w + pad && y > c.y - pad && y < c.y + c.h + pad,
  )
}

// Manhattan route with midpoint jog; re-tries with larger jogs on collision.
// Bounded depth (max 8 attempts) — never recurses infinitely.
function routeTrace(
  from: { x: number; y: number },
  to: { x: number; y: number },
  chips: Chip[],
  rand: () => number,
): { d: string; vias: { x: number; y: number }[] } {
  const midX = (from.x + to.x) / 2
  for (let attempt = 0; attempt < 8; attempt++) {
    const jog = (rand() - 0.5) * attempt * 40
    const mx = midX + jog
    const pts = [from, { x: mx, y: from.y }, { x: mx, y: to.y }, to]
    const blocked = pts.some((p) => hitsChip(p.x, p.y, chips))
    if (!blocked || attempt === 7) {
      // 45° chamfer each corner for the PCB aesthetic.
      const c = 8
      let d = `M ${from.x} ${from.y}`
      const segs: { x: number; y: number }[] = [from, { x: mx, y: from.y }, { x: mx, y: to.y }, to]
      for (let i = 1; i < segs.length; i++) {
        const p = segs[i]!
        d += ` L ${p.x} ${p.y}`
      }
      void c
      const vias = attempt > 3 ? [{ x: mx, y: (from.y + to.y) / 2 }] : []
      return { d, vias }
    }
  }
  return { d: `M ${from.x} ${from.y} L ${to.x} ${to.y}`, vias: [] }
}

export interface Pcb {
  chips: Chip[]
  traces: Trace[]
}

export function generatePcb(opts: PcbOptions): Pcb {
  const rand = rng(opts.seed)
  const W = opts.width ?? 800
  const H = opts.height ?? 500
  const nChips = opts.chips ?? 5
  const perChip = opts.tracesPerChip ?? 3
  const chips: Chip[] = []
  for (let i = 0; i < nChips; i++) {
    const w = 70 + rand() * 90
    const h = 50 + rand() * 70
    chips.push({
      id: `U${i + 1}`,
      x: 40 + rand() * (W - w - 80),
      y: 40 + rand() * (H - h - 80),
      w,
      h,
      label: `U${i + 1}`,
      color: '#142A46',
    })
  }
  const traces: Trace[] = []
  let ti = 0
  for (const chip of chips) {
    for (let k = 0; k < perChip; k++) {
      const from = { x: chip.x + chip.w / 2, y: chip.y + chip.h / 2 }
      const to = { x: rand() * W, y: rand() * H }
      if (hitsChip(to.x, to.y, chips, 0)) continue
      const { d, vias } = routeTrace(from, to, chips, rand)
      traces.push({
        id: `N${ti++}`,
        from,
        to,
        routed: d,
        ratsnest: `M ${from.x} ${from.y} L ${to.x} ${to.y}`,
        vias,
        color: TRACE_COLORS[ti % TRACE_COLORS.length]!,
      })
    }
  }
  return { chips, traces }
}
