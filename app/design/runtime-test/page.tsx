'use client';

import SketchEmbed from '@/components/SketchEmbed';
import { p5Circle } from '@/lib/fixtures/sketches/p5-circle';

const VANILLA_CANVAS_CODE = `
  // Create a full-bleed canvas. The runner's body already has overflow:hidden
  // and zero margin, so we just need to size it to the viewport.
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display: block; width: 100%; height: 100%;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  document.body.style.background = '#F0F0F0';

  // Handle resize so the canvas tracks the iframe size.
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const ctx = canvas.getContext('2d');

  // Bauhaus palette — we'll cycle through these.
  const COLORS = ['#D02020', '#1040C0', '#F0C020'];

  // Create a few orbiting shapes with different parameters.
  const shapes = [
    { type: 'circle', orbitRadius: 120, speed: 0.020, phase: 0,            color: COLORS[0], size: 60 },
    { type: 'square', orbitRadius: 180, speed: 0.012, phase: Math.PI * 0.6, color: COLORS[1], size: 50 },
    { type: 'circle', orbitRadius: 240, speed: 0.008, phase: Math.PI * 1.2, color: COLORS[2], size: 40 },
    { type: 'square', orbitRadius: 90,  speed: 0.030, phase: Math.PI * 1.7, color: COLORS[0], size: 30 },
  ];

  let frame = 0;
  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    // Bauhaus off-white background each frame (clears the canvas).
    ctx.fillStyle = '#F0F0F0';
    ctx.fillRect(0, 0, w, h);

    // Draw a static black border to match Bauhaus card style.
    ctx.strokeStyle = '#121212';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, w - 4, h - 4);

    // Central pulsing element — a circle that breathes between two sizes.
    const pulse = 80 + Math.sin(frame * 0.04) * 20;
    ctx.fillStyle = '#121212';
    ctx.beginPath();
    ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting shapes — each rotates around the center at its own speed.
    for (const s of shapes) {
      const angle = frame * s.speed + s.phase;
      const x = cx + Math.cos(angle) * s.orbitRadius;
      const y = cy + Math.sin(angle) * s.orbitRadius;

      ctx.fillStyle = s.color;
      ctx.strokeStyle = '#121212';
      ctx.lineWidth = 3;

      if (s.type === 'circle') {
        ctx.beginPath();
        ctx.arc(x, y, s.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        // Square — rotated to face the direction of motion for a bit more visual interest.
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillRect(-s.size / 2, -s.size / 2, s.size, s.size);
        ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
        ctx.restore();
      }
    }

    frame++;
    requestAnimationFrame(draw);
  }
  draw();
`;

export default function RuntimeTestPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-6 text-4xl">{p5Circle.title}</h1>
      <p className="mb- 6 text-sm font-bold tracking-widest uppercase">
        Runtime: {p5Circle.runtime}
      </p>
      <div className="h-[70vh]">
        <SketchEmbed runtime={p5Circle.runtime} code={p5Circle.code} />
      </div>
    </main>
  );
}
