import { useEffect, useRef, useState } from 'react'
import { getGPUTier, TierResult } from 'detect-gpu'
import Workers from './webworker/workers'
import CanvasComponent from './canvas/CanvasComponent'
import Loader from './components/Loader'
import Settings from './global/settings'
import { QualityType } from './types'

export default function Wrapper() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    getGPUTier().then((gpuTier: TierResult) => {
      // Detect Support
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
      }

      // Update Settings
      Settings.dpr = devicePixelRatio
      if (gpuTier.fps) Settings.fps = Math.min(gpuTier.fps, 60) // cap FPS to 60
      if (gpuTier.isMobile) Settings.mobile = gpuTier.isMobile
      if (gpuTier.tier === 3) Settings.quality = QualityType.High
      else if (gpuTier.tier === 2) Settings.quality = QualityType.Medium
      Settings.supportOffScreenCanvas = supportOffScreenWebGL
      Settings.width = innerWidth
      Settings.height = innerHeight

      Workers.init()
      setReady(true)
    })
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
