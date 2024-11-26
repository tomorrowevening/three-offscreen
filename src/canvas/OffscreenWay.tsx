import { useEffect } from 'react'
import { MethodProps } from '../types'
import Settings from '../global/settings';
import Workers from '../webworker/workers'
import { ElementProxy, eventHandlers } from '../webworker/EventHandling';

// Component

export default function OffscreenWay(props: MethodProps) {
  useEffect(() => {
    console.log('Offscreen Canvas')

    props.canvas.focus()
  
    if (Workers.canvas) {
      const proxy = new ElementProxy(props.canvas, Workers.canvas, eventHandlers)

      // App
      const offscreenCanvas = props.canvas.transferControlToOffscreen()
      const message = {
        ...{
          type: 'init',
          canvas: offscreenCanvas,
          canvasId: proxy.id,
        },
        ...Settings,
      }
      Workers.canvas.postMessage(message, [offscreenCanvas])
    }
  }, [props])

  return null
}
