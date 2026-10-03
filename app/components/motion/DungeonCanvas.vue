<template>
  <svg
    :viewBox="`0 0 ${vb.w} ${vb.h}`"
    class="dungeon-canvas"
    role="img"
    aria-label="Generated dungeon map"
  >
    <g v-for="room in dungeon.rooms" :key="room.id">
      <rect
        v-for="cell in visibleCells(room)"
        :key="`${cell.x},${cell.y}`"
        :x="(cell.x - minX) * S"
        :y="(cell.y - minY) * S"
        :width="S - 1"
        :height="S - 1"
        :fill="room.color"
        opacity="0.75"
      />
      <circle
        v-for="door in room.doors"
        :key="`d${door.x},${door.y}`"
        :cx="(door.x - minX) * S + S / 2"
        :cy="(door.y - minY) * S + S / 2"
        :r="S / 4"
        fill="#D9B45B"
      />
    </g>
    <polyline
      v-for="(corr, i) in visibleCorridors"
      :key="i"
      :points="corr.path.map((c) => `${(c.x - minX) * S + S / 2},${(c.y - minY) * S + S / 2}`).join(' ')"
      fill="none"
      stroke="#7C5CFF"
      :stroke-width="S / 3"
      opacity="0.9"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { generateDungeon, type Cell, type Corridor, type Dungeon, type Room } from '#shared/generative/dungeon'

const props = withDefaults(
  defineProps<{ seed?: number; rooms?: number; progress?: number; stage?: number }>(),
  { seed: 7, rooms: 8, progress: 1, stage: 3 },
)

const S = 24
const dungeon: ComputedRef<Dungeon> = computed(() => generateDungeon({ seed: props.seed, rooms: props.rooms }))
const allCells: ComputedRef<Cell[]> = computed(() => dungeon.value.rooms.flatMap((r) => r.cells))
const minX: ComputedRef<number> = computed(() => Math.min(...allCells.value.map((c) => c.x)))
const minY: ComputedRef<number> = computed(() => Math.min(...allCells.value.map((c) => c.y)))
const maxX: ComputedRef<number> = computed(() => Math.max(...allCells.value.map((c) => c.x)))
const maxY: ComputedRef<number> = computed(() => Math.max(...allCells.value.map((c) => c.y)))
const vb: ComputedRef<{ w: number; h: number }> = computed(() => ({ w: (maxX.value - minX.value + 1) * S, h: (maxY.value - minY.value + 1) * S }))

// stage 1 = blocks only, 2 = rooms, 3 = + corridors; progress reveals fraction.
function visibleCells(room: Room): Cell[] {
  if (props.stage < 2) return room.cells
  const n = Math.max(1, Math.floor(room.cells.length * props.progress))
  return room.cells.slice(0, n)
}
const visibleCorridors: ComputedRef<Corridor[]> = computed(() => {
  if (props.stage < 3) return []
  const n = Math.floor(dungeon.value.corridors.length * props.progress)
  return dungeon.value.corridors.slice(0, n)
})
</script>
