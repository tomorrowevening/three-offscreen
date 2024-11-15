import { AnimationClip, AnimationMixer, Object3D, ObjectLoader } from 'three';
import { GLTFLite } from '../types'

export function createGLTF(gltf: GLTFLite) {
  const loader = new ObjectLoader();
  const model = loader.parse(gltf.scene);

  // Load animations
  const mixer = new AnimationMixer(model);
  if (gltf.animations.length > 0) {
    // @ts-ignore
    const animations = gltf.animations.map(data => AnimationClip.parse(data));
    // Play the first animation
    const action = mixer.clipAction(animations[0]);
    action.play();
  }

  const cameras: Object3D[] = []
  if (gltf.cameras.length > 0) {
    gltf.cameras.forEach((value: unknown) => {
      const camera = loader.parse(value)
      cameras.push(camera)
    })
  }

  return {
    model,
    mixer,
    cameras,
  };
}
