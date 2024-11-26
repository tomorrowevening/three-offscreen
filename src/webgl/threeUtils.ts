import { AnimationClip, AnimationMixer, Object3D, Object3DEventMap, ObjectLoader } from 'three';
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
