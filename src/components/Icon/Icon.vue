<script setup>
import * as icons from './icons.js';

const props = defineProps({
  icon: {
    type: String,
    required: true
  }
});

const { w, h, d, title } = icons[props.icon]
</script>

<template>
  <svg :width="w" :height="h" :viewBox="`0 0 ${w} ${h}`" class="inline-block h-[1em] overflow-visible">
    <title><slot>{{title}}</slot></title>
    <path :d="d" fill="currentColor" />
  </svg>
</template>