import * as V3 from './v3.js'

const lerp = (start, end, t) => start + (end - start) * t

// class for getting info about the bezier curve
export class BezierCurve3D {
    constructor(p0x, p0y, p0z, c0x, c0y, c0z, c1x, c1y, c1z, p1x, p1y, p1z) {
        Object.assign(this, {
            p0x, p0y, p0z, c0x, c0y, c0z, c1x, c1y, c1z, p1x, p1y, p1z,
        })
        this._length = 0
        this._tLengths = []
        this._initLengths()
    }

    getLength() {
        return this._length
    }

    getPointAt(t) {
        t = Math.min(Math.max(t, 0), 1)
        const { p0x, p0y, p0z, c0x, c0y, c0z, c1x, c1y, c1z, p1x, p1y, p1z } = this
        const omt = 1 - t
        const x = (omt ** 3 * p0x) + (3 * omt ** 2 * t * c0x) + (3 * omt * t ** 2 * c1x) + (t ** 3 * p1x)
        const y = (omt ** 3 * p0y) + (3 * omt ** 2 * t * c0y) + (3 * omt * t ** 2 * c1y) + (t ** 3 * p1y)
        const z = (omt ** 3 * p0z) + (3 * omt ** 2 * t * c0z) + (3 * omt * t ** 2 * c1z) + (t ** 3 * p1z)
        return [x, y, z]
    }

    getPointAtLength(len) {
        const t = this.getTAtLength(len)
        return this.getPointAt(t)
    }

    getPointAtNormalizedLength(nLen) {
        return this.getPointAtLength(this._length * nLen)
    }

    getVelocityAt(t) {
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

    getTangentAt(t) {
        return V3.normalize(this.getVelocityAt(t))
    }

    getTangentAtLength(len) {
        const t = this.getTAtLength(len)
        return this.getTangentAt(t)
    }

    getTAtNormalizedLength(nLength) {
        if (nLength <= 0) return 0
        if (nLength >= 1) return 1
        return this.getTAtLength(nLength * this.getLength())
    }

    getTAtLength(len) {
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
    getLengthAt(t) {
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

    getNormalizedLengthAt(t) {
        return this.getLengthAt(t) / this.getLength()
    }

    _initLengths() {
        const tLengths = []

        const minLen = 0.05
        // TODO: not quite sure why the loop is happening exactly 1000 times here,
        const incrementT = 0.006
        let totalLength = 0

        let lastPoint = this.getPointAt(0)
        let t = incrementT
        while (true) {
            if (t >= 1) t = 1
            const pt = this.getPointAt(t)
            const len = V3.distance(pt, lastPoint)
            if (len >= minLen) {
                tLengths.push([t, len])
                totalLength += len
                lastPoint = pt
            }
            if (t >= 1) break
            t += incrementT
        }

        this._tLengths = tLengths
        this._length = totalLength
    }
}

export class BezierSpline3D {
    constructor(curveDescriptions) {
        this.curves = []
        this._curveStartLengths = []
        this._curveStartTs = []
        this._length = 0

        this._initCurves(curveDescriptions)
    }

    getLength() {
        return this._length
    }

    getPointAt(t) {
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

    getTangentAt(t) {
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

    getPointAtCurveLocation({ index, t }) {
        return this.curves[index].getPointAt(t)
    }

    getTangentAtCurveLocation({ index, t }) {
        return this.curves[index].getTangentAt(t)
    }

    getTAtLength(len) {
        return len / this._length
    }

    getLengthAt(t) {
        return t * this._length
    }

    getCurveIndexAt(t) {
        if (t <= 0) return 0
        if (t >= 1) this._curveStartTs.length - 1
        for (let i = this._curveStartTs.length - 1; i >= 0; i--) {
            if (this._curveStartTs[i] < t) return i
        }
    }

    getCurveIndexAtLength(l) {
        if (l <= 0) return 0
        if (l >= this._length) this._curveStartLengths.length - 1
        for (let i = this._curveStartLengths.length - 1; i >= 0; i--) {
            if (this._curveStartLengths[i] < l) return i
        }
    }

    _initCurves(curveDescriptors) {
        this._length = 0

        curveDescriptors.forEach((c, i, a) => {
            let curve
            if (i === 0) {
                curve = new BezierCurve3D(...c)
            } else if (i === 1) {
                const previous = a[i - 1]
                const p0x = previous[9]
                const p0y = previous[10]
                const p0z = previous[11]
                curve = new BezierCurve3D(p0x, p0y, p0z, ...c)
            } else {
                const previous = a[i - 1]
                const p0x = previous[6]
                const p0y = previous[7]
                const p0z = previous[8]
                curve = new BezierCurve3D(p0x, p0y, p0z, ...c)
            }

            this.curves.push(curve)
            this._curveStartLengths.push(this._length)
            this._length += curve.getLength()
        })

        this._curveStartTs = this._curveStartLengths.map(l => l / this._length)
    }
}