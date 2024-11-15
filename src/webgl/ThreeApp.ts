import {
  AmbientLight,
  AnimationMixer,
  BoxGeometry,
  Clock,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Texture,
  WebGLRenderer,
} from 'three'
import { Assets } from '../types'
import { createGLTF } from './threeUtils'

export default class ThreeApp {
  canvas: HTMLCanvasElement
  renderer: WebGLRenderer
  scene: Scene
  camera: PerspectiveCamera
  cube: Mesh

  private clock = new Clock()
  private raf = -1
  private mixer?: AnimationMixer

  constructor(canvas: HTMLCanvasElement, width: number, height: number, dpr: number) {
    this.canvas = canvas

    this.renderer = new WebGLRenderer({ canvas })
    this.renderer.setSize(width, height, !(canvas instanceof OffscreenCanvas))
    this.renderer.setPixelRatio(dpr)

    this.camera = new PerspectiveCamera(60, width / height, 0.1, 1000)
    this.camera.position.z = 5

    this.scene = new Scene()

    this.cube = new Mesh(new BoxGeometry(), new MeshPhongMaterial())
    this.scene.add(this.cube);

    const light = new DirectionalLight()
    light.position.set(1, 5, 5)
    this.scene.add(light)

    const ambient = new AmbientLight(0xffffff, 0.4)
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

    const material = new MeshBasicMaterial({ map: texture })
    const mesh = new Mesh(new PlaneGeometry(), material)
    mesh.position.z = -5
    mesh.scale.setScalar(6)
    mesh.scale.y *= -1
    this.scene.add(mesh)

    // GLTF Examples
    const gltf = createGLTF(assets.gltf.Horse)
    const model = gltf.model
    model.position.set(1.5, -1, 0)
    model.scale.setScalar(0.01)
    this.scene.add(model)
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
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01
    this.mixer?.update(delta)
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