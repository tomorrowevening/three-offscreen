import { useEffect } from 'react'

type EventHandlerProps = {
  onResize: (width: number, height: number) => void
  onMouseDown: (x: number, y: number) => void
  onMouseMove: (x: number, y: number) => void
  onMouseUp: (x: number, y: number) => void
}

export default function EventHandler(props: EventHandlerProps) {
  useEffect(() => {
    const onResize = () => {
      props.onResize(window.innerWidth, window.innerHeight)
    }
    const onMouseDown = (evt: MouseEvent) => {
      props.onMouseDown(evt.clientX, evt.clientY)
    }
    const onMouseMove = (evt: MouseEvent) => {
      props.onMouseMove(evt.clientX, evt.clientY)
    }
    const onMouseUp = (evt: MouseEvent) => {
      props.onMouseUp(evt.clientX, evt.clientY)
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return  () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [props])

  return null
}
