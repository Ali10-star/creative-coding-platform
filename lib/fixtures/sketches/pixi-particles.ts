import { Sketch } from '@/lib/schemas/parameterSchema';

export const pixiParticles: Sketch = {
  id: 'fixture-pixi-particles',
  slug: 'pixi-particles',
  title: 'Pixi Particles',
  runtime: 'pixi',
  code: `
  import * as PIXI from 'pixi.js';

  console.log('[sketch] Pixi extensions before init:', PIXI.extensions);
  console.log('[sketch] batcher already registered?',
  PIXI.extensions._addHandlers?.batcher !== undefined);

  import { Application, Graphics, Container, BlurFilter } from 'pixi.js';

  // ---- App setup ----
  const app = new Application();
  await app.init({
    background: params.bgColor ?? '#F0F0F0',
    resizeTo: window,
    antialias: true,
  });
  document.body.appendChild(app.canvas);

  // ---- Bauhaus palette for cycling ----
  const PALETTE = [0xD02020, 0x1040C0, 0xF0C020, 0x121212];

  // ---- Particle container ----
  // Container lets us apply filters (blur) to all particles at once.
  const particleLayer = new Container();
  app.stage.addChild(particleLayer);

  const blur = new BlurFilter({ strength: 0 });
  particleLayer.filters = [blur];

  // ---- Particle pool ----
  // We keep a pool so we never allocate during animation. Adding particles
  // means activating ones from the pool; removing means deactivating.
  const MAX_PARTICLES = 2000;
  const particles = [];

  function makeParticle() {
    const g = new Graphics();
    g.visible = false;
    particleLayer.addChild(g);
    return {
      gfx: g,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 1,
      color: 0xD02020,
      shape: 'circle',
      active: false,
    };
  }

  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push(makeParticle());
  }

  function spawnParticle(x, y) {
    // Find first inactive particle.
    const p = particles.find((p) => !p.active);
    if (!p) return;

    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * (params.spawnSpeed ?? 4);

    p.x = x;
    p.y = y;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.life = 0;
    p.maxLife = 60 + Math.random() * 60;  // 1-2 seconds at 60fps
    p.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    p.shape = params.shape ?? 'circle';
    p.active = true;
    p.gfx.visible = true;
  }

  // ---- Mouse tracking for fountain emission ----
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let isPointerDown = false;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  window.addEventListener('pointerdown', () => { isPointerDown = true; });
  window.addEventListener('pointerup',   () => { isPointerDown = false; });

  // ---- Actions ----
  onAction('burst', () => {
    // Emit a ring of particles from the center.
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    for (let i = 0; i < 80; i++) {
      spawnParticle(cx, cy);
    }
  });

  onAction('clear', () => {
    for (const p of particles) {
      p.active = false;
      p.gfx.visible = false;
    }
  });

  onAction('chaos', () => {
    // Spawn particles randomly across the whole canvas.
    for (let i = 0; i < 200; i++) {
      spawnParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      );
    }
  });

  // ---- Render loop ----
  app.ticker.add(() => {
    // Background — set each frame so color changes apply instantly.
    app.renderer.background.color = params.bgColor ?? '#F0F0F0';

    // Blur intensity from param.
    blur.strength = params.blur ?? 0;

    // Emit while mouse is down (or always if alwaysEmit is on).
    if (isPointerDown || params.alwaysEmit) {
      const rate = params.emissionRate ?? 5;
      for (let i = 0; i < rate; i++) {
        spawnParticle(mouseX, mouseY);
      }
    }

    // Update + draw active particles.
    const gravity = params.gravity ?? 0.1;
    const friction = 0.99;
    const size = params.particleSize ?? 6;

    for (const p of particles) {
      if (!p.active) continue;

      p.vy += gravity;
      p.vx *= friction;
      p.vy *= friction;
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      if (p.life > p.maxLife) {
        p.active = false;
        p.gfx.visible = false;
        continue;
      }

      // Fade out toward end of life.
      const alpha = 1 - (p.life / p.maxLife);

      p.gfx.clear();
      if (p.shape === 'square') {
        p.gfx
          .rect(-size / 2, -size / 2, size, size)
          .fill({ color: p.color, alpha });
      } else {
        p.gfx
          .circle(0, 0, size / 2)
          .fill({ color: p.color, alpha });
      }
      p.gfx.x = p.x;
      p.gfx.y = p.y;
    }
  });
  `,
  parameters: [
    {
      name: 'emissionRate',
      type: 'number',
      min: 1,
      max: 20,
      step: 1,
      default: 5,
      label: 'Emission Rate',
    },
    {
      name: 'spawnSpeed',
      type: 'number',
      min: 1,
      max: 10,
      step: 0.5,
      default: 4,
      label: 'Spawn Speed',
    },
    {
      name: 'gravity',
      type: 'number',
      min: -0.5,
      max: 0.5,
      step: 0.01,
      default: 0.1,
      label: 'Gravity',
    },
    {
      name: 'particleSize',
      type: 'number',
      min: 2,
      max: 30,
      step: 1,
      default: 6,
      label: 'Particle Size',
    },
    {
      name: 'blur',
      type: 'number',
      min: 0,
      max: 20,
      step: 0.5,
      default: 0,
      label: 'Blur',
    },
    {
      name: 'shape',
      type: 'select',
      options: ['circle', 'square'],
      default: 'circle',
      label: 'Particle Shape',
    },
    {
      name: 'alwaysEmit',
      type: 'boolean',
      default: false,
      label: 'Always Emit',
    },
    {
      name: 'bgColor',
      type: 'color',
      default: '#F0F0F0',
      label: 'Background',
    },
  ],
  actions: [
    { name: 'burst',  label: 'Burst' },
    { name: 'clear',  label: 'Clear' },
    { name: 'chaos',  label: 'Chaos' },
  ],
  extraImports: {},
};