import type { Vec3 } from "./v3"

export type Vec = [x: number, y: number]
type P = [theta: number, r: number]

export const dot = (v0: Vec, v1: Vec): number => v0[0] * v1[0] + v0[1] * v1[1]
export const magnitude = (v: Vec): number => Math.sqrt(squareLength(v))
export const length = magnitude
export const angle = (v: Vec): number => Math.atan2(v[1], v[0])
export const angleDifference = (a: number, b: number, _d = a - b): number => _d + (_d > Math.PI ? -2 * Math.PI : _d < -Math.PI ? 2 * Math.PI : 0)
export const toPolar = (v: Vec): P => [angle(v), length(v)]
export const fromPolar = (theta: number, r: number): Vec => [Math.cos(theta) * r, Math.sin(theta) * r]
export const squareLength = (v: Vec): number => v[0] ** 2 + v[1] ** 2
export const distance = (v0: Vec, v1: Vec): number => Math.sqrt(squareDistance(v0, v1))
export const squareDistance = (v0: Vec, v1: Vec): number => squareLength(subtract(v1, v0))
export const scale = (v: Vec, s): Vec => [v[0] * s, v[1] * s]
export const add = (v0: Vec, v1: Vec): Vec => [v0[0] + v1[0], v0[1] + v1[1]]
export const subtract = (v0: Vec, v1: Vec): Vec => [v0[0] - v1[0], v0[1] - v1[1]]
export const sub = subtract
export const normalize = (v: Vec): Vec => scale(v, 1 / length(v))
export const resize = (v: Vec, l: number): Vec => scale(normalize(v), l)
export const from3d = (v3: Vec3, m: any[]): Vec => {
    const ox = m[0] * v3[0] + m[4] * v3[1] + m[8] * v3[2] + m[12]
    const oy = m[1] * v3[0] + m[5] * v3[1] + m[9] * v3[2] + m[13]
    const ow = m[3] * v3[0] + m[7] * v3[1] + m[11] * v3[2] + m[15]
    return [
        (ox / ow + 1) / 2,
        1 - (oy / ow + 1) / 2
    ]
}