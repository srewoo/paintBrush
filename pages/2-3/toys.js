// Toy colouring pages for toddlers: Ball, Star, Heart, Balloon, Teddy Bear, Blocks, Kite, Drum, Rubber Duck, Rattle.
const r = (n) => Math.round(n * 10) / 10;
const face = (x, y, s = 1) => `<circle class="k" cx="${r(x - 20 * s)}" cy="${y}" r="${r(7 * s)}"/><circle class="k" cx="${r(x + 20 * s)}" cy="${y}" r="${r(7 * s)}"/><path class="l" d="M${r(x - 18 * s)} ${r(y + 18 * s)}q${r(18 * s)} ${r(18 * s)} ${r(36 * s)} 0"/>`;
const hill = (y = 335) => `<path d="M-10 ${y + 10}Q200 ${y - 30} 410 ${y + 10}V410H-10Z"/>`;
const cloud = (x, y, s = 1) => `<path d="M${x} ${y}a${r(18 * s)} ${r(18 * s)} 0 0 1 ${r(8 * s)}-${r(34 * s)}a${r(24 * s)} ${r(24 * s)} 0 0 1 ${r(44 * s)}-${r(8 * s)}a${r(18 * s)} ${r(18 * s)} 0 0 1 ${r(22 * s)} ${r(42 * s)}Z"/>`;
const heartD = (cx, cy, s) => {
  const p = (dx, dy) => `${r(cx + dx * s)} ${r(cy + dy * s)}`;
  return `M${p(0, 130)}C${p(-140, 40)} ${p(-160, -50)} ${p(-110, -95)}C${p(-65, -135)} ${p(-15, -115)} ${p(0, -75)}C${p(15, -115)} ${p(65, -135)} ${p(110, -95)}C${p(160, -50)} ${p(140, 40)} ${p(0, 130)}Z`;
};
// softStar(): one closed 5-point star outline with rounded tips (k = how far the rounding reaches along each edge).
const softStar = (cx, cy, R, ri, k = 0.2) => {
  const v = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2, d = i % 2 ? ri : R;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
  });
  const lerp = (a, b, t) => `${r(a[0] + (b[0] - a[0]) * t)} ${r(a[1] + (b[1] - a[1]) * t)}`;
  return v.map((p, i) => {
    const prev = v[(i + 9) % 10], next = v[(i + 1) % 10];
    return `${i ? 'L' : 'M'}${lerp(p, prev, k)}Q${r(p[0])} ${r(p[1])} ${lerp(p, next, k)}`;
  }).join('') + 'Z';
};

export default [
  { title: 'Ball', art: `${cloud(300, 80, 1)}<path d="M200 87A128 128 0 0 0 72 215A128 128 0 0 0 140 328C124 290 118 170 182 122L200 112Z"/><path d="M200 87A128 128 0 0 1 328 215A128 128 0 0 1 260 328C276 290 282 170 218 122L200 112Z"/><path d="M182 122C118 170 124 290 140 328Q200 360 260 328C276 290 282 170 218 122Z"/><ellipse cx="200" cy="122" rx="32" ry="20"/>${hill()}${face(200, 225, 1.15)}` },
  { title: 'Star', art: `${hill(345)}<path d="${softStar(200, 205, 175, 88)}"/>${face(200, 205, 1.15)}` },
  { title: 'Heart', art: `${cloud(285, 80, 1.1)}${hill(345)}<path d="${heartD(200, 195, 1.15)}"/><path d="${heartD(200, 200, 0.62)}"/>${face(200, 185)}` },
  { title: 'Balloon', art: `${cloud(14, 96, 0.95)}${hill(360)}<path class="l" d="M200 309q-22 10 -6 17t-5 11"/><path d="M186 262Q200 258 214 262Q240 298 230 304Q200 314 170 304Q160 298 186 262Z"/><path d="M200 26C268 26 310 82 310 145C310 212 255 262 200 270C145 262 90 212 90 145C90 82 132 26 200 26Z"/>${face(200, 150, 1.2)}` },
  { title: 'Teddy Bear', art: `${hill(350)}<circle cx="128" cy="72" r="38"/><circle cx="272" cy="72" r="38"/><path d="M155 205C112 208 76 226 66 262C58 292 82 312 108 300C104 334 140 356 200 356C260 356 296 334 292 300C318 312 342 292 334 262C324 226 288 208 245 205Z"/><path class="l" d="M108 300C118 280 122 258 118 238M292 300C282 280 278 258 282 238"/><ellipse cx="200" cy="282" rx="55" ry="50"/><circle cx="140" cy="345" r="33"/><circle cx="260" cy="345" r="33"/><circle cx="200" cy="138" r="88"/><ellipse cx="200" cy="170" rx="46" ry="34"/><circle class="k" cx="168" cy="118" r="8"/><circle class="k" cx="232" cy="118" r="8"/><ellipse class="k" cx="200" cy="158" rx="13" ry="9"/><path class="l" d="M184 178q16 14 32 0"/>` },
  { title: 'Blocks', art: `${hill(345)}<rect x="62" y="215" width="135" height="130" rx="10"/><rect x="203" y="215" width="135" height="130" rx="10"/><rect x="133" y="80" width="135" height="135" rx="10"/><circle cx="129.5" cy="280" r="38"/><polygon points="270.5,240 312,318 229,318"/>${face(200, 140)}` },
  { title: 'Kite', art: `${cloud(300, 330, 1.1)}<path class="l" d="M200 300q-30 18 0 36t-10 36"/><polygon points="155,312 245,360 245,312 155,360"/><polygon points="200,40 85,165 200,165"/><polygon points="200,40 315,165 200,165"/><polygon points="85,165 200,300 200,165"/><polygon points="315,165 200,300 200,165"/>` },
  { title: 'Drum', art: `${hill(350)}<path d="M80 160V300A120 42 0 0 0 320 300V160Z"/><ellipse cx="200" cy="160" rx="120" ry="42"/>${face(200, 245)}<rect x="189" y="20" width="22" height="160" rx="11" transform="rotate(-40 200 100)"/><rect x="189" y="20" width="22" height="160" rx="11" transform="rotate(40 200 100)"/><circle cx="135" cy="45" r="22"/><circle cx="265" cy="45" r="22"/>` },
  { title: 'Rubber Duck', art: `<polygon points="78,256 36,172 136,212"/><ellipse cx="190" cy="265" rx="135" ry="72"/><path d="M120 250Q170 205 235 250Q180 305 120 250Z"/><circle cx="255" cy="150" r="72"/><path d="M300 140Q350 128 368 150Q352 176 300 176Q314 158 300 140Z"/><circle class="k" cx="347" cy="150" r="3"/><circle class="k" cx="270" cy="132" r="9"/><path class="l" d="M262 175q20 10 38 -4"/><path d="M-10 320Q30 300 70 320T150 320T230 320T310 320T390 320T470 320V410H-10Z"/>` },
  { title: 'Rattle', art: `${cloud(285, 330, 1.1)}<rect x="176" y="200" width="48" height="125" rx="12"/><circle cx="200" cy="335" r="34"/><ellipse cx="200" cy="228" rx="50" ry="24"/><circle cx="200" cy="120" r="92"/><path d="M109.2 135A92 92 0 0 0 140.3 190H259.7A92 92 0 0 0 290.8 135Z"/>${face(200, 85)}` },
];
