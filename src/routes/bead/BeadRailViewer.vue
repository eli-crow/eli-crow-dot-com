<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits<{ (e: 'interacted'): void }>()

const { BeadScene } = await import('./BeadScene')
const scene = new BeadScene({ onInteractionStart() { emit('interacted') } })
await scene.load()
const container = ref<HTMLElement>()
onMounted(() => scene.init(container.value))
onUnmounted(() => scene.dispose())
</script>

<template>
    <div ref="container" class="min-w-0 min-h-0" />
</template>