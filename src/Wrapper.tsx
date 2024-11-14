import { useEffect, useRef, useState } from 'react'
import OffscreenWay from './methods/OffscreenWay'
import StandardWay from './methods/StandardWay'

export default function Wrapper() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [offscreenSupported, setOffscreenSupported] = useState(false)
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
			let supportOffScreenWebGL = 'transferControlToOffscreen' in canvasRef.current

			// If it's Safari, then check the version because Safari < 17 doesn't support OffscreenCanvas with a WebGL context.
			if (isSafari) {
				const versionMatch = navigator.userAgent.match( /version\/(\d+)/i )
				const safariVersion = versionMatch ? parseInt( versionMatch[ 1 ] ) : 0
				supportOffScreenWebGL = safariVersion >= 17
			}

      setOffscreenSupported(supportOffScreenWebGL)
      setAppReady(true)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} />
      {appReady && canvasRef.current !== null ? (
        <>
          {offscreenSupported ? (
            <OffscreenWay canvas={canvasRef.current} />
          ) : (
            <StandardWay canvas={canvasRef.current} />
          )}
        </>
      ) : null}
    </>
  )
}
