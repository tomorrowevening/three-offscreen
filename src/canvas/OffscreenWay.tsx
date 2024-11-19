import { useEffect } from 'react'
import { MethodProps } from '../types'
import Workers from '../webworker/workers'
import EventHandler from '../webgl/EventHandler'

export default function OffscreenWay(props: MethodProps) {
  useEffect(() => {
    console.log('Offscreen Canvas')

    // App
    const offscreenCanvas = props.canvas.transferControlToOffscreen()
    Workers.canvas?.postMessage(
      {
        type: 'init',
        canvas: offscreenCanvas,
        width: innerWidth,
        height: innerHeight,
        dpr: devicePixelRatio,
      },
      [offscreenCanvas]
    )
  }, [props])

  return (
    <EventHandler
      onResize={(width: number, height: number) => Workers.canvas?.postMessage({ type: 'resize', width, height })}
      onMouseDown={(x: number, y: number) => Workers.canvas?.postMessage({ type: 'mouseDown', x, y })}
      onMouseMove={(x: number, y: number) => Workers.canvas?.postMessage({ type: 'mouseMove', x, y })}
      onMouseUp={(x: number, y: number) => Workers.canvas?.postMessage({ type: 'mouseUp', x, y })}
      onWheel={(position: number, delta: number) => Workers.canvas?.postMessage({ type: 'wheel', position, delta })}
    />
  )
}
