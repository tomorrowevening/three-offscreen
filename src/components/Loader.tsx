import { useEffect, useRef, useState } from 'react';
import { assetList, dispatcher, Events } from '../global/constants';

export default function Loader() {
  const pRef = useRef<HTMLParagraphElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    function onLoad() {
      dispatcher.removeEventListener(Events.LoadComplete, onLoad)
      setLoaded(true)
    }

    dispatcher.addEventListener(Events.LoadComplete, onLoad)
    dispatcher.dispatchEvent({ type: Events.LoadStart, value: assetList })
    return () => {
      dispatcher.removeEventListener(Events.LoadComplete, onLoad)
    }
  }, [])

  return (
    <>
      {loaded ? null : <p ref={pRef} style={{ top: '100px' }}>0%</p>}
    </>
  )
}