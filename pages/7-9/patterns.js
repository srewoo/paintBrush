// Pattern colouring pages (ages 7-9): mandalas, a snowflake and zentangle-style animals.
// Every shape is generated with loops + trig below; numbers are rounded to 1 decimal.

const r1 = (n) => Math.round(n * 10) / 10;
const P = (x, y) => `${r1(x)},${r1(y)}`;
const rad = (d) => (d * Math.PI) / 180;
const pol = (cx, cy, r, a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
const cls = (c) => (c ? ` class="${c}"` : '');
const circ = (x, y, r, c) => `<circle${cls(c)} cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}"/>`;
const ell = (x, y, rx, ry) => `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(rx)}" ry="${r1(ry)}"/>`;
const path = (d, c) => `<path${cls(c)} d="${d}"/>`;
const poly = (pts) => `<polygon points="${pts.map((p) => P(p[0], p[1])).join(' ')}"/>`;
const ring = (n, off, fn) => Array.from({ length: n }, (_, i) => fn(off + (i * 360) / n, i)).join('');
const range = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join('');

// Local frame at (x, y) facing angle a: u runs along a, v across it.
const frame = (x, y, a) => (u, v) => [x + u * Math.cos(rad(a)) - v * Math.sin(rad(a)), y + u * Math.sin(rad(a)) + v * Math.cos(rad(a))];

// Petal from radius ra to rb along angle a around (cx, cy), max half-width w. tear = rounded outer end.
const petal = (cx, cy, ra, rb, a, w, tear) => {
  const L = rb - ra;
  const f = (u, v) => frame(cx, cy, a)(ra + u, v);
  const [c1, c2, k] = tear ? [0.3, 1.05, 1.25] : [0.25, 0.75, 1.33];
  return path(`M${P(...f(0, 0))}C${P(...f(L * c1, w * k))} ${P(...f(L * c2, w * k))} ${P(...f(L, 0))}`
    + `C${P(...f(L * c2, -w * k))} ${P(...f(L * c1, -w * k))} ${P(...f(0, 0))}Z`);
};
const tri = (cx, cy, ra, rb, a, w) => poly([pol(cx, cy, ra, a - w), pol(cx, cy, rb, a), pol(cx, cy, ra, a + w)]);
const kite = (cx, cy, ra, rm, rb, a, w) => poly([pol(cx, cy, ra, a), pol(cx, cy, rm, a - w), pol(cx, cy, rb, a), pol(cx, cy, rm, a + w)]);
const ngon = (cx, cy, r, n, off) => poly(Array.from({ length: n }, (_, i) => pol(cx, cy, r, off + (i * 360) / n)));

// Heart with its tip pointing along angle d, centred at (x, y), size s.
const HEART = [[0, 0.9], [-0.3, 0.6], [-1, 0.2], [-1, -0.3], [-1, -0.8], [-0.45, -1.05], [0, -0.55],
  [0.45, -1.05], [1, -0.8], [1, -0.3], [1, 0.2], [0.3, 0.6], [0, 0.9]];
const heart = (x, y, s, d) => {
  const q = HEART.map(([hx, hy]) => P(...frame(x, y, d)(hy * s, hx * s)));
  return path(`M${q[0]}C${q[1]} ${q[2]} ${q[3]}C${q[4]} ${q[5]} ${q[6]}C${q[7]} ${q[8]} ${q[9]}C${q[10]} ${q[11]} ${q[12]}Z`);
};

// Polygon helpers: ellipse outline, signed area, point-in-polygon, convex clipping.
const ellPts = (cx, cy, rx, ry, n = 72) => Array.from({ length: n }, (_, i) => [cx + rx * Math.cos((i * 2 * Math.PI) / n), cy + ry * Math.sin((i * 2 * Math.PI) / n)]);
const area = (p) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0) / 2;
const inside = (p, x, y) => {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    if ((p[i][1] > y) !== (p[j][1] > y) && x < ((p[j][0] - p[i][0]) * (y - p[i][1])) / (p[j][1] - p[i][1]) + p[i][0]) c = !c;
  }
  return c;
};
const clip = (subj, cp) => { // Sutherland-Hodgman; cp must be convex
  const o = area(cp) > 0 ? 1 : -1;
  let out = subj;
  cp.forEach((A, i) => {
    const B = cp[(i + 1) % cp.length];
    const side = (p) => o * ((B[0] - A[0]) * (p[1] - A[1]) - (B[1] - A[1]) * (p[0] - A[0]));
    const cut = (s, e) => { const t = side(s) / (side(s) - side(e)); return [s[0] + t * (e[0] - s[0]), s[1] + t * (e[1] - s[1])]; };
    const inp = out; out = [];
    inp.forEach((e, j) => {
      const s = inp[(j + inp.length - 1) % inp.length];
      if (side(e) >= 0) { if (side(s) < 0) out.push(cut(s, e)); out.push(e); } else if (side(s) >= 0) out.push(cut(s, e));
    });
  });
  return out;
};
const scaleAbout = (pts, ax, ay, k) => pts.map(([x, y]) => [ax + k * (x - ax), ay + k * (y - ay)]);

