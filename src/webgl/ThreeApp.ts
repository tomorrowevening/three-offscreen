import {
  AmbientLight,
  AnimationMixer,
  BoxGeometry,
  Clock,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Texture,
  Vector2,
  WebGLRenderer,
} from 'three'
import { clamp, damp, degToRad } from 'three/src/math/MathUtils.js'
import { Assets } from '../types'
import { createGLTF } from './threeUtils'

export default class ThreeApp {
  canvas: HTMLCanvasElement
  renderer: WebGLRenderer
  scene: Scene
  camera: PerspectiveCamera
  container: Group
  cube: Mesh

  private clock = new Clock()
  private raf = -1
  private mixer?: AnimationMixer
  private isMouseDown = false
  private targetRotation = 0
  private targetZ = 0

  constructor(canvas: HTMLCanvasElement, width: number, height: number, dpr: number) {
    this.canvas = canvas

    this.renderer = new WebGLRenderer({ canvas })
    this.renderer.setSize(width, height, !(canvas instanceof OffscreenCanvas))
    this.renderer.setPixelRatio(dpr)

    this.camera = new PerspectiveCamera(60, width / height, 0.1, 1000)
    this.camera.position.z = 12
    this.targetZ = this.camera.position.z

    this.scene = new Scene()

    this.container = new Group()
    this.scene.add(this.container)

    this.cube = new Mesh(new BoxGeometry(), new MeshPhongMaterial())
    this.container.add(this.cube);

    const light = new DirectionalLight()
    light.position.set(3, 5, 5)
    this.scene.add(light)

    const ambient = new AmbientLight(0xffffff, 0.1)
    this.scene.add(ambient)

    this.clock.start()
  }

  dispose() {
    this.pause()
    this.renderer.dispose()
  }

  onLoad(assets: Assets) {
    // Show loaded Texture
    const texture = new Texture(assets.textures.uvGrid)
    texture.needsUpdate = true

    const material = new MeshBasicMaterial({ map: texture, side: DoubleSide })
    const mesh = new Mesh(new PlaneGeometry(), material)
    mesh.position.z = -5
    mesh.scale.setScalar(6)
    mesh.scale.y *= -1
    this.container.add(mesh)

    // GLTF Examples
    const gltf = createGLTF(assets.gltf.Horse)
    const model = gltf.model
    model.position.set(1.5, -1, 0)
    model.scale.setScalar(0.01)
    this.container.add(model)
    this.mixer = gltf.mixer
  }

  play() {
    this.onUpdate()
  }

  pause() {
    cancelAnimationFrame(this.raf)
    this.raf = -1
  }

  update() {
    const delta = this.clock.getDelta()
    this.mixer?.update(delta)

    this.cube.rotation.x += delta

    const deltaX = delta * 100
    this.camera.position.z = damp(this.camera.position.z, this.targetZ, 0.1, deltaX)
    this.container.rotation.y = damp(this.container.rotation.y, this.targetRotation, 0.1, deltaX)
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

  // Events

  private mouseDownPt = new Vector2()

  mouseDown(x: number, y: number) {
    this.isMouseDown = true
    this.mouseDownPt.set(x, y)
  }

  mouseMove(x: number, _y: number) {
    if (this.isMouseDown) {
      const scale = 0.01
      const deltaX = this.mouseDownPt.x - x
      this.targetRotation += degToRad(deltaX * scale);
    }
  }

  mouseUp(_x: number, _y: number) {
    this.isMouseDown = false
  }

  wheel(_position: number, delta: number) {
    this.targetZ = clamp(this.targetZ + delta, 3, 15)
  }
}