<template>
  <UContainer>
    <section ref="heroEl" class="landing-hero">
      <GriffinMascot state="idle" />
      <h1 ref="heroTitle">Domina la mazmorra del código</h1>
      <p>Quests, XP y certificados en cada nivel superado.</p>
      <UButton to="/courses/demo-101">Empezar quest</UButton>
    </section>

    <section ref="pathsEl" class="landing-section">
      <h2>Learning paths</h2>
      <p>Cada módulo, una sala. Cada prerrequisito, un corredor.</p>
      <DungeonCanvas :seed="7" :rooms="8" :progress="dungeonProgress" :stage="3" />
    </section>

    <section ref="stackEl" class="landing-section">
      <h2>Shared services</h2>
      <p>Del caos al orden: ratsnest → trazas ruteadas.</p>
      <PcbCanvas :seed="11" :chips="5" :routed="pcbRouted" />
    </section>

    <section ref="statsEl" class="landing-section">
      <h2>Stats</h2>
      <p><strong ref="statCourses">0</strong> cursos · <strong ref="statQuests">0</strong> quests</p>
    </section>

    <section ref="ctaEl" class="landing-section">
      <h2>¿Listo para la raid?</h2>
      <UButton ref="ctaBtn" size="xl" to="/courses/demo-101">Unirme a la academy</UButton>
    </section>

    <h2>Cursos demo</h2>
    <CourseCard
      v-for="c in courses"
      :key="c.slug"
      :course="c"
    />
  </UContainer>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import DungeonCanvas from '../components/motion/DungeonCanvas.vue'
import PcbCanvas from '../components/motion/PcbCanvas.vue'
import GriffinMascot from '../components/motion/GriffinMascot.vue'
import { useScrollTheater } from '../composables/useScrollTheater'

useSeoMeta({ title: 'Demo LMS', description: 'White-label LMS template demo.' })
const courses = [{ slug: 'demo-101', title: 'Demo Course', description: 'Offline demo data.' }]

const heroEl = ref<HTMLElement | null>(null)
const heroTitle = ref<HTMLElement | null>(null)
const pathsEl = ref<HTMLElement | null>(null)
const stackEl = ref<HTMLElement | null>(null)
const statsEl = ref<HTMLElement | null>(null)
const ctaEl = ref<HTMLElement | null>(null)
const statCourses = ref<HTMLElement | null>(null)
const statQuests = ref<HTMLElement | null>(null)
const ctaBtn = ref<{ $el?: HTMLElement } | null>(null)

const dungeonProgress = ref(0)
const pcbRouted = ref(false)
const killers: { kill: () => void; refresh: () => void }[] = []

onMounted(() => {
  // Hero: title reveal (SplitText-class feel with plain stagger).
  killers.push(
    useScrollTheater(() => heroEl.value, (_ctx, tl) => {
      tl.from(heroTitle.value, { y: 40, autoAlpha: 0, duration: 0.8 })
    }),
  )
  // Paths: scrub dungeon generation progress with scroll.
  killers.push(
    useScrollTheater(
      () => pathsEl.value,
      (_ctx, tl) => {
        const proxy = { p: 0 }
        tl.to(proxy, {
          p: 1,
          duration: 2,
          ease: 'none',
          onUpdate: () => {
            dungeonProgress.value = proxy.p
          },
        })
      },
      { scrub: 1, start: 'top 80%', end: 'bottom 30%' },
    ),
  )
  // Stack: flip ratsnest → routed traces at midpoint.
  killers.push(
    useScrollTheater(
      () => stackEl.value,
      (_ctx, tl) => {
        tl.call(() => {
          pcbRouted.value = true
        })
        tl.from(stackEl.value?.querySelector('.pcb-canvas') ?? {}, { autoAlpha: 0.2, duration: 0.5 })
      },
      { scrub: false },
    ),
  )
  // Stats: snap counters.
  killers.push(
    useScrollTheater(() => statsEl.value, (_ctx, tl) => {
      const c = { n: 0 }
      tl.to(c, {
        n: 12,
        duration: 1.2,
        snap: { n: 1 },
        onUpdate: () => {
          if (statCourses.value !== null) statCourses.value.textContent = String(Math.round(c.n))
        },
      })
      const q = { n: 0 }
      tl.to(
        q,
        {
          n: 140,
          duration: 1.2,
          snap: { n: 1 },
          onUpdate: () => {
            if (statQuests.value !== null) statQuests.value.textContent = String(Math.round(q.n))
          },
        },
        '<',
      )
    }),
  )
  // CTA: magnetic-feel hover (transform-only).
  const btn = ctaBtn.value?.$el
  if (btn !== undefined && btn !== null) {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.3 })
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.3 })
    const move = (e: MouseEvent): void => {
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
      xTo((e.clientX - r.left - r.width / 2) * 0.2)
      yTo((e.clientY - r.top - r.height / 2) * 0.2)
    }
    const leave = (): void => {
      xTo(0)
      yTo(0)
    }
    btn.addEventListener('mousemove', move)
    btn.addEventListener('mouseleave', leave)
    killers.push({ kill: () => btn.removeEventListener('mousemove', move), refresh: () => {} })
    void leave
  }
})

onUnmounted(() => {
  for (const k of killers) k.kill()
})
</script>

<style scoped>
.landing-hero { text-align: center; padding: 48px 0; }
.landing-section { padding: 40px 0; }
</style>
