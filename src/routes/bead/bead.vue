<script setup>
import { reactive } from "vue"
import GLTFViewer from '../../components/GLTFViewer/GLTFViewer.vue'
import TheShowoffPage from '../../components/TheShowoffPage.vue'
import InteractionHint from '../../components/InteractionHint.vue'
import model from './bead.glb?url'
import { BezierSpline3D } from "../../lib/bezier3"
import { BezierSpline, BezierCurve } from "../../lib/bezier"
import * as V3 from '../../lib/v3'
import * as THREE from 'three'
import { clamp } from "three/src/math/MathUtils"
import { rafThrottle } from "../../lib/throttle"

const RAIL_BLUE = [[-4.3924, -0.0067, 2.6806, -4.3924, 1.9067, 2.6806, -3.7167, 4.1599, 2.2111, -1.9087, 4.1599, 1.6492], [-1.1158, 4.1599, 1.4027, -0.6941, 3.5126, 1.2613, -0.6781, 2.8892, 1.1295], [-0.66, 2.1845, 0.9804, -1.2875, 1.7329, 0.8787, -1.8878, 1.7452, 0.8049], [-2.5135, 1.758, 0.7279, -3.1008, 2.1304, 0.6469, -3.1018, 2.8892, 0.4853], [-3.1028, 3.5808, 0.3379, -2.6339, 4.1551, 0.2531, -1.9087, 4.1599, -0.0041], [-1.2996, 4.164, -0.2201, -0.6936, 3.6499, -0.3713, -0.6759, 2.8892, -0.5249], [-0.6611, 2.2502, -0.6539, -1.109, 1.7507, -0.713, -1.8878, 1.7452, -0.8377], [-2.5325, 1.7406, -0.9409, -3.1135, 2.1422, -1.0006, -3.1018, 2.8892, -1.2016], [-3.0806, 4.2551, -1.5692, -1.3132, 4.5659, -1.61, 0.313, 4.4528, -1.821], [2.9157, 4.2718, -2.1587, 4.4721, 3.1251, -2.3432, 4.369, -0.0067, -2.4717]]
const RAIL_RED = [[-4.3924, -0.0067, -2.5489, -4.3924, 1.7337, -2.5489, -3.9389, 2.4084, -2.6721, -3.1529, 2.7177, -2.4874], [-2.2111, 3.0884, -2.266, -1.8924, 2.8969, -1.378, -1.8843, 2.8969, -0.5918], [-1.8735, 2.8969, 0.4442, -1.874, 2.8969, 0.5871, -1.8843, 2.8969, 1.5078], [-1.8954, 2.8969, 2.5023, -1.5353, 2.7339, 3.0759, -0.519, 2.4174, 3.0603], [0.5928, 2.0712, 3.0432, 0.7547, 2.1454, 2.0415, 0.5004, 2.2446, 1.2701], [0.2022, 2.3609, 0.3651, -0.1063, 2.5171, -0.0734, -0.2415, 2.5945, -0.9939], [-0.3639, 2.6645, -1.8273, 0.4604, 2.6586, -2.4524, 1.213, 2.6328, -2.4379], [2.006, 2.6057, -2.4226, 2.7115, 2.5844, -1.9776, 2.7316, 2.66, -1.0714], [2.75, 2.7289, -0.2453, 2.1986, 2.9141, 0.3776, 1.2213, 3.0433, 0.3837], [0.453, 3.1448, 0.3886, -0.1783, 3.2159, -0.1626, -0.1834, 3.2881, -1.0714], [-0.1877, 3.3488, -1.8346, 0.3829, 3.3965, -2.4587, 1.3422, 3.344, -2.4379], [2.2471, 3.2946, -2.4182, 3.1413, 3.1841, -1.5377, 3.4349, 3.0324, -0.5025], [3.7062, 2.8922, 0.4541, 3.8086, 2.7526, 1.182, 3.9825, 2.1333, 1.8003], [4.1564, 1.5138, 2.4189, 4.2889, 0.4335, 2.6549, 4.3169, -0.0067, 2.6806]]
const RAIL_YELLOW = [[-4.3924, -0.0067, 0.0434, -4.3924, 0.4865, 0.0434, -4.0733, 1.1946, 0.0723, -3.1529, 1.1946, 0.0428], [-2.5161, 1.1946, 0.0225, -2.0242, 1.1946, 0.3274, -2.0313, 1.1946, 0.9645], [-2.0429, 1.1946, 2.0006, -1.6889, 1.1815, 2.177, -1.086, 1.1946, 2.177], [-0.3926, 1.2095, 2.177, -0.1111, 1.5817, 2.177, -0.1579, 2.5023, 2.177], [-0.2035, 3.4012, 2.177, 0.762, 3.3777, 2.1212, 1.2631, 3.3886, 2.1212], [1.8333, 3.4011, 2.1212, 2.5346, 3.3898, 2.1212, 2.6044, 2.6455, 2.1212], [2.6893, 1.7404, 2.1212, 1.804, 1.4651, 1.4701, 1.8301, 1.4651, 0.6167], [1.8531, 1.4651, -0.1322, 2.4781, 1.4651, -0.0746, 3.1709, 1.4651, -0.0593], [3.9896, 1.4651, -0.0413, 4.369, 0.7296, 0.0273, 4.369, 0.0235, 0.0434]]

