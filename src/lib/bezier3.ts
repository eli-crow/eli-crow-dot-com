import * as V3 from './v3'
import { Vec3 } from './v3'

const lerp = (start: number, end: number, t: number) => start + (end - start) * t

// class for getting info about the bezier curve
export class BezierCurve3D {
    private _length = 0
    private _tLengths: [t: number, length: number][] = []

    constructor(
        public p0x: number,
        public p0y: number,
        public p0z: number,
        public c0x: number,
        public c0y: number,
        public c0z: number,
        public c1x: number,
        public c1y: number,
        public c1z: number,
        public p1x: number,
        public p1y: number,
        public p1z: number,
    ) {
        this._initLengths()
    }

    getLength() {
        return this._length
    }

    getPointAt(t: number): Vec3 {
        t = Math.min(Math.max(t, 0), 1)
        const { p0x, p0y, p0z, c0x, c0y, c0z, c1x, c1y, c1z, p1x, p1y, p1z } = this
        const omt = 1 - t
        const x = (omt ** 3 * p0x) + (3 * omt ** 2 * t * c0x) + (3 * omt * t ** 2 * c1x) + (t ** 3 * p1x)
        const y = (omt ** 3 * p0y) + (3 * omt ** 2 * t * c0y) + (3 * omt * t ** 2 * c1y) + (t ** 3 * p1y)
        const z = (omt ** 3 * p0z) + (3 * omt ** 2 * t * c0z) + (3 * omt * t ** 2 * c1z) + (t ** 3 * p1z)
        return [x, y, z]
    }

    getPointAtLength(len: number): Vec3 {
        const t = this.getTAtLength(len)
        return this.getPointAt(t)
    }

    getPointAtNormalizedLength(nLen: number): Vec3 {
        return this.getPointAtLength(this._length * nLen)
    }

    getVelocityAt(t: number): Vec3 {
        const { p0x, p0y, p0z, c0x, c0y, c0z, c1x, c1y, c1z, p1x, p1y, p1z } = this

        if (t < Number.EPSILON) return [
            3 * (c0x - p0x),
            3 * (c0y - p0y),
            3 * (c0z - p0z),
        ]

        if (t >= 1) return [
            3 * (p1x - c1x),
            3 * (p1y - c1y),
            3 * (p1z - c1z),
        ]

        const component = (p0, c0, c1, p1) =>
            3 * (c0 - p0) +
            2 * t * (3 * p0 - 6 * c0 + 3 * c1) +
            3 * (t ** 2) * (-p0 + 3 * c0 - 3 * c1 + p1)

        return [
            component(p0x, c0x, c1x, p1x),
            component(p0y, c0y, c1y, p1y),
            component(p0z, c0z, c1z, p1z),
        ]
    }

    getTangentAt(t: number): Vec3 {
        return V3.normalize(this.getVelocityAt(t))
    }

    getTangentAtLength(len: any): Vec3 {
        const t = this.getTAtLength(len)
        return this.getTangentAt(t)
    }

    getTAtNormalizedLength(nLength: number) {
        if (nLength <= 0) return 0
        if (nLength >= 1) return 1
        return this.getTAtLength(nLength * this.getLength())
    }

    getTAtLength(len: number) {
        if (len <= 0) return 0
        if (len >= this.getLength()) return 1

        let lastTLength = this._tLengths[0]
        let accumulatedLength = lastTLength[1]
        let lastAccumulatedLength = accumulatedLength
        for (let i = 1; i < this._tLengths.length; i++) {
            const tLength = this._tLengths[i]

            accumulatedLength += tLength[1]

            if (accumulatedLength > len) {
                const prog = (len - lastAccumulatedLength) / (accumulatedLength - lastAccumulatedLength)
                const t = lerp(lastTLength[0], tLength[0], prog)
                return t
            }

            lastTLength = tLength
            lastAccumulatedLength = accumulatedLength
        }
    }

    // Look for two cached T-lengths, one on either side of `t`. Lerp between them. tLengths are assumed to be sorted in ascending T order
    getLengthAt(t: number) {
        if (t <= 0) return 0
        if (t >= 1) return this.getLength()

        let lastTLength = this._tLengths[0]
        let accumulatedLength = lastTLength[1]
        let lastAccumulatedLength = accumulatedLength
        for (let i = 1; i < this._tLengths.length; i++) {
            const tLength = this._tLengths[i]

            accumulatedLength += tLength[1]

            if (tLength[0] > t) {
                const prog = (t - lastTLength[0]) / (tLength[0] - lastTLength[0])
                const length = lerp(lastAccumulatedLength, accumulatedLength, prog)
                return length
            }

            lastTLength = tLength
            lastAccumulatedLength = accumulatedLength
        }
    }

    getNormalizedLengthAt(t: number) {
        return this.getLengthAt(t) / this.getLength()
    }

