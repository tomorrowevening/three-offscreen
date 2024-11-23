import { AnimationClip, AnimationMixer, Object3D, ObjectLoader } from 'three';
import { ModelLite } from '../types'

export function createModel(model: ModelLite) {
  const loader = new ObjectLoader();
  const scene = loader.parse(model.scene);

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
      const camera = loader.parse(value)
      cameras.push(camera)
    })
  }

  return {
    model: scene,
    mixer,
    cameras,
  };
}
