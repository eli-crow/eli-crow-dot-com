<script setup lang="ts">
import * as THREE from 'three';
import { reactive } from "vue";
import GLTFViewer from '../components/GLTFViewer/GLTFViewer.vue';
import InteractionHint from '../components/InteractionHint.vue';
import TheShowoffPage from '../components/TheShowoffPage.vue';

const state = reactive({
  showHint: true
})

function afterInit(scene: THREE.Scene) {
  // lost the source files, and they've since fixed the lighting issues in three, so just undoing the original hack
  scene.traverse((obj) => {
    if (obj instanceof THREE.Light) {
      obj.intensity *= 0.25
    }
  })
}

</script>

<template>
  <TheShowoffPage title="Losing Sleep"
                  subtitle="I wonder why my spine hurts."
                  description="This was my first attempt at skinning a mesh and rigging it for animation. 3d modelling can look polished and impressive, but there's a huge upfront cost, especially when it's animated! Lesson learned: you better re-use the hell out of the models you create."
                  tools="Blender, THREE.js"
                  time="2021">
    <GLTFViewer gltf="/assets/losing-sleep.glb"
                environment="/assets/studio.exr"
                auto-rotate
                rotatable
                class="w-full h-full md:max-w-[40rem] md:max-h-[40rem] min-w-0 min-h-0"
                @interacted="state.showHint = false"
                @after-init="afterInit" />
    <InteractionHint :visible="state.showHint" icon="threeD" class="absolute bottom-0">
      <span class="coarse:hidden">Drag</span>
      <span class="fine:hidden">Swipe</span> to rotate
    </InteractionHint>
  </TheShowoffPage>
</template>