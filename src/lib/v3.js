export const dot = (v0, v1) => v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2]
export const magnitude = (v) => Math.sqrt(squareLength(v))
export const length = magnitude
export const squareLength = (v) => v[0] ** 2 + v[1] ** 2 + v[2] ** 2
export const distance = (v0, v1) => Math.sqrt(squareDistance(v0, v1))
export const squareDistance = (v0, v1) => squareLength(subtract(v1, v0))
export const scale = (v, s) => [v[0] * s, v[1] * s, v[2] * s]
export const add = (v0, v1) => [v0[0] + v1[0], v0[1] + v1[1], v0[2] + v1[2]]
export const subtract = (v0, v1) => [v0[0] - v1[0], v0[1] - v1[1], v0[2] - v1[2]]
export const sub = subtract
export const normalize = (v) => scale(v, 1 / length(v))
export const resize = (v, l) => scale(normalize(v), l)