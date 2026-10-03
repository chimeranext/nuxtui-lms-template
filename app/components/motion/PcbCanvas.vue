<template>
  <svg viewBox="0 0 800 500" class="pcb-canvas" role="img" aria-label="Generated PCB layout">
    <rect x="0" y="0" width="800" height="500" fill="#0B1526" rx="12" />
    <!-- ratsnest guides (unrouted) -->
    <g v-if="!routed" opacity="0.5">
      <line
        v-for="t in pcb.traces"
        :key="`r${t.id}`"
        :x1="t.from.x" :y1="t.from.y" :x2="t.to.x" :y2="t.to.y"
        :stroke="t.color" stroke-width="1" stroke-dasharray="4 4"
      />
    </g>
    <!-- routed traces -->
    <g v-else>
      <path
        v-for="t in pcb.traces"
        :key="t.id"
        :d="t.routed"
        :stroke="t.color"
        stroke-width="2.5"
        fill="none"
        stroke-linejoin="round"
      />
      <circle
        v-for="(via, i) in allVias"
        :key="i"
        :cx="via.x" :cy="via.y" r="4"
        fill="#D9B45B" stroke="#0B1526" stroke-width="1.5"
      />
    </g>
    <!-- chips (obstacles) -->
    <g v-for="chip in pcb.chips" :key="chip.id">
      <rect :x="chip.x" :y="chip.y" :width="chip.w" :height="chip.h" rx="4" fill="#142A46" stroke="#B78E3B" stroke-width="1.5" />
      <text :x="chip.x + chip.w / 2" :y="chip.y + chip.h / 2 + 5" text-anchor="middle" fill="#F2EAD8" font-size="14" font-family="Inconsolata, monospace">{{ chip.label }}</text>
    </g>
    <!-- endpoints -->
    <circle
      v-for="t in pcb.traces"
      :key="`e${t.id}`"
      :cx="t.to.x" :cy="t.to.y" r="3.5"
      :fill="t.color"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { generatePcb, type Pcb } from '#shared/generative/pcb'

const props = withDefaults(
  defineProps<{ seed?: number; chips?: number; routed?: boolean }>(),
  { seed: 11, chips: 5, routed: false },
)

const pcb: ComputedRef<Pcb> = computed(() => generatePcb({ seed: props.seed, chips: props.chips }))
const allVias: ComputedRef<{ x: number; y: number }[]> = computed(() => pcb.value.traces.flatMap((t) => t.vias))
</script>
