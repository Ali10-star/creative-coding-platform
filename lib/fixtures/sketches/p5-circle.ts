import { Sketch } from '@/lib/schemas/parameterSchema';

export const p5Circle: Sketch = {
  id: 'fixture-p5-circle',
  slug: 'p5-circle',
  title: 'Pulsing Circles (p5)',
  runtime: 'p5',
  code: `
import p5 from 'p5';
import * as Tone from 'tone';

// A simple synth, created lazily on first action click.
// (Browsers require user interaction before AudioContext can start.)
let synth = null;
function ensureSynth() {
  if (synth) return synth;
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.5 },
  }).toDestination();
  return synth;
}

// Bauhaus-y pentatonic so anything sounds harmonious.
const PENTATONIC = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5'];

onAction('play', async () => {
  // Tone.start() is required to satisfy the browser's user-gesture rule for audio.
  await Tone.start();
  const s = ensureSynth();
  const note = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
  s.triggerAttackRelease(note, '8n');
});

onAction('chord', async () => {
  await Tone.start();
  const s = ensureSynth();
  // C major-ish triad in two octaves.
  s.triggerAttackRelease(['C4', 'E4', 'G4', 'C5'], '4n');
});

// The visual sketch — circles pulse to the rhythm of params.
new p5((p) => {
  let lastBeat = 0;

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

    // Optional: auto-play a note every N frames if 'autoplay' is on.
    if (params.autoplay && p.frameCount - lastBeat > 30) {
      lastBeat = p.frameCount;
      const note = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
      // ensureSynth() will fail silently if no user gesture has happened yet;
      // user must click an action button at least once first.
      try {
        if (synth) synth.triggerAttackRelease(note, '16n');
      } catch (e) { /* AudioContext not started yet — ignore */ }
    }
  };
});
`.trim(),
  parameters: [
    { name: 'size', type: 'number', min: 50, max: 400, step: 1, default: 200, label: 'Size' },
    { name: 'color', type: 'color', default: '#1040C0', label: 'Color' },
    { name: 'autoplay', type: 'boolean', default: false, label: 'Auto-play' },
  ],
  actions: [
    { name: 'play', label: 'Play Note' },
    { name: 'chord', label: 'Play Chord' },
  ],
  extraImports: {
    tone: 'https://esm.sh/tone@15.0.4',
  },
};