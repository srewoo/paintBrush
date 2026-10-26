// Wild animals. Redrawn pages are built with the small geometry helpers below; the export is plain strings.
const f = (n) => Math.round(n * 10) / 10;
const P = (p) => `${f(p[0])} ${f(p[1])}`;
// Point on a cubic Bézier [p0, c1, c2, p3] at t.
const bez = ([a, b, c, d], t) => {
  const u = 1 - t;
  return [0, 1].map((i) => u * u * u * a[i] + 3 * u * u * t * b[i] + 3 * u * t * t * c[i] + t * t * t * d[i]);
};
// x where a (roughly vertical) Bézier edge crosses height y.
const xAt = (seg, y) => {
  let best = [0, 1e9];
  for (let i = 0; i <= 60; i++) { const p = bez(seg, i / 60); if (Math.abs(p[1] - y) < best[1]) best = [p[0], Math.abs(p[1] - y)]; }
  return best[0];
};
// Closed outline from a list of cubic segments (each starts where the last ended).
const outline = (segs) => `<path d="M${P(segs[0][0])}${segs.map((s) => `C${P(s[1])} ${P(s[2])} ${P(s[3])}`).join('')}Z"/>`;
// Tapered limb or tail around a chain of cubic centrelines, width w0 → w1, round ends.
const tube = (segs, w0, w1) => {
  const c = [];
  segs.forEach((s, k) => { for (let i = k ? 1 : 0; i <= 24; i++) c.push(bez(s, i / 24)); });
  const n = c.length - 1, L = [], R = [], W = [];
  c.forEach((p, i) => {
    const q = c[Math.min(i + 1, n)], o = c[Math.max(i - 1, 0)];
    const dx = q[0] - o[0], dy = q[1] - o[1], d = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * (i / n)) / 2;
    L.push([p[0] - (dy / d) * w, p[1] + (dx / d) * w]); R.push([p[0] + (dy / d) * w, p[1] - (dx / d) * w]); W.push(w);
  });
  const cap = (p, side, w) => {
    const a0 = Math.atan2(side[1] - p[1], side[0] - p[0]);
    return Array.from({ length: 7 }, (_, j) => [p[0] + Math.cos(a0 - ((j + 1) * Math.PI) / 8) * w, p[1] + Math.sin(a0 - ((j + 1) * Math.PI) / 8) * w]);
  };
  const pts = [...L, ...cap(c[n], L[n], W[n]), ...R.reverse(), ...cap(c[0], R[R.length - 1], W[0])];
  return `<path d="M${pts.map(P).join('L')}Z"/>`;
};
// Smooth irregular spot (giraffe patches).
const blob = (cx, cy, rx, ry, k = 0) => {
  const j = [1, 0.82, 1.06, 0.9, 1, 0.8, 0.96];
  const v = j.map((_, i) => { const a = (i / 7) * Math.PI * 2 + k; const m = j[(i + k * 3) % 7]; return [cx + Math.cos(a) * rx * m, cy + Math.sin(a) * ry * m]; });
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return `<path d="M${P(mid(v[6], v[0]))}${v.map((p, i) => `Q${P(p)} ${P(mid(p, v[(i + 1) % 7]))}`).join('')}Z"/>`;
};
// Rounded hexagon (turtle shell plates).
const hex = (cx, cy, R) => {
  const v = Array.from({ length: 6 }, (_, i) => [cx + R * Math.cos((i * Math.PI) / 3), cy + R * Math.sin((i * Math.PI) / 3)]);
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  return `<path d="M${P(lerp(v[0], v[1], 0.22))}${v.map((_, i) => { const a = v[(i + 1) % 6], b = v[(i + 2) % 6]; return `L${P(lerp(a, v[i], 0.22))}Q${P(a)} ${P(lerp(a, b, 0.22))}`; }).join('')}Z"/>`;
};
// Zebra stripe: a tapering wedge whose wide end sits on an outline segment between t0 and t1.
const wedge = (seg, t0, t1, dx, dy) => {
  const a = bez(seg, t0), b = bez(seg, t1), m = bez(seg, (t0 + t1) / 2), tip = [m[0] + dx, m[1] + dy];
  const ca = [(a[0] + tip[0]) / 2 + dy * 0.08, (a[1] + tip[1]) / 2 - dx * 0.08], cb = [(b[0] + tip[0]) / 2 + dy * 0.08, (b[1] + tip[1]) / 2 - dx * 0.08];
  return `<path d="M${P(a)}Q${P(ca)} ${P(tip)}Q${P(cb)} ${P(b)}Z"/>`;
};
// Leg band between two leg edges, from height y0 to y1.
const band = (front, rear, y0, y1) => `<path d="M${P([xAt(front, y0), y0])}Q${P([(xAt(front, y0) + xAt(rear, y0)) / 2, y0 + 4])} ${P([xAt(rear, y0), y0])}L${P([xAt(rear, y1), y1])}Q${P([(xAt(front, y1) + xAt(rear, y1)) / 2, y1 + 4])} ${P([xAt(front, y1), y1])}Z"/>`;

