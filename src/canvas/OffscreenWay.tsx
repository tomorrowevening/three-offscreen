import { useEffect } from 'react'
import { MethodProps } from '../types'
import Workers from '../webworker/workers'

export default function OffscreenWay(props: MethodProps) {
  useEffect(() => {
    console.log('Offscreen Canvas')
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

    const resize = () => {
      Workers.canvas?.postMessage({
        type: 'resize',
        width: innerWidth,
        height: innerHeight
      })
    };
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    };
  }, [props])

  return null
}
