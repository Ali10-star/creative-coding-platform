import { p5Circle } from './p5-circle';
import { pixiParticles } from './pixi-particles';
import { threeCube } from './three-cube';

export const FIXTURES = {
  'p5-circle': p5Circle,
  'three-cube': threeCube,
  'pixi-particles': pixiParticles,
} as const;
