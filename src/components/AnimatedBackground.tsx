import { memo } from 'react';
import { SCENE_REGISTRY } from './animated-scenes/registry';

interface Props {
  sceneId: string;
}

function AnimatedBackground({ sceneId }: Props) {
  const Scene = SCENE_REGISTRY[sceneId];
  return Scene ? <Scene /> : null;
}

export default memo(AnimatedBackground);
