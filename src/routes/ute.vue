<script setup>
import { reactive } from "vue"
import GLTFViewer from '../components/GLTFViewer/GLTFViewer.vue'
import TheShowoffPage from '../components/TheShowoffPage.vue'
import InteractionHint from '../components/InteractionHint.vue'

const state = reactive({
  showHint: true
})
</script>

<template>
  <TheShowoffPage>
    <template #description>
      <div class="flex gap-3 items-center mb-5">
        <router-link to="/" title="Back" class="icon-button text-gray-800 flex items-center justify-center p-4 -m-4 -mr-2 text-lg">
            <Icon icon="chevronLeft" />
        </router-link>
        <h1 class="font-light text-2xl text-gray-800 leading-[1.42] flex-1">Ute</h1>
      </div>

      <p class="mb-5 gooey-text text-lg">
        <a class="gooey-text-inner" href="https://www.youtube.com/watch?v=9i2eZaJsC7g" target="_blank">Chuck 'er in the ute, eh?</a>
      </p>
      
      <p class="mb-6">This cute little ute was the first 3D project I thought was worth sharing. Modeling hard surfaces is more technical than I expected. I was suprised to learn how much goes into making surfaces look natural. Thanks go out to the generous Blender community for many YouTube tutorials.</p> 

      <p class="mb-2"><Icon icon="clock">Created:</Icon> <time>2021</time></p>
      <p><Icon icon="wrench">Tools used:</Icon> Blender, THREE.js</p>
    </template>

    <template #content>
      <GLTFViewer 
        gltf="/assets/ute.glb" 
        environment="/assets/pedestrian-overpass.hdr" 
        rotate
        class="w-full h-full md:max-w-[40rem] md:max-h-[40rem] min-w-0 min-h-0"
        @interacted="state.showHint = false"/>
      
      <InteractionHint :visible="state.showHint" icon="threeD" class="absolute bottom-0">
        <span class="coarse:hidden">Drag</span><span class="fine:hidden">Swipe</span> to rotate
      </InteractionHint>
    </template>
  </TheShowoffPage>
</template>