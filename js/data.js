import little from '../pages/2-3/index.js';
import junior from '../pages/4-6/index.js';
import big from '../pages/7-9/index.js';

const star = (cx, cy, r) => `<polygon points="${Array.from({ length: 10 }, (_, i) => {
  const a = (Math.PI / 5) * i - Math.PI / 2, d = i % 2 ? r * 0.45 : r;
  return `${(cx + d * Math.cos(a)).toFixed(1)},${(cy + d * Math.sin(a)).toFixed(1)}`;
}).join(' ')}"/>`;
const balloon = (x, y) => `<path class="l" d="M${x} ${y + 50} q-12 30 ${200 - x > 0 ? 8 : -8} 70"/>
  <polygon points="${x - 7},${y + 54} ${x + 7},${y + 54} ${x},${y + 44}"/><ellipse cx="${x}" cy="${y}" rx="38" ry="46"/>
  <path class="l" d="M${x - 20} ${y - 18} q8 -14 22 -16"/>`;

const COVER = {
  title: 'Pick a crayon, then tap the picture!',
  art: `${star(42, 40, 20)}${star(358, 44, 20)}${star(36, 236, 16)}${star(364, 232, 16)}
    <text class="k cover-title" x="206" y="104" text-anchor="middle" textLength="330" lengthAdjust="spacingAndGlyphs">COLORING</text>
    <text class="cover-title" x="200" y="98" text-anchor="middle" textLength="330" lengthAdjust="spacingAndGlyphs">COLORING</text>
    <text class="k cover-title" x="206" y="196" text-anchor="middle" style="font-size:100px">BOOK</text>
    <text class="cover-title" x="200" y="190" text-anchor="middle" style="font-size:100px">BOOK</text>
    ${balloon(118, 286)}${balloon(282, 286)}${balloon(200, 262)}`,
};
export const GROUPS = [
  { id: '2-3', name: 'Little Artists', blurb: 'Big, simple shapes', pages: [COVER, ...little] },
  { id: '4-6', name: 'Junior Artists', blurb: 'Animals, vehicles & fun', pages: [COVER, ...junior] },
  { id: '7-9', name: 'Big Artists', blurb: 'Detailed scenes & patterns', pages: [COVER, ...big] },
];
