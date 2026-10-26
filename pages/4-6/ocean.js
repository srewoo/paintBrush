// Ocean colouring pages. Shared scenery bits are small helpers; each `art` is plain inner SVG.
const sand = (y = 340) =>
  `<path d="M-20 ${y} H0 Q50 ${y - 14} 100 ${y} T200 ${y} T300 ${y} T400 ${y} H420 V420 H-20Z"/>`;
const weed = (x, y, h = 1) =>
  `<path transform="translate(${x} ${y}) scale(1 ${h})" d="M-12 0 C-32 -30 8 -60 -10 -90 C-26 -118 4 -140 0 -165 C26 -140 12 -114 14 -90 C32 -60 -4 -30 14 0Z"/>`;
const rock = (x, y, w = 40, h = 34) =>
  `<path d="M${x - w} ${y} Q${x - w} ${y - h} ${x} ${y - h} Q${x + w} ${y - h} ${x + w} ${y}Z"/>`;
const shell = (x, y) =>
  `<g transform="translate(${x} ${y})"><path d="M-24 0 Q-30 -30 0 -34 Q30 -30 24 0 H12 Q12 9 0 9 Q-12 9 -12 0Z"/><path class="l" d="M0 -2 V-30 M-10 -2 L-16 -26 M10 -2 L16 -26"/></g>`;
const bubbles = (...list) => list.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
const eye = (x, y, r = 16) =>
  `<circle cx="${x}" cy="${y}" r="${r}"/><circle class="k" cx="${x + r * 0.2}" cy="${y + r * 0.15}" r="${r * 0.5}"/>`;
const cheek = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="12" ry="8"/>`;

// Five chubby rounded arms around (cx, cy).
const star = (cx, cy, R, r) => {
  const p = (a, d) => [cx + d * Math.cos(a), cy + d * Math.sin(a)].map((n) => n.toFixed(1)).join(' ');
  const step = Math.PI / 5;
  let d = '';
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * 2 * step;
    d += `${i ? 'L' : 'M'}${p(a - step, r)} L${p(a - 0.16, R * 0.8)} Q${p(a, R * 1.02)} ${p(a + 0.16, R * 0.8)} `;
  }
  return `<path d="${d}Z"/>`;
};

// Pufferfish spikes: triangles with their base hidden under the body.
const spikes = (cx, cy, angles) => angles.map((deg) => {
  const a = (deg * Math.PI) / 180;
  const pt = (d, off) => `${(cx + d * Math.cos(a) - off * Math.sin(a)).toFixed(1)},${(cy + d * Math.sin(a) + off * Math.cos(a)).toFixed(1)}`;
  return `<polygon points="${pt(98, -14)} ${pt(140, 0)} ${pt(98, 14)}"/>`;
}).join('');

const tentacle = (x, y, rot, flip) =>
  `<path transform="translate(${x} ${y}) rotate(${rot}) scale(${flip ? -1 : 1} 1)" d="M-20 0 C-26 60 -12 100 14 116 C36 128 50 104 36 92 C26 100 14 94 10 84 C2 62 6 38 18 0Z"/>`;

const jellyArm = (x, len) =>
  `<path transform="translate(${x} 190)" d="M-9 0 Q-24 ${len / 4} -9 ${len / 2} Q6 ${len * 0.75} -9 ${len} L9 ${len} Q24 ${len * 0.75} 9 ${len / 2} Q-6 ${len / 4} 9 0Z"/>`;

export default [
  {
    title: 'Fish',
    art: `${sand()}${weed(40, 350, 1.1)}${weed(360, 350)}${rock(330, 352)}${shell(90, 360)}
<polygon points="100,190 30,125 50,190 30,255"/>
<path d="M140 125 Q190 70 250 125Z"/><path d="M165 255 Q195 300 225 255Z"/>
<ellipse cx="190" cy="190" rx="110" ry="75"/>
<path d="M140 128 Q125 190 140 252 L165 260 Q150 190 165 120Z"/>
<path d="M185 120 Q170 190 185 260 L210 262 Q195 190 210 118Z"/>
<path d="M232 208 Q206 236 240 244 Q252 224 232 208Z"/>
${eye(255, 168, 18)}<path class="l" d="M268 212 Q283 222 295 205"/>
${bubbles([322, 150, 10], [342, 112, 14], [326, 72, 9])}`,
  },
  {
    title: 'Whale',
    art: `${sand()}${rock(60, 352, 36, 30)}${weed(370, 350, 0.8)}${shell(250, 362)}