// One tile of a fish-scale pattern; flip=true turns it to bulge rightwards.
const scale = (cx, cy, r, flip) => {
  const m = (dx, dy) => (flip ? P(cx + dy, cy + dx) : P(cx + dx, cy + dy));
  const s = flip ? [1, 0, 0] : [0, 1, 1];
  return path(`M${m(-r, 0)}A${r} ${r} 0 0 ${s[0]} ${m(r, 0)}A${r} ${r} 0 0 ${s[1]} ${m(0, -r)}A${r} ${r} 0 0 ${s[2]} ${m(-r, 0)}Z`);
};
const scales = (x0, x1, y0, y1, r, flip, ok) => {
  let out = '';
  for (let a = 0, A = x0; A <= x1; a++, A += flip ? r : 2 * r) {
    for (let B = y0 + (a % 2 ? r : 0); B <= y1; B += flip ? 2 * r : r) {
      const [cx, cy] = flip ? [A, B] : [B, A];
      const ext = [[cx - r, cy], [cx + r, cy], [cx, cy - r], [cx, cy + r]];
      if (ext.every(([x, y]) => ok(x, y))) out += scale(cx, cy, r, flip);
    }
  }
  return out;
};
const MIRROR = (s) => `${s}<g transform="matrix(-1 0 0 1 400 0)">${s}</g>`;

/* ---------- Mandalas ---------- */
const C = 200;

const flowerMandala = [
  ring(16, 0, (a) => petal(C, C, 98, 188, a, 21, true)),
  ring(16, 0, (a) => petal(C, C, 128, 176, a, 10, true)),
  ring(16, 11.25, (a) => petal(C, C, 88, 150, a, 16)),
  circ(C, C, 98),
  ring(24, 0, (a) => petal(C, C, 58, 95, a, 8, true)),
  circ(C, C, 58),
  ring(12, 15, (a) => petal(C, C, 21, 55, a, 10, true)),
  circ(C, C, 21), circ(C, C, 9),
].join('');

const starMandala = [
  ring(8, 22.5, (a) => kite(C, C, 84, 118, 158, a, 7)),
  ring(8, 22.5, (a) => circ(...pol(C, C, 172, a), 9)),
  ring(8, 0, (a) => kite(C, C, 70, 115, 188, a, 13)),
  ring(8, 0, (a) => kite(C, C, 122, 140, 172, a, 5.5)),
  ring(8, 0, (a) => circ(...pol(C, C, 98, a), 7)),
  circ(C, C, 82),
  ring(16, 0, (a) => tri(C, C, 58, 80, a, 11.25)),
  circ(C, C, 58),
  poly(Array.from({ length: 16 }, (_, i) => pol(C, C, i % 2 ? 28 : 52, i * 22.5))),
  ring(8, 22.5, (a) => circ(...pol(C, C, 44, a), 5)),
  circ(C, C, 18), circ(C, C, 8),
].join('');

const sunMandala = [
  ring(12, 15, (a) => tri(C, C, 98, 150, a, 7)),
  ring(12, 0, (a) => poly([pol(C, C, 98, a - 11), pol(C, C, 188, a), pol(C, C, 98, a)])
    + poly([pol(C, C, 98, a), pol(C, C, 188, a), pol(C, C, 98, a + 11)])),
  ring(24, 0, (a) => circ(...pol(C, C, 100, a), 13)),
  circ(C, C, 100),
  ring(12, 0, (a) => petal(C, C, 60, 96, a, 12, true)),
  circ(C, C, 60),
  ring(8, 22.5, (a) => petal(C, C, 22, 58, a, 12)),
  circ(C, C, 22),
].join('');

