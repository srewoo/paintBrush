// Sparkle burst + "You did it!" when the last shape on a page gets coloured.
const SPARK_COLOURS = ['#ef4444', '#fb923c', '#facc15', '#a3e635', '#22c55e', '#2dd4bf', '#7dd3fc', '#3b82f6', '#a78bfa', '#f9a8d4'];

export function celebrate(stage, reducedMotion) {
  const layer = document.createElement('div');
  layer.className = 'cheer';
  layer.innerHTML = '<div class="cheer-msg" role="status">You did it!</div>';
  if (!reducedMotion) {
    for (let n = 0; n < 60; n++) {
      const s = document.createElement('span');
      s.className = n % 3 ? 'spark' : 'spark star';
      s.style.background = SPARK_COLOURS[n % SPARK_COLOURS.length];
      const a = Math.random() * Math.PI * 2, r = 120 + Math.random() * 260, size = 8 + Math.random() * 14;
      s.style.width = s.style.height = `${size}px`;
      layer.append(s);
      s.animate([
        { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * r}px), calc(-50% + ${Math.sin(a) * r}px)) scale(1) rotate(${360 * Math.random()}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * r * 1.15}px), calc(-50% + ${Math.sin(a) * r * 1.15 + 60}px)) scale(.4) rotate(540deg)`, opacity: 0 },
      ], { duration: 1400 + Math.random() * 700, easing: 'cubic-bezier(.15,.8,.3,1)', delay: Math.random() * 150, fill: 'forwards' });
    }
  }
  stage.append(layer);
  setTimeout(() => layer.remove(), 2400);
}
