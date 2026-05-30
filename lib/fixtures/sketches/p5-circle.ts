import { Sketch } from '@/lib/schemas/parameterSchema';

export const p5Circle: Sketch = {
  id: 'fixture-p5-circle',
  slug: 'p5-circle',
  title: 'Pulsing Circles (p5)',
  runtime: 'p5',
  code: `
  import p5 from 'p5';

  new p5((p) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
    };

    p.draw = () => {
      p.background('#F0F0F0');
      p.noStroke();
      p.fill(params.color ?? '#D02020');
      const pulse = p.sin(p.frameCount * 0.05) * 30;
      const size = (params.size ?? 200) + pulse;
      p.ellipse(p.width / 2, p.height / 2, size, size);
    };
  });
  `.trim(),
  actions: [],
  extraImports: {},
  parameters: [
    { name: 'size', type: 'number', default: 125 },
    { name: 'color', type: 'color', default: '#1040C0' },
  ],
};
