// Tiny synthesized sound effects (Web Audio, no audio files). Silent until the first user gesture.
let ctx = null;
let muted = false;

export const setMuted = (m) => { muted = m; };
export const isMuted = () => muted;

function audio() {
  if (muted) return null;
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, at, dur, { type = 'sine', gain = 0.12, slide = 0 } = {}) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + at;
  const osc = a.createOscillator();
  const amp = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(gain, t + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(amp).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  pop: () => tone(420 + Math.random() * 260, 0, 0.12, { slide: 1.6 }),
  erase: () => tone(300, 0, 0.18, { type: 'triangle', slide: 0.5, gain: 0.08 }),
  sticker: () => { tone(660, 0, 0.08); tone(990, 0.06, 0.12); },
  flip: () => tone(180, 0, 0.22, { type: 'triangle', slide: 2.2, gain: 0.05 }),
  cheer: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.35, { type: 'triangle', gain: 0.1 })),
};
