import { clamp } from "three/src/math/MathUtils"
import * as V from './v'
import type { Vec } from './v'

const CURVETIME_EPSILON = 1e-6 // close enough for pixel-precision

const lerp = (start: number, end: number, t: number) => start + (end - start) * t

// class for getting info about the bezier curve
export class BezierCurve {
    private _length = 0
    private _tLengths: [t: number, length: number][] = []

    constructor(
        public p0x: number,
        public p0y: number,
        public c0x: number,
        public c0y: number,
        public c1x: number,
        public c1y: number,
        public p1x: number,
        public p1y: number

    ) {
        this._initLengths()
    }

    getLength() {
        return this._length
    }

    getPointAt(t: number): Vec {
        t = Math.min(Math.max(t, 0), 1)
        const { p0x, p0y, c0x, c0y, c1x, c1y, p1x, p1y } = this
        const omt = 1 - t
        const x = (omt ** 3 * p0x) + (3 * omt ** 2 * t * c0x) + (3 * omt * t ** 2 * c1x) + (t ** 3 * p1x)
        const y = (omt ** 3 * p0y) + (3 * omt ** 2 * t * c0y) + (3 * omt * t ** 2 * c1y) + (t ** 3 * p1y)
        return [x, y]
    }

    getPointAtLength(len: number) {
        const t = this.getTAtLength(len)
        if (t === null) return null
        return this.getPointAt(t)
    }

    getPointAtNormalizedLength(nLen: number) {
        return this.getPointAtLength(this._length * nLen)
    }

    getVelocityAt(t: number): Vec {
        t = Math.min(Math.max(t, 0), 1)
        const { p0x, p0y, c0x, c0y, c1x, c1y, p1x, p1y } = this
        const omt = 1 - t
        //first derivative of bezier
        const x = (3 * omt ** 2 * (c0x - p0x)) + (6 * omt * t * (c1x - c0x)) + (3 * t ** 2 * (p1x - c1x))
        const y = (3 * omt ** 2 * (c0y - p0y)) + (6 * omt * t * (c1y - c0y)) + (3 * t ** 2 * (p1y - c1y))
        return [x, y]
    }

    getWeightedNormalAt(t: number): Vec {
        t = Math.min(Math.max(t, 0), 1)
        const tangent = this.getVelocityAt(t)
        return [-tangent[1], tangent[0]]
    }

    getTangentAt(t: number): Vec {
        return V.normalize(this.getVelocityAt(t))
    }

    getNormalAt(t: number): Vec {
        return V.normalize(this.getWeightedNormalAt(t))
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

        return null
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

        return null
    }

    getNormalizedLengthAt(t: number) {
        const length = this.getLengthAt(t)
        if (length === null) return null
        return length / this.getLength()
    }

    getNearestTInWindingOrder(currentT: number, target: Vec): number {
        const currentPoint = this.getPointAt(currentT)
        const currentTangent = this.getTangentAt(currentT)
        const currentTargetVector = V.subtract(target, currentPoint)
        const currentDirection = V.dot(currentTargetVector, currentTangent)
        const currentDirectionSign = Math.sign(currentDirection)

        let stepIncrement = 0.01 * currentDirectionSign
        let lowT = currentT
        let highT = lowT
        let lowDirection = currentDirection
        let highDirection = currentDirection

        // breadth-first search:
        // step incrementally in the same winding direction as the initial projection until 
        // the direction's (d) sign switches, indicating that we have found a point 
        // on either side of where the thumb should be
        while (Math.sign(highDirection) === currentDirectionSign) {
            lowT = highT
            lowDirection = highDirection
            highT = clamp(highT + stepIncrement, 0, 1)
            if (Math.abs(lowT - highT) <= CURVETIME_EPSILON) {
                highDirection = lowDirection
                break
            }
            const highPoint = this.getPointAt(highT)
            const highTangent = this.getTangentAt(highT)
            const highTargetVector = V.subtract(target, highPoint)
            highDirection = V.dot(highTangent, highTargetVector)
        }

        if (Math.abs(highT - lowT) < CURVETIME_EPSILON) {
            return highT
        } else {
            //binary search between the last two t's checked to get a close-enough point
            let midT = (lowT + highT) / 2
            let midDirection = (lowDirection + highDirection) / 2
            while (Math.abs(midDirection) >= CURVETIME_EPSILON) {
                midT = (lowT + highT) / 2
                const midPoint = this.getPointAt(midT)
                const midTangent = this.getTangentAt(midT)
                const midTargetVector = V.subtract(target, midPoint)
                midDirection = V.dot(midTangent, midTargetVector)
                if (midDirection * -currentDirectionSign < 0) {
                    lowT = midT
                    lowDirection = midDirection
                } else {
                    highT = midT
                    highDirection = midDirection
                }
            }
            return midT
        }
    }

    getSvgPathData(isFirst = true) {
        const { p0x, p0y, c0x, c0y, c1x, c1y, p1x, p1y } = this
        if (isFirst) {
            return `M${p0x},${p0y} C${c0x},${c0y} ${c1x},${c1y} ${p1x},${p1y}`
        } else {
            return `C${c0x},${c0y} ${c1x},${c1y} ${p1x},${p1y}`
        }
    }

