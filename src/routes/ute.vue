<script setup>
import { reactive } from "vue"
import GLTFViewer from '../components/GLTFViewer/GLTFViewer.vue'
import TheShowoffPage from '../components/TheShowoffPage.vue'
import InteractionHint from '../components/InteractionHint.vue'
import { Vector2 } from "three/build/three.module"

const state = reactive({
  showHint: true
})

let road

function afterInit(THREE, scene, gltf) {
  const roadTexture = THREE.ImageUtils.loadTexture("/assets/road.webp")
  roadTexture.wrapS = THREE.RepeatWrapping
  roadTexture.wrapT = THREE.RepeatWrapping
  const roadGeometery = new THREE.PlaneGeometry(4, 16)
  const roadMaterial = new THREE.ShaderMaterial({
    uniforms: {
      offset: {value: 0},
      tex: { type: "t", value: roadTexture}
    },
    vertexShader: `
      uniform float offset;
      varying vec2 vUv;
      varying vec3 vPos;
			void main() {
				vUv = (uv + vec2(0.0, offset)) * vec2(1.0, 2.0);
        vPos = position;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}`,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPos;
			uniform sampler2D tex;

			void main() {
        gl_FragColor = texture2D( tex, vUv );
				gl_FragColor.a *= 1.0 - clamp(length(vPos.xy) / 5.0, 0.0, 1.0);
			}
    `,
  })
  roadMaterial.transparent = true
  road = new THREE.Mesh(roadGeometery, roadMaterial)
  road.rotation.x = Math.PI * -0.5
  scene.add(road)
}

function beforeRender(THREE, scene) {
  road.material.uniforms.offset.value -= 0.005
}
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
        @after-init="afterInit"
        @before-render="beforeRender"
        @interacted="state.showHint = false"/>
      
      <InteractionHint :visible="state.showHint" icon="threeD" class="absolute bottom-0">
        <span class="coarse:hidden">Drag</span><span class="fine:hidden">Swipe</span> to rotate
      </InteractionHint>
    </template>
  </TheShowoffPage>
</template>