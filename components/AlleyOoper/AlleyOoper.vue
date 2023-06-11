<script setup lang="ts">
import { BezierSpline, SplineDescription } from '../../lib/bezier';
import * as V from '../../lib/v';

import { computed, onMounted, watch } from 'vue';
import { lerp, unlerp } from '../../lib/utilities';

const MAX_DASH_OFFSET = 99999

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const props = withDefaults(defineProps<{
  spline: SplineDescription,
  min?: number,
  max?: number,
  modelValue?: number,
}>(), {
  min: 0,
  max: 1,
  modelValue: 0,
})

const progressDashOffset = ref(0)
const thumbRadius = ref(12)
const thumbPosition = ref<V.Vec>([0, 0])
const targetPosition = ref<V.Vec | null>(null)
const trackSpline = ref<BezierSpline | null>(null)
const pathData = computed(() => trackSpline.value?.getSvgPathData() ?? '')
const root = ref<HTMLElement | null>(null)

const currentT = computed(() => unlerp(props.modelValue, props.min, props.max))

onMounted(() => {
  redraw()
  window.addEventListener('resize', redraw)
})
watch(() => props.spline, updateCurve, { deep: true })
watch(() => props.modelValue, updateThumbAndOffset)

function redraw() {
  updateCurve()
  updateThumbAndOffset()
  thumbRadius.value = window.innerWidth < 700 ? 16 : 12
}

function updateCurve() {
  if (root.value === null) return
  const { width, height } = root.value.getBoundingClientRect()
  const sizedSpline = props.spline.map(curve => curve.map((v, i) => i % 2 === 0 ? v * width : v * height)) as SplineDescription
  trackSpline.value = new BezierSpline(sizedSpline)
  updateThumbAndOffset()
}

function updateThumbAndOffset() {
  if (trackSpline.value === null) return
  const splineLength = trackSpline.value.getLength()
  progressDashOffset.value = MAX_DASH_OFFSET - splineLength * currentT.value
  thumbPosition.value = trackSpline.value.getPointAt(currentT.value)!
}

function handleThumbDown(e: PointerEvent) {
  if (root.value === null) return

  const bb = root.value.getBoundingClientRect()
  const downPt: V.Vec = [e.clientX - bb.left, e.clientY - bb.top]
  const downThumbPt: V.Vec = [...thumbPosition.value]

  const move = (e: PointerEvent) => {
    if (root.value === null || trackSpline.value === null) {
      up();
      return
    }
    const bb = root.value.getBoundingClientRect()
    const movePt: V.Vec = [e.clientX - bb.left, e.clientY - bb.top]
    const diff = V.sub(movePt, downPt)
    targetPosition.value = V.add(downThumbPt, diff)

    const nearestT = trackSpline.value.getNearestTInWindingOrder(currentT.value, targetPosition.value)!
    const newVal = lerp(props.min, props.max, nearestT)
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
  <svg class="overflow-visible w-full" ref="root">
    <!-- track -->
    <path class="fill-none stroke-[6px] stroke-gray-100 dark:stroke-gray-400"
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
          :d="pathData" />

    <!-- track progress -->
    <path class="fill-none stroke-[6px] stroke-teal"
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
          :d="pathData"
          :stroke-dasharray="MAX_DASH_OFFSET"
          :stroke-dashoffset="progressDashOffset" />

    <!-- drag line -->
    <line v-if="targetPosition"
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
    <circle class="fill-white drop-shadow-lg dark:drop-shadow-none dark:stroke-[2px] stroke-gray-100 active:!stroke-[hsla(209,73%,59%,1)]"
            :cx="thumbPosition[0]"
            :cy="thumbPosition[1]"
            :r="thumbRadius"
            @pointerdown.stop.prevent="handleThumbDown"
            @touchstart.stop.prevent.capture />
  </svg>
</template>