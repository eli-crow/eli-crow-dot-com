<script setup lang="ts">
import * as THREE from 'three'
import { reactive } from "vue"
import GLTFViewer from '../components/GLTFViewer/GLTFViewer.vue'
import InteractionHint from '../components/InteractionHint.vue'
import TheShowoffPage from '../components/TheShowoffPage.vue'

const state = reactive({
  showHint: true
})

let road: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>

function afterInit(scene: THREE.Scene) {
  // lost the source files, and they've since fixed the lighting issues in three, so just undoing the original hack
  scene.traverse((obj) => {
    if (obj instanceof THREE.Light) {
      obj.intensity *= 0.008
    }
  })

  const roadTexture = new THREE.TextureLoader().load("/assets/road.webp")
  roadTexture.wrapS = THREE.RepeatWrapping
  roadTexture.wrapT = THREE.RepeatWrapping
  const roadGeometery = new THREE.PlaneGeometry(4, 16)
  const roadMaterial = new THREE.ShaderMaterial({
    uniforms: {
      offset: { value: 0 },
      tex: { value: roadTexture }
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

function beforeRender() {
  road.material.uniforms.offset.value -= 0.005
}
</script>

<template>
  <TheShowoffPage title="Ute"
                  subtitle="Chuck 'er in the ute, eh?"
                  tools="Blender, THREE.js"
                  description="This cute little ute was the first 3D project I thought was worth sharing. Modeling hard surfaces is more technical than I expected. I was suprised to learn how much goes into making surfaces look natural. Thanks go out to the generous Blender community for many YouTube tutorials."
                  time="2021">
    <GLTFViewer gltf="/assets/ute.glb"
                environment="/assets/pedestrian-overpass.hdr"
                :light-environment="null"
                auto-rotate
                rotatable
                class="w-full h-full md:max-w-[40rem] md:max-h-[40rem] min-w-0 min-h-0"
                @after-init="afterInit"
                @before-render="beforeRender"
                @interacted="state.showHint = false" />
    <InteractionHint :visible="state.showHint" icon="threeD" class="absolute bottom-0">
      <span class="coarse:hidden">Drag</span>
      <span class="fine:hidden">Swipe</span> to rotate
    </InteractionHint>
  </TheShowoffPage>
</template>