import { Group, Object3DEventMap } from 'three'
import { FBXLoader } from 'three/examples/jsm/Addons.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Assets, File, ModelInfo } from '../types'

let loadedAssets = 0

const assets: Assets = {
  audio: new Map<string, ArrayBuffer>(),
  blob: new Map<string, Blob>(),
  buffer: new Map<string, ArrayBuffer>(),
  image: new Map<string, ImageBitmap>(),
  json: new Map<string, any>(),
  model: new Map<string, ModelInfo>(),
  video: new Map<string, Blob>(),
}

// Loaders

const draco = new DRACOLoader();
draco.setDecoderPath('/libs/draco/');
draco.preload()

const fbxLoader = new FBXLoader()

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(draco)

// Load functions

async function loadBuffer(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  return await response.arrayBuffer();
}

async function loadBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  return await response.blob();
}

async function loadFBX(url: string): Promise<ModelInfo> {
  return new Promise((resolve) => {
    fbxLoader.loadAsync(url)
      .then((value: Group<Object3DEventMap>) => {
        resolve({
          animations: value.animations.map(animation => animation.toJSON(animation)),
          scene: value.toJSON(),
        })
      })
      .catch((reason: any) => {
        console.log('FBX Error:')
        console.log(reason)
      })
  })
}

async function loadGLTF(url: string): Promise<ModelInfo> {
  return new Promise((resolve) => {
    gltfLoader.loadAsync(url)
      .then((value: GLTF) => {
        resolve({
          animations: value.animations.map(animation => animation.toJSON(animation)),
          cameras: value.cameras.map(camera => camera.toJSON()),
          scene: value.scene.toJSON(),
        })
      })
      .catch((reason: any) => {
        console.log('GLTF Error:')
        console.log(reason)
      })
  })
}

async function loadImage(url: string): Promise<ImageBitmap> {
  const response = await fetch(url);
  const blob = await response.blob();
  return await createImageBitmap(blob);
}

async function loadJSON(url: string): Promise<any> {
  const response = await fetch(url);
  return response.json();
}

// Load calls

function loadStart(assetList: File[]) {
  assetList.forEach((item: File) => {
    switch (item.type) {
      case 'audio':
        loadBuffer(item.file).then((value: ArrayBuffer) => {
          assets.audio.set(item.name, value)
          onLoad(assetList)
        })
        break
      case 'blob':
        loadBlob(item.file).then((value: Blob) => {
          assets.blob.set(item.name, value)
          onLoad(assetList)
        })
        break
      case 'buffer':
        loadBuffer(item.file).then((value: ArrayBuffer) => {
          assets.buffer.set(item.name, value)
          onLoad(assetList)
        })
        break
      case 'fbx':
        loadFBX(item.file).then((value: ModelInfo) => {
          assets.model.set(item.name, value)
          onLoad(assetList)
        })
        break
      case 'gltf':
        loadGLTF(item.file).then((value: ModelInfo) => {
          assets.model.set(item.name, value)
          onLoad(assetList)
        })
        break
      case 'image':
        loadImage(item.file).then((value: ImageBitmap) => {
          assets.image.set(item.name, value)
          onLoad(assetList)
        })
        break
      case 'json':
        loadJSON(item.file).then((value: any) => {
          assets.json.set(item.name, value)
          onLoad(assetList)
        })
        break
      case 'video':
        loadBlob(item.file).then((value: Blob) => {
          assets.video.set(item.name, value)
          onLoad(assetList)
        })
        break
    }
  })
}

function onLoad(assetList: File[]) {
  loadedAssets++
  if (loadedAssets >= assetList.length) loadComplete()
}

function loadComplete() {
  self.postMessage({ type: 'loadComplete', data: assets })
}

// Worker

self.onmessage = (event) => {
  switch (event.data.type) {
    case 'loadStart':
      loadStart(event.data.data)
      break;
  }
}
