<script setup lang="ts">
import { watch, ref, reactive, onMounted, onUnmounted } from "vue";
const { createScene } = await import('./crowScene')

const props = defineProps({
  scale: {
    type: Number,
    default: 1
  }
})

const state = reactive({
  isLoaded: false,
})

const canvas = ref()
const root = ref()

const scene = await createScene()

async function init(root, canvas) {
  await scene.init(root, canvas, props.scale)
  state.isLoaded = true
}

watch(() => props.scale, scene.setScale)
onMounted(() => init(root.value, canvas.value))
onUnmounted(() => scene.destroy())
</script>

<template>
  <div ref="root" class="user-select-none relative">
    <canvas
      ref="canvas"
      class="transition duration-500 absolute inset-0"
      :class="{ 'opacity-0': !state.isLoaded }"
    />
  </div>
</template>