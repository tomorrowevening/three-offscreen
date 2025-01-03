import {
  AnimationClip,
  AnimationMixer,
  Audio,
  Material,
  Mesh,
  Object3D,
  Object3DEventMap,
  ObjectLoader,
  Texture,
} from 'three';
import { ModelInfo } from '../types'

type ParsedModel = {
  model: Object3D<Object3DEventMap>
  mixer: AnimationMixer
  cameras: Object3D[]
}

export function createModel(model: ModelInfo): Promise<ParsedModel> {
  return new Promise((resolve) => {
    const loader = new ObjectLoader();
    loader.parseAsync(model.scene).then((scene: Object3D<Object3DEventMap>) => {
      // Load animations
      const mixer = new AnimationMixer(scene);
      if (model.animations.length > 0) {
        // @ts-ignore
        const animations = model.animations.map(data => AnimationClip.parse(data));
        // Play the first animation
        const action = mixer.clipAction(animations[0]);
        action.play();
      }

      const cameras: Object3D[] = []
      if (model.cameras && model.cameras.length > 0) {
        model.cameras.forEach((value: unknown) => {
          loader.parseAsync(value).then((camera) => {
            cameras.push(camera)
          })
        })
      }

      resolve({
        model: scene,
        mixer,
        cameras,
      });
    })
  })
}

export const disposeTexture = (texture?: Texture): void => {
  texture?.dispose();
};

export const disposeMaterial = (material?: Material | Material[]): void => {
  if (!material) return;

  if (Array.isArray(material)) {
    material.forEach((mat: Material) => mat.dispose());
  } else {
    material.dispose();
  }
};

export const dispose = (object: Object3D): void => {
  if (!object) return;

  // Dispose children
  while (object.children.length > 0) {
    const child = object.children[0];
    if (child.type === 'Audio') {
      (child as Audio).pause();
      if (child.parent) {
        child.parent.remove(child);
      }
    } else {
      dispose(child);
    }
  }

  // Dispose object
  if (object.parent) object.parent.remove(object);
  // @ts-ignore
  if (object.isMesh) {
    const mesh = object as Mesh;
    mesh.geometry?.dispose();
    disposeMaterial(mesh.material);
  }

  // @ts-ignore
  if (object.dispose !== undefined) object.dispose();
};