<path d="M165 125 Q155 85 120 70 Q150 72 160 55 Q170 75 182 52 Q192 72 220 68 Q190 85 185 125Z"/>
${bubbles([115, 42, 9], [228, 46, 9])}
<path d="M300 215 Q330 175 368 150 Q362 200 340 218 Q365 238 372 285 Q330 262 300 235Z"/>
<path d="M45 215 Q45 118 180 118 Q300 118 320 215 Q300 292 180 292 Q55 292 45 215Z"/>
<path d="M55 240 Q180 262 300 250 Q280 290 180 291 Q75 291 55 240Z"/>
<path class="l" d="M90 262 Q180 278 270 266 M125 278 Q180 286 240 280"/>
<path d="M215 250 Q232 304 272 292 Q258 262 242 248Z"/>
${eye(100, 188, 13)}${cheek(132, 222)}<path class="l" d="M58 222 Q78 238 104 228"/>
${bubbles([330, 110, 10], [355, 80, 13])}`,
  },
  {
    title: 'Octopus',
    art: `${sand(345)}${weed(35, 355)}${weed(368, 355, 0.85)}${shell(335, 368)}
${tentacle(130, 190, 30, true)}${tentacle(162, 200, 12, true)}${tentacle(192, 205, 2, true)}
${tentacle(208, 205, -2, false)}${tentacle(238, 200, -12, false)}${tentacle(270, 190, -30, false)}
<path d="M100 165 Q95 45 200 45 Q305 45 300 165 Q300 222 200 222 Q100 222 100 165Z"/>
<circle cx="150" cy="88" r="11"/><circle cx="200" cy="70" r="9"/><circle cx="252" cy="92" r="13"/>
${eye(168, 140, 22)}${eye(232, 140, 22)}${cheek(138, 182)}${cheek(262, 182)}
<path class="l" d="M178 185 Q200 202 222 185"/>
${bubbles([60, 80, 12], [80, 45, 9], [335, 70, 11])}`,
  },
  {
    title: 'Crab',
    art: `${sand(310)}${rock(55, 330, 40, 40)}${shell(345, 370)}${weed(370, 310, 0.8)}
<path transform="translate(118 222) rotate(12)" d="M0 -7 L-52 -10 L-72 30 L-58 34 L-44 6 L0 8Z"/><path transform="translate(114 248) rotate(-6)" d="M0 -7 L-52 -10 L-72 30 L-58 34 L-44 6 L0 8Z"/><path transform="translate(120 272) rotate(-24)" d="M0 -7 L-52 -10 L-72 30 L-58 34 L-44 6 L0 8Z"/>
<path transform="translate(400 0) scale(-1 1) translate(118 222) rotate(12)" d="M0 -7 L-52 -10 L-72 30 L-58 34 L-44 6 L0 8Z"/><path transform="translate(400 0) scale(-1 1) translate(114 248) rotate(-6)" d="M0 -7 L-52 -10 L-72 30 L-58 34 L-44 6 L0 8Z"/><path transform="translate(400 0) scale(-1 1) translate(120 272) rotate(-24)" d="M0 -7 L-52 -10 L-72 30 L-58 34 L-44 6 L0 8Z"/>
<polygon points="142,205 122,198 84,140 104,128"/><polygon points="258,205 278,198 316,140 296,128"/>
<path transform="translate(88 118)" d="M0 26 C-44 26 -54 -32 -16 -48 L-4 -20 L16 -42 C42 -26 32 22 0 26Z"/>
<path transform="translate(312 118) scale(-1 1)" d="M0 26 C-44 26 -54 -32 -16 -48 L-4 -20 L16 -42 C42 -26 32 22 0 26Z"/>
<rect x="163" y="150" width="16" height="42" rx="6"/><rect x="221" y="150" width="16" height="42" rx="6"/>
<ellipse cx="200" cy="240" rx="105" ry="62"/>
${eye(171, 142, 19)}${eye(229, 142, 19)}${cheek(150, 248)}${cheek(250, 248)}
<path class="l" d="M175 255 Q200 278 225 255"/>
<circle cx="200" cy="214" r="10"/>
${bubbles([240, 70, 10], [262, 40, 13])}`,
  },
  {
    title: 'Starfish',
    art: `${sand(300)}${weed(40, 310, 0.9)}${rock(355, 315, 34, 30)}${shell(70, 372)}${shell(330, 375)}
