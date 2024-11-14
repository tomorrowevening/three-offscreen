import ThreeApp from './ThreeApp'

let app: ThreeApp

self.onmessage = (event) => {
  const width = event.data.width
  const height = event.data.height

  if (event.data.type === 'init') {
    const canvas = event.data.canvas as HTMLCanvasElement;
    if (!(canvas instanceof OffscreenCanvas)) {
      console.log(`Doesn't support offscreen`)
      return
    }

    app = new ThreeApp(canvas, width, height, event.data.dpr)
    app.play()
  } else if (event.data.type === 'resize') {
    app.resize(width, height)
  }
}
