import { useEffect, useRef } from 'react';

type OffscreenWayProps = {
  canvas: HTMLCanvasElement
}

export default function OffscreenWay(props: OffscreenWayProps) {
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
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
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: devicePixelRatio,
      },
      [offscreenCanvas]
    )

    const resize = () => {
      workerRef.current?.postMessage({
        type: 'resize',
        width: window.innerWidth,
        height: window.innerHeight
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
