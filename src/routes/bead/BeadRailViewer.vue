<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits<{ (e: 'interaction-end'): void }>()

const { BeadScene } = await import('./BeadScene')
const scene = new BeadScene({ onInteractionEnd() { emit('interaction-end') } })
await scene.load()
const container = $ref<HTMLElement>()
onMounted(() => scene.init(container))
onBeforeUnmount(() => window.setTimeout(scene.dispose, 1000))
</script>

<template>
    <div ref="container" class="min-w-0 min-h-0" />
</template>