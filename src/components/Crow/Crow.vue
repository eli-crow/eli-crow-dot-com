<script setup>
import { watch, onMounted, ref, reactive } from "vue";
const {default: scene} = await import('./crowScene.js')

const props = defineProps({
  scale: {
    type: Number,
    default: 1
  }
})

const state = reactive({
  isLoaded: false
})

const canvas = ref()
const root = ref()
watch(() => props.scale, scene.setScale)

await scene.load()
onMounted(async () => {
  await scene.init(root.value, canvas.value, props.scale)
  state.isLoaded = true
})
</script>

<template>
  <div ref="root" class="user-select-none">
    <canvas ref="canvas" class="transition duration-500 absolute inset-0" :class="{'opacity-0': !state.isLoaded}"/>
  </div>
</template>