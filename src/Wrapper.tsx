import { useEffect, useRef, useState } from 'react'
import Workers from './webworker/workers'
import CanvasComponent from './canvas/CanvasComponent'
import Loader from './components/Loader'

export default function Wrapper() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    Workers.init()
    setReady(true)
    return () => {
      Workers.dispose()
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} />
      {ready && canvasRef.current !== null && (
        <>
          <CanvasComponent canvas={canvasRef.current} />
          <Loader />
        </>
      )}
    </>
  )
}