<g transform="rotate(-8 200 205)">${star(200, 205, 160, 66)}
<circle cx="200" cy="86" r="10"/><circle cx="315" cy="170" r="10"/><circle cx="270" cy="300" r="10"/>
<circle cx="130" cy="300" r="10"/><circle cx="85" cy="170" r="10"/>
${eye(178, 192, 15)}${eye(222, 192, 15)}${cheek(160, 222)}${cheek(240, 222)}
<path class="l" d="M185 225 Q200 240 215 225"/></g>
${bubbles([60, 60, 10], [340, 50, 12], [365, 90, 8])}`,
  },
  {
    title: 'Seahorse',
    art: `${sand(350)}${weed(60, 360, 1.2)}${weed(340, 360, 1)}${rock(300, 362, 38, 30)}${shell(118, 372)}
<path d="M170 84 L140 70 L166 62 L156 38 L184 52 L190 24 L210 54Z"/>
<path d="M148 186 C108 188 92 226 104 254 C118 248 136 250 152 252Z"/><path class="l" d="M140 196 L112 226 M144 222 L110 246"/>
<path d="M160 96 C158 64 186 46 214 50 C234 52 246 64 250 78 C268 80 290 78 306 78 C318 78 318 98 306 98 C290 98 268 100 254 108 C244 114 240 126 238 136 C236 148 242 156 250 166 C276 196 272 246 238 266 C220 276 196 280 184 292 C176 300 172 318 180 330 C188 342 208 342 214 330 C218 322 214 312 206 310 C214 302 230 306 234 318 C240 342 220 364 194 364 C166 364 148 344 148 318 C148 298 154 286 156 270 C140 240 134 200 148 172 C160 150 162 124 160 96Z"/>
<path class="l" d="M222 190 Q240 196 256 190 M222 214 Q242 220 260 214 M220 238 Q238 244 254 238"/>
${eye(212, 82, 14)}${cheek(222, 114)}<path class="l" d="M298 90 Q305 95 312 89"/>
${bubbles([330, 70, 12], [350, 35, 9], [80, 110, 10])}`,
  },
  {
    title: 'Dolphin',
    art: `<circle cx="70" cy="70" r="36"/><path class="l" d="M70 18 V8 M120 70 H132 M106 34 L114 26 M34 34 L26 26"/>
<path d="M260 60 Q262 36 290 40 Q300 20 325 32 Q350 30 350 52 Q366 60 352 72 L268 72 Q250 70 260 60Z"/>
<path d="M206 140 C210 110 232 92 262 86 C250 104 248 120 254 134Z"/>
<path d="M262 190 C262 214 250 232 230 240 C230 222 234 206 240 190Z"/>
<path d="M92 320 C96 200 190 116 272 126 C318 132 344 158 350 186 C362 196 378 206 380 216 Q382 228 368 226 C352 224 338 216 326 206 C280 182 204 184 164 222 C144 242 136 280 140 320Z"/>
<path d="M326 206 C280 182 204 184 164 222 C144 242 136 280 140 320 H156 C154 282 164 250 184 232 C220 202 280 196 326 206Z"/>
${eye(314, 168, 12)}<path class="l" d="M330 200 Q340 208 352 206"/>
<path d="M-20 300 H0 Q50 282 100 300 T200 300 T300 300 T400 300 H420 V420 H-20Z"/>
<path d="M30 312 C24 302 14 296 10 282 C30 280 48 288 58 298 C56 280 52 262 58 242 C72 258 80 276 86 294 C110 288 138 288 162 294 C168 276 178 260 194 246 C192 264 190 280 194 296 C208 286 226 278 244 280 C236 292 232 304 230 312 Q130 334 30 312Z"/>
<path d="M28 226 Q38 240 34 248 A8 8 0 0 1 20 242 Q22 234 28 226Z"/><path d="M234 246 Q244 260 240 268 A8 8 0 0 1 226 262 Q228 254 234 246Z"/>
<path d="M-20 350 H0 Q50 335 100 350 T200 350 T300 350 T400 350 H420 V420 H-20Z"/>`,
  },
  {
    title: 'Jellyfish',
    art: `${sand(355)}${weed(40, 365, 0.9)}${weed(365, 365, 1.1)}${shell(300, 385)}${rock(110, 368, 36, 28)}
