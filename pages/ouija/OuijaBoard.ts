import { io, Socket } from "socket.io-client";
import { catmull, lerp } from "../../lib/utilities";
import { angleDifference, Vec } from "../../lib/v";

const BRUSH_IMAGE_SRC =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFw2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZWRhMmIzZmFjLCAyMDIxLzExLzE3LTE3OjIzOjE5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjMuMSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDItMDVUMTc6MTg6MTMtMDU6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDItMDVUMTc6NDE6NTctMDU6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTAyLTA1VDE3OjQxOjU3LTA1OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozZDA4MjM3My04N2Y4LTQ2NmEtOTgzOS1lN2QxOTg0YTliZmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OGIyNmRmMjItNTQ4OC00OTUzLWEwOGYtNGFmZjBhZGNlOTVjIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OGIyNmRmMjItNTQ4OC00OTUzLWEwOGYtNGFmZjBhZGNlOTVjIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4YjI2ZGYyMi01NDg4LTQ5NTMtYTA4Zi00YWZmMGFkY2U5NWMiIHN0RXZ0OndoZW49IjIwMjItMDItMDVUMTc6MTg6MTMtMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMy4xIChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozZDA4MjM3My04N2Y4LTQ2NmEtOTgzOS1lN2QxOTg0YTliZmUiIHN0RXZ0OndoZW49IjIwMjItMDItMDVUMTc6NDE6NTctMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMy4xIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiZw9WAAAAFnSURBVDjLrdVLKERRGMDxYSYxkjyKshRJdsrGiGxsrWxEEhYkG7KwYGkjpaw8s7GxkBQbkbWd7FhQRB5hNR4N/6++U8fp3DGXWfyaO/fO/XfnzDlnIsVnBxFHvuecyAk4/4M5iCKGckxgGE3oxQIOcYRNNGcSzEOpHvfhC8/66rrDFKrSBY1GbOMdHwFBO9zvDoUdq8Wefvi3mC3hC9ZhHZ8hQuIBS5jEIuIm2IqXkDH7mzzpMCVMsPMPMZ8RE5zLQkyGa0xi9UhmIfiKIQnOZOnrih4JdmEfV/+MpcwTlmBVJ6pcuMZjyJj8yvNok2BcI+biOdZCPPEbptGOSgnmYsP50CVuM4jJ3DvBLAZQYKZNGZY9kzblTAvz/kY3iAZdJStocddyEcaxozcmraW4iw5dAFsy+NZ9sspG9f6Ib0+rwb3ztIPW9ULdP+17okHblxnTbhzjAqeozmS39gVjzvuKNH8JXt9HPHuK3bJLcgAAAABJRU5ErkJggg==";
const TOUCH_EVENTS = [
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
] as const;

interface ClientToServerEvents {
  stroke: (stroke: Stroke) => void;
  clear: () => void;
}

interface ServerToClientEvents {
  stroked: (stroke: Stroke) => void;
  cleared: () => void;
}

interface Stroke {
  points: { position: Vec; time: number }[];
}

type OuijaEventPayloads = {
  "brush-end": undefined;
};

type OuijaEvent = keyof OuijaEventPayloads;

type OuijaEventArgs<E extends OuijaEvent> =
  OuijaEventPayloads[E] extends undefined
    ? []
    : [payload: OuijaEventPayloads[E]];

