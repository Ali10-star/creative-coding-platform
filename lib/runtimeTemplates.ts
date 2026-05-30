import { Runtime } from './schemas/parameterSchema';

export const BASE_IMPORT_MAPS: Record<Runtime, Record<string, string>> = {
  p5: { p5: 'https://esm.sh/p5@1.11.13' },
  three: { three: 'https://esm.sh/three' },
  pixi: { pixi: 'https://esm.sh/pixi.js@8.11.0' },
  vanilla: {},
};

export const STARTER_CODE: Record<Runtime, string> = {
  vanilla: ``,
  p5: `import p5 from 'p5';\n\nnew p5((p) => {\n p.setup = () =>
p.createCanvas(p.windowWidth, p.windowHeight);\n p.draw = () => {\n
p.background(255);\n p.fill(params.color);\n p.ellipse(p.width /
2, p.height / 2, params.size, params.size);\n };\n});`,
  three: ``,
  pixi: ``,
};
