import { useEffect } from 'react'
import ThreeApp from '../webgl/ThreeApp'
import { MethodProps } from '../types'
import { dispatcher, Events } from '../global/constants'

export default function StandardWay(props: MethodProps) {
  useEffect(() => {
    console.log('Regular Canvas')

    // App
    const newApp = new ThreeApp(props.canvas, props.canvas, innerWidth, innerHeight, devicePixelRatio)
    newApp.play()
    newApp.resize(innerWidth, innerHeight)

    function onLoad(event: any) {
      dispatcher.removeEventListener(Events.LoadComplete, onLoad)
      newApp.onLoad(event.value)
    }
    dispatcher.addEventListener(Events.LoadComplete, onLoad)

    return () => {
      dispatcher.removeEventListener(Events.LoadComplete, onLoad)
      newApp.dispose()
    }
  }, [props])

  return null
}