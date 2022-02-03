<script setup lang="ts">
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { ref, onMounted, watchEffect, watch, onUnmounted } from "vue"

const props = withDefaults(defineProps<{
    gltf: string,
    environment: string,
    environmentBackground?: boolean,
    clearColor?: string,
    autoRotate?: boolean,
    rotatable?: boolean,
    zoomable?: boolean,
    pannable?: boolean,
}>(), {
    environment: "/pedestrian-overpass.hdr",
    environmentBackground: false,
    autoRotate: false,
    rotatable: false,
    zoomable: false,
    pannable: false,
})

const emit = defineEmits<{
    (event: 'interacted'): void,
    (event: 'interacted-end'): void,
    (event: 'before-render'): void,
    (event: 'after-init', scene: THREE.Scene, gltf: GLTF): void,
}>()

const { GLTFViewerScene } = await import("./GLTFViewerScene")
const scene = new GLTFViewerScene({
    gltfSrc: props.gltf,
    pannable: props.pannable,
    rotatable: props.rotatable,
    zoomable: props.zoomable,
    autoRotate: props.autoRotate,
    clearColor: props.clearColor,
    environment: props.environment,
    environmentIsBackground: props.environmentBackground,
    onInteractionStart() { emit('interacted') },
    onInteractionEnd() { emit('interacted-end') },
    onAfterInit(scene, gltf) { emit('after-init', scene, gltf) },
    onUpdate() { emit('before-render') },
})
await scene.load()

const container = ref<HTMLElement>()
onMounted(() => {
    scene.init(container.value)
})
onUnmounted(() => {
    scene.dispose()
})
watchEffect(() => {
    if (!scene?.controls) return
    scene.controls.enableZoom = props.zoomable
    scene.controls.enablePan = props.pannable
    scene.controls.enableRotate = props.rotatable
    scene.controls.autoRotate = props.autoRotate
})
watch(() => props.environment, src => {
    if (!scene) return
    scene.setEnvironment(src)
})
</script>


<template>
    <div ref="container" class="min-w-0 min-h-0"></div>
</template>