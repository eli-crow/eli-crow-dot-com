import { BezierCurve } from "../../lib/bezier"
import { lerp } from "../../lib/utilities"
import { angleDifference, Vec } from "../../lib/v"
import { io, Socket } from 'socket.io-client'

const BRUSH_IMAGE_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFw2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZWRhMmIzZmFjLCAyMDIxLzExLzE3LTE3OjIzOjE5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjMuMSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDItMDVUMTc6MTg6MTMtMDU6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDItMDVUMTc6NDE6NTctMDU6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTAyLTA1VDE3OjQxOjU3LTA1OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozZDA4MjM3My04N2Y4LTQ2NmEtOTgzOS1lN2QxOTg0YTliZmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OGIyNmRmMjItNTQ4OC00OTUzLWEwOGYtNGFmZjBhZGNlOTVjIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OGIyNmRmMjItNTQ4OC00OTUzLWEwOGYtNGFmZjBhZGNlOTVjIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4YjI2ZGYyMi01NDg4LTQ5NTMtYTA4Zi00YWZmMGFkY2U5NWMiIHN0RXZ0OndoZW49IjIwMjItMDItMDVUMTc6MTg6MTMtMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMy4xIChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozZDA4MjM3My04N2Y4LTQ2NmEtOTgzOS1lN2QxOTg0YTliZmUiIHN0RXZ0OndoZW49IjIwMjItMDItMDVUMTc6NDE6NTctMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMy4xIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiZw9WAAAAFnSURBVDjLrdVLKERRGMDxYSYxkjyKshRJdsrGiGxsrWxEEhYkG7KwYGkjpaw8s7GxkBQbkbWd7FhQRB5hNR4N/6++U8fp3DGXWfyaO/fO/XfnzDlnIsVnBxFHvuecyAk4/4M5iCKGckxgGE3oxQIOcYRNNGcSzEOpHvfhC8/66rrDFKrSBY1GbOMdHwFBO9zvDoUdq8Wefvi3mC3hC9ZhHZ8hQuIBS5jEIuIm2IqXkDH7mzzpMCVMsPMPMZ8RE5zLQkyGa0xi9UhmIfiKIQnOZOnrih4JdmEfV/+MpcwTlmBVJ6pcuMZjyJj8yvNok2BcI+biOdZCPPEbptGOSgnmYsP50CVuM4jJ3DvBLAZQYKZNGZY9kzblTAvz/kY3iAZdJStocddyEcaxozcmraW4iw5dAFsy+NZ9sspG9f6Ib0+rwb3ztIPW9ULdP+17okHblxnTbhzjAqeozmS39gVjzvuKNH8JXt9HPHuK3bJLcgAAAABJRU5ErkJggg=="

// copied from server repo
interface ClientToServerEvents {
    stroke: (stroke: Stroke) => void
}

interface ServerToClientEvents {
    stroked: (stroke: Stroke) => void
}

interface Stroke {
    points: { position: Vec, time: number }[]
}

type OuijaEventPayloads = {
    'brush-end': undefined
}

type OuijaEvent = keyof OuijaEventPayloads

type OuijaEventArgs<E extends OuijaEvent> = OuijaEventPayloads[E] extends undefined ? [] : [payload: OuijaEventPayloads[E]]

export class OuijaBoard {
    readonly loaded: Promise<void>
    private canvas: HTMLCanvasElement | null = null
    private buffer: HTMLCanvasElement = document.createElement('canvas')
    private context: CanvasRenderingContext2D | null = null
    private brushImage: HTMLImageElement
    private brushDownListener: ((e: PointerEvent) => void) | null = null
    private listeners: { [E in keyof OuijaEventPayloads]: Set<(...args: OuijaEventArgs<E>) => void> } = {
        "brush-end": new Set()
    }
    private smoothingCurve: BezierCurve = new BezierCurve(0, 0, 0, 0, 0, 0, 0, 0)
    private smoothingFactor = 0.5
    private smoothingSteps = 12
    private minSquaredSpeed = 6 ** 2
    private brushScaleMin = 0.2
    private brushScaleSpeedFactor = 0.006
    private brushScaleAngleFactor = 0.4
    private downAngle = .6 * Math.PI
    private socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(import.meta.env.VITE_SERVER_URL!)

    constructor() {
        this.brushImage = new Image();
        this.brushImage.src = BRUSH_IMAGE_SRC
        this.loaded = new Promise(resolve => {
            this.brushImage.onload = () => resolve()
        })
        this.socket.on('stroked', stroke => {
            this.playStroke(stroke)
        })
    }

    setCanvas(canvas: HTMLCanvasElement | undefined | null) {
        if (canvas) {
            this.canvas = canvas
            this.context = this.canvas.getContext("2d")
            this.resizeToClientSize()
            this.setupListeners()
        } else {
            this.canvas = null
            this.context = null
        }
    }

    setSize(width: number, height: number) {
        if (!this.context || !this.canvas) throw new Error("Need to call setCanvas first")

        this.buffer.width = this.canvas.width
        this.buffer.height = this.canvas.height
        this.buffer.getContext("2d")!.drawImage(this.canvas, 0, 0)

        const ratio = width / this.canvas.width

        this.canvas.width = width
        this.canvas.height = height
        this.context.drawImage(this.buffer, 0, 0, width, this.buffer.height * ratio)
    }

