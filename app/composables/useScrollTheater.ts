// Scoped GSAP ScrollTrigger helper: one gsap.context() per section,
// scrub/pin support, refresh on content change, kill on unmount.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface TheaterOptions {
  scrub?: boolean | number
  pin?: boolean
  start?: string
  end?: string
}

export function useScrollTheater(
  scope: () => HTMLElement | null,
  build: (ctx: gsap.Context, tl: gsap.core.Timeline) => void,
  opts: TheaterOptions = {},
): { refresh: () => void; kill: () => void } {
  let ctx: gsap.Context | null = null
  if (import.meta.client) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { duration: 0.6, ease: 'power2.out' },
        scrollTrigger: reduce
          ? undefined
          : {
              trigger: scope(),
              start: opts.start ?? 'top 75%',
              end: opts.end ?? 'bottom 40%',
              scrub: opts.scrub ?? false,
              pin: opts.pin ?? false,
            },
      })
      // Reduced motion: jump straight to the final frame.
      if (reduce) tl.progress(1)
      build(ctx as gsap.Context, tl)
    }, scope)
  }
  return {
    refresh: () => ScrollTrigger.refresh(),
    kill: () => ctx?.revert(),
  }
}
