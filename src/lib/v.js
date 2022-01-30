export const dot = (v0, v1) => v0[0] * v1[0] + v0[1] * v1[1]
export const magnitude = (v) => Math.sqrt(squareLength(v))
export const length = magnitude
export const angle = (v) => Math.atan2(v[1], v[0])
export const angleDifference = (a, b, _d = a - b) => _d + (_d > Math.PI ? -2 * Math.PI : _d < -Math.PI ? 2 * Math.PI : 0)
export const toPolar = (v) => [angle(v), length(v)]
export const fromPolar = (theta, r) => [Math.cos(theta) * r, Math.sin(theta) * r]
export const squareLength = (v) => v[0] ** 2 + v[1] ** 2
export const distance = (v0, v1) => Math.sqrt(squareDistance(v0, v1))
export const squareDistance = (v0, v1) => squareLength(subtract(v1, v0))
export const scale = (v, s) => [v[0] * s, v[1] * s]
export const add = (v0, v1) => [v0[0] + v1[0], v0[1] + v1[1]]
export const subtract = (v0, v1) => [v0[0] - v1[0], v0[1] - v1[1]]
export const sub = subtract
export const normalize = (v) => scale(v, 1 / length(v))
export const resize = (v, l) => scale(normalize(v), l)
export const from3d = (v3, m) => {
    const ox = m[0] * v3[0] + m[4] * v3[1] + m[8] * v3[2] + m[12]
    const oy = m[1] * v3[0] + m[5] * v3[1] + m[9] * v3[2] + m[13]
    const ow = m[3] * v3[0] + m[7] * v3[1] + m[11] * v3[2] + m[15]
    return [
        (ox / ow + 1) / 2,
        1 - (oy / ow + 1) / 2
    ]
}