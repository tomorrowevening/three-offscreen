import { Assets, File } from '../types'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let loadedAssets = 0
let assetList: File[] = []

const assets: Assets = {
  gltf: {},
  textures: {},
}

const draco = new DRACOLoader();
draco.setDecoderPath('/libs/draco/');
draco.preload()

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(draco)

async function loadImage(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return await createImageBitmap(blob);
}

async function loadGLTF(item: File) {
  return new Promise((resolve) => {
    gltfLoader.load(
      item.file,
      (value: GLTF) => {
        const gltfLite = {
          scene: value.scene.toJSON(),
          animations: value.animations.map(animation => animation.toJSON(animation)),
          cameras: value.cameras.map(camera => camera.toJSON()),
        }
        assets.gltf[item.name] = gltfLite
        resolve(gltfLite)
      },
      undefined,
      (err: unknown) => {
        console.log('GLTF Error:')
        console.log(err)
      }
    )
  })
}

function loadStart() {
  assetList.forEach((item: File) => {
    switch (item.type) {
      case 'texture':
        loadImage(item.file).then((value: ImageBitmap) => {
          assets.textures[item.name] = value
          onLoad()
        })
        break
      case 'gltf':
        loadGLTF(item).then(() => {
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

self.onmessage = (event) => {
  switch (event.data.type) {
    case 'loadStart':
      assetList = event.data.data
      loadStart()
      break;
  }
}