<script setup>
import { watch, ref, reactive, onMounted } from "vue";
const {default: scene} = await import('./crowScene.js')

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

await scene.load()

async function init(root, canvas) {
  console.log(root, canvas)
  await scene.init(root, canvas, props.scale, true)
  state.isLoaded = true
}

watch(() => props.scale, scene.setScale)
onMounted(() => {
  init(root.value, canvas.value)
})
</script>

<template>
  <div 
    ref="root" 
    class="user-select-none relative"
  >
    <canvas 
      ref="canvas" 
      class="transition duration-500 absolute inset-0" 
      :class="{'opacity-0': !state.isLoaded}"
    />
  </div>
</template>