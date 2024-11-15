/* eslint-disable @typescript-eslint/no-explicit-any */
import ThreeApp from '../webgl/ThreeApp'

let app: ThreeApp

function createApp(data: any) {
  const canvas = data.canvas as HTMLCanvasElement
  if (!(canvas instanceof OffscreenCanvas)) {
    console.log(`Doesn't support offscreen`)
    return
  }

  app = new ThreeApp(canvas, data.width, data.height, data.dpr)
  app.play()

  self.postMessage({ type: 'initComplete' })
}

self.onmessage = (event) => {
  switch (event.data.type) {
    case 'init':
      createApp(event.data)
      break;
    case 'resize':
      app.resize(event.data.width, event.data.height)
      break
    case 'loadComplete':
      app.onLoad(event.data.data)
      break
  }
}
