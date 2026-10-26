// Crayon sets. Shiny + Mix crayons are SVG gradients defined once in book.html's #defs and filled via url(#id).
export const GRADIENTS = {
  gold: ['#8a6512', '#f7d774', '#c9962a', '#fff1a8', '#a8781a'],
  silver: ['#6e7378', '#e9ecef', '#a3a9ae', '#ffffff', '#80868b'],
  bronze: ['#6b4220', '#d9a066', '#9c6a3a', '#f0c08a', '#7a4c26'],
  copper: ['#7a3418', '#f19a6b', '#b5582e', '#ffc09a', '#8a3e1e'],
  rosegold: ['#a5645e', '#f6c9c0', '#d38f86', '#ffe3dc', '#b8716a'],
  emerald: ['#0c5a3a', '#5fd39a', '#1f8a5a', '#a6f0c8', '#136a44'],
  sapphire: ['#102a6b', '#6f9cf5', '#2a4fb0', '#b5ccff', '#173a8a'],
  amethyst: ['#4a1f6e', '#c39af0', '#7a44b0', '#e4ccff', '#5a2a86'],
  ruby: ['#6b0f1e', '#f2667a', '#b01e34', '#ffb0bc', '#850f24'],
  gunmetal: ['#2a2e33', '#8e979f', '#4a5157', '#c4ccd2', '#353a40'],
  rainbow: ['#ef4444', '#fb923c', '#facc15', '#22c55e', '#3b82f6', '#a78bfa'],
  sunset: ['#fb923c', '#f472b6', '#a78bfa'],
  ocean: ['#2dd4bf', '#3b82f6', '#1e3a8a'],
  candy: ['#f9a8d4', '#c4b5fd', '#7dd3fc'],
  fire: ['#facc15', '#fb923c', '#ef4444'],
  galaxy: ['#1e1b4b', '#6d28d9', '#ec4899'],
  aurora: ['#34d399', '#22d3ee', '#a78bfa'],
  berry: ['#f472b6', '#a21caf'],
  forest: ['#bef264', '#16a34a', '#14532d'],
  tropical: ['#fde047', '#4ade80', '#22d3ee'],
};
const grad = (id) => `url(#g-${id})`;

export const SETS = {
  Bright: [
    ['Red', '#ef4444'], ['Orange', '#fb923c'], ['Yellow', '#facc15'], ['Light green', '#a3e635'], ['Green', '#22c55e'],
    ['Teal', '#2dd4bf'], ['Sky blue', '#7dd3fc'], ['Blue', '#3b82f6'], ['Purple', '#a78bfa'], ['Pink', '#f9a8d4'],
    ['Peach', '#fed7aa'], ['Tan', '#d6a77a'], ['Brown', '#92582f'], ['Gray', '#a8a29e'], ['Black', '#292524'],
  ],
  Soft: [
    ['Blush', '#f8c8c8'], ['Apricot', '#fbd5b5'], ['Butter', '#fdf0b0'], ['Mint', '#c8ecd4'], ['Sage', '#b8cfae'],
    ['Seafoam', '#bde8e0'], ['Baby blue', '#c6e0f5'], ['Periwinkle', '#c5c8f2'], ['Lavender', '#dccbf0'], ['Lilac', '#e8c8e8'],
    ['Dusty rose', '#e3b0bf'], ['Sand', '#e8d8bf'], ['Mocha', '#b89a82'], ['Cloud', '#dad8d4'], ['Cream', '#faf3e0'],
  ],
  Shiny: [
    ['Gold', grad('gold')], ['Silver', grad('silver')], ['Bronze', grad('bronze')], ['Copper', grad('copper')], ['Rose gold', grad('rosegold')],
    ['Emerald', grad('emerald')], ['Sapphire', grad('sapphire')], ['Amethyst', grad('amethyst')], ['Ruby', grad('ruby')], ['Gunmetal', grad('gunmetal')],
  ],
  Mix: [
    ['Rainbow', grad('rainbow')], ['Sunset', grad('sunset')], ['Ocean', grad('ocean')], ['Candy', grad('candy')], ['Fire', grad('fire')],
    ['Galaxy', grad('galaxy')], ['Aurora', grad('aurora')], ['Berry', grad('berry')], ['Forest', grad('forest')], ['Tropical', grad('tropical')],
  ],
};

// Colour-by-number uses these 10, numbered 1-10.
export const NUMBERED = ['Red', 'Orange', 'Yellow', 'Green', 'Sky blue', 'Blue', 'Purple', 'Pink', 'Brown', 'Gray']
  .map((name) => SETS.Bright.find(([n]) => n === name));

export const STICKERS = ['⭐', '❤️', '🌈', '🦋', '🌸', '🎈', '🐞', '☀️', '🌙', '🍀', '👑', '🚀', '🐠', '🍓', '🦄'];

// Icon shown on each tab so pre-readers can pick a set by look.
export const TAB_ICONS = {
  Bright: 'conic-gradient(#ef4444 0 25%, #facc15 0 50%, #22c55e 0 75%, #3b82f6 0)',
  Soft: 'conic-gradient(#f8c8c8 0 25%, #fdf0b0 0 50%, #c8ecd4 0 75%, #c6e0f5 0)',
  Shiny: 'linear-gradient(135deg, #8a6512, #f7d774, #c9962a, #fff1a8)',
  Mix: 'linear-gradient(135deg, #ef4444, #facc15, #22c55e, #3b82f6, #a78bfa)',
};

export function drawGradients(svg) {
  svg.innerHTML = `<defs>${Object.entries(GRADIENTS).map(([id, stops]) =>
    `<linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">${stops.map((c, i) =>
      `<stop offset="${(i / (stops.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`).join('')}</defs>`;
}

export const crayonSvg = (c) => `<svg viewBox="0 0 84 22" aria-hidden="true">
  <rect x="1" y="3" width="60" height="16" rx="3" fill="${c}" stroke="#2b2620" stroke-width="1.5"/>
  <rect x="12" y="6.5" width="38" height="9" rx="2" fill="#fff" fill-opacity=".8"/>
  <path d="M61 3 L81 11 L61 19 Z" fill="${c}" stroke="#2b2620" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M75 8.6 L81 11 L75 13.4 Z" fill="#2b2620"/></svg>`;

export const ERASER_SVG = `<svg viewBox="0 0 84 22" aria-hidden="true">
  <rect x="1" y="3" width="60" height="16" rx="4" fill="#f9c6d4" stroke="#2b2620" stroke-width="1.5"/>
  <path d="M40 3 V19" stroke="#2b2620" stroke-width="1.5" stroke-dasharray="2 2"/></svg>`;
