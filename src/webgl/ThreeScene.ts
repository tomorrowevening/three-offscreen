import {
  AmbientLight,
  AnimationMixer,
  BoxGeometry,
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
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { EffectComposer, EffectPass, FXAAEffect, RenderPass, VignetteEffect } from 'postprocessing'
import { createModel } from './threeUtils'
import { Assets } from '../types'

export default class ThreeScene extends Scene {
  camera: PerspectiveCamera
  cube: Mesh
  private composer: EffectComposer
  private controls?: OrbitControls
  private fbxMixer?: AnimationMixer
  private gltfMixer?: AnimationMixer

  constructor(renderer: WebGLRenderer, inputElement: any, width: number, height: number) {
    super();
    this.name = 'ThreeScene';

    this.camera = new PerspectiveCamera(60, width / height, 0.1, 100)
    this.camera.position.z = 12

    this.cube = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ roughness: 0.1, metalness: 0.75 }))
    this.add(this.cube);

    const light = new DirectionalLight()
    light.position.set(3, 5, 5)
    this.add(light)

    const ambient = new AmbientLight(0xffffff, 0.1)
    this.add(ambient)

    // Post
    this.composer = new EffectComposer(renderer, { frameBufferType: HalfFloatType })
    this.composer.addPass(new RenderPass(this, this.camera))
    this.composer.addPass(new EffectPass(this.camera, new FXAAEffect(), new VignetteEffect()))

    // Orbit
    // @ts-ignore
    this.controls = new OrbitControls(this.camera, inputElement)
    this.controls.target.set( 0, 0, 0 );
    this.controls.enableDamping = true
    this.controls.maxDistance = 20
    this.controls.minDistance = 4
    this.controls.update()
  }

  dispose() {
    this.controls?.dispose();
  }

  update(delta: number) {
    this.cube.rotation.x += delta
    this.fbxMixer?.update(delta)
    this.gltfMixer?.update(delta)
    this.controls?.update(delta)
  }

  draw() {
    this.composer.render()
  }

  resize(width: number, height: number, updateStyle: boolean) {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.composer.setSize(width, height, updateStyle)
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
    this.background = cubeTexture

    // Image
    const texture = new Texture(assets.image.get('uvGrid'))
    texture.needsUpdate = true
    const material = new MeshBasicMaterial({ map: texture, side: DoubleSide })
    const mesh = new Mesh(new PlaneGeometry(), material)
    mesh.position.z = -5
    mesh.scale.setScalar(6)
    mesh.scale.y *= -1
    this.add(mesh)

    // FBX
    const fbx = await createModel(assets.model.get('Idle')!)
    fbx.model.position.set(-1.5, -1, 0)
    fbx.model.scale.setScalar(0.01)
    this.add(fbx.model)
    this.fbxMixer = fbx.mixer

    // GLTF
    const gltf = await createModel(assets.model.get('Horse')!)
    gltf.model.position.set(1.5, -1, 0)
    gltf.model.scale.setScalar(0.01)
    this.add(gltf.model)
    this.gltfMixer = gltf.mixer
  }
}
