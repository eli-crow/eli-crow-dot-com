<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";
const { createScene } = await import('./crowScene')

interface CrowProps {
  scale?: number
}

const props = withDefaults(defineProps<CrowProps>(), {
  scale: 1,
});

const isLoaded = ref(false)

const canvas = ref<HTMLCanvasElement | null>(null)
const root = ref<HTMLElement | null>(null)

const scene = await createScene()

async function init(root: HTMLElement, canvas: HTMLCanvasElement) {
  await scene.init(root, canvas, props.scale ?? 1)
  isLoaded.value = true
}

watch(() => props.scale, scale => scale && scene.setScale(scale))
onMounted(() => init(root.value!, canvas.value!))
onUnmounted(() => scene.destroy())
</script>

<template>
  <div ref="root" class="user-select-none relative">
    <canvas ref="canvas"
            class="transition duration-500 absolute inset-0 bg-transparent"
            :class="{ 'opacity-0': !isLoaded }" />
  </div>
</template>