export class OuijaBoard {
  readonly loaded: Promise<void>;
  private canvas: HTMLCanvasElement | null = null;
  private bufferCanvas: HTMLCanvasElement = document.createElement("canvas");
  private context: CanvasRenderingContext2D | null = null;
  private brushImage: HTMLImageElement;
  private brushDownListener: ((e: PointerEvent) => void) | null = null;
  private listeners: {
    [E in keyof OuijaEventPayloads]: Set<(...args: OuijaEventArgs<E>) => void>;
  } = {
    "brush-end": new Set(),
  };
  private smoothingFactor = 0.5;
  private minSquaredPixelDist = 5 ** 2;
  private brushScaleMin = 0.22;
  private brushScaleSpeedFactor = 0.06;
  private brushScaleAngleFactor = 0.4;
  private downAngle = 0.6 * Math.PI;
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
  private lastScale = 0;
  private recordedStroke: Stroke = {
    points: [],
  };
  private smoothingPoints: [Vec, Vec, Vec, Vec] = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];

  constructor() {
    this.brushImage = new Image();
    this.brushImage.src = BRUSH_IMAGE_SRC;
    this.loaded = new Promise((resolve) => {
      this.brushImage.onload = () => resolve();
    });

    this.socket.on("connect", () => {
      console.log("connected");
    });

    this.socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    this.socket.on("stroked", (stroke) => this.playStroke(stroke));
    this.socket.on("cleared", () => this.clearInternal());
  }

  setCanvas(canvas: HTMLCanvasElement | undefined | null) {
    if (canvas) {
      this.canvas = canvas;
      this.context = this.canvas.getContext("2d");
      this.resizeToClientWidth();
      this.setupListeners();
    } else {
      this.canvas = null;
      this.context = null;
    }
  }

  setSize(width: number, height: number) {
    if (!this.context || !this.canvas)
      throw new Error("Need to call setCanvas first");

    this.bufferCanvas.width = this.canvas.width;
    this.bufferCanvas.height = this.canvas.height;
    this.bufferCanvas.getContext("2d")!.drawImage(this.canvas, 0, 0);

    const ratio = width / this.canvas.width;

    this.canvas.width = width;
    this.canvas.height = height;
    this.context.drawImage(
      this.bufferCanvas,
      0,
      0,
      width,
      this.bufferCanvas.height * ratio
    );
  }

  resizeToClientWidth() {
    if (!this.context || !this.canvas)
      throw new Error("Need to call setCanvas first");
    const { clientWidth } = this.canvas;
    const { devicePixelRatio } = window;
    this.setSize(
      clientWidth * devicePixelRatio,
      clientWidth * devicePixelRatio
    );
    this.context.scale(devicePixelRatio, devicePixelRatio);
  }

  on<E extends OuijaEvent>(
    event: E,
    callback: (...args: OuijaEventArgs<E>) => void
  ) {
    this.listeners[event].add(callback);
  }

  off<E extends OuijaEvent>(
    event: E,
    callback: (...args: OuijaEventArgs<E>) => void
  ) {
    this.listeners[event].delete(callback);
  }

  private clearInternal() {
    if (!this.context || !this.canvas)
      throw new Error("Need to call setCanvas first");
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  clear() {
    this.socket.emit("clear");
    this.clearInternal();
  }

  destroy() {
    this.listeners = {
      "brush-end": new Set(),
    };
    this.socket.disconnect();
  }

  private playStroke(stroke: Stroke) {
    // TODO: x and y need to be normalized positions
    stroke.points.forEach(({ position, time }, i) => {
      if (i === 0) {
        this.strokeDown(...position);
      } else {
        setTimeout(() => this.strokeMove(...position), time);
      }
    });
  }

  private emit<E extends OuijaEvent>(event: E, ...args: OuijaEventArgs<E>) {
    for (let callback of this.listeners[event]) {
      callback(...(args as any));
    }
  }

  private sendStroke(stroke: Stroke) {
    this.socket.emit("stroke", stroke);
  }

  private drawBrush(x: number, y: number, size = 1) {
    if (!this.brushImage.complete)
      throw new Error("Await TrustCanvas#loaded before drawing");
    if (!this.context || !this.canvas)
      throw new Error("Need to call setCanvas first");
    // un-normalize coordinates
    x = x * this.canvas.clientWidth;
    y = y * this.canvas.clientHeight;
    const c = this.context!;
    const angle = 2 * Math.PI * Math.random();
    c.translate(x, y);
    c.rotate(angle);
    c.scale(size, size);
    c.drawImage(
      this.brushImage,
      -this.brushImage.width / 2,
      -this.brushImage.height / 2
    );
    c.scale(1 / size, 1 / size);
    c.rotate(-angle);
    c.translate(-x, -y);
  }

  private strokeDown(x: number, y: number) {
    const p = this.smoothingPoints;
    this.lastScale = this.brushScaleMin;
    this.drawBrush(x, y, this.brushScaleMin);
    p[0][0] = p[1][0] = p[2][0] = p[3][0] = x;
    p[0][1] = p[1][1] = p[2][1] = p[3][1] = y;
  }

  private *getSmoothPoints(n: number) {
    const p = this.smoothingPoints;
    for (var i = 0; i < n; i++) {
      const t = i / (n - 1);
      yield [
        catmull(t, p[3][0], p[2][0], p[1][0], p[0][0]),
        catmull(t, p[3][1], p[2][1], p[1][1], p[0][1]),
      ] as Vec;
    }
  }

  private strokeMove(x: number, y: number) {
    const p = this.smoothingPoints;
    const t = this.smoothingFactor;
    // HACK: shouldn't use normalized coordinates here, but it's okay since it's square.
    const speed = ((x - p[0][0]) ** 2 + (y - p[0][1]) ** 2) ** 0.5;
    const strokeAngle = Math.atan2(y - p[0][1], x - p[0][0]);
    const angleMatch =
      (1 - Math.abs(angleDifference(strokeAngle, this.downAngle) / Math.PI)) **
      2;
    const scale =
      this.brushScaleMin +
      speed * this.brushScaleSpeedFactor +
      angleMatch * this.brushScaleAngleFactor;

    p[3][0] = p[2][0];
    p[2][0] = p[1][0];
    p[1][0] = p[0][0];
    p[0][0] = lerp(p[0][0], x, t);

    p[3][1] = p[2][1];
    p[2][1] = p[1][1];
    p[1][1] = p[0][1];
    p[0][1] = lerp(p[0][1], y, t);

    // HACK: won't work if canvas is not square
    const points = Array.from(this.getSmoothPoints((speed * 500) ** 0.85));
    points.forEach((point, i, a) => {
      const [x, y] = point!;
      const interpolatedScale = lerp(this.lastScale, scale, i / (a.length - 1));
      this.drawBrush(x, y, interpolatedScale);
    });

    this.lastScale = scale;
  }

  private pointFromEvent(e: PointerEvent): Vec {
    const { left, top, width, height } = this.canvas!.getBoundingClientRect();
    const { clientX, clientY } = e;
    return [(clientX - left) / width, (clientY - top) / height];
  }

  /** Set up listeners, record stroke events, send to socket */
  private setupListeners() {
    if (!this.context || !this.canvas)
      throw new Error("Need to call setCanvas first");

    if (this.brushDownListener) {
      this.canvas?.removeEventListener("pointerdown", this.brushDownListener);
    }

    let strokeDownTime = 0;
    let lastX = 0;
    let lastY = 0;

    this.brushDownListener = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      lastX = e.clientX;
      lastY = e.clientY;
      strokeDownTime = Date.now();

      const [x, y] = this.pointFromEvent(e);
      this.recordedStroke.points = [{ position: [x, y], time: strokeDownTime }];
      this.strokeDown(x, y);

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };

    const move = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const squaredPixelDistance =
        (e.clientX - lastX) ** 2 + (e.clientY - lastY) ** 2;

      if (squaredPixelDistance > this.minSquaredPixelDist) {
        const [x, y] = this.pointFromEvent(e);
        this.recordedStroke.points.push({
          position: [x, y],
          time: Date.now() - strokeDownTime,
        });
        this.strokeMove(x, y);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const up = () => {
      this.emit("brush-end");
      this.sendStroke(this.recordedStroke);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    this.canvas.addEventListener("pointerdown", this.brushDownListener);

    TOUCH_EVENTS.forEach((t) =>
      this.canvas!.addEventListener(t, (e) => e.preventDefault(), {
        passive: false,
      })
    );
  }
}
