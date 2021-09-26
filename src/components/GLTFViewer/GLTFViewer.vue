<script setup>
import { ref, onMounted, watchEffect, onUnmounted } from "vue"

const container = ref()
const canvas = ref()

const props = defineProps({
    gltf: { type: String, required: true },
    environment: { type: String, default: '/assets/pedestrian-overpass.hdr' },
    rotate: { type: Boolean, default: false },
    zoomable: { type: Boolean, default: false },
    pannable: { type: Boolean, default: false },
})

const emit = defineEmits(['interacted'])

const doesAnimate = props.rotate

let THREE, OrbitControls
let gltf, environmentTexture
let camera, scene, renderer, controls, mixer
let lastTime

await load()

onMounted(() => {
    init()
    render()

    if (doesAnimate) {
        window.requestAnimationFrame(loop)
    }
})

onUnmounted(() => {
    if (doesAnimate) {
        window.cancelAnimationFrame(loop)
    }
    renderer.dispose()
    environmentTexture?.dispose()
})

watchEffect(() => {
    if (controls) {
        controls.enableZoom = props.zoomable
        controls.enablePan = props.pannable
    }
})

function convertBlenderLightUnitsToThreeUnits(units) {
    return units / 300
}

async function load() {
    const pTHREE = import('three/build/three.module');
    const pGLTFLoader = import('three/examples/jsm/loaders/GLTFLoader')
    const pDRACOLoader = import( 'three/examples/jsm/loaders/DRACOLoader')
    const pOrbitControls = import( 'three/examples/jsm/controls/OrbitControls.js')

    THREE = await pTHREE
    const { GLTFLoader } = await pGLTFLoader
    const { DRACOLoader } = await pDRACOLoader
    const o = await pOrbitControls
    OrbitControls = o.OrbitControls

    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
    gltfLoader.setDRACOLoader(dracoLoader)
    const pGLTF = gltfLoader.loadAsync(props.gltf)

    let pEnvirontmentTexture
    if (props.environment.endsWith('.exr')) {
        const { EXRLoader } = await import( 'three/examples/jsm/loaders/EXRLoader')
        pEnvirontmentTexture = new EXRLoader().loadAsync(props.environment)
    } 
    else if (props.environment.endsWith('.hdr')) {
        const { RGBELoader } = await import( 'three/examples/jsm/loaders/RGBELoader')
        pEnvirontmentTexture = new RGBELoader().loadAsync(props.environment)
    }
    
    environmentTexture = await pEnvirontmentTexture
    gltf = await pGLTF
}

function init () {
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        canvas: canvas.value,
        alpha: true,
    })
    renderer.physicallyCorrectLights = true;
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
            o.material.envMapIntensity *= 1
        }
    })

    camera = gltf.cameras[0]
    if (camera.parent) {
        camera.position.copy(camera.parent.position)
        camera.quaternion.copy(camera.parent.quaternion)
        camera.scale.copy(camera.parent.scale)
    }
    const cameraTarget = gltf.scene.children.find(o => o.userData.name === 'CameraTarget')
    scene.add(camera)

    controls = new OrbitControls(camera, canvas.value);
    if (cameraTarget) {
        controls.target.copy(cameraTarget.position)
    }
    controls.addEventListener('start', () => {emit('interacted')})
    controls.enablePan = props.pannable
    controls.enableZoom = props.zoomable
    controls.enableDamping = true
    const distance = cameraTarget?.position.distanceTo(camera.position) ?? 10
    controls.minDistance = distance
    controls.maxDistance = distance
    controls.minPolarAngle = Math.PI * 0.25
    controls.maxPolarAngle = Math.PI * 0.5
    controls.update()
    controls.autoRotate = props.rotate

    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()
    const cubeRenderTarget = pmremGenerator.fromEquirectangular(environmentTexture)
    const envMap = cubeRenderTarget.texture ?? null
    scene.environment = envMap
    environmentTexture.dispose()

    if (gltf.animations.length) {
        mixer = new THREE.AnimationMixer(scene)
        gltf.animations.forEach(clip => {
            mixer.clipAction(clip).play();
        })
    } 

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

function loop(time) {
    if (lastTime === undefined)
        lastTime = time
    const deltaTime = (time - lastTime) / 1_000

    mixer?.update(deltaTime)
    controls?.update()

    render()

    lastTime = time

    window.requestAnimationFrame(loop)
}
</script>


<template>
    <div ref="container" class="min-w-0 min-h-0">
        <canvas ref="canvas"/>
    </div>
</template>