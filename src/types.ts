import { AnimationClip, Object3DJSON } from 'three'

export type MethodProps = {
  canvas: HTMLCanvasElement
}

export type FileType = 'audio' | 'image' | 'json' | 'gltf' | 'fbx' | 'video'

export type File = {
  name: string
  file: string
  type: FileType
}

export type Assets = {
  audio: any
  images: any
  models: any
  video: any
}

export type ModelLite = {
  animations: AnimationClip[]
  cameras?: Object3DJSON[]
  scene: Object3DJSON
}

export enum QualityType {
  'High',
  'Medium',
  'Low',
}

export type AppSettings = {
  dpr: number
  fps: number
  width: number
  height: number
  mobile: boolean
  supportOffScreenCanvas: boolean
  quality: QualityType
}
