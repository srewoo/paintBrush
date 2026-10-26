// Zoom (buttons) + drag-to-pan for the page drawing, via the SVG viewBox. Tapping still colours;
// a drag of more than a few pixels pans instead and swallows the click that follows it.
const FULL = 400;
const LEVELS = [1, 1.5, 2, 3, 4];

export function createZoom(page, onChange) {
  let level = 0;
  let cx = FULL / 2;
  let cy = FULL / 2;
  let drag = null;
  let swallowClick = false;

  const svg = () => page.querySelector('svg.art');
  const clamp = () => {
    const half = FULL / LEVELS[level] / 2;
    cx = Math.min(FULL - half, Math.max(half, cx));
    cy = Math.min(FULL - half, Math.max(half, cy));
  };
  const apply = () => {
    clamp();
    const size = FULL / LEVELS[level];
    svg()?.setAttribute('viewBox', `${cx - size / 2} ${cy - size / 2} ${size} ${size}`);
    page.classList.toggle('zoomed', level > 0);
    onChange(LEVELS[level]);
  };

  page.addEventListener('pointerdown', (e) => {
    if (!level || !svg()?.contains(e.target)) return;
    drag = { x: e.clientX, y: e.clientY, cx, cy, moved: false, scale: FULL / LEVELS[level] / svg().getBoundingClientRect().width };
  });
  page.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    drag.moved = true;
    cx = drag.cx - dx * drag.scale;
    cy = drag.cy - dy * drag.scale;
    apply();
  });
  addEventListener('pointerup', () => {
    if (drag?.moved) swallowClick = true;
    drag = null;
  });
  // Capture phase so the colouring click handler never sees a pan.
  page.addEventListener('click', (e) => {
    if (swallowClick) { e.stopPropagation(); swallowClick = false; }
  }, true);

  return {
    in: () => { level = Math.min(LEVELS.length - 1, level + 1); apply(); },
    out: () => { level = Math.max(0, level - 1); apply(); },
    reset: () => { level = 0; cx = cy = FULL / 2; apply(); },
    // Centre on a point (svg units), zooming in if needed: used by "find missed parts".
    focus: (x, y) => { level = Math.max(level, 2); cx = x; cy = y; apply(); },
  };
}
