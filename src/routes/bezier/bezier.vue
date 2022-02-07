<script setup lang="ts">
import { onMounted, watchEffect } from 'vue';
import { BezierCurve } from '../../lib/bezier'
import * as V from '../../lib/v'
// @ts-ignore
import { CatmullRom } from 'three/src/extras/core/interpolations'

let svgPoint: DOMPoint

let svg = $ref<SVGSVGElement>()
let p0 = $ref<V.Vec>([10, 10])
let c0 = $ref<V.Vec>([40, 13])
let c1 = $ref<V.Vec>([50, 43])
let p1 = $ref<V.Vec>([30, 63])

let catmullPath = $computed(() => {
    const [first, ...rest] = [...generateCatmullPoints(10)]
    return `M${first} ${rest.map(r => `L${r}`).join(' ')}`
})

let bezierPath = $ref("")
const bezier = new BezierCurve(0, 0, 0, 0, 0, 0, 0, 0)
watchEffect(() => {
    bezier.p0x = p0[0]
    bezier.p0y = p0[1]
    bezier.c0x = c0[0]
    bezier.c0y = c0[1]
    bezier.c1x = c1[0]
    bezier.c1y = c1[1]
    bezier.p1x = p1[0]
    bezier.p1y = p1[1]
    bezier.measure()
    bezierPath = bezier.getSvgPathData()
})

onMounted(() => {
    svgPoint = svg.createSVGPoint()
})

function* generateCatmullPoints(n: number) {
    for (var i = 0; i < n; i++) {
        const t = i / (n - 1)
        yield [
            CatmullRom(t, p0[0], c0[0], c1[0], p1[0]),
            CatmullRom(t, p0[1], c0[1], c1[1], p1[1]),
        ] as V.Vec
    }
}

function eventToPoint({ clientX, clientY }: PointerEvent): V.Vec {
    svgPoint.x = clientX
    svgPoint.y = clientY
    const point = svgPoint.matrixTransform(svg.getScreenCTM()!.inverse())
    return [point.x, point.y]
}

function handlePointerDown(e: PointerEvent) {
    p0 = c0
    c0 = c1
    c1 = p1
    p1 = eventToPoint(e)
}
</script>

<template>
    <div>
        <svg viewBox="0 0 100 100" ref="svg" @pointerdown="handlePointerDown">
            <path
                :d="bezierPath"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                vector-effect="non-scaling-stroke"
            />
            <path
                :d="catmullPath"
                fill="none"
                stroke="red"
                stroke-width="2"
                vector-effect="non-scaling-stroke"
            />
            <circle :cx="p0[0]" :cy="p0[1]" r=".5" fill="currentColor" />
            <circle :cx="c0[0]" :cy="c0[1]" r=".5" fill="currentColor" />
            <circle :cx="c1[0]" :cy="c1[1]" r=".5" fill="currentColor" />
            <circle :cx="p1[0]" :cy="p1[1]" r=".5" fill="currentColor" />
        </svg>
        <div class="grid grid-cols-3">
            <label>p0</label>
            <input type="number" step="0.1" v-model="p0[0]" />
            <input type="number" step="0.1" v-model="p0[1]" />

            <label>c0</label>
            <input type="number" step="0.1" v-model="c0[0]" />
            <input type="number" step="0.1" v-model="c0[1]" />

            <label>c1</label>
            <input type="number" step="0.1" v-model="c1[0]" />
            <input type="number" step="0.1" v-model="c1[1]" />

            <label>p1</label>
            <input type="number" step="0.1" v-model="p1[0]" />
            <input type="number" step="0.1" v-model="p1[1]" />
        </div>
    </div>
</template>