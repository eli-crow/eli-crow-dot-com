import { clamp } from "three/src/math/MathUtils";
import { BezierSpline } from "../../lib/bezier";
import { BezierSpline3D, SplineDescription3D } from "../../lib/bezier3";
import { bezierCurveTo2D } from "../../lib/utilities";
import * as V3 from "../../lib/v3";

export class Rail {
  private spline3d: BezierSpline3D;
  private spline2d: BezierSpline;
  private t: number = Math.random();

  constructor(
    splineDescription: SplineDescription3D,
    public bead: THREE.Mesh,
    private camera: THREE.Camera,
    private renderer: THREE.WebGLRenderer,
    public minT = 0,
    public maxT = 1
  ) {
    this.spline3d = new BezierSpline3D(splineDescription);
    this.spline2d = BezierSpline.fromCurves(
      this.spline3d.curves.map((c) => bezierCurveTo2D(c, this.camera))
    );

    this.calculate2d();
    this.update(this.t);
  }

  calculate2d() {
    this.spline2d = BezierSpline.fromCurves(
      this.spline3d.curves.map((c) => bezierCurveTo2D(c, this.camera))
    );
  }

  getSVGPath() {
    return this.spline2d.getSvgPathData();
  }

  update(t: number) {
    this.t = clamp(t, this.minT, this.maxT);

    const location2d = this.spline2d.getCurveLocation(this.t);

    if (!location2d) return;

    const pos = this.spline3d.getPointAtCurveLocation(location2d);
    const tan = this.spline3d.getTangentAtCurveLocation(location2d);

    this.bead.position.set(...pos);
    this.bead.lookAt(...V3.add(pos, tan));
  }

  updateFromEvent(e: PointerEvent) {
    const { clientWidth, clientHeight } = this.renderer.domElement;

    const x = (e.offsetX / clientWidth) * 2 - 1;
    const y = (e.offsetY / clientHeight) * 2 - 1;

    const t = this.spline2d.getNearestTInWindingOrder(this.t, [x, y]);

    if (t) this.update(t);
  }
}
