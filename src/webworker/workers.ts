import { dispatcher, Events } from "../global/constants"

export default class Workers {
  static canvas: Worker | null
  static loader: Worker | null

  static init(offscreenSupported: boolean) {
    // Canvas

    if (offscreenSupported) {
      this.canvas = new Worker(new URL('./CanvasWorker.ts', import.meta.url), { type: 'module' })
    }

    // Loader

    this.loader = new Worker(new URL('./LoadWorker.ts', import.meta.url), { type: 'module' })
    this.loader.onmessage = (event: MessageEvent) => {
      if (event.data.type === 'loadComplete') {
        const assets = event.data.data
        dispatcher.dispatchEvent({ type: Events.LoadComplete, value: assets })
        this.canvas?.postMessage({ type: 'loadComplete', data: assets })
        this.loader?.terminate()
        this.loader = null
      }
    }

    const loadStart = (event: any) => {
      dispatcher.removeEventListener(Events.LoadStart, loadStart)
      this.loader?.postMessage({ type: 'loadStart', data: event.value })
    }
    dispatcher.addEventListener(Events.LoadStart, loadStart)
  }

  static dispose() {
    this.canvas?.terminate()
    this.canvas = null
    this.loader?.terminate()
    this.loader = null
  }
}