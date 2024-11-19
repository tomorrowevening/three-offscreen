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
}

self.onmessage = (event) => {
  switch (event.data.type) {
    // WebGL Events
    case 'init':
      createApp(event.data)
      break;
    case 'resize':
      app.resize(event.data.width, event.data.height)
      break
    // Loading
    case 'loadComplete':
      app.onLoad(event.data.data)
      break
    // Interaction Events
    case 'mouseDown':
      app.mouseDown(event.data.x, event.data.y)
      break
    case 'mouseMove':
      app.mouseMove(event.data.x, event.data.y)
      break
    case 'mouseUp':
      app.mouseUp(event.data.x, event.data.y)
      break
    case 'wheel':
      app.wheel(event.data.position, event.data.delta)
      break;
  }
}
