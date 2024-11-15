/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import Workers from '../webworker/workers';
import { File } from '../types';

export default function Loader() {
  const pRef = useRef<HTMLParagraphElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const assetList: File[] = [
      {
        type: 'texture',
        name: 'uvGrid',
        file: '/uvGrid.jpg',
      },
      {
        type: 'gltf',
        name: 'Horse',
        file: '/Horse.glb',
      },
    ]

    const onCanvasMessage = (event: any) => {
      if (event.data.type === 'initComplete') {
        Workers.canvas?.removeEventListener('message', onCanvasMessage)
        Workers.loader?.postMessage({ type: 'loadStart', data: assetList })
      }
    }

    const onLoadMessage = (event: any) => {
      if (event.data.type === 'loadComplete') {
        Workers.canvas?.postMessage({ type: 'loadComplete', data: event.data.data })
        setLoaded(true)
      }
    }

    Workers.canvas?.addEventListener('message', onCanvasMessage)
    Workers.loader?.addEventListener('message', onLoadMessage)
    return () => {
      Workers.canvas?.removeEventListener('message', onCanvasMessage)
      Workers.loader?.removeEventListener('message', onLoadMessage)
    }
  }, [])

  return (
    <>
      {loaded ? null : <p ref={pRef} style={{ top: '100px' }}>0%</p>}
    </>
  )
}