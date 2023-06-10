<script setup lang="ts">
import { BezierSpline, SplineDescription } from '../../lib/bezier';
import * as V from '../../lib/v';

import { computed, onMounted, ref, watch } from 'vue';
import { lerp, unlerp } from '../../lib/utilities';

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

const mounted = ref(false)
const progressDashOffset = ref(0)
const thumbRadius = ref(12)
const pathData = ref('')
const thumbPosition = ref<V.Vec>([0, 0])
const targetPosition = ref<V.Vec | null>(null)
const trackSpline = ref<BezierSpline>()
const root = ref<HTMLElement>()
const currentT = computed(() => unlerp(modelValue, min, max))

onMounted(() => {
  mounted.value = true
  redraw()
  window.addEventListener('resize', redraw)
})
watch(() => spline, updateCurve, { deep: true })
watch(() => modelValue, updateThumbAndOffset)

function redraw() {
  updateCurve()
  updateThumbAndOffset()
  thumbRadius.value = window.innerWidth < 700 ? 16 : 12
}

function updateCurve() {
  if (!root.value) return
  const { width, height } = root.value.getBoundingClientRect()
  const sizedSpline = spline.map(curve => curve.map((v, i) => i % 2 === 0 ? v * width : v * height)) as SplineDescription
  trackSpline.value = new BezierSpline(sizedSpline)
  pathData.value = trackSpline.value.getSvgPathData()
  updateThumbAndOffset()
}

function updateThumbAndOffset() {
  if (!trackSpline.value) {
    return
  }
  const splineLength = trackSpline.value.getLength()
  progressDashOffset.value = 99999 - splineLength * currentT.value
  thumbPosition.value = trackSpline.value.getPointAt(currentT.value)!
}

function handleThumbDown(e: PointerEvent) {
  if (typeof root.value === 'undefined') {
    return
  }

  const bb = root.value.getBoundingClientRect()
  const downPt: V.Vec = [e.clientX - bb.left, e.clientY - bb.top]
  const downThumbPt: V.Vec = [...thumbPosition.value] as V.Vec

  const move = (e: PointerEvent) => {
    if (!root.value || !trackSpline.value) {
      up();
      return
    }
    const bb = root.value.getBoundingClientRect()
    const movePt: V.Vec = [e.clientX - bb.left, e.clientY - bb.top]
    const diff = V.sub(movePt, downPt)
    targetPosition.value = V.add(downThumbPt, diff)

    const nearestT = trackSpline.value.getNearestTInWindingOrder(currentT.value, targetPosition.value)!
    const newVal = lerp(min, max, nearestT)
    emit('update:modelValue', newVal)
  }

  const up = () => {
    targetPosition.value = null
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
            class="fill-none stroke-[6px] stroke-gray-100 dark:stroke-gray-400"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
            :d="pathData" />

      <!-- track progress -->
      <path
            class="fill-none stroke-[6px] stroke-teal"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
            :d="pathData"
            stroke-dasharray="99999"
            :stroke-dashoffset="progressDashOffset" />

      <!-- drag line -->
      <line
            v-if="targetPosition"
            class="fill-none stroke-[1px] stroke-teal"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
            :x1="thumbPosition[0]"
            :y1="thumbPosition[1]"
            :x2="targetPosition[0]"
            :y2="targetPosition[1]"
            stroke-dasharray="4 6"
            :stroke-dashoffset="progressDashOffset" />

      <!-- thumb -->
      <circle
              class="fill-white drop-shadow-lg dark:drop-shadow-none dark:stroke-[2px] stroke-gray-100 active:!stroke-[hsla(209,73%,59%,1)]"
              :cx="thumbPosition[0]"
              :cy="thumbPosition[1]"
              :r="thumbRadius"
              @pointerdown.stop.prevent="handleThumbDown"
              @touchstart.stop.prevent.capture />
    </svg>
  </div>
</template>