const ground = `<path d="M-20 337Q200 303 420 337V420H-20Z"/>`;
const sun = (x, y, s = 24) => `<circle cx="${x}" cy="${y}" r="${s}"/><path class="l" d="M${x} ${y - s - 8}v-12M${x} ${y + s + 8}v12M${x - s - 8} ${y}h-12M${x + s + 8} ${y}h12M${x - s + 2} ${y - s + 2}l-9 -9M${x + s - 2} ${y - s + 2}l9 -9M${x - s + 2} ${y + s - 2}l-9 9M${x + s - 2} ${y + s - 2}l9 9"/>`;
const grass = (...xs) => `<path class="l" d="${xs.map((x) => `M${x} 372q-2-10-12-16M${x} 372q0-10 3-20M${x} 372q3-9 12-14`).join('')}"/>`;
const flower = (x, y) => {
  const p = Array.from({ length: 5 }, (_, i) => [Math.round(x + 12 * Math.sin(i * 1.2566)), Math.round(y - 12 * Math.cos(i * 1.2566))]);
  return `<path class="l" d="M${x} ${y + 20}v${330 - y}"/><path d="M${p[0]}${[...p.slice(1), p[0]].map((q) => `A10 10 0 1 1 ${q}`).join('')}Z"/><circle cx="${x}" cy="${y}" r="9"/>`;
};
const eye = (x, y, s = 9) => `<circle cx="${x}" cy="${y}" r="${s}"/><circle class="k" cx="${x + 1}" cy="${y + 1}" r="${f(s * 0.55)}"/>`;
const hoof = (x0, x1, y, h = 12) => `<path d="M${x0} ${y}H${x1}L${x1 + 2} ${y + h}H${x0 - 2}Z"/>`;
const farLeg = (x, top, y, w) => `<path d="M${x} ${top}C${x + 1} ${top + 30} ${x + 3} ${y - 18} ${x + 3} ${y}H${x + w + 1}C${x + w + 1} ${y - 18} ${x + w} ${top + 30} ${x + w} ${top}Z"/>`;
const farEdges = (x, top, y, w) => [[[x, top], [x + 1, top + 30], [x + 3, y - 18], [x + 3, y]], [[x + w, top], [x + w, top + 30], [x + w + 1, y - 18], [x + w + 1, y]]];

