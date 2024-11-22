import { useEffect, useRef } from 'react'
import Stats from 'stats-gl'
import OffscreenWay from './OffscreenWay'
import StandardWay from './StandardWay'
import Settings from '../global/settings'

let interval: number | null = null

type CanvasComponentProps = {
  canvas: HTMLCanvasElement
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

  useEffect(() => {
    const stats = new Stats({})
    document.body.appendChild(stats.dom)

    let rafID = -1
    const onUpdate = () => {
      stats.update()
      rafID = requestAnimationFrame(onUpdate)
    }
    onUpdate()

    return () => {
      cancelAnimationFrame(rafID)
      rafID = -1
    }
  }, [])

  return (
    <>
      <p ref={resultRef}>0</p>
      <button ref={buttonRef} onClick={clickButton}>Jank</button>
      {Settings.supportOffScreenCanvas ? (
        <OffscreenWay canvas={props.canvas} />
      ) : (
        <StandardWay canvas={props.canvas} />
      )}
    </>
  )
}