${jellyArm(125, 120)}${jellyArm(162, 150)}${jellyArm(200, 135)}${jellyArm(238, 150)}${jellyArm(275, 120)}
<path d="M90 200 Q90 60 200 60 Q310 60 310 200 Q288 218 266 200 Q244 218 222 200 Q200 218 178 200 Q156 218 134 200 Q112 218 90 200Z"/>
<circle cx="140" cy="115" r="12"/><circle cx="200" cy="90" r="10"/><circle cx="262" cy="118" r="13"/>
${eye(170, 145, 16)}${eye(230, 145, 16)}${cheek(145, 175)}${cheek(255, 175)}
<path class="l" d="M185 172 Q200 186 215 172"/>
${bubbles([50, 90, 12], [70, 50, 8], [345, 150, 10], [355, 110, 13])}`,
  },
  {
    title: 'Pufferfish',
    art: `${sand(345)}${weed(35, 360)}${weed(365, 360, 0.8)}${shell(300, 380)}${rock(110, 365, 36, 26)}
<path d="M98 200 L38 160 Q26 200 38 240Z"/>
${spikes(200, 195, [-150, -120, -90, -60, -30, 30, 60, 90, 120, 150])}
<circle cx="200" cy="195" r="110"/>
<path d="M94 225 Q200 265 306 225 A110 110 0 0 1 94 225Z"/>
<circle cx="135" cy="150" r="10"/><circle cx="165" cy="115" r="9"/><circle cx="125" cy="190" r="9"/>
<path d="M160 200 Q128 220 162 236 Q176 218 160 200Z"/>
${eye(215, 160, 22)}${eye(272, 160, 22)}${cheek(196, 200)}${cheek(292, 200)}
<ellipse cx="248" cy="208" rx="12" ry="10"/>
${bubbles([340, 75, 12], [360, 40, 9], [60, 70, 10])}`,
  },
  {
    title: 'Sailboat',
    art: `<circle cx="75" cy="85" r="35"/><path class="l" d="M75 30 V18 M130 85 H142 M114 46 L122 38 M36 46 L28 38 M114 124 L122 132"/>
<path d="M270 80 Q272 56 300 60 Q310 40 335 52 Q360 50 360 72 Q376 80 362 92 L278 92 Q260 90 270 80Z"/>
<path class="l" d="M300 140 Q310 130 320 140 Q330 130 340 140"/>
<polygon points="200,40 236,52 200,64"/>
<rect x="196" y="40" width="8" height="210"/>
<polygon points="212,70 212,232 312,232"/><polygon points="212,150 212,190 279,190 255,150"/>
<polygon points="188,90 188,232 104,232"/>
<polygon points="80,245 320,245 290,292 110,292"/>
<polygon points="84,245 316,245 305,262 95,262"/>
<circle cx="160" cy="274" r="9"/><circle cx="200" cy="274" r="9"/><circle cx="240" cy="274" r="9"/>
<path d="M0 290 Q50 272 100 290 T200 290 T300 290 T400 290 V400 H0Z"/>
<path d="M0 340 Q50 322 100 340 T200 340 T300 340 T400 340 V400 H0Z"/>
<path class="l" d="M40 315 Q55 305 70 315 M300 312 Q315 302 330 312 M160 375 Q175 365 190 375"/>`,
  },
];
