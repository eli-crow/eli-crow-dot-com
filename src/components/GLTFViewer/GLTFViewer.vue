<script setup lang="ts">
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { onMounted, onUnmounted, ref, watch, watchEffect } from "vue";

import theme from '../../store/theme';

const {
    gltf,
    clearColor,
    environment = "/assets/studio.exr",
    lightEnvironment = "/assets/studio-light.exr",
    environmentIsBackground = false,
    autoRotate = false,
    rotatable = false,
    zoomable = false,
    pannable = false,
} = defineProps<{
    gltf: string,
    environment?: string,
    lightEnvironment?: string | null,
    environmentIsBackground?: boolean,
    clearColor?: string,
    autoRotate?: boolean,
    rotatable?: boolean,
    zoomable?: boolean,
    pannable?: boolean,
}>()

const emit = defineEmits<{
    (event: 'interaction-end'): void,
    (event: 'interacted-end'): void,
    (event: 'before-render'): void,
    (event: 'after-init', scene: THREE.Scene, gltf: GLTF): void,
}>()

const { GLTFViewerScene } = await import("./GLTFViewerScene")
const scene = new GLTFViewerScene({
    gltf, pannable, rotatable, zoomable, autoRotate, clearColor, environmentIsBackground,
    environment: lightEnvironment && theme.theme === 'light' ? lightEnvironment : environment,
    onInteractionStart() { emit('interaction-end') },
    onInteractionEnd() { emit('interacted-end') },
    onAfterInit(scene, gltf) { emit('after-init', scene, gltf) },
    onUpdate() { emit('before-render') },
})
await scene.load()

const container = ref<HTMLElement>()
onMounted(() => {
    scene.init(container.value!)
})
onUnmounted(() => {
    // wait for any transitions to complete
    window.setTimeout(scene.dispose, 500)
})
watchEffect(() => {
    if (!scene?.controls) return
    scene.controls.enableZoom = zoomable
    scene.controls.enablePan = pannable
    scene.controls.enableRotate = rotatable
    scene.controls.autoRotate = autoRotate
})
watch(() => environment, src => {
    if (!scene) return
    scene.setEnvironment(src)
})
watch(() => [theme.theme, lightEnvironment, environment], () => {
    if (lightEnvironment && theme.theme === 'light') {
        scene.setEnvironment(lightEnvironment)
    } else {
        scene.setEnvironment(environment)
    }
})
</script>

<template>
    <div ref="container" class="min-w-0 min-h-0"></div>
</template>