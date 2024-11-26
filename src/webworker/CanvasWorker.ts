import { ProxyManager } from './ProxyManager';
import ThreeApp from '../webgl/ThreeApp'

let app: ThreeApp
const proxyManager = new ProxyManager();

function createApp(data: any) {
  const canvas = data.canvas as HTMLCanvasElement
  if (!(canvas instanceof OffscreenCanvas)) {
    console.log(`Doesn't support offscreen`)
    return
  }

  const proxy = proxyManager.getProxy(data.canvasId);
  app = new ThreeApp(canvas, proxy, data)
  app.play()
}

self.onmessage = (event) => {
  const type = event.data.type
  switch (type) {
    case 'init':
      createApp(event.data)
      break
    case 'loadComplete':
      app.onLoad(event.data.data)
      break
    case 'event':
      proxyManager.handleEvent(event.data)
      break
    case 'makeProxy':
      proxyManager.makeProxy(event.data)
      break
  }
}
