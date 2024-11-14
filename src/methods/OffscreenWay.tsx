import { useEffect, useRef } from 'react'
import { MethodProps } from '../types'

export default function OffscreenWay(props: MethodProps) {
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    console.log('Offscreen Canvas')
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('../OffscreenWorker.ts', import.meta.url), {
        type: 'module',
      })
    }

    const offscreenCanvas = props.canvas.transferControlToOffscreen()
    workerRef.current.postMessage(
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
      workerRef.current?.postMessage({
        type: 'resize',
        width: innerWidth,
        height: innerHeight
      })
    };
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      workerRef.current?.terminate()
      workerRef.current = null
    };
  }, [props])

  return null
}