const heartMandala = [
  ring(8, 0, (a) => heart(...pol(C, C, 142, a), 42, a + 180)),
  ring(8, 0, (a) => heart(...pol(C, C, 146, a), 22, a + 180)),
  ring(8, 22.5, (a) => heart(...pol(C, C, 162, a), 16, a)),
  ring(8, 22.5, (a) => circ(...pol(C, C, 118, a), 7)),
  circ(C, C, 96),
  ring(16, 0, (a) => petal(C, C, 60, 94, a, 9)),
  circ(C, C, 60),
  ring(8, 22.5, (a) => heart(...pol(C, C, 40, a), 11, a)),
  circ(C, C, 22), circ(C, C, 10),
].join('');

const snowflake = '<g transform="translate(200 190) scale(0.93) translate(-200 -200)">' + [
  ring(6, -90, (a) => {
    const f = frame(C, C, a);
    return [[85, 50, 8], [138, 34, 6]].map(([u, len, w]) => petal(...f(u, 0), 0, len, a - 55, w) + petal(...f(u, 0), 0, len, a + 55, w)).join('')
      + petal(C, C, 25, 176, a, 9)
      + [[60, 16, 12], [110, 14, 11], [158, 12, 9]].map(([u, h, w]) => poly([f(u - h, 0), f(u, w), f(u + h, 0), f(u, -w)])).join('')
      + circ(...f(180, 0), 7);
  }),
  ring(6, -60, (a) => petal(C, C, 38, 96, a, 11, true) + circ(...pol(C, C, 116, a), 6)),
  ngon(C, C, 42, 6, -90), ngon(C, C, 26, 6, -60), circ(C, C, 11),
].join('') + '</g>';

/* ---------- Pattern animals ---------- */

// Butterfly: right wings built in polar form around an anchor, then mirrored.
const wing = (ax, ay, R, t0, t1, k, n = 36) => Array.from({ length: n + 1 }, (_, i) => {
  const t = i / n;
  const r = R * k * Math.pow(Math.sin(Math.PI * t), 0.6) * (1 + 0.12 * Math.sin(2 * Math.PI * t));
  return pol(ax, ay, r, t0 + (t1 - t0) * t);
});
const wingArt = (ax, ay, R, t0, t1, nd, nm, np) => {
  const rr = (t) => R * Math.pow(Math.sin(Math.PI * t), 0.6) * (1 + 0.12 * Math.sin(2 * Math.PI * t));
  const at = (t, k) => pol(ax, ay, rr(t) * k, t0 + (t1 - t0) * t);
  const dots = (n, k, f) => range(n, (i) => { const t = 0.2 + (0.66 * (i + 0.5)) / n; return circ(...at(t, k), rr(t) * f); });
  return poly(wing(ax, ay, R, t0, t1, 1)) + dots(nd, 0.89, 0.055)
    + poly(wing(ax, ay, R, t0, t1, 0.78)) + dots(nm, 0.64, 0.07)
    + poly(wing(ax, ay, R, t0, t1, 0.5))
    + range(np, (i) => { const t = 0.3 + (0.4 * i) / Math.max(np - 1, 1); return petal(ax, ay, 14, rr(t) * 0.42, t0 + (t1 - t0) * t, rr(t) * 0.05, true); });
};
const butterfly = MIRROR(wingArt(204, 206, 150, 12, 92, 6, 4, 2) + wingArt(204, 188, 178, -82, 8, 7, 5, 3))
  + range(5, (i) => ell(C, 300 - i * 18, 8 + i * 1.3, 14))
  + ell(C, 200, 15, 27) + circ(C, 162, 15)
  + circ(194, 159, 3, 'k') + circ(206, 159, 3, 'k')
  + MIRROR(`${path('M205 152Q206 110 214 80', 'l')}${circ(215, 76, 6)}`);

// Belly feathers: scale tiles clipped to the belly ellipse so the edge tiles are whole regions too.
const belly = ellPts(200, 284, 74, 62);
const scalePts = (cx, cy, r) => [[180, 0, cx, cy], [90, 180, cx + r, cy - r], [0, 90, cx - r, cy - r]]
  .flatMap(([a, b, x, y]) => Array.from({ length: 8 }, (_, i) => pol(x, y, r, a + ((b - a) * i) / 8)));
