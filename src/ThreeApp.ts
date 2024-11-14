import {
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'

export default class ThreeApp {
  canvas: HTMLCanvasElement
  renderer: WebGLRenderer
  scene: Scene
  camera: PerspectiveCamera
  cube: Mesh

  private raf = -1

  constructor(canvas: HTMLCanvasElement, width: number, height: number, dpr: number) {
    this.canvas = canvas

    this.renderer = new WebGLRenderer({ canvas })
    this.renderer.setSize(width, height, !(canvas instanceof OffscreenCanvas))
    this.renderer.setPixelRatio(dpr)

    this.camera = new PerspectiveCamera(60, width / height, 0.1, 1000)
    this.camera.position.z = 5
    this.camera.lookAt(new Vector3())

    this.scene = new Scene()

    this.cube = new Mesh(new BoxGeometry(), new MeshNormalMaterial())
    this.scene.add(this.cube);
  }

  dispose() {
    this.pause()
    this.renderer.dispose()
  }

  play() {
    this.onUpdate()
  }

  pause() {
    cancelAnimationFrame(this.raf)
    this.raf = -1
  }

  update() {
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01
  }

  draw() {
    this.renderer.render(this.scene, this.camera)
  }

  onUpdate = () => {
    this.update()
    this.draw()
    this.raf = requestAnimationFrame(this.onUpdate)
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, !(this.canvas instanceof OffscreenCanvas))
  }
}