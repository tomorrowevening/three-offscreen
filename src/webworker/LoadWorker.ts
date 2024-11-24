import { Group, Object3DEventMap } from 'three'
import { FBXLoader } from 'three/examples/jsm/Addons.js'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Assets, File, ModelLite } from '../types'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

let loadedAssets = 0
let assetList: File[] = []

const assets: Assets = {
  audio: {},
  images: {},
  json: {},
  models: {},
  video: {},
}

// Loaders

const draco = new DRACOLoader();
draco.setDecoderPath('/libs/draco/');
draco.preload()

const fbxLoader = new FBXLoader()

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(draco)


// Load functions

async function loadAudio(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  return await response.arrayBuffer();
}

async function loadFBX(url: string): Promise<ModelLite> {
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

async function loadGLTF(url: string): Promise<ModelLite> {
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

async function loadVideo(url: string): Promise<Blob> {
  const response = await fetch(url);
  return await response.blob();
}

// Load calls

function loadStart() {
  assetList.forEach((item: File) => {
    switch (item.type) {
      case 'audio':
        loadAudio(item.file).then((value: ArrayBuffer) => {
          assets.audio[item.name] = value
          onLoad()
        })
        break
      case 'fbx':
        loadFBX(item.file).then((value: ModelLite) => {
          assets.models[item.name] = value
          onLoad()
        })
        break
      case 'gltf':
        loadGLTF(item.file).then((value: ModelLite) => {
          assets.models[item.name] = value
          onLoad()
        })
        break
      case 'image':
        loadImage(item.file).then((value: ImageBitmap) => {
          assets.images[item.name] = value
          onLoad()
        })
        break
      case 'json':
        loadJSON(item.file).then((value: any) => {
          assets.json[item.name] = value
          onLoad()
        })
        break
      case 'video':
        loadVideo(item.file).then((value: Blob) => {
          assets.video[item.name] = value
          onLoad()
        })
        break
    }
  })
}

function onLoad() {
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
      assetList = event.data.data
      loadStart()
      break;
  }
}