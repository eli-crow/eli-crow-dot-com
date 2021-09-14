<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import envTextureUrl from './pedestrian_overpass_1k.hdr'

const container = ref()
const canvas = ref()

const props = defineProps({
    gltf: {
        type: String,
        required: true,
    },
    rotate: {
        type: Boolean,
        default: false,
    },
})

const doesAnimate = props.rotate

let THREE, OrbitControls
let gltf, environmentTexture
let camera, scene, renderer, controls

await load()

onMounted(() => {
    init()
    render()
    if (doesAnimate) {
        window.requestAnimationFrame(loop)
    }
})

onBeforeUnmount(() => {
    if (doesAnimate) {
        window.cancelAnimationFrame(loop)
    }
})

async function load() {
    const pTHREE = import('three/build/three.module');
    const pGLTFLoader = import('three/examples/jsm/loaders/GLTFLoader')
    const pRGBELoader = import( 'three/examples/jsm/loaders/RGBELoader')
    const pDRACOLoader = import( 'three/examples/jsm/loaders/DRACOLoader')
    const pOrbitControls = import( 'three/examples/jsm/controls/OrbitControls.js')

    THREE = await pTHREE
    const { GLTFLoader } = await pGLTFLoader
    const { DRACOLoader } = await pDRACOLoader
    const { RGBELoader } = await pRGBELoader
    const o = await pOrbitControls
    OrbitControls = o.OrbitControls

    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    const rgbeLoader = new RGBELoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
    gltfLoader.setDRACOLoader(dracoLoader)

    const pEnvirontmentTexture = rgbeLoader.loadAsync(envTextureUrl)
    const pGLTF = gltfLoader.loadAsync(props.gltf)
    
    environmentTexture = await pEnvirontmentTexture
    gltf = await pGLTF
}

function init () {
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        canvas: canvas.value,
        alpha: true,
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.outputEncoding = THREE.sRGBEncoding

    scene = new THREE.Scene()
    scene.add(gltf.scene)

    // TODO: next time you add a model, figure out how you want to disambiguate cameras
    camera = gltf.cameras[0]
    camera.position.copy(camera.parent.position)
    camera.quaternion.copy(camera.parent.quaternion)
    camera.scale.copy(camera.parent.scale)
    scene.add(camera)

    controls = new OrbitControls(camera, canvas.value);
    controls.addEventListener('change', render)
    controls.enablePan = false
    controls.enableZoom = false
    controls.enableDamping = true
    controls.minDistance = 32
    controls.maxDistance = 32
    controls.minPolarAngle = Math.PI * 0.25
    controls.maxPolarAngle = Math.PI * 0.5
    controls.target.set(0, 1.1, 0)
    controls.update()
    controls.autoRotate = props.rotate

    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()
    const cubeRenderTarget = pmremGenerator.fromEquirectangular(environmentTexture)
    const envMap = cubeRenderTarget.texture ?? null
    scene.environment = envMap
    
    environmentTexture.dispose()

    window.addEventListener('resize', handleResize)
    handleResize()
}

function render() {
    renderer.render(scene, camera)
}

function handleResize() {
    const {clientWidth: w, clientHeight: h} = container.value
    camera.aspect = w / h
    camera.updateProjectionMatrix()

    renderer.setSize(w, h)
    
    render()
}

function loop() {
    window.requestAnimationFrame(loop)

    controls.update()

    render()
}
</script>


<template>
    <div ref="container">
        <canvas ref="canvas"/>
    </div>
</template>