export type Vec3 = [x: number, y: number, z: number]

export const dot = (v0: Vec3, v1: Vec3): number => v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2]
export const magnitude = (v: Vec3): number => Math.sqrt(squareLength(v))
export const length = magnitude
export const squareLength = (v: Vec3): number => v[0] ** 2 + v[1] ** 2 + v[2] ** 2
export const distance = (v0: Vec3, v1: Vec3): number => Math.sqrt(squareDistance(v0, v1))
export const squareDistance = (v0: Vec3, v1: Vec3): number => squareLength(subtract(v1, v0))
export const scale = (v: Vec3, s: number): Vec3 => [v[0] * s, v[1] * s, v[2] * s]
export const add = (v0: Vec3, v1: Vec3): Vec3 => [v0[0] + v1[0], v0[1] + v1[1], v0[2] + v1[2]]
export const subtract = (v0: Vec3, v1: Vec3): Vec3 => [v0[0] - v1[0], v0[1] - v1[1], v0[2] - v1[2]]
export const sub = subtract
export const normalize = (v: Vec3): Vec3 => scale(v, 1 / length(v))
export const resize = (v: Vec3, l: number): Vec3 => scale(normalize(v), l)