<script setup>
import { BezierSpline } from '../../lib/bezier.js'
import * as V from '../../lib/v.js'

import { onMounted, reactive, ref, watch, computed } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  min: { type: [Number, String], default: 0 },
  max: { type: [Number, String], default: 1 },
  step: { type: [Number, String], default: 0.0001 },
  modelValue: { type: Number, default: 0 },
  spline: { type: Array, required: true },
})
const state = reactive({
  mounted: false,
  progressDashOffset: 0,
  thumbRadius: 12,
  pathData: '',
  thumbPosition: [0, 0],
  currentT: 0,
})
const trackSpline = ref()
const root = ref()

onMounted(() => {
  state.mounted = true
  redraw()
  window.addEventListener('resize', redraw)
})
watch(() => props.spline, updateCurve, { deep: true })
watch(() => props.modelValue, updateThumbAndOffset)
const currentT = computed(() => {
  const min = Number(props.min)
  const max = Number(props.max)
  const range = max - min
  if (range === 0) return 0
  else return (props.modelValue - min) / range
})

function redraw() {
  updateCurve()
  updateThumbAndOffset()
  state.thumbRadius = window.innerWidth < 700
    ? 16
    : 12
}

function updateCurve() {
  if (!root.value) return
  const { width, height } = root.value.getBoundingClientRect()
  const spline = props.spline.map(curve => {
    const sizedCurve = curve.map((v, i) => i % 2 === 0 ? v * width : v * height)
    return sizedCurve
  })
  trackSpline.value = new BezierSpline(spline)
  state.pathData = trackSpline.value.getSvgPathData()
  updateThumbAndOffset()
}

function updateThumbAndOffset() {
  const splineLength = trackSpline.value.getLength()
  state.progressDashOffset = 99999 - splineLength * currentT.value
  state.thumbPosition = trackSpline.value.getPointAt(currentT.value)
}

function handleThumbDown(ev) {
  const bb = root.value.getBoundingClientRect()
  const downPt = [ev.clientX - bb.left, ev.clientY - bb.top]
  const downThumbPt = [...state.thumbPosition]

  const move = ev => {
    if (!root.value) {
      up()
      return
    }
    const bb = root.value.getBoundingClientRect()
    const movePt = [ev.clientX - bb.left, ev.clientY - bb.top]
    const diff = V.sub(movePt, downPt)
    const newPos = V.add(downThumbPt, diff)

    const min = Number(props.min)
    const max = Number(props.max)
    const nearestT = trackSpline.value.getNearestTInWindingOrder(currentT.value, newPos)
    const newVal = nearestT * max - min
    emit('update:modelValue', newVal)
  }

  const up = () => {
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
    <svg v-if="state.mounted" class="overflow-visible w-full">
      <!-- track -->
      <path
        class="fill-none stroke-[6px] stroke-gray-100 dark:stroke-gray-400 fill-[none]"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
        :d="state.pathData"
      />

      <!-- track progress -->
      <path
        class="fill-none stroke-[6px] stroke-teal fill-[none]"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
        :d="state.pathData"
        stroke-dasharray="99999"
        :stroke-dashoffset="state.progressDashOffset"
      />

      <!-- thumb -->
      <circle
        class="fill-white drop-shadow-lg dark:drop-shadow-none dark:stroke-[2px] stroke-gray-100 active:!stroke-[hsla(209,73%,59%,1)]"
        :cx="state.thumbPosition[0]"
        :cy="state.thumbPosition[1]"
        :r="state.thumbRadius"
        @pointerdown.stop.prevent="handleThumbDown"
        @touchstart.stop.prevent.capture
      />
    </svg>
  </div>
</template>