const scaleFill = (shape, x0, x1, y0, y1, r, whole = false) => {
  let out = '';
  for (let row = 0, cy = y0; cy < y1; row++, cy += r) {
    for (let cx = x0 + (row % 2 ? r : 0); cx <= x1; cx += 2 * r) {
      const ext = [[cx - r, cy], [cx + r, cy], [cx, cy - r], [cx, cy + r]];
      if (ext.every(([x, y]) => inside(shape, x, y))) { out += scale(cx, cy, r); continue; }
      if (whole) continue;
      const cp = clip(scalePts(cx, cy, r), shape);
      if (cp.length > 2 && Math.abs(area(cp)) > 40) out += poly(cp);
    }
  }
  return out;
};
const bellyScales = scaleFill(scaleAbout(belly, 200, 284, 0.94), 116, 284, 222, 350, 14, true);

// Owl: ears, egg body, folded wings with nested feathers, big eyes, scaled belly.
const owl = path('M30 352Q30 344 38 344H362Q370 344 370 352V362Q370 370 362 370H38Q30 370 30 362Z')
  + MIRROR(poly([[112, 112], [92, 38], [168, 88]]) + poly([[116, 96], [104, 56], [146, 86]]))
  + ell(C, 212, 118, 140)
  + MIRROR([1, 0.74, 0.5, 0.28].map((k) => petal(118, 342, 0, 180 * k, -99, 36 * k, true)).join(''))
  + MIRROR(circ(150, 152, 50) + ring(10, 18, (a) => circ(...pol(150, 152, 44, a), 5.5)) + circ(150, 152, 37) + circ(150, 152, 24) + circ(153, 152, 12, 'k'))
  + poly([[186, 186], [214, 186], [200, 216]])
  + ell(C, 284, 74, 62)
  + bellyScales
  + MIRROR(range(3, (i) => ell(162 + i * 13, 352, 6, 11)));

// Fish: parametric body with a gill-cut head, scale tiles, fan fins.
const fishBody = (() => {
  const h = (u) => 95 * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.7)), 0.75) + 18 * u;
  const n = 30;
  const top = Array.from({ length: n + 1 }, (_, i) => [60 + 240 * (i / n), 200 - h(i / n)]);
  const bot = Array.from({ length: n - 1 }, (_, i) => { const u = (n - 1 - i) / n; return [60 + 240 * u, 200 + 0.9 * h(u)]; });
  return [...top, ...bot];
})();
const gill = ellPts(40, 200, 96, 96);
const fan = (x, y, a0, a1, n, R) => range(n, (i) => {
  const a = a0 + ((a1 - a0) * i) / n; const b = a0 + ((a1 - a0) * (i + 1)) / n;
  return path(`M${P(x, y)}L${P(...pol(x, y, R, a))}Q${P(...pol(x, y, R * 1.18, (a + b) / 2))} ${P(...pol(x, y, R, b))}Z`);
});
const fish = fan(282, 200, -42, 42, 4, 92) + fan(185, 160, -150, -40, 4, 82) + fan(205, 240, 50, 120, 2, 72)
  + poly(fishBody) + poly(clip(fishBody, gill))
  + scales(142, 296, 92, 308, 14, true, (x, y) => inside(fishBody, x, y) && (x - 40) ** 2 + (y - 200) ** 2 > 98 ** 2)
  + petal(150, 228, 0, 50, 35, 12, true)
  + circ(96, 182, 14) + circ(98, 182, 7, 'k') + path('M62 208Q72 214 80 208', 'l')
  + circ(46, 122, 10) + circ(60, 88, 7) + circ(44, 62, 5);

