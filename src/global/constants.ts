import { EventDispatcher } from 'three'
import { File } from '../types'

export enum Events {
  LoadStart = 'LoadStart',
  LoadComplete = 'LoadComplete',
}

export type WebGLEvent = {
  [key in Events]: { value?: unknown }
}

export const dispatcher = new EventDispatcher<WebGLEvent>()

export const assetList: File[] = [
  {
    type: 'image',
    name: 'uvGrid',
    file: '/uvGrid.jpg',
  },
  {
    type: 'image',
    name: 'nx',
    file: '/cube/nx.png',
  },
  {
    type: 'image',
    name: 'ny',
    file: '/cube/ny.png',
  },
  {
    type: 'image',
    name: 'nz',
    file: '/cube/nz.png',
  },
  {
    type: 'image',
    name: 'px',
    file: '/cube/px.png',
  },
  {
    type: 'image',
    name: 'py',
    file: '/cube/py.png',
  },
  {
    type: 'image',
    name: 'pz',
    file: '/cube/pz.png',
  },
  {
    type: 'gltf',
    name: 'Horse',
    file: '/Horse.glb',
  },
  {
    type: 'fbx',
    name: 'Idle',
    file: '/Idle.fbx',
  },
]
