<script setup>
import { BezierCurve } from '../../bezier.js';
import * as V from '../../v.js';

import { defineEmits, defineProps, onMounted, nextTick, reactive, ref, watch } from 'vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  min: { type: [Number, String], default: 0 },
  max: { type: [Number, String], default: 1 },
  step: { type: [Number, String], default: 0.0001 },
  modelValue: { type: Number, default: 0 },
  curvePoints: { type: Array, required: true },
});
const state = reactive({
  mounted: false,
  progressDashOffset: 0,
  pathData: '',
  thumbPosition: [0, 0],
  currentT: 0,
});
const trackCurve = ref(null);
const root = ref();
const track = ref();

onMounted(() => {
  state.mounted = true;
  updateCurve();
  updateThumbAndOffset();
  window.addEventListener('resize', () => {
    updateCurve();
    updateThumbAndOffset();
  });
});
watch(() => props.curvePoints, updateCurve, { deep: true });
watch(() => props.modelValue, updateThumbAndOffset);

function getCurrentT() {
  if (trackCurve.value === null) return 0;
  const min = Number(props.min);
  const max = Number(props.max);
  const range = max - min;
  const nLength = range === 0 ? 0 : (props.modelValue - min) / range;
  const t = trackCurve.value.getTAtNormalizedLength(nLength);
  return t;
}

function updateCurve() {
  const { width, height } = root.value.getBoundingClientRect();
  const [p0x, p0y, c0x, c0y, c1x, c1y, p1x, p1y] = props.curvePoints;
  trackCurve.value = new BezierCurve(
    p0x * width, p0y * height,
    c0x * width, c0y * height,
    c1x * width, c1y * height,
    p1x * width, p1y * height,
  );
  state.pathData = trackCurve.value.getSvgPathData();
  updateThumbAndOffset();
}

function updateThumbAndOffset() {
  //need to allow svg to render before measuring.
  nextTick(() => {
    //OPTIMIZE: could remove dependency on svg api by mapping internal representation to expected width and height
    const totalLengthSvgUnits = track.value?.getTotalLength();
    const length = trackCurve.value.getNormalizedLengthAt(getCurrentT()) * totalLengthSvgUnits;
    const offset = 99999 - length;
    state.progressDashOffset = offset;

    state.thumbPosition = trackCurve.value.getPointAt(getCurrentT());
  });
}

function emitInput(pt) {
  const min = Number(props.min);
  const max = Number(props.max);
  const newT = trackCurve.value.getNearestTInWindingOrder(getCurrentT(), pt);
  const newNormalizedLength = trackCurve.value.getNormalizedLengthAt(newT);
  const newVal = newNormalizedLength * max - min;
  emit('update:modelValue', newVal);
}

function handleThumbDown(ev) {
  const bb = root.value.getBoundingClientRect();
  const downPt = [ev.clientX - bb.left, ev.clientY - bb.top];
  const downThumbPt = [...state.thumbPosition];

  const move = ev => {
    const bb = root.value.getBoundingClientRect();
    const movePt = [ev.clientX - bb.left, ev.clientY - bb.top];
    const diff = V.sub(movePt, downPt);
    const newPos = V.add(downThumbPt, diff);
    emitInput(newPos);
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
  <div class="AlleyOoper" ref="root">
    <svg v-if="state.mounted" class="svg" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <path tab-index="0" class="track" :d="state.pathData" ref="track" />
      <path class="track-progress" :d="state.pathData" stroke-dasharray="99999" :stroke-dashoffset="state.progressDashOffset" />
      <circle class="thumb" :cx="state.thumbPosition[0]" :cy="state.thumbPosition[1]" r="12" @pointerdown.stop.prevent="handleThumbDown" @touchstart.stop.prevent.capture />
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