// Elephant: legs, body with patterned blanket, head, segmented trunk, banded ear.
const trunk = (() => {
  const B = (s) => { const q = [[318, 178], [356, 236], [334, 322], [372, 300]]; const m = 1 - s;
    return [0, 1].map((k) => m ** 3 * q[0][k] + 3 * m * m * s * q[1][k] + 3 * m * s * s * q[2][k] + s ** 3 * q[3][k]); };
  const side = (s, sg) => { const [x, y] = B(s); const [x2, y2] = B(Math.min(s + 0.01, 1)); const [x0, y0] = B(Math.max(s - 0.01, 0));
    const d = Math.hypot(x2 - x0, y2 - y0); const w = 17 - 9 * s; return [x - (sg * w * (y2 - y0)) / d, y + (sg * w * (x2 - x0)) / d]; };
  return range(9, (i) => i === 0 ? '' : (() => { const ss = [0, 1, 2, 3].map((j) => (i + j / 3) / 9);
    return poly([...ss.map((s) => side(s, 1)), ...ss.reverse().map((s) => side(s, -1))]); })());
})();
const eBody = ellPts(170, 215, 112, 78);
const ear = ellPts(236, 182, 52, 66, 48);
const earIn = scaleAbout(ear, 240, 174, 0.72);
const elephant = path('M62 208Q40 230 46 262', 'l') + petal(46, 258, 0, 22, 95, 7, true)
  + [75, 118, 195, 238].map((x) => `<rect x="${x}" y="240" width="38" height="106" rx="12"/>`
    + `<rect x="${x}" y="296" width="38" height="11"/><rect x="${x}" y="315" width="38" height="11"/>`
    + range(3, (i) => ell(x + 8 + i * 11, 338, 4.6, 6.5))).join('')
  + poly(eBody)
  + poly(clip([[90, 110], [196, 110], ...range(0, () => ''), ...Array.from({ length: 11 }, (_, i) => [196 - i * 10.6, i % 2 ? 262 : 248])], eBody))
  + poly(clip([[90, 110], [196, 110], [196, 162], [90, 162]], eBody))
  + range(4, (i) => circ(106 + i * 22, 190, 8))
  + range(6, (i) => poly([[100 + i * 18, 214], [108 + i * 18, 226], [100 + i * 18, 238], [92 + i * 18, 226]]))
  + trunk + circ(290, 160, 60)
  + path('M314 206Q330 252 372 242Q342 230 330 200Z')
  + poly(ear) + range(8, (i) => circ(...scaleAbout([ear[2 + i * 5]], 236, 182, 0.86)[0], 5.2))
  + scaleFill(earIn, 175, 300, 125, 250, 17)
  + circ(322, 142, 7) + circ(323, 142, 3.5, 'k');

// Turtle (top view): head, flippers, banded shell rim and clipped hexagon plates.
const shellIn = ellPts(200, 215, 96, 116);
const hexes = (() => {
  let out = ''; let inner = ''; const R = 32;
  for (let c = -4; c <= 4; c++) {
    for (let r = -5; r <= 5; r++) {
      const x = 200 + c * 1.5 * R; const y = 215 + (r + (c % 2 ? 0.5 : 0)) * Math.sqrt(3) * R;
      const hx = Array.from({ length: 6 }, (_, i) => pol(x, y, R, i * 60));
      const cp = clip(hx, shellIn);
      if (cp.length < 3 || Math.abs(area(cp)) < 80) continue;
      out += poly(cp);
      if (hx.every(([px, py]) => inside(shellIn, px, py))) inner += ngon(x, y, R * 0.5, 6, 0);
    }
  }
  return out + inner;
})();
const turtle = ell(C, 52, 28, 32) + circ(187, 42, 4, 'k') + circ(213, 42, 4, 'k') + path('M190 60Q200 68 210 60', 'l')
  + MIRROR(petal(118, 150, 0, 92, -145, 26, true) + petal(118, 150, 40, 84, -145, 13, true)
    + petal(124, 296, 0, 70, 140, 20, true) + petal(124, 296, 32, 64, 140, 10, true))
  + poly([[188, 346], [212, 346], [200, 380]])
  + ring(24, -97.5, (a) => {
    const [o1, o2, i1, i2] = [[118, 140, a], [118, 140, a + 15], [96, 116, a], [96, 116, a + 15]]
      .map(([rx, ry, t]) => [200 + rx * Math.cos(rad(t)), 215 + ry * Math.sin(rad(t))]);
    return path(`M${P(...o1)}A118 140 0 0 1 ${P(...o2)}L${P(...i2)}A96 116 0 0 0 ${P(...i1)}Z`);
  })
  + hexes;

export default [
  { title: 'Flower Mandala', art: flowerMandala },
  { title: 'Star Mandala', art: starMandala },
  { title: 'Sun Mandala', art: sunMandala },
  { title: 'Heart Mandala', art: heartMandala },
  { title: 'Snowflake', art: snowflake },
  { title: 'Pattern Butterfly', art: butterfly },
  { title: 'Pattern Owl', art: owl },
  { title: 'Pattern Fish', art: fish },
  { title: 'Pattern Elephant', art: elephant },
  { title: 'Pattern Turtle', art: turtle },
];
