import { useEffect } from 'react'
import ThreeApp from '../ThreeApp'
import { MethodProps } from '../types'

export default function StandardWay(props: MethodProps) {
  useEffect(() => {
    console.log('Regular Canvas')
    const app = new ThreeApp(props.canvas, innerWidth, innerHeight, devicePixelRatio)
    app.play()
    return () => {
      app.dispose()
    }
  }, [props])

  return null
}