    // Cache a number of roughly equidistant lengths
    private _initLengths() {
        const tLengths: [t: number, length: number][] = [[0, 0]]

        const minLength = 0.05
        // TODO: not quite sure why the loop is happening exactly 1000 times here,
        const incrementT = 0.006
        let totalLength = 0

        let lastPoint = this.getPointAt(0)
        let t = incrementT
        while (true) {
            if (t + incrementT >= 1) break
            const point = this.getPointAt(t)
            const length = V.distance(point, lastPoint)
            if (length >= minLength) {
                tLengths.push([t, length])
                totalLength += length
                lastPoint = point
            }
            t += incrementT
        }

        const finalPoint = this.getPointAt(1)
        const finalLength = V.distance(finalPoint, lastPoint)
        tLengths.push([1, finalLength])
        totalLength += finalLength

        this._tLengths = tLengths
        this._length = totalLength
    }
}

export class BezierSpline {
    curves: BezierCurve[] = []
    private _curveStartLengths: number[] = []
    private _curveStartTs: number[] = []
    private _length = 0
    constructor(curveDescription: SplineDescription) {
        this._initCurves(curveDescription)
        this._measure()
    }

    static fromCurves(curves: BezierCurve[]) {
        // @ts-ignore
        const spline = new BezierSpline([])
        spline.curves = curves
        spline._measure()
        return spline
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

        if (curveIndex === null) return null

        const curveStartsAtLength = this._curveStartLengths[curveIndex]
        const curve = this.curves[curveIndex]

        const lengthAlongCurve = lengthAtT - curveStartsAtLength
        return curve.getPointAtLength(lengthAlongCurve)
    }

    getCurveLocation(t: number) {
        const length = this.getLength()
        const lengthAtT = length * t

        const index = this.getCurveIndexAtLength(lengthAtT)

        if (index === null) return null

        const curveStartsAtLength = this._curveStartLengths[index]
        const curve = this.curves[index]
        const lengthAlongCurve = lengthAtT - curveStartsAtLength
        const tAtlength = curve.getTAtLength(lengthAlongCurve)

        if (tAtlength === null) return null

        const location: CurveLocation = { index, t: tAtlength }
        return location
    }

    getTAtLength(len: number) {
        return len / this._length
    }

    getLengthAt(t: number) {
        return t * this._length
    }

    getCurveIndexAt(t: number) {
        if (t <= 0) return 0
        if (t >= 1) return this._curveStartTs.length - 1
        let i = this._curveStartTs.length
        while (i--) {
            if (this._curveStartTs[i] < t) return i
        }
        return null
    }

    getCurveIndexAtLength(l: number) {
        if (l <= 0) return 0
        if (l >= this._length) return this._curveStartLengths.length - 1
        let i = this._curveStartLengths.length
        while (i--) {
            if (this._curveStartLengths[i] < l) return i
        }
        return null
    }

    getSvgPathData() {
        return this.curves
            .map((curve, i) => curve.getSvgPathData(i === 0))
            .join('')
    }

    getNearestTInWindingOrder(splineCurrentT: number, pt: Vec) {
        const lenAtSplineCurrentT = this.getLengthAt(splineCurrentT)

        let curveIndex = this.getCurveIndexAt(splineCurrentT) ?? 0
        let lastCurveIndex: number | undefined
        let curveNearestT: number
        let curveLengthBefore: number
        let curve: BezierCurve

        while (true) {
            curve = this.curves[curveIndex]
            curveLengthBefore = this._curveStartLengths[curveIndex]
            const curveNLen = lenAtSplineCurrentT - curveLengthBefore
            const curveCurrentT = curve.getTAtLength(curveNLen)!
            curveNearestT = curve.getNearestTInWindingOrder(curveCurrentT, pt)

            if (curveNearestT <= CURVETIME_EPSILON) {
                if (curveIndex === 0 || lastCurveIndex === curveIndex - 1) break
                lastCurveIndex = curveIndex
                curveIndex--
            }

            else if (curveNearestT >= 1 - CURVETIME_EPSILON) {
                if (curveIndex === this.curves.length - 1 || lastCurveIndex === curveIndex + 1) break
                lastCurveIndex = curveIndex
                curveIndex++
            }

            else break
        }

        const lengthNearestT = curve.getLengthAt(curveNearestT)
        if (lengthNearestT === null) return null

        return (curveLengthBefore + lengthNearestT) / this._length
    }

    _initCurves(curveDescription: SplineDescription) {
        this.curves = curveDescription.map((c, i, a) => {
            if (i === 0) {
                c = c as SplineDescription[0]
                return new BezierCurve(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7])
            }

            else if (i === 1) {
                const previous = a[i - 1] as SplineDescription[0]
                const p0x = previous[6]
                const p0y = previous[7]
                return new BezierCurve(p0x, p0y, c[0], c[1], c[2], c[3], c[4], c[5])
            }

            else {
                const previous = a[i - 1] as SplineDescription[1]
                const p0x = previous[4]
                const p0y = previous[5]
                return new BezierCurve(p0x, p0y, c[0], c[1], c[2], c[3], c[4], c[5])
            }
        })
    }

    private _measure() {
        this._length = 0

        this.curves.forEach(c => {
            this._curveStartLengths.push(this._length)
            this._length += c.getLength()
        })

        this._curveStartTs = this._curveStartLengths.map(l => l / this._length)
    }
}

export type SplineDescription = [
    [p0x: number, p0y: number, c0x: number, c0y: number, c1x: number, c1y: number, p1x: number, p1y: number],
    ...Array<[c0x: number, c0y: number, c1x: number, c1y: number, p1x: number, p1y: number]>
]

interface CurveLocation {
    index: number
    t: number
}