const state = reactive({
  showHint: true,
  rails: [],
})

// TODO: raycast to select 3d bead
// TODO: use findNearestTInWindingOrder to find the right curveLocation.

let renderFunc, renderer, camera

function bezierCurveTo2D(bez, threeCamera, threeRenderer) {
  threeCamera.getWorldPosition(new THREE.Vector3())
  function project(x, y, z) {
    const vec = new THREE.Vector3(x, y, z)
    vec.project(threeCamera)
    vec.y *= -1
    return vec
  }

  const p0 = project(bez.p0x, bez.p0y, bez.p0z)
  const c0 = project(bez.c0x, bez.c0y, bez.c0z)
  const c1 = project(bez.c1x, bez.c1y, bez.c1z)
  const p1 = project(bez.p1x, bez.p1y, bez.p1z)

  return new BezierCurve(p0.x, p0.y, c0.x, c0.y, c1.x, c1.y, p1.x, p1.y)
}

function bezierSplineTo2D(spline3d, threeCamera, renderer) {
  const spline = new BezierSpline([])
  spline.curves = spline3d.curves.map(c => bezierCurveTo2D(c, threeCamera, renderer))
  spline._measure()
  return spline
}

class Rail {
  constructor(splineDescription, bead, camera, renderer, minT = 0, maxT = 1) {
    this.camera = camera
    this.renderer = renderer
    this.spline3d = new BezierSpline3D(splineDescription)
    this.spline2d = null
    this.bead = bead
    this.t = Math.random()
    this.minT = minT
    this.maxT = maxT

    this.calculate2d()
    this.update(this.t)
  }

  calculate2d() {
    this.spline2d = bezierSplineTo2D(this.spline3d, this.camera, this.renderer)
  }

  update(t) {
    this.t = clamp(t, this.minT, this.maxT)

    const location2d = this.spline2d.getCurveLocation(this.t)

    const pos = this.spline3d.getPointAtCurveLocation(location2d)
    const tan = this.spline3d.getTangentAtCurveLocation(location2d)

    this.bead.position.set(...pos)
    this.bead.lookAt(...V3.add(pos, tan))
  }

  updateFromEvent(e) {
    const { clientWidth, clientHeight } = this.renderer.domElement

    const x = (e.offsetX / clientWidth) * 2 - 1
    const y = (e.offsetY / clientHeight) * 2 - 1

    const t = this.spline2d.getNearestTInWindingOrder(this.t, [x, y])
    this.update(t)
  }
}

function update2d() {
  state.rails.forEach(r => {
    r.calculate2d()
  })
}

