import { useEffect, useRef, useState } from 'react'
import Workers from './webworker/workers'
import CanvasComponent from './canvas/CanvasComponent'
import Loader from './components/Loader'

export default function Wrapper() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [offscreenSupported, setOffscreenSupported] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let supportOffScreenWebGL = false
    if (canvasRef.current !== null) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
			supportOffScreenWebGL = 'transferControlToOffscreen' in canvasRef.current

			// If it's Safari, then check the version because Safari < 17 doesn't support OffscreenCanvas with a WebGL context.
			if (isSafari) {
				const versionMatch = navigator.userAgent.match( /version\/(\d+)/i )
				const safariVersion = versionMatch ? parseInt( versionMatch[ 1 ] ) : 0
				supportOffScreenWebGL = safariVersion >= 17
			}

      // Override setting
      if (location.hash.search('regular') > -1) supportOffScreenWebGL = false

      setOffscreenSupported(supportOffScreenWebGL)
    }

    Workers.init(supportOffScreenWebGL)
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
          <CanvasComponent canvas={canvasRef.current} offscreenSupported={offscreenSupported} />
          <Loader />
        </>
      )}
    </>
  )
}
