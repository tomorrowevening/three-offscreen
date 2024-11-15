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
