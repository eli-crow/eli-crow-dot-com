import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { convertBlenderLightUnitsToThreeUnits } from "../../lib/utilities";

const DRACO_URL = "https://www.gstatic.com/draco/v1/decoders/";

interface GLTFViewerSceneOptions {
  gltf: string;
  environment?: THREE.DataTexture | string;
  environmentIsBackground?: boolean;
  clearColor?: string;
  pannable?: boolean;
  zoomable?: boolean;
  rotatable?: boolean;
  autoRotate?: boolean;
  defaultZoom?: number;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
  onAfterInit?: (scene: THREE.Scene, gltf: GLTF) => void;
  onUpdate?: () => void;
}

export class GLTFViewerScene {
  public controls: OrbitControls | undefined;
  protected camera: THREE.Camera | undefined;
  protected scene: THREE.Scene;
  protected environmentTexture: THREE.DataTexture | undefined;
  protected mixer: THREE.AnimationMixer | undefined;
  protected lastTime: number = 0;
  protected renderer: THREE.WebGLRenderer;
  private options: GLTFViewerSceneOptions;
  private raf: number = -1;
  private gltf: GLTF | undefined;
  private isLoaded: boolean = false;

  get doesAnimate() {
    return this.options.autoRotate ?? false;
  }

  constructor(options: GLTFViewerSceneOptions) {
    this.options = {
      ...({ defaultZoom: 1 } as GLTFViewerSceneOptions),
      ...options,
    };

    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      antialias: true,
      alpha: !(this.options.environmentIsBackground || this.options.clearColor),
    });

    if (this.options.clearColor)
      this.renderer.setClearColor(new THREE.Color(this.options.clearColor));
    this.renderer.physicallyCorrectLights = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.scene = new THREE.Scene();
  }

  async load() {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_URL);
    gltfLoader.setDRACOLoader(dracoLoader);
    this.gltf = await gltfLoader.loadAsync(this.options.gltf);

    if (this.options.environment) {
      await this.setEnvironment(this.options.environment);
    }

    this.isLoaded = true;
  }

  init(container: HTMLElement) {
    if (!this.gltf) throw new Error("Call and await load() before init");

    this.scene.add(this.gltf.scene);
    this.scene.traverse((o) => {
      //objects otherwise disappear at certain angles
      o.frustumCulled = false;

      if (o instanceof THREE.PointLight) {
        o.intensity = convertBlenderLightUnitsToThreeUnits(o.intensity);
      } else if (
        o instanceof THREE.Mesh &&
        o.material instanceof THREE.MeshPhysicalMaterial
      ) {
        o.material.toneMapped = false;
      }
    });

    this.camera = this.gltf.cameras[0];
    if (!this.camera) throw new Error("The loaded scene must have a camera.");
    if (this.camera.parent) {
      this.camera.position.copy(this.camera.parent.position);
      this.camera.quaternion.copy(this.camera.parent.quaternion);
      this.camera.scale.copy(this.camera.parent.scale);
    }
    this.scene.add(this.camera);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    const cameraTarget = this.gltf.scene.children.find(
      (o) => o.userData.name === "CameraTarget"
    );
    if (cameraTarget) {
      this.controls.target.copy(cameraTarget.position);
    }
    if (this.options.onInteractionStart)
      this.controls.addEventListener("start", this.options.onInteractionStart);
    if (this.options.onInteractionEnd)
      this.controls.addEventListener("end", this.options.onInteractionEnd);
    this.controls.enablePan = this.options.pannable ?? false;
    this.controls.enableZoom = this.options.zoomable ?? false;
    this.controls.enableRotate = this.options.rotatable ?? false;
    if (this.doesAnimate) this.controls.enableDamping = true;
    const distance =
      cameraTarget?.position.distanceTo(this.camera.position) ?? 10;
    if (this.options.zoomable) {
      this.controls.minDistance = distance * 0.5;
      this.controls.maxDistance = distance * 2;
    } else {
      this.controls.minDistance = distance;
      this.controls.maxDistance = distance;
    }
    this.controls.minPolarAngle = Math.PI * 0.25;
    this.controls.maxPolarAngle = Math.PI * 0.75;
    this.controls.update();
    if (this.options.autoRotate) this.controls.autoRotate = true;
    if (!this.doesAnimate) {
      this.controls.addEventListener("change", () => this.render());
    }

    if (this.gltf.animations.length) {
      this.mixer = new THREE.AnimationMixer(this.scene);
      this.gltf.animations.forEach((clip) =>
        this.mixer!.clipAction(clip).play()
      );
    }

    this.options.onAfterInit?.(this.scene, this.gltf);

    container.appendChild(this.renderer.domElement);

    window.addEventListener("resize", () => this.handleResize());
    this.handleResize();

    if (this.doesAnimate) {
      this.raf = window.requestAnimationFrame((t) => this.animate(t));
    }
  }

  dispose() {
    window.cancelAnimationFrame(this.raf);
    this.renderer?.forceContextLoss();
    this.renderer?.dispose();
    this.environmentTexture?.dispose();
  }

  async setEnvironment(environment: THREE.DataTexture | string) {
    this.environmentTexture =
      typeof environment === "string"
        ? await this.loadEnvironmentTexture(environment)
        : environment;

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    this.environmentTexture.mapping = THREE.EquirectangularReflectionMapping;
    const cubeRenderTarget = pmremGenerator.fromEquirectangular(
      this.environmentTexture
    );
    const envMap = cubeRenderTarget.texture ?? null;

    this.scene.environment = envMap;
    if (this.options.environmentIsBackground)
      this.scene.background = this.environmentTexture;

    if (!this.doesAnimate && this.isLoaded) this.render();
  }

  protected render() {
    this.renderer.render(this.scene, this.camera!);
  }

  private async loadEnvironmentTexture(src: string) {
    if (src.endsWith(".exr")) return await new EXRLoader().loadAsync(src);
    if (src.endsWith(".hdr")) return await new RGBELoader().loadAsync(src);
    throw new Error(`Environment map extension not supported: ${src}`);
  }

  private handleResize() {
    const { clientWidth: w, clientHeight: h } =
      this.renderer.domElement.parentElement!;

    this.renderer.setSize(w, h);

    if (this.camera instanceof THREE.PerspectiveCamera) {
      const { defaultZoom = 1 } = this.options;
      const aspect = w / h;
      this.camera.aspect = aspect;
      this.camera.zoom = h > w ? aspect * defaultZoom : defaultZoom;
      this.camera.updateProjectionMatrix();
    }

    if (!this.doesAnimate) this.render();
  }

  private animate(time: number) {
    this.mixer?.update((time - this.lastTime) / 1_000);
    this.controls?.update();
    this.options.onUpdate?.();

    this.render();

    this.lastTime = time;

    this.raf = window.requestAnimationFrame((t) => this.animate(t));
  }
}
