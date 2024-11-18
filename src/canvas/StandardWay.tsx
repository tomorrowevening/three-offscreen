import { useEffect, useState } from 'react'
import ThreeApp from '../webgl/ThreeApp'
import { MethodProps } from '../types'
import EventHandler from '../webgl/EventHandler'
import { dispatcher, Events } from '../global/constants'

export default function StandardWay(props: MethodProps) {
  // let app: ThreeApp
  const [app, setApp] = useState<ThreeApp | null>(null)

  useEffect(() => {
    console.log('Regular Canvas')

    // App
    const newApp = new ThreeApp(props.canvas, innerWidth, innerHeight, devicePixelRatio)
    newApp.play()
    newApp.resize(innerWidth, innerHeight)
    setApp(newApp)

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

  return (
    <>
      {app !== null && (
        <>
          <EventHandler
            onResize={(width: number, height: number) => app.resize(width, height)}
            onMouseDown={(x: number, y: number) => app.mouseDown(x, y)}
            onMouseMove={(x: number, y: number) => app.mouseMove(x, y)}
            onMouseUp={(x: number, y: number) => app.mouseUp(x, y)}
          />
        </>
      )}
    </>
  )
}