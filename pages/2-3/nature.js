// Nature colouring pages for toddlers (2-3): Sun, Moon, Cloud, Flower, Leaf, Tree, House, Umbrella, Cup, Hat.
const ring = (n, shape, cx, cy) => Array.from({ length: n }, (_, i) =>
  shape.replace('/>', ` transform="rotate(${(360 / n) * i} ${cx} ${cy})"/>`)).join('');
const hill = '<path d="M25 375V335Q200 300 375 335V375Z"/>';
// ground(): grass that bleeds off the page on three sides.
const ground = '<path d="M-20 360Q200 322 420 360V420H-20Z"/>';
// apple(): small chunky apple with a stalk line, centred on x,y.
const apple = (x, y) => `<path d="M${x} ${y - 14}C${x - 10} ${y - 24} ${x - 28} ${y - 18} ${x - 28} ${y + 2}C${x - 28} ${y + 22} ${x - 10} ${y + 30} ${x} ${y + 24}C${x + 10} ${y + 30} ${x + 28} ${y + 22} ${x + 28} ${y + 2}C${x + 28} ${y - 18} ${x + 10} ${y - 24} ${x} ${y - 14}Z"/><path class="l" d="M${x} ${y - 14}q1-10 7-15"/>`;
const drop = (x, y) => `<path d="M${x} ${y}Q${x + 28} ${y + 38} ${x + 26} ${y + 52}A26 26 0 0 1 ${x - 26} ${y + 52}Q${x - 28} ${y + 38} ${x} ${y}Z"/>`;
const star = (cx, cy, r) => `<polygon points="${Array.from({ length: 10 }, (_, i) => {
  const a = (Math.PI / 5) * i - Math.PI / 2, d = i % 2 ? r * 0.55 : r;
  return `${(cx + d * Math.cos(a)).toFixed(1)},${(cy + d * Math.sin(a)).toFixed(1)}`;
}).join(' ')}"/>`;
const face = (x, y, w) => `<circle class="k" cx="${x - w}" cy="${y}" r="8"/><circle class="k" cx="${x + w}" cy="${y}" r="8"/><path class="l" d="M${x - w} ${y + 32}q${w} ${w * 0.8} ${w * 2} 0"/>`;

export default [
  { title: 'Sun', art: `${ring(8, '<polygon points="168,100 200,28 232,100"/>', 200, 200)}<circle cx="200" cy="200" r="102"/>${face(200, 185, 35)}` },
  { title: 'Moon', art: `<path d="M230 55A150 150 0 1 0 230 345A170 170 0 0 1 230 55Z"/>${star(305, 95, 50)}${star(322, 215, 48)}${star(298, 325, 46)}<circle class="k" cx="100" cy="175" r="8"/><path class="l" d="M82 225q22 20 46 4"/>` },
  { title: 'Cloud', art: `<path d="M90 250A52 52 0 0 1 95 150A68 68 0 0 1 215 110A58 58 0 0 1 310 165A45 45 0 0 1 305 250Z"/>${face(200, 185, 38)}${drop(120, 285)}${drop(200, 290)}${drop(280, 285)}` },
  { title: 'Flower', art: `<rect x="185" y="190" width="30" height="150" rx="10"/><path d="M200 300C165 245 105 245 85 265C110 300 165 310 200 300Z"/><path d="M200 270C235 215 295 215 315 235C290 270 235 280 200 270Z"/>${hill}${ring(5, '<ellipse cx="200" cy="82" rx="44" ry="50"/>', 200, 145)}<circle cx="200" cy="145" r="55"/>${face(200, 132, 20)}` },
  { title: 'Leaf', art: `${ground}<g transform="translate(0 -8) rotate(-20 200 190)"><path d="M189 268H211C213 290 206 318 192 336A10.4 10.4 0 0 1 174 326C186 310 190 290 189 268Z"/><path d="M200 278C112 248 82 140 200 32C318 140 288 248 200 278Z"/><path class="l" d="M200 270V222"/><circle class="k" cx="175" cy="150" r="9"/><circle class="k" cx="225" cy="150" r="9"/><path class="l" d="M178 176q22 20 44 0"/></g>` },
  { title: 'Tree', art: `${ground}<path d="M172 220C176 260 176 300 168 330Q150 344 132 348Q200 358 268 348Q250 344 232 330C224 300 224 260 228 220Z"/><path d="M90 225A62 62 0 0 1 92 108A78 78 0 0 1 228 52A72 72 0 0 1 322 130A62 62 0 0 1 306 240Q200 268 90 225Z"/>${apple(108, 170)}${apple(292, 175)}${apple(150, 92)}${face(205, 150, 34)}` },
  { title: 'House', art: `${hill}<rect x="255" y="75" width="50" height="80"/><rect x="90" y="180" width="220" height="165"/><polygon points="65,195 200,60 335,195"/><rect x="170" y="245" width="60" height="100" rx="6"/><rect x="102" y="210" width="56" height="56" rx="4"/><rect x="242" y="210" width="56" height="56" rx="4"/><circle class="k" cx="218" cy="298" r="6"/>` },
  { title: 'Umbrella', art: `<path d="M187 230H213V320A43 43 0 0 1 127 320V305H153V320A17 17 0 0 0 187 320Z"/><path d="M50 200A150 150 0 0 1 350 200A50 50 0 0 1 250 200A50 50 0 0 1 150 200A50 50 0 0 1 50 200Z"/><path d="M200 50Q145 110 150 200A50 50 0 0 0 250 200Q255 110 200 50Z"/>${drop(70, 40)}${drop(330, 40)}` },
  { title: 'Cup', art: `<ellipse cx="180" cy="335" rx="150" ry="30"/><path d="M285 165A70 70 0 1 1 285 305A70 70 0 1 1 285 165ZM285 197A38 38 0 1 0 285 273A38 38 0 1 0 285 197Z"/><path d="M70 140H290L272 312Q269 330 252 330H108Q91 330 88 312Z"/><ellipse cx="180" cy="140" rx="110" ry="24"/>${face(180, 210, 38)}<path class="l" d="M145 100q-15-20 0-38q15-18 0-36M215 100q-15-20 0-38q15-18 0-36"/>` },
  { title: 'Hat', art: `<ellipse cx="200" cy="285" rx="175" ry="62"/><path d="M95 282C80 75 320 75 305 282Q200 312 95 282Z"/><path d="M93 230Q200 258 307 230L305 282Q200 312 95 282Z"/><polygon points="200,262 135,225 135,300"/><polygon points="200,262 265,225 265,300"/><circle cx="200" cy="263" r="24"/>` },
];
