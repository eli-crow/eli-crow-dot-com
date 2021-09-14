<script setup>
import { watch, ref, reactive } from "vue";
import Modal from '../Modal.vue'
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

watch(() => props.scale, scene.setScale)
watch(canvas, async (nv, ov) => {
  if (nv && !ov) {
    await scene.init(root.value, canvas.value, props.scale, true)
    state.isLoaded = true
  }
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