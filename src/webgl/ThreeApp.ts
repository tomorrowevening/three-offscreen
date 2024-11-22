import {
  AmbientLight,
  AnimationMixer,
  BackSide,
  BoxGeometry,
  Clock,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  Texture,
  WebGLRenderer,
} from 'three'
import { Assets } from '../types'
import { createGLTF } from './threeUtils'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

export default class ThreeApp {
  canvas: HTMLCanvasElement
  renderer: WebGLRenderer
  scene: Scene
  camera: PerspectiveCamera
  cube: Mesh

  private clock = new Clock()
  private raf = -1
  private mixer?: AnimationMixer
  private controls?: OrbitControls
  private inputElement: any

  constructor(canvas: HTMLCanvasElement, inputElement: any, width: number, height: number, dpr: number) {
    this.canvas = canvas
    this.inputElement = inputElement

    this.renderer = new WebGLRenderer({ canvas })
    this.renderer.setPixelRatio(dpr)

    this.camera = new PerspectiveCamera(60, width / height, 0.1, 100)
    this.camera.position.z = 12

    this.scene = new Scene()

    this.cube = new Mesh(new BoxGeometry(), new MeshPhongMaterial())
    this.scene.add(this.cube);

    const sky = new Mesh(new SphereGeometry(20), new MeshNormalMaterial({ side: BackSide }))
    this.scene.add(sky)

    const light = new DirectionalLight()
    light.position.set(3, 5, 5)
    this.scene.add(light)

    const ambient = new AmbientLight(0xffffff, 0.1)
    this.scene.add(ambient)

    this.clock.start()

    inputElement.addEventListener('resize', this.onResize)
    this.resize(width, height)

    // @ts-ignore
    this.controls = new OrbitControls(this.camera, inputElement)
    this.controls.target.set( 0, 0, 0 );
    this.controls.enableDamping = true
    this.controls.maxDistance = 20
    this.controls.minDistance = 4
    this.controls.update()
  }

  dispose() {
    this.controls?.dispose()
    this.inputElement.removeEventListener('resize', this.onResize)
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
    this.mixer?.update(delta)

    this.cube.rotation.x += delta

    // const deltaX = delta * 100
    // this.camera.position.z = damp(this.camera.position.z, this.targetZ, 0.1, deltaX)
    // this.container.rotation.y = damp(this.container.rotation.y, this.targetRotation, 0.1, deltaX)

    this.controls?.update(delta)
    // @ts-ignore
    // console.log(this.controls.state, this.inputElement.clientHeight, this.camera.position)
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
    if (this.canvas instanceof OffscreenCanvas) {
      const offscreen = this.canvas as OffscreenCanvas
      this.inputElement.clientWidth = width
      this.inputElement.clientHeight = height
      // @ts-ignore
      offscreen.clientWidth = width
      // @ts-ignore
      offscreen.clientHeight = height
    }

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, !(this.canvas instanceof OffscreenCanvas))
  }

  // Handlers

  private onResize = (evt: any) => {
    const { width, height } = evt
    this.resize(width, height)
  }
}