    _initLengths() {
        const tLengths: [t: number, length: number][] = [
            [0, 0]
        ]

        const minLength = 0.05
        // TODO: not quite sure why the loop is happening exactly 1000 times here,
        const incrementT = 0.006
        let totalLength = 0

        let lastPoint = this.getPointAt(0)
        let t = incrementT
        while (true) {
            if (t + incrementT >= 1) break
            const point = this.getPointAt(t)
            const length = V3.distance(point, lastPoint)
            if (length >= minLength) {
                tLengths.push([t, length])
                totalLength += length
                lastPoint = point
            }
            t += incrementT
        }

        const finalPoint = this.getPointAt(1)
        const finalLength = V3.distance(finalPoint, lastPoint)
        tLengths.push([1, finalLength])
        totalLength += finalLength

        this._tLengths = tLengths
        this._length = totalLength
    }
}

export class BezierSpline3D {
    curves: BezierCurve3D[] = []
    private _curveStartLengths: number[] = []
    private _curveStartTs: number[] = []
    private _length = 0

    constructor(splineDescription: SplineDescription3D) {
        this._initCurves(splineDescription)
    }

    getLength() {
        return this._length
    }

    getPointAt(t: number) {
        if (t <= 0) return this.curves[0].getPointAt(0)
        if (t >= 1) return this.curves[this.curves.length - 1].getPointAt(1)
        if (this.curves.length === 1) return this.curves[0].getPointAtNormalizedLength(t)

        const length = this.getLength()
        const lengthAtT = length * t

        const curveIndex = this.getCurveIndexAtLength(lengthAtT)
        const curveStartsAtLength = this._curveStartLengths[curveIndex]
        const curve = this.curves[curveIndex]

        const lengthAlongCurve = lengthAtT - curveStartsAtLength
        return curve.getPointAtLength(lengthAlongCurve)
    }

    getTangentAt(t: number) {
        if (t <= 0) return this.curves[0].getTangentAt(0)
        if (t >= 1) return this.curves[this.curves.length - 1].getTangentAt(1)
        if (this.curves.length === 1) return this.curves[0].getTangentAt(t)

        const length = this.getLength()
        const lengthAtT = length * t

        const curveIndex = this.getCurveIndexAtLength(lengthAtT)
        const curveStartsAtLength = this._curveStartLengths[curveIndex]
        const curve = this.curves[curveIndex]

        const lengthAlongCurve = lengthAtT - curveStartsAtLength
        return curve.getTangentAtLength(lengthAlongCurve)
    }

    getPointAtCurveLocation({ index, t }: CurveLocation3D) {
        return this.curves[index].getPointAt(t)
    }

    getTangentAtCurveLocation({ index, t }: CurveLocation3D) {
        return this.curves[index].getTangentAt(t)
    }

    getTAtLength(len: number) {
        return len / this._length
    }

    getLengthAt(t: number) {
        return t * this._length
    }

    getCurveIndexAt(t: number) {
        if (t <= 0) return 0
        if (t >= 1) this._curveStartTs.length - 1
        for (let i = this._curveStartTs.length - 1; i >= 0; i--) {
            if (this._curveStartTs[i] < t) return i
        }
    }

    getCurveIndexAtLength(l: number) {
        if (l <= 0) return 0
        if (l >= this._length) this._curveStartLengths.length - 1
        for (let i = this._curveStartLengths.length - 1; i >= 0; i--) {
            if (this._curveStartLengths[i] < l) return i
        }
    }

    _initCurves(splineDescription: SplineDescription3D) {
        this._length = 0

        splineDescription.forEach((c, i, a) => {
            let curve: BezierCurve3D
            if (i === 0) {
                curve = new BezierCurve3D(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[9], c[10], c[11])
            } else if (i === 1) {
                const previous = a[i - 1]
                const p0x = previous[9]
                const p0y = previous[10]
                const p0z = previous[11]
                curve = new BezierCurve3D(p0x, p0y, p0z, c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8])
            } else {
                const previous = a[i - 1]
                const p0x = previous[6]
                const p0y = previous[7]
                const p0z = previous[8]
                curve = new BezierCurve3D(p0x, p0y, p0z, c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8])
            }

            this.curves.push(curve)
            this._curveStartLengths.push(this._length)
            this._length += curve.getLength()
        })

        this._curveStartTs = this._curveStartLengths.map(l => l / this._length)
    }
}

export type SplineDescription3D = [
    [p0x: number, p0y: number, p0z: number, c0x: number, c0y: number, c0z: number, c1x: number, c1y: number, c1z: number, p1x: number, p1y: number, p1z: number],
    ...Array<[c0x: number, c0y: number, c0z: number, c1x: number, c1y: number, c1z: number, p1x: number, p1y: number, p1z: number]>
]

interface CurveLocation3D {
    index: number
    t: number
}