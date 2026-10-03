// Anime.js v4 custom adapters for dungeon/PCB model objects.
// Lets generators tween with the standard animate()/timeline API.
import { registerAdapter } from 'animejs/adapters'

interface ProgressTarget {
  progress: number
  onFrame?: (p: number) => void
}

const generative = registerAdapter()

const isProgressTarget = (t: unknown): t is ProgressTarget =>
  typeof t === 'object' && t !== null && 'progress' in t

generative.registerTargetAdapter((target) => isProgressTarget(target))

// Property resolver: any `room_<id>` / `trace_<id>` progress channel.
generative.registerPropertyResolver((target, name) => {
  if (!isProgressTarget(target)) return null
  if (name === 'progress' || name.startsWith('room_') || name.startsWith('trace_')) {
    return {
      get: (t) => (t as ProgressTarget).progress,
      set: (t, value) => {
        const p = value as number
        ;(t as ProgressTarget).progress = p
        ;(t as ProgressTarget).onFrame?.(p)
      },
    }
  }
  return null
})

export function tweenProgress(
  target: ProgressTarget,
  to: number,
  ms = 1200,
): { pause: () => void; play: () => void } {
  let raf = 0
  let start = -1
  const from = target.progress
  const step = (t: number): void => {
    if (start < 0) start = t
    const p = Math.min(1, (t - start) / ms)
    const eased = 1 - Math.pow(1 - p, 3)
    target.progress = from + (to - from) * eased
    target.onFrame?.(target.progress)
    if (p < 1) raf = requestAnimationFrame(step)
  }
  return {
    play: () => {
      cancelAnimationFrame(raf)
      start = -1
      raf = requestAnimationFrame(step)
    },
    pause: () => cancelAnimationFrame(raf),
  }
}
