import {
  AmbientLight,
  AnimationMixer,
  BoxGeometry,
  Clock,
  CubeReflectionMapping,
  CubeTexture,
  DirectionalLight,
  DoubleSide,
  HalfFloatType,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Texture,
  WebGLRenderer,
} from 'three'
import { EffectComposer, EffectPass, FXAAEffect, RenderPass, VignetteEffect } from 'postprocessing'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { AppSettings, Assets } from '../types'
import { createModel } from './threeUtils'

export default class ThreeApp {
  canvas: HTMLCanvasElement
  renderer: WebGLRenderer
  scene: Scene
  camera: PerspectiveCamera
  cube: Mesh
  private inputElement: any
  private composer: EffectComposer
  private raf = -1
  private clock = new Clock()
  private controls?: OrbitControls
  private fbxMixer?: AnimationMixer
  private gltfMixer?: AnimationMixer

  constructor(canvas: HTMLCanvasElement, inputElement: any, settings: AppSettings) {
    console.log(settings)
    this.canvas = canvas
    this.inputElement = inputElement

    this.renderer = new WebGLRenderer({ canvas })
    this.renderer.setPixelRatio(settings.dpr)

    // Scene

    this.camera = new PerspectiveCamera(60, settings.width / settings.height, 0.1, 100)
    this.camera.position.z = 12

    this.scene = new Scene()

    this.cube = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ roughness: 0.1, metalness: 0.75 }))
    this.scene.add(this.cube);

    const light = new DirectionalLight()
    light.position.set(3, 5, 5)
    this.scene.add(light)

    const ambient = new AmbientLight(0xffffff, 0.1)
    this.scene.add(ambient)

    // Post
    this.composer = new EffectComposer(this.renderer, { frameBufferType: HalfFloatType })
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(new EffectPass(this.camera, new FXAAEffect(), new VignetteEffect()))

    // Begin App

    this.clock.start()

    inputElement.addEventListener('resize', this.onResize)
    this.resize(settings.width, settings.height)

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

  async onLoad(assets: Assets) {
    // Cube Texture
    const cubeTexture = new CubeTexture([
      assets.image.get('px'),
      assets.image.get('nx'),
      assets.image.get('py'),
      assets.image.get('ny'),
      assets.image.get('pz'),
      assets.image.get('nz'),
    ], CubeReflectionMapping)
    cubeTexture.needsUpdate = true
    this.scene.background = cubeTexture

    // Image
    const texture = new Texture(assets.image.get('uvGrid'))
    texture.needsUpdate = true
    const material = new MeshBasicMaterial({ map: texture, side: DoubleSide })
    const mesh = new Mesh(new PlaneGeometry(), material)
    mesh.position.z = -5
    mesh.scale.setScalar(6)
    mesh.scale.y *= -1
    this.scene.add(mesh)

    // FBX
    const fbx = await createModel(assets.model.get('Idle')!)
    fbx.model.position.set(-1.5, -1, 0)
    fbx.model.scale.setScalar(0.01)
    this.scene.add(fbx.model)
    this.fbxMixer = fbx.mixer

    // GLTF
    const gltf = await createModel(assets.model.get('Horse')!)
    gltf.model.position.set(1.5, -1, 0)
    gltf.model.scale.setScalar(0.01)
    this.scene.add(gltf.model)
    this.gltfMixer = gltf.mixer
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
    this.fbxMixer?.update(delta)
    this.gltfMixer?.update(delta)
    this.cube.rotation.x += delta
    this.controls?.update(delta)
  }

  draw() {
    this.composer.render()
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
    const updateStyle = !(this.canvas instanceof OffscreenCanvas)
    this.composer.setSize(width, height, updateStyle)
  }

  // Handlers

  private onResize = (evt: any) => {
    const { width, height } = evt
    this.resize(width, height)
  }
}