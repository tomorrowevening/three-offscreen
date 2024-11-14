import { useEffect } from 'react'
import ThreeApp from '../ThreeApp'

type StandardWayProps = {
  canvas: HTMLCanvasElement
}

export default function StandardWay(props: StandardWayProps) {
  useEffect(() => {
    const app = new ThreeApp(props.canvas, innerWidth, innerHeight, devicePixelRatio)
    app.play()
    return () => {
      app.dispose()
    }
  }, [props])

  return null
}