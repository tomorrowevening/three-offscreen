import { Clock, WebGLRenderer } from 'three'
import ThreeScene from './ThreeScene'
import { AppSettings, Assets } from '../types'
import { dispose } from './threeUtils'

export default class ThreeApp {
  canvas: HTMLCanvasElement
  renderer: WebGLRenderer
  scene: ThreeScene
  private inputElement: any
  private raf = -1
  private clock = new Clock()

  constructor(canvas: HTMLCanvasElement, inputElement: any, settings: AppSettings) {
    console.log(settings)
    this.canvas = canvas
    this.inputElement = inputElement

    this.renderer = new WebGLRenderer({ canvas })
    this.renderer.setPixelRatio(settings.dpr)

    // Scene

    this.scene = new ThreeScene(this.renderer, inputElement, settings.width, settings.height)

    // Begin App

    this.clock.start()

    inputElement.addEventListener('resize', this.onResize)
    this.resize(settings.width, settings.height)
  }

  dispose() {
    this.pause()
    this.inputElement.removeEventListener('resize', this.onResize)
    dispose(this.scene)
    this.renderer.dispose()
  }

  async onLoad(assets: Assets) {
    return this.scene.onLoad(assets);
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
    this.scene.update(delta)
  }

  draw() {
    this.scene.draw()
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

    const updateStyle = !(this.canvas instanceof OffscreenCanvas)
    this.scene.resize(width, height, updateStyle);
  }

  // Handlers

  private onResize = (evt: any) => {
    const { width, height } = evt
    this.resize(width, height)
  }
}