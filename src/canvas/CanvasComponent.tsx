import { useRef } from 'react'
import OffscreenWay from './OffscreenWay'
import StandardWay from './StandardWay'

let interval: number | null = null

type CanvasComponentProps = {
  canvas: HTMLCanvasElement
  offscreenSupported: boolean
}

export default function CanvasComponent(props: CanvasComponentProps) {
  // Refs
  const buttonRef = useRef<HTMLButtonElement>(null)
  const resultRef = useRef<HTMLParagraphElement>(null)

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
      {props.offscreenSupported ? (
        <OffscreenWay canvas={props.canvas} />
      ) : (
        <StandardWay canvas={props.canvas} />
      )}
    </>
  )
}
