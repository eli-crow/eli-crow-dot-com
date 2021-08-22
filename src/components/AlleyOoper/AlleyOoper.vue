<script setup>
import { BezierSpline } from '../../lib/bezier.js';
import * as V from '../../lib/v.js';

import { defineEmits, defineProps, onMounted, nextTick, reactive, ref, watch, computed, onBeforeUnmount } from 'vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  min: { type: [Number, String], default: 0 },
  max: { type: [Number, String], default: 1 },
  step: { type: [Number, String], default: 0.0001 },
  modelValue: { type: Number, default: 0 },
  spline: { type: Array, required: true },
});
const state = reactive({
  mounted: false,
  progressDashOffset: 0,
  pathData: '',
  thumbPosition: [0, 0],
  currentT: 0,
});
const trackSpline = ref();
const root = ref();
const trackRef = ref();

onMounted(() => {
  state.mounted = true;
  updateCurve();
  updateThumbAndOffset();
  window.addEventListener('resize', () => {
    updateCurve();
    updateThumbAndOffset();
  });
});
watch(() => props.spline, updateCurve, { deep: true });
watch(() => props.modelValue, updateThumbAndOffset);
const currentT = computed(() => {
  const min = Number(props.min);
  const max = Number(props.max);
  const range = max - min;
  if (range === 0) return 0;
  else return (props.modelValue - min) / range;
});

function updateCurve() {
  if (!root.value) return;
  const { width, height } = root.value.getBoundingClientRect();
  const spline = props.spline.map(curve => {
    const sizedCurve = curve.map((v, i) => i % 2 === 0 ? v * width : v * height);
    return sizedCurve;
  });
  trackSpline.value = new BezierSpline(spline);
  state.pathData = trackSpline.value.getSvgPathData();
  updateThumbAndOffset();
}

function updateThumbAndOffset() {
  const splineLength = trackSpline.value.getLength();
  state.progressDashOffset = 99999 - splineLength * currentT.value;
  state.thumbPosition = trackSpline.value.getPointAt(currentT.value);
}

function handleThumbDown(ev) {
  const bb = root.value.getBoundingClientRect();
  const downPt = [ev.clientX - bb.left, ev.clientY - bb.top];
  const downThumbPt = [...state.thumbPosition];

  const move = ev => {
    if (!root.value) {
      up();
      return;
    }
    const bb = root.value.getBoundingClientRect();
    const movePt = [ev.clientX - bb.left, ev.clientY - bb.top];
    const diff = V.sub(movePt, downPt);
    const newPos = V.add(downThumbPt, diff);

    const min = Number(props.min);
    const max = Number(props.max);
    const nearestT = trackSpline.value.getNearestTInWindingOrder(currentT.value, newPos);
    const newVal = nearestT * max - min;
    emit('update:modelValue', newVal);
  };

  const up = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointercancel', up);
    window.removeEventListener('pointerup', up);
  };

  window.addEventListener('pointermove', move);
  window.addEventListener('pointercancel', up);
  window.addEventListener('pointerup', up);
}
</script>

<template>
  <div
    class="AlleyOoper"
    ref="root">
    <svg
      v-if="state.mounted"
      class="svg">
      <path tab-index="0"
        class="track"
        :d="state.pathData"
        ref="trackRef" />
      <path
        class="track-progress"
        :d="state.pathData"
        stroke-dasharray="99999"
        :stroke-dashoffset="state.progressDashOffset" />
      <circle
        class="thumb"
        :cx="state.thumbPosition[0]"
        :cy="state.thumbPosition[1]"
        r="12"
        @pointerdown.stop.prevent="handleThumbDown"
        @touchstart.stop.prevent.capture />
    </svg>
  </div>
</template>

<style scoped>
.AlleyOoper {
}
.svg {
  overflow: visible;
  width: 100%;
}

.track {
  fill: none;
  stroke: white;
  vector-effect: non-scaling-stroke;
  stroke-width: 6px;
  stroke-linecap: round;
}
.track-progress {
  fill: none;
  stroke: var(--blue);
  vector-effect: non-scaling-stroke;
  stroke-width: 6px;
  stroke-linecap: round;
}
.thumb {
  fill: white;
  stroke-width: 2px;
  vector-effect: non-scaling-stroke;
}
.thumb:active {
  stroke: var(--blue);
}
.thumb:focus {
}
</style>