import { useEffect } from 'react'
import ThreeApp from '../webgl/ThreeApp'
import { MethodProps } from '../types'

export default function StandardWay(props: MethodProps) {
  useEffect(() => {
    console.log('Regular Canvas')
    function onResize() {
      app.resize(innerWidth, innerHeight)
    }
    const app = new ThreeApp(props.canvas, innerWidth, innerHeight, devicePixelRatio)
    app.play()
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      app.dispose()
    }
  }, [props])

  return null
}