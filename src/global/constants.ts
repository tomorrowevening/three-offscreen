import { EventDispatcher } from "three"

export enum Events {
  LoadStart = 'LoadStart',
  LoadComplete = 'LoadComplete',
}

export type WebGLEvent = {
  [key in Events]: { value?: unknown }
}

export const dispatcher = new EventDispatcher<WebGLEvent>()
