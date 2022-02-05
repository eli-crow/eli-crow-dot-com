import type * as THREE from 'three'
import { Vector3 } from 'three'

import { BezierCurve } from './bezier'
import { BezierCurve3D } from './bezier3'

export function convertBlenderLightUnitsToThreeUnits(watts: number) {
    return (683 * watts) / (4 * Math.PI)
}

export function bezierCurveTo2D(curve: BezierCurve3D, threeCamera: THREE.Camera) {
    threeCamera.getWorldPosition(new Vector3())
    function project(x: number, y: number, z: number) {
        const vec = new Vector3(x, y, z)
        vec.project(threeCamera)
        vec.y *= -1
        return vec
    }

    const p0 = project(curve.p0x, curve.p0y, curve.p0z)
    const c0 = project(curve.c0x, curve.c0y, curve.c0z)
    const c1 = project(curve.c1x, curve.c1y, curve.c1z)
    const p1 = project(curve.p1x, curve.p1y, curve.p1z)

    return new BezierCurve(p0.x, p0.y, c0.x, c0.y, c1.x, c1.y, p1.x, p1.y)
}

export function clamp(n: number, min: number = 0, max: number = 1) {
    return Math.min(Math.max(n, min), max)
}

export function lerp(from: number, to: number, t: number) {
    return from + (to - from) * t
}

export function unlerp(n: number, from: number, to: number) {
    if (Math.abs(to - from) < Number.EPSILON) return 0
    return (n - from) / (to - from)
}

export function remap(n: number, from0: number, from1: number, to0: number, to1: number) {
    return lerp(to0, to1, unlerp(n, from0, from1))
}