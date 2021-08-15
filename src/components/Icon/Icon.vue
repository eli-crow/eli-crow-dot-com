<script setup>
import { defineProps } from 'vue';
import * as icons from './icons.js';
const props = defineProps({
  icon: {
    type: String,
    required: true
  }
});
const { w, h, d } = icons[props.icon]
</script>

<template>
  <svg :width="w" :height="h" :viewBox="`0 0 ${w} ${h}`">
    <path :d="d" fill="currentColor" />
  </svg>
</template>

<style scoped>
svg {
  height: 1em;
  overflow: visible;
}
</style>