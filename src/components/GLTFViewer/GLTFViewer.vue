<script setup>
import { ref, onMounted } from "vue"
import envTextureUrl from './pedestrian_overpass_1k.hdr'

const container = ref()
const canvas = ref()

const props = defineProps({
    gltf: {
        type: String,
        required: true,
    },
})

let THREE, OrbitControls
let gltf, environmentTexture
let camera, scene, renderer

await load()

onMounted(() => {
    init()
    render()
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

    camera = gltf.cameras[1]
    camera.position.copy(camera.parent.position)
    camera.quaternion.copy(camera.parent.quaternion)
    camera.scale.copy(camera.parent.scale)
    scene.add(camera)

    const controls = new OrbitControls(camera, canvas.value);
    controls.addEventListener('change', render)
    controls.minDistance = 20
    controls.maxDistance = 20
    controls.target.set(-.8, 0.4, 0)
    controls.update()

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
</script>


<template>
    <div ref="container">
        <canvas ref="canvas"/>
    </div>
</template>