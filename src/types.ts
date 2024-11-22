import { AnimationClip } from 'three'

export type MethodProps = {
  canvas: HTMLCanvasElement
}

export type FileType = 'audio' | 'image' | 'json' | 'cubeTexture' | 'texture' | 'gltf' | 'draco' | 'fbx' | 'mp4'

export type File = {
  name: string
  file: string
  type: FileType
}

export type Assets = {
  gltf: any
  textures: any
}

export type GLTFLite = {
  animations: AnimationClip[]
  cameras: []
  scene: any
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
