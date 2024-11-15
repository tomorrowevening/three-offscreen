import { useEffect, useRef, useState } from 'react'
import OffscreenWay from './OffscreenWay'
import StandardWay from './StandardWay'

let interval: number | null = null

type CanvasComponentProps = {
  canvas: HTMLCanvasElement
}

export default function CanvasComponent(props: CanvasComponentProps) {
  // Refs
  const buttonRef = useRef<HTMLButtonElement>(null)
  const resultRef = useRef<HTMLParagraphElement>(null)

  // States
  const [offscreenSupported, setOffscreenSupported] = useState(false)
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    if (props.canvas) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
			let supportOffScreenWebGL = 'transferControlToOffscreen' in props.canvas

			// If it's Safari, then check the version because Safari < 17 doesn't support OffscreenCanvas with a WebGL context.
			if (isSafari) {
				const versionMatch = navigator.userAgent.match( /version\/(\d+)/i )
				const safariVersion = versionMatch ? parseInt( versionMatch[ 1 ] ) : 0
				supportOffScreenWebGL = safariVersion >= 17
			}

      // Override setting
      if (location.hash.search('regular') > -1) supportOffScreenWebGL = false

      setOffscreenSupported(supportOffScreenWebGL)
      setAppReady(true)
    }
  }, [props])

  function jank() {
    let number = 0;
    for ( let i = 0; i < 10000000; i ++ ) {
      number += Math.random();
    }
  
    if (resultRef.current) {
      resultRef.current.innerHTML = number.toString()
    }
  }

  function clickButton() {
    if ( interval === null ) {
      interval = setInterval( jank, 1000 / 60 )
      buttonRef.current!.innerHTML = 'STOP JANK'
    } else {
      clearInterval( interval )
      interval = null
      buttonRef.current!.innerHTML = 'START JANK'
      resultRef.current!.innerHTML = ''
    }
  }

  return (
    <>
      <p ref={resultRef}>0</p>
      <button ref={buttonRef} onClick={clickButton}>Jank</button>
      {appReady && (
        <>
          {offscreenSupported ? (
            <OffscreenWay canvas={props.canvas} />
          ) : (
            <StandardWay canvas={props.canvas} />
          )}
        </>
      )}
    </>
  )
}
