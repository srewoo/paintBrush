// Which shapes can a child actually tap? Some drawings fully cover a shape with others, which would
// make a page impossible to finish. We sample points inside each shape and hit-test them on screen.
const SHAPES = ':is(path, circle, ellipse, rect, polygon, polyline, text):not(.l, .k, .bg)';
const GRID = 9;

// Returns [{ k: index in svg.querySelectorAll('*'), x, y: a visible point inside it, in svg units }].
export function findTargets(svg) {
  const all = [...svg.querySelectorAll('*')];
  const view = { w: innerWidth, h: innerHeight };
  const out = [];
  all.forEach((el, k) => {
    if (!el.matches(SHAPES) || el.closest('.nums, .stks')) return;
    const hit = visiblePoint(svg, el, view);
    if (hit) out.push({ k, ...hit });
  });
  return out;
}

function visiblePoint(svg, el, view) {
  if (el instanceof SVGTextElement) {
    const b = el.getBBox();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }
  const b = el.getBBox();
  const toScreen = el.getScreenCTM();
  const toSvg = svg.getScreenCTM()?.inverse();
  if (!toScreen || !toSvg) return null;
  const pt = svg.createSVGPoint();
  const hits = [];
  let offscreen = false;
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      pt.x = b.x + (b.width * (i + 0.5)) / GRID;
      pt.y = b.y + (b.height * (j + 0.5)) / GRID;
      if (!el.isPointInFill(pt)) continue;
      const s = pt.matrixTransform(toScreen);
      if (s.x < 0 || s.y < 0 || s.x >= view.w || s.y >= view.h) { offscreen = true; continue; }
      if (document.elementFromPoint(s.x, s.y) === el) hits.push(s.matrixTransform(toSvg));
    }
  }
  // Scrolled out of view (small screens): can't prove it's hidden, so count it.
  if (!hits.length) return offscreen ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null;
  // The visible sample nearest the middle of all visible samples: a good spot for a number label.
  const mx = hits.reduce((a, p) => a + p.x, 0) / hits.length;
  const my = hits.reduce((a, p) => a + p.y, 0) / hits.length;
  const best = hits.reduce((a, p) => (Math.hypot(p.x - mx, p.y - my) < Math.hypot(a.x - mx, a.y - my) ? p : a));
  return { x: best.x, y: best.y };
}
