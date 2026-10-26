// Things drawn on top of a page's art: colour-by-number labels and stickers. Both live at the end of
// the SVG (after the art), so shape indices used for saved fills never shift, and neither takes taps.
const LABEL = { '2-3': 30, '4-6': 15, '7-9': 10 };
export const STICKER_SIZE = { '2-3': 64, '4-6': 50, '7-9': 40 };

// Stable 1-10 number per shape, so a page always shows the same numbers.
export function numberFor(pageKey, k) {
  let h = 2166136261;
  for (const ch of `${pageKey}:${k}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return ((h >>> 0) % 10) + 1;
}

export function drawOverlays(svg, { age, pageKey, targets, filled, stickers }) {
  svg.querySelectorAll('.nums, .stks').forEach((n) => n.remove());
  if (targets) {
    const size = LABEL[age];
    svg.insertAdjacentHTML('beforeend', `<g class="nums" aria-hidden="true">${targets
      .filter((t) => !filled[t.k])
      .map((t) => `<text class="l nl" x="${t.x.toFixed(1)}" y="${t.y.toFixed(1)}" font-size="${size}">${numberFor(pageKey, t.k)}</text>`)
      .join('')}</g>`);
  }
  if (stickers?.length) {
    const size = STICKER_SIZE[age];
    svg.insertAdjacentHTML('beforeend', `<g class="stks" aria-hidden="true">${stickers
      .map((s) => `<text class="l stk" x="${s.x.toFixed(1)}" y="${s.y.toFixed(1)}" font-size="${size}">${s.e}</text>`)
      .join('')}</g>`);
  }
}
