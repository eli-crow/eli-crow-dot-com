<script setup lang="ts">
import { useSlots } from "vue";
import * as icons from './icons';

const props = defineProps<{
  icon: keyof typeof icons
}>();

const slots = useSlots()

const { w, h, d, title } = icons[props.icon]
</script>

<template>
  <svg :viewBox="`0 0 ${w} ${h}`" class="inline-block h-[1em] overflow-visible">
    <title v-if="slots.default"><slot/></title>
    <path :d="d" fill="currentColor" />
  </svg>
</template>