function initScene(_THREE, scene, gltf, _renderer, _render) {
  renderer = _renderer
  renderFunc = rafThrottle(_render)
  camera = gltf.cameras[0]

  scene.traverse(obj => {
    if (obj.name.startsWith("Bead")) {

      obj.geometry.rotateY(Math.PI / 2)

      if (obj.name.includes("Blue")) {
        const rail = new Rail(RAIL_RED, obj, camera, renderer, 0.028, 0.97)
        state.rails.push(rail)
      }

      else if (obj.name.includes("Red")) {
        const rail = new Rail(RAIL_YELLOW, obj, camera, renderer, 0.05, 0.942)
        state.rails.push(rail)
      }

      else if (obj.name.includes("Yellow")) {
        const rail = new Rail(RAIL_BLUE, obj, camera, renderer, 0.027, 0.963)
        state.rails.push(rail)
      }
    }
  })

  const raycaster = new THREE.Raycaster()
  const raycasterPointer = new THREE.Vector2()
  function handlePointerLeave() {
    _renderer.domElement.style.cursor = ""
  }

  function handlePointerMove(e) {
    const { clientWidth, clientHeight } = _renderer.domElement
    const { offsetX, offsetY } = e
    raycasterPointer.x = (offsetX / clientWidth) * 2 - 1
    raycasterPointer.y = - (offsetY / clientHeight) * 2 + 1
    raycaster.setFromCamera(raycasterPointer, camera)
    const beads = state.rails.map(r => r.bead)
    const intersects = raycaster.intersectObjects(beads)

    if (intersects.length) {
      _renderer.domElement.style.cursor = "grab"
    } else {
      _renderer.domElement.style.cursor = ""
    }
  }

  function handlePointerDown(e) {
    const { clientWidth, clientHeight } = _renderer.domElement
    const { offsetX, offsetY } = e
    raycasterPointer.x = (offsetX / clientWidth) * 2 - 1
    raycasterPointer.y = - (offsetY / clientHeight) * 2 + 1
    raycaster.setFromCamera(raycasterPointer, camera)
    const beads = state.rails.map(r => r.bead)
    const intersects = raycaster.intersectObjects(beads)

    if (intersects.length) {
      e.preventDefault()
      e.stopPropagation()
      _renderer.domElement.style.cursor = "grabbing"
      const bead = intersects[0].object
      const index = beads.indexOf(bead)
      const rail = state.rails[index]

      const drag = e => {
        e.preventDefault()
        e.stopPropagation()
        _renderer.domElement.style.cursor = "grabbing"
        state.showHint = false
        rail.updateFromEvent(e)
        renderFunc()
      }
      const release = () => {
        _renderer.domElement.style.cursor = ""
        window.removeEventListener('pointermove', drag)
        window.removeEventListener('pointerup', release)
      }
      window.addEventListener('pointermove', drag)
      window.addEventListener('pointerup', release)
    }
  }

  _renderer.domElement.addEventListener('pointerdown', handlePointerDown, true)
  _renderer.domElement.addEventListener('pointermove', handlePointerMove)
  _renderer.domElement.addEventListener('pointerleave', handlePointerLeave)

  window.addEventListener('resize', update2d)
  window.requestAnimationFrame(update2d)
}
</script>

<template>
  <TheShowoffPage>
    <template #description>
      <div class="flex gap-3 items-center mb-5">
        <router-link
          to="/"
          title="Back"
          class="icon-button text-gray-800 flex items-center justify-center p-4 -m-4 -mr-2 text-lg"
        >
          <Icon icon="chevronLeft" />
        </router-link>
        <h1 class="font-light text-2xl text-gray-800 leading-[1.42] flex-1">Bead Maze</h1>
      </div>

      <p class="mb-5 gooey-text text-lg">
        <span
          class="gooey-text-inner"
        >You are seven. Goku flexes silently on an old CRT. It kept you busy in the waiting room.</span>
      </p>

      <p
        class="mb-6"
      >Many of my interactive experiments involve a bead and a track. I solved this squiggly puzzle by projecting a 3D bezier spline onto 2D and constraining the beads using projection and binary search</p>

      <p class="mb-2">
        <Icon icon="clock">Created:</Icon>
        <time>2022</time>
      </p>
      <p>
        <Icon icon="wrench">Tools used:</Icon>Blender, THREE.js
      </p>
    </template>

    <template #content>
      <div class="w-full h-full min-w-0 min-h-0 flex items-center">
        <GLTFViewer
          :gltf="model"
          environment="/assets/studio.exr"
          @interacted="state.showHint = false"
          @interacted-end="update2d"
          @after-init="initScene"
          rotatable
          class="flex-1 md:h-[calc(70vw-14rem)]"
        />
        <InteractionHint
          :visible="state.showHint"
          icon="threeD"
          class="absolute bottom-0 left-1/2 -translate-x-1/2"
        >
          <span>You know what to do</span>
        </InteractionHint>
      </div>
    </template>
  </TheShowoffPage>
</template>