    resizeToClientSize() {
        if (!this.context || !this.canvas) throw new Error("Need to call setCanvas first")
        const { clientWidth, clientHeight } = this.canvas
        const { devicePixelRatio } = window
        this.setSize(clientWidth * devicePixelRatio, clientHeight * devicePixelRatio)
        this.context.scale(devicePixelRatio, devicePixelRatio)
    }

    on<E extends OuijaEvent>(event: E, callback: (...args: OuijaEventArgs<E>) => void) {
        this.listeners[event].add(callback)
    }

    off<E extends OuijaEvent>(event: E, callback: (...args: OuijaEventArgs<E>) => void) {
        this.listeners[event].delete(callback)
    }

    clear() {
        if (!this.context || !this.canvas) throw new Error("Need to call setCanvas first")
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    private playStroke(stroke: Stroke) {
        // TODO: x and y need to be normalized positions
        // TODO: need to replay events as if they occurreed via pointermove
        stroke.points.forEach(({ position, time }) => {
            setTimeout(() => this.brush(...position), time)
        })
    }

    private emit<E extends OuijaEvent>(event: E, ...args: OuijaEventArgs<E>) {
        for (let callback of this.listeners[event]) {
            callback(...args as [])
        }
    }

    private sendStroke(stroke: Stroke) {
        this.socket.emit("stroke", stroke)
    }

    private brush(x: number, y: number, size = 1) {
        if (!this.brushImage.complete) throw new Error("Await TrustCanvas#loaded before drawing")
        const c = this.context!
        const angle = 2 * Math.PI * Math.random()
        c.translate(x, y)
        c.rotate(angle)
        c.scale(size, size)
        c.drawImage(this.brushImage, -this.brushImage.width / 2, -this.brushImage.width / 2)
        c.scale(1 / size, 1 / size)
        c.rotate(-angle)
        c.translate(-x, -y)
    }

    private pointFromEvent(e: PointerEvent): Vec {
        const { left, top } = this.canvas!.getBoundingClientRect()
        const { clientX, clientY } = e
        return [clientX - left, clientY - top]
    }

    private setupListeners() {
        if (!this.context || !this.canvas) throw new Error("Need to call setCanvas first")

        if (this.brushDownListener) {
            this.canvas?.removeEventListener('pointerdown', this.brushDownListener)
        }

        const stroke: Stroke = {
            points: []
        }
        let downTime = 0
        let lastScale = this.brushScaleMin

        this.brushDownListener = (e: PointerEvent) => {
            e.preventDefault()
            e.stopPropagation()
            downTime = Date.now()
            const c = this.smoothingCurve
            const [x, y] = this.pointFromEvent(e)
            stroke.points = [{ position: [x, y], time: downTime }]
            lastScale = this.brushScaleMin
            this.brush(x, y, this.brushScaleMin)
            c.p0x = c.c0x = c.c1x = c.p1x = x;
            c.p0y = c.c0y = c.c1y = c.p1y = y;
            window.addEventListener('pointermove', move)
            window.addEventListener('pointerup', up)
        }

        const move = (e: PointerEvent) => {
            e.preventDefault()
            e.stopPropagation()

            const c = this.smoothingCurve
            const t = this.smoothingFactor

            const [x, y] = this.pointFromEvent(e)

            const squaredSpeed = (x - c.p0x) ** 2 + (y - c.p0y) ** 2

            if (squaredSpeed > this.minSquaredSpeed) {
                stroke.points.push({ position: [x, y], time: Date.now() - downTime })

                const speed = squaredSpeed ** 0.5
                const strokeAngle = Math.atan2(y - c.p0y, x - c.p0x)
                const angleMatch = (1 - Math.abs(angleDifference(strokeAngle, this.downAngle) / Math.PI)) ** 2
                const scale =
                    this.brushScaleMin +
                    speed * this.brushScaleSpeedFactor +
                    angleMatch * this.brushScaleAngleFactor

                // TODO: something isn't right here.

                c.p1x = c.c1x
                c.c1x = c.c0x
                c.c0x = c.p0x
                c.p0x = lerp(c.p0x, x, t)

                c.p1y = c.c1y
                c.c1y = c.c0y
                c.c0y = c.p0y
                c.p0y = lerp(c.p0y, y, t)

                const points = c.getPoints(this.smoothingSteps)
                points.forEach((point, i, a) => {
                    const [x, y] = point!
                    const interpolatedScale = lerp(lastScale, scale, i / (a.length - 1))
                    this.brush(x, y, interpolatedScale)
                })

                lastScale = scale
            }
        }

        const up = () => {
            this.emit("brush-end")
            this.sendStroke(stroke)
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
        }

        this.canvas.addEventListener('pointerdown', this.brushDownListener)
        this.canvas.addEventListener("touchstart", e => e.preventDefault(), { passive: false })
        this.canvas.addEventListener("touchmove", e => e.preventDefault(), { passive: false })
        this.canvas.addEventListener("touchend", e => e.preventDefault(), { passive: false })
        this.canvas.addEventListener("touchcancel", e => e.preventDefault(), { passive: false })
    }
}