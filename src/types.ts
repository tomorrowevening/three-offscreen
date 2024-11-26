import { AnimationClip, Object3DJSON } from 'three'

export type MethodProps = {
  canvas: HTMLCanvasElement
}

export type FileType = 'audio' | 'blob' | 'buffer' | 'fbx' | 'gltf' | 'image' | 'json' | 'video'

export type File = {
  name: string
  file: string
  type: FileType
}

export type Assets = {
  audio: Map<string, ArrayBuffer>
  blob: Map<string, Blob>
  buffer: Map<string, ArrayBuffer>
  image: Map<string, ImageBitmap>
  json: Map<string, any>
  model: Map<string, ModelInfo>
  video: Map<string, Blob>
}

export type ModelInfo = {
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
