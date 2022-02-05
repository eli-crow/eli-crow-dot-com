<script setup lang="ts">
import { BezierSpline, SplineDescription } from '../../lib/bezier'
import * as V from '../../lib/v'

import { onMounted, watch } from 'vue'
import { lerp, unlerp } from '../../lib/utilities'

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const {
  spline,
  min = 0,
  max = 1,
  modelValue = 0
} = defineProps<{
  spline: SplineDescription,
  min?: number,
  max?: number,
  modelValue?: number,
}>()

let mounted = $ref(false)
let progressDashOffset = $ref(0)
let thumbRadius = $ref(12)
let pathData = $ref('')
let thumbPosition = $ref<V.Vec>([0, 0])
let targetPosition = $ref<V.Vec | null>(null)
let trackSpline = $ref<BezierSpline>()
let root = $ref<HTMLElement>()
let currentT = $computed(() => unlerp(modelValue, min, max))

onMounted(() => {
  mounted = true
  redraw()
  window.addEventListener('resize', redraw)
})
watch(() => spline, updateCurve, { deep: true })
watch(() => modelValue, updateThumbAndOffset)

function redraw() {
  updateCurve()
  updateThumbAndOffset()
  thumbRadius = window.innerWidth < 700 ? 16 : 12
}

function updateCurve() {
  if (!root) return
  const { width, height } = root.getBoundingClientRect()
  const sizedSpline = spline.map(curve => curve.map((v, i) => i % 2 === 0 ? v * width : v * height)) as SplineDescription
  trackSpline = new BezierSpline(sizedSpline)
  pathData = trackSpline.getSvgPathData()
  updateThumbAndOffset()
}

function updateThumbAndOffset() {
  const splineLength = trackSpline.getLength()
  progressDashOffset = 99999 - splineLength * currentT
  thumbPosition = trackSpline.getPointAt(currentT)!
}

function handleThumbDown(e: PointerEvent) {
  const bb = root.getBoundingClientRect()
  const downPt: V.Vec = [e.clientX - bb.left, e.clientY - bb.top]
  const downThumbPt: V.Vec = [...thumbPosition] as V.Vec

  const move = (e: PointerEvent) => {
    if (!root) { up(); return }
    const bb = root.getBoundingClientRect()
    const movePt: V.Vec = [e.clientX - bb.left, e.clientY - bb.top]
    const diff = V.sub(movePt, downPt)
    targetPosition = V.add(downThumbPt, diff)

    const nearestT = trackSpline.getNearestTInWindingOrder(currentT, targetPosition)!
    const newVal = lerp(min, max, nearestT)
    emit('update:modelValue', newVal)
  }

  const up = () => {
    targetPosition = null
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointercancel', up)
    window.removeEventListener('pointerup', up)
  }

  window.addEventListener('pointermove', move)
  window.addEventListener('pointercancel', up)
  window.addEventListener('pointerup', up)
}
</script>

<template>
  <div class="AlleyOoper" ref="root">
    <svg v-if="mounted" class="overflow-visible w-full">
      <!-- track -->
      <path
        class="fill-none stroke-[6px] stroke-gray-100 dark:stroke-gray-400 fill-[none]"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
        :d="pathData"
      />

      <!-- track progress -->
      <path
        class="fill-none stroke-[6px] stroke-teal fill-[none]"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
        :d="pathData"
        stroke-dasharray="99999"
        :stroke-dashoffset="progressDashOffset"
      />

      <!-- drag line -->
      <line
        v-if="targetPosition"
        class="fill-none stroke-[1px] stroke-teal fill-[none]"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
        :x1="thumbPosition[0]"
        :y1="thumbPosition[1]"
        :x2="targetPosition[0]"
        :y2="targetPosition[1]"
        stroke-dasharray="4 6"
        :stroke-dashoffset="progressDashOffset"
      />

      <!-- thumb -->
      <circle
        class="fill-white drop-shadow-lg dark:drop-shadow-none dark:stroke-[2px] stroke-gray-100 active:!stroke-[hsla(209,73%,59%,1)]"
        :cx="thumbPosition[0]"
        :cy="thumbPosition[1]"
        :r="thumbRadius"
        @pointerdown.stop.prevent="handleThumbDown"
        @touchstart.stop.prevent.capture
      />
    </svg>
  </div>
</template>