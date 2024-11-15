export default class Workers {
  static canvas: Worker | null
  static loader: Worker | null

  static init() {
    this.canvas = new Worker(new URL('./CanvasWorker.ts', import.meta.url), { type: 'module' })
    this.loader = new Worker(new URL('./LoadWorker.ts', import.meta.url), { type: 'module' })
  }

  static dispose() {
    this.canvas?.terminate()
    this.canvas = null
    this.loader?.terminate()
    this.loader = null
  }
}