// ---- Giraffe (faces right) ----
const gBack = [[232, 190], [250, 160], [270, 120], [284, 82]];
const gFront = [[306, 92], [296, 130], [278, 172], [266, 210]];
const giraffe = () => {
  const neckSpots = [0.22, 0.47, 0.72].map((t, i) => { const a = bez(gBack, t), b = bez(gFront, 1 - t); return blob((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 8, 11, i + 1); }).join('');
  return `${sun(64, 58)}${ground}${grass(300, 350, 385)}
<path d="M26 337L36 196H50L60 337Z"/><path d="M-20 196Q-16 168 14 168Q30 146 56 160Q90 158 86 190Q34 206 -20 196Z"/>
<path class="l" d="M114 226C100 250 98 270 100 286"/><path d="M100 280C88 290 90 306 100 314C112 306 112 290 100 280Z"/>
${farLeg(150, 250, 318, 16)}${hoof(153, 168, 318)}${farLeg(208, 250, 318, 16)}${hoof(211, 226, 318)}
<path d="M288 86C274 124 256 162 240 198C232 198 226 196 224 194C240 156 256 118 270 80Z"/>
<path d="M120 215C160 205 200 196 232 190C250 160 270 120 284 82L306 92C296 130 278 172 266 210C262 226 256 240 248 250C248 278 250 302 250 322H232C232 298 230 280 226 262C200 266 160 266 140 260C138 280 136 302 136 322H118C118 298 116 276 112 256C106 240 108 226 120 215Z"/>
${hoof(118, 136, 322)}${hoof(232, 250, 322)}
${blob(142, 232, 14, 11, 1)}${blob(182, 224, 16, 12, 2)}${blob(222, 222, 13, 13, 3)}${blob(176, 250, 14, 8, 4)}${blob(216, 248, 12, 8, 5)}${blob(246, 214, 8, 11, 6)}
${neckSpots}
<path d="M285 64L283 38H295L297 62Z"/><circle cx="289" cy="36" r="9"/><path d="M302 60L303 34H315L313 60Z"/><circle cx="309" cy="32" r="9"/>
<path d="M282 74C268 64 254 64 244 68C254 80 270 86 284 84Z"/>
<path d="M276 78C286 58 312 56 330 66C346 74 356 86 352 98C348 108 334 110 320 106C304 102 288 100 280 94C274 90 272 84 276 78Z"/>
${eye(302, 76, 8)}
<ellipse class="k" cx="343" cy="86" rx="3" ry="4"/>
<path class="l" d="M322 99Q333 104 343 98"/>`;
};

// ---- Zebra (faces left) ----
const zb = {
  crest: [[118, 100], [150, 108], [168, 158], [190, 180]],
  back: [[190, 180], [230, 176], [280, 176], [305, 180]],
  rump: [[305, 180], [335, 186], [345, 213], [338, 240]],
  thigh: [[338, 240], [334, 256], [328, 264], [326, 270]],
  bRear: [[326, 270], [326, 288], [330, 304], [328, 318]],
  bBottom: [[328, 318], [320, 318], [314, 318], [306, 318]],
  bFront: [[306, 318], [306, 298], [300, 278], [296, 258]],
  belly: [[296, 258], [270, 266], [220, 266], [186, 260]],
  fRear: [[186, 260], [184, 278], [186, 300], [186, 318]],
  fBottom: [[186, 318], [178, 318], [172, 318], [164, 318]],
  fFront: [[164, 318], [162, 298], [160, 276], [152, 248]],
  chest: [[152, 248], [138, 233], [130, 213], [122, 188]],
  throat: [[122, 188], [116, 168], [106, 148], [98, 136]],
};
const zebra = () => {
  const [fl1, fl2] = farEdges(268, 254, 312, 22), [fr1, fr2] = farEdges(196, 254, 312, 22);
  return `${sun(340, 60)}${ground}${grass(30, 70, 350, 385)}
<path class="l" d="M338 206C356 222 360 250 354 276"/><path d="M354 270C340 276 338 298 348 308C362 300 368 286 360 272Z"/>
${farLeg(268, 254, 312, 22)}${hoof(271, 293, 312)}${farLeg(196, 254, 312, 22)}${hoof(199, 221, 312)}
${band(fl1, fl2, 280, 292)}${band(fr1, fr2, 280, 292)}
${outline(Object.values(zb))}
${hoof(306, 328, 318)}${hoof(164, 186, 318)}
${wedge(zb.back, 0.06, 0.2, -4, 56)}${wedge(zb.back, 0.32, 0.46, -2, 58)}${wedge(zb.back, 0.58, 0.72, 2, 58)}
${wedge(zb.rump, 0.48, 0.72, -44, 16)}
${wedge(zb.crest, 0.36, 0.52, -34, 26)}${wedge(zb.crest, 0.6, 0.76, -32, 28)}${wedge(zb.crest, 0.84, 0.98, -26, 30)}
${band(zb.fFront, zb.fRear, 272, 284)}${band(zb.fFront, zb.fRear, 294, 306)}${band(zb.bFront, zb.bRear, 272, 284)}${band(zb.bFront, zb.bRear, 294, 306)}
<path d="M104 88C122 72 144 80 148 94C164 92 174 106 172 116C186 118 194 132 190 142C202 146 208 160 204 172C196 180 186 178 180 172C170 162 160 150 150 140C140 124 130 112 116 102Z"/>
<path d="M104 90C106 70 114 60 124 56C126 70 122 84 116 94Z"/><path d="M88 92C86 72 92 60 100 52C108 64 108 78 104 92Z"/>
<path d="M104 82C116 88 124 108 122 126C120 142 110 152 96 156C86 160 74 164 62 162C46 160 36 150 38 136C40 124 50 116 60 108C74 98 88 80 104 82Z"/>
<path d="M60 112C44 118 34 132 38 146C42 158 54 164 68 162C78 150 76 128 60 112Z"/>
${eye(94, 116)}
<ellipse class="k" cx="50" cy="134" rx="3.5" ry="5"/>
<path class="l" d="M48 152Q58 158 68 154"/>`;
};

// ---- Monkey (sits facing us) ----
const monkey = () => `${sun(340, 55)}${ground}${grass(200, 300, 380)}
<path d="M52 340Q46 230 74 118L88 122Q64 230 70 340Z"/>
<path d="M80 118Q50 90 18 130Q48 110 80 126Z"/><path d="M80 118Q112 90 142 130Q112 110 80 126Z"/><path d="M80 116Q60 80 30 78Q62 92 76 122Z"/><path d="M80 116Q100 80 130 78Q98 92 84 122Z"/>
<circle cx="72" cy="128" r="10"/><circle cx="90" cy="132" r="10"/>
${tube([[[236, 306], [300, 336], [366, 318], [358, 268]], [[358, 268], [352, 234], [318, 238], [330, 258]]], 18, 11)}
${tube([[[172, 296], [138, 284], [126, 314], [148, 326]]], 34, 26)}${tube([[[228, 296], [262, 284], [274, 314], [252, 326]]], 34, 26)}
<path d="M200 206C242 206 262 240 262 282C262 314 240 330 200 330C160 330 138 314 138 282C138 240 158 206 200 206Z"/>
<ellipse cx="200" cy="286" rx="36" ry="36"/>
<ellipse cx="146" cy="332" rx="28" ry="12"/><ellipse cx="254" cy="332" rx="28" ry="12"/>
${tube([[[164, 232], [136, 250], [128, 284], [150, 300]]], 26, 20)}<circle cx="154" cy="302" r="14"/>
<path d="M284 224C276 198 286 176 312 166L318 172C302 186 298 204 302 222Z"/>
${tube([[[238, 234], [270, 258], [292, 256], [290, 234]]], 26, 20)}<circle cx="290" cy="228" r="14"/>
<circle cx="130" cy="150" r="24"/><circle cx="270" cy="150" r="24"/><circle cx="130" cy="150" r="12"/><circle cx="270" cy="150" r="12"/>
<circle cx="200" cy="150" r="64"/>
<path d="M200 128C182 98 138 108 142 152C146 196 172 212 200 212C228 212 254 196 258 152C262 108 218 98 200 128Z"/>
${eye(178, 146, 10)}${eye(222, 146, 10)}
<circle cx="194" cy="172" r="2.5" class="k"/><circle cx="206" cy="172" r="2.5" class="k"/>
<path class="l" d="M176 186Q200 206 224 186M186 86q14-14 14 0q6-12 14 0"/>`;

// ---- Turtle (walks right) ----
const turtle = () => `${sun(60, 58)}${ground}${grass(30, 210)}${flower(368, 290)}
<path d="M104 274L56 300L108 300Z"/>
<path d="M144 262C142 286 140 300 138 314H174C172 300 170 286 168 262Z"/><path d="M234 262C232 286 230 300 228 314H264C262 300 260 286 258 262Z"/>
${tube([[[284, 264], [304, 254], [316, 238], [326, 220]]], 40, 34)}
<path d="M110 262C108 290 104 308 100 326H140C138 308 136 290 134 262Z"/><path d="M268 262C266 290 262 308 258 326H298C296 308 294 290 292 262Z"/>
<path class="l" d="M110 326v-8M120 326v-8M130 326v-8M268 326v-8M278 326v-8M288 326v-8"/>
<path d="M84 268C84 180 140 132 200 132C260 132 316 180 316 268Z"/>
${hex(200, 196, 36)}${hex(126, 234, 24)}${hex(274, 234, 24)}
<path d="M72 260Q200 248 328 260Q342 268 330 278Q200 292 70 278Q58 268 72 260Z"/>
<ellipse cx="344" cy="204" rx="40" ry="34"/>
${eye(354, 190, 10)}
<circle cx="330" cy="218" r="9"/>
<path class="l" d="M342 220Q358 230 374 214"/>`;

export default [
  { title: 'Lion', art: `<circle cx="335" cy="62" r="28"/><path class="l" d="M371 62L383 62M360.5 87.5L368.9 95.9M335 98L335 110M309.5 87.5L301.1 95.9M299 62L287 62M309.5 36.5L301.1 28.1M335 26L335 14M360.5 36.5L368.9 28.1"/><path d="M-20 337Q200 303 420 337V420H-20Z"/><path class="l" d="M40 372q-2-10-12-16M40 372q0-10 3-20M40 372q3-9 12-14M90 372q-2-10-12-16M90 372q0-10 3-20M90 372q3-9 12-14M330 372q-2-10-12-16M330 372q0-10 3-20M330 372q3-9 12-14M365 372q-2-10-12-16M365 372q0-10 3-20M365 372q3-9 12-14"/><path class="l" d="M268 300Q335 305 322 248"/><circle cx="322" cy="238" r="15"/><ellipse cx="200" cy="290" rx="85" ry="58"/><ellipse cx="200" cy="302" rx="42" ry="36"/><ellipse cx="140" cy="340" rx="32" ry="15"/><ellipse cx="260" cy="340" rx="32" ry="15"/><rect x="166" y="285" width="30" height="62" rx="15"/><rect x="204" y="285" width="30" height="62" rx="15"/><path d="M288 160 A24 24 0 0 1 279.3 198.2 A24 24 0 0 1 254.9 228.8 A24 24 0 0 1 219.6 245.8 A24 24 0 0 1 180.4 245.8 A24 24 0 0 1 145.1 228.8 A24 24 0 0 1 120.7 198.2 A24 24 0 0 1 112 160 A24 24 0 0 1 120.7 121.8 A24 24 0 0 1 145.1 91.2 A24 24 0 0 1 180.4 74.2 A24 24 0 0 1 219.6 74.2 A24 24 0 0 1 254.9 91.2 A24 24 0 0 1 279.3 121.8 A24 24 0 0 1 288 160Z"/><circle cx="146" cy="108" r="19"/><circle cx="254" cy="108" r="19"/><circle cx="146" cy="108" r="9.5"/><circle cx="254" cy="108" r="9.5"/><circle cx="200" cy="168" r="64"/><ellipse cx="183" cy="196" rx="22" ry="17"/><ellipse cx="217" cy="196" rx="22" ry="17"/><path d="M186 178Q200 170 214 178Q208 192 200 192Q192 192 186 178Z"/><circle cx="176" cy="152" r="7" class="k"/><circle cx="224" cy="152" r="7" class="k"/><path class="l" d="M164 136q12-8 24 0M212 136q12-8 24 0M182 220Q200 232 218 220"/><circle cx="174" cy="196" r="2.5" class="k"/><circle cx="182" cy="202" r="2.5" class="k"/><circle cx="226" cy="196" r="2.5" class="k"/><circle cx="218" cy="202" r="2.5" class="k"/><path class="l" d="M181 316v18M219 316v18M190 324v12M210 324v12"/>` },
  { title: 'Elephant', art: `<circle cx="340" cy="60" r="28"/><path class="l" d="M376 60L388 60M365.5 85.5L373.9 93.9M340 96L340 108M314.5 85.5L306.1 93.9M304 60L292 60M314.5 34.5L306.1 26.1M340 24L340 12M365.5 34.5L373.9 26.1"/><circle cx="55" cy="318" r="34"/><circle cx="98" cy="326" r="26"/><circle cx="350" cy="320" r="32"/><path d="M-20 337Q200 303 420 337V420H-20Z"/><path class="l" d="M30 372q-2-10-12-16M30 372q0-10 3-20M30 372q3-9 12-14M70 372q-2-10-12-16M70 372q0-10 3-20M70 372q3-9 12-14M345 372q-2-10-12-16M345 372q0-10 3-20M345 372q3-9 12-14M375 372q-2-10-12-16M375 372q0-10 3-20M375 372q3-9 12-14"/><ellipse cx="200" cy="280" rx="95" ry="60"/><rect x="118" y="290" width="38" height="55" rx="12"/><rect x="244" y="290" width="38" height="55" rx="12"/><rect x="152" y="300" width="38" height="52" rx="12"/><rect x="210" y="300" width="38" height="52" rx="12"/><ellipse cx="110" cy="160" rx="58" ry="68" transform="rotate(-10 110 160)"/><ellipse cx="290" cy="160" rx="58" ry="68" transform="rotate(10 290 160)"/><ellipse cx="115" cy="162" rx="36" ry="46" transform="rotate(-10 115 162)"/><ellipse cx="285" cy="162" rx="36" ry="46" transform="rotate(10 285 162)"/><ellipse cx="200" cy="150" rx="62" ry="66"/><path d="M168 200Q150 228 136 226Q148 214 160 192Z"/><path d="M232 200Q250 228 264 226Q252 214 240 192Z"/><path d="M182 190C178 245 172 278 192 294C208 306 236 298 240 278C228 284 214 284 210 272C205 258 216 228 218 190Z"/><circle cx="176" cy="142" r="7" class="k"/><circle cx="224" cy="142" r="7" class="k"/><circle cx="160" cy="168" r="10"/><circle cx="240" cy="168" r="10"/><path class="l" d="M186 226q14 5 28 0M190 248q12 4 22 0M196 270q10 3 16 0M160 120q10-8 20-2M220 118q10-6 20 2"/><path class="l" d="M126 342v-10M137 342v-10M160 349v-10M171 349v-10M229 349v-10M240 349v-10M263 342v-10M274 342v-10"/>` },
  { title: 'Giraffe', art: giraffe() },
  { title: 'Monkey', art: monkey() },
  { title: 'Zebra', art: zebra() },
  { title: 'Bear', art: `<circle cx="285" cy="45" r="20"/><path class="l" d="M313 45L325 45M304.8 64.8L313.3 73.3M285 73L285 85M265.2 64.8L256.7 73.3M257 45L245 45M265.2 25.2L256.7 16.7M285 17L285 5M304.8 25.2L313.3 16.7"/><path d="M-20 337Q200 303 420 337V420H-20Z"/><path class="l" d="M110 372q-2-10-12-16M110 372q0-10 3-20M110 372q3-9 12-14M290 372q-2-10-12-16M290 372q0-10 3-20M290 372q3-9 12-14"/><rect x="50" y="270" width="18" height="64"/><polygon points="59,90 14,280 104,280"/><rect x="332" y="270" width="18" height="64"/><polygon points="341,90 296,280 386,280"/><ellipse cx="200" cy="280" rx="78" ry="66"/><ellipse cx="200" cy="296" rx="44" ry="44"/><ellipse cx="130" cy="268" rx="20" ry="42" transform="rotate(25 130 268)"/><ellipse cx="270" cy="268" rx="20" ry="42" transform="rotate(-25 270 268)"/><ellipse cx="152" cy="338" rx="32" ry="22"/><ellipse cx="248" cy="338" rx="32" ry="22"/><ellipse cx="152" cy="342" rx="16" ry="11"/><ellipse cx="248" cy="342" rx="16" ry="11"/><circle cx="142" cy="98" r="24"/><circle cx="258" cy="98" r="24"/><circle cx="142" cy="98" r="12"/><circle cx="258" cy="98" r="12"/><circle cx="200" cy="150" r="66"/><ellipse cx="200" cy="182" rx="30" ry="24"/><ellipse cx="200" cy="170" rx="13" ry="9"/><circle cx="174" cy="140" r="6.5" class="k"/><circle cx="226" cy="140" r="6.5" class="k"/><path class="l" d="M200 179v10M186 192Q193 200 200 189Q207 200 214 192M60 140l-10 12M58 200l-14 16M342 140l10 12M342 200l14 16"/>` },
  { title: 'Owl', art: `<path d="M70 40A32 32 0 1 0 102 88A26 26 0 1 1 70 40Z"/><polygon points="300,40 306,54 320,56 309,65 312,79 300,71 288,79 291,65 280,56 294,54"/><polygon points="350,110 355,121 366,122 357,129 360,140 350,134 340,140 343,129 334,122 345,121"/><polygon points="140,108 150,60 182,104"/><polygon points="260,108 250,60 218,104"/><ellipse cx="200" cy="210" rx="86" ry="108"/><ellipse cx="118" cy="228" rx="28" ry="62" transform="rotate(12 118 228)"/><ellipse cx="282" cy="228" rx="28" ry="62" transform="rotate(-12 282 228)"/><ellipse cx="200" cy="252" rx="52" ry="58"/><path class="l" d="M176 226q8 8 16 0M208 226q8 8 16 0M160 250q8 8 16 0M192 250q8 8 16 0M224 250q8 8 16 0M176 274q8 8 16 0M208 274q8 8 16 0"/><circle cx="165" cy="168" r="34"/><circle cx="235" cy="168" r="34"/><circle cx="165" cy="168" r="19"/><circle cx="235" cy="168" r="19"/><circle cx="165" cy="168" r="9" class="k"/><circle cx="235" cy="168" r="9" class="k"/><path d="M188 194H212Q206 214 200 220Q194 214 188 194Z"/><path d="M20 322Q200 300 380 318L380 340Q200 326 20 346Z"/><ellipse cx="180" cy="316" rx="15" ry="9"/><ellipse cx="220" cy="316" rx="15" ry="9"/><ellipse cx="52" cy="300" rx="26" ry="11" transform="rotate(-25 52 300)"/><ellipse cx="352" cy="296" rx="26" ry="11" transform="rotate(25 352 296)"/>` },
  { title: 'Fox', art: `<circle cx="340" cy="60" r="24"/><path class="l" d="M372 60L384 60M362.6 82.6L371.1 91.1M340 92L340 104M317.4 82.6L308.9 91.1M308 60L296 60M317.4 37.4L308.9 28.9M340 28L340 16M362.6 37.4L371.1 28.9"/><path d="M-20 337Q200 303 420 337V420H-20Z"/><path class="l" d="M30 372q-2-10-12-16M30 372q0-10 3-20M30 372q3-9 12-14M80 372q-2-10-12-16M80 372q0-10 3-20M80 372q3-9 12-14M350 372q-2-10-12-16M350 372q0-10 3-20M350 372q3-9 12-14"/><rect x="60" y="300" width="14" height="36" rx="6"/><path d="M38 305Q67 260 96 305Z"/><circle cx="54" cy="292" r="6" class="l"/><path d="M240 322C335 335 370 250 334 196C318 172 290 186 300 212C316 254 290 288 238 292Z"/><path d="M300 212C290 186 318 172 334 196C340 208 340 220 336 228Q314 226 300 212Z"/><ellipse cx="200" cy="280" rx="62" ry="64"/><ellipse cx="200" cy="282" rx="30" ry="44"/><rect x="166" y="290" width="28" height="58" rx="13"/><rect x="206" y="290" width="28" height="58" rx="13"/><ellipse cx="180" cy="342" rx="14" ry="8"/><ellipse cx="220" cy="342" rx="14" ry="8"/><polygon points="138,150 148,58 198,120"/><polygon points="262,150 252,58 202,120"/><polygon points="150,130 154,84 178,116"/><polygon points="250,130 246,84 222,116"/><path d="M126 130Q200 92 274 130Q268 178 200 230Q132 178 126 130Z"/><path d="M138 150Q176 150 200 198V230Q150 196 138 150Z"/><path d="M262 150Q224 150 200 198V230Q250 196 262 150Z"/><ellipse cx="200" cy="222" rx="11" ry="7"/><circle cx="172" cy="150" r="6.5" class="k"/><circle cx="228" cy="150" r="6.5" class="k"/><path class="l" d="M186 198q14 10 28 0"/>` },
  { title: 'Turtle', art: turtle() },
  { title: 'Frog', art: `<circle cx="340" cy="50" r="22"/><path class="l" d="M370 50L382 50M361.2 71.2L369.7 79.7M340 80L340 92M318.8 71.2L310.3 79.7M310 50L298 50M318.8 28.8L310.3 20.3M340 20L340 8M361.2 28.8L369.7 20.3"/><path d="M-20 287Q200 263 420 287V420H-20Z"/><path class="l" d="M40 300V160M66 305V190"/><ellipse cx="40" cy="160" rx="8" ry="24"/><ellipse cx="66" cy="190" rx="8" ry="22"/><path d="M30 300Q10 230 26 200Q30 250 44 300Z"/><path class="l" d="M362 300V170"/><ellipse cx="362" cy="170" rx="8" ry="24"/><path d="M200 325L295.5 299.5A135 36 0 1 1 257.1 292.4Z"/><ellipse cx="128" cy="288" rx="40" ry="26"/><ellipse cx="272" cy="288" rx="40" ry="26"/><ellipse cx="102" cy="318" rx="26" ry="10"/><ellipse cx="298" cy="318" rx="26" ry="10"/><ellipse cx="200" cy="262" rx="74" ry="56"/><ellipse cx="200" cy="282" rx="44" ry="34"/><ellipse cx="162" cy="300" rx="14" ry="26"/><ellipse cx="238" cy="300" rx="14" ry="26"/><ellipse cx="156" cy="324" rx="19" ry="8"/><ellipse cx="244" cy="324" rx="19" ry="8"/><circle cx="155" cy="140" r="30"/><circle cx="245" cy="140" r="30"/><ellipse cx="200" cy="188" rx="86" ry="56"/><circle cx="155" cy="134" r="19"/><circle cx="245" cy="134" r="19"/><circle cx="155" cy="136" r="9" class="k"/><circle cx="245" cy="136" r="9" class="k"/><circle cx="138" cy="205" r="10"/><circle cx="262" cy="205" r="10"/><circle cx="193" cy="172" r="2.5" class="k"/><circle cx="207" cy="172" r="2.5" class="k"/><path class="l" d="M150 198Q200 236 250 198M110 360q20-8 40 0M260 372q20-8 40 0"/>` },
];
