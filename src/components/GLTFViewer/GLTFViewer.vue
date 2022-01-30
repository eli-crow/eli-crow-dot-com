<script setup lang="ts">
//@ts-nocheck -- too many typing errors from three

// This is a home-rolled gltf viewer. It handles loading, common controls, and 

import { ref, computed, onMounted, watchEffect, watch, onUnmounted } from "vue"

const container = ref()
const canvas = ref()

const props = defineProps({
    gltf: { type: String, required: true },
    environment: { type: String, default: "/pedestrian-overpass.hdr" },
    environmentBackground: { type: Boolean, default: false },
    clearColor: { type: String, required: false },
    autoRotate: { type: Boolean, default: false },
    rotatable: { type: Boolean, default: false },
    zoomable: { type: Boolean, default: false },
    pannable: { type: Boolean, default: false },
})

const emit = defineEmits(['interacted', 'before-render', 'after-init'])

let THREE, OrbitControls
let gltf, environmentTexture
let camera, scene, renderer, controls, mixer
let lastTime

const doesAnimate = computed(() => props.autoRotate)

await load()

onMounted(() => {
    init()
    render()

    if (doesAnimate.value) {
        window.requestAnimationFrame(loop)
    }
})

onUnmounted(() => {
    window.cancelAnimationFrame(loop)
    renderer.dispose()
    environmentTexture?.dispose()
})

watchEffect(() => {
    if (controls) {
        controls.enableZoom = props.zoomable
        controls.enablePan = props.pannable
    }
})

watch(() => props.environment, src => {
    updateEnvironmentMapFromSrc(src)
})

function convertBlenderLightUnitsToThreeUnits(watts) {
    return (683 * watts) / (4 * Math.PI)
}

async function loadEnvironmentTexture(src) {
    let pEnvirontmentTexture
    if (src.endsWith('.exr')) {
        const { EXRLoader } = await import('three/examples/jsm/loaders/EXRLoader')
        pEnvirontmentTexture = new EXRLoader().loadAsync(src)
    }
    else if (src.endsWith('.hdr')) {
        const { RGBELoader } = await import('three/examples/jsm/loaders/RGBELoader')
        pEnvirontmentTexture = new RGBELoader().loadAsync(src)
    }
    else {
        throw new Error("Enviornment map extension not supported: `${src}`")
    }
    return pEnvirontmentTexture
}

function updateEnvironmentMapFromTexture(environmentTexture) {
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()
    environmentTexture.mapping = THREE.EquirectangularReflectionMapping
    const cubeRenderTarget = pmremGenerator.fromEquirectangular(environmentTexture)
    const envMap = cubeRenderTarget.texture ?? null

    scene.environment = envMap
    scene.background = props.environmentBackground
        ? environmentTexture
        : null
}

async function updateEnvironmentMapFromSrc(src) {
    environmentTexture = await loadEnvironmentTexture(src)
    updateEnvironmentMapFromTexture(environmentTexture)
    render()
}

async function load() {
    const pTHREE = import('three/build/three.module')
    const pGLTFLoader = import('three/examples/jsm/loaders/GLTFLoader')
    const pDRACOLoader = import('three/examples/jsm/loaders/DRACOLoader')
    const pOrbitControls = import('three/examples/jsm/controls/OrbitControls.js')

    const { GLTFLoader } = await pGLTFLoader
    const { DRACOLoader } = await pDRACOLoader

    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
    gltfLoader.setDRACOLoader(dracoLoader)
    const pGLTF = gltfLoader.loadAsync(props.gltf)

    const pEnvirontmentTexture = loadEnvironmentTexture(props.environment)

    THREE = await pTHREE
    gltf = await pGLTF
    OrbitControls = (await pOrbitControls).OrbitControls
    environmentTexture = await pEnvirontmentTexture
}

function init() {
    renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true,
        canvas: canvas.value,
        alpha: !(props.environmentBackground || props.clearColor),
    })
    if (props.clearColor) renderer.setClearColor(new THREE.Color(props.clearColor))
    renderer.physicallyCorrectLights = true
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.outputEncoding = THREE.sRGBEncoding

    scene = new THREE.Scene()
    scene.add(gltf.scene)
    scene.traverse(o => {
        //objects otherwise disappear at certain angles
        o.frustumCulled = false

        //fix lights by adjusting blender's units
        if (o.type === 'PointLight') {
            o.intensity = convertBlenderLightUnitsToThreeUnits(o.intensity)
        }

        if (o.material?.envMapIntensity) {
            o.material.toneMapped = false
        }
    })

    camera = gltf.cameras[0]
    if (!camera) throw new Error("The loaded scene must have a camera.")
    if (camera.parent) {
        camera.position.copy(camera.parent.position)
        camera.quaternion.copy(camera.parent.quaternion)
        camera.scale.copy(camera.parent.scale)
    }
    scene.add(camera)

    controls = new OrbitControls(camera, canvas.value)
    const cameraTarget = gltf.scene.children.find(o => o.userData.name === 'CameraTarget')
    if (cameraTarget) {
        controls.target.copy(cameraTarget.position)
    }
    controls.addEventListener('start', () => { emit('interacted') })
    controls.enablePan = props.pannable
    controls.enableZoom = props.zoomable
    controls.enableRotate = props.rotatable
    if (doesAnimate.value) controls.enableDamping = true
    const distance = cameraTarget?.position.distanceTo(camera.position) ?? 10
    if (props.zoomable) {
        controls.minDistance = distance * .5
        controls.maxDistance = distance * 2
    } else {
        controls.minDistance = distance
        controls.maxDistance = distance
    }
    controls.minPolarAngle = Math.PI * 0.25
    controls.maxPolarAngle = Math.PI * 0.75
    controls.update()
    controls.autoRotate = props.autoRotate
    if (!doesAnimate.value) {
        controls.addEventListener('change', render)
    }

    updateEnvironmentMapFromTexture(environmentTexture)

    if (gltf.animations.length) {
        mixer = new THREE.AnimationMixer(scene)
        gltf.animations.forEach(clip => {
            mixer.clipAction(clip).play()
        })
    }

    emit('after-init', THREE, scene, gltf, renderer, render)

    window.addEventListener('resize', handleResize)
    handleResize()
}

function render() {
    renderer.render(scene, camera)
}

function handleResize() {
    if (!container.value) return

    const { clientWidth: w, clientHeight: h } = container.value

    renderer.setSize(w, h)

    camera.aspect = w / h
    camera.updateProjectionMatrix()

    render()
}

function loop(time) {
    if (lastTime === undefined)
        lastTime = time
    const deltaTime = (time - lastTime) / 1_000

    mixer?.update(deltaTime)
    controls?.update()
    emit('before-render', THREE, scene)

    render()

    lastTime = time

    window.requestAnimationFrame(loop)
}
</script>


<template>
    <div ref="container" class="min-w-0 min-h-0">
        <canvas ref="canvas" />
    </div>
</template>