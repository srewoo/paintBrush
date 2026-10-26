// A colourable picture made from an uploaded image: a colour layer underneath and the black line layer
// on top (so fills never blur the outlines). Fills are stored as tap points and replayed, which keeps
// saves tiny and makes undo exact.
import { lineMask, dilate, region, inkRatio } from './fill.js';
import { GRADIENTS } from './colors.js';

export const MAX_SIDE = 1400;
const INK = [43, 38, 32];

// Decode an uploaded file into a line-art PNG (black lines on transparent) scaled to fit MAX_SIDE.
export async function fileToLineArt(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const c = new OffscreenCanvas(w, h);
  const g = c.getContext('2d');
  g.fillStyle = '#fff';
  g.fillRect(0, 0, w, h);
  g.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  let mask = lineMask(g.getImageData(0, 0, w, h).data, w, h);
  if (Math.max(w, h) > 700) mask = dilate(mask, w, h); // big images: close JPEG hairline gaps
  const out = g.createImageData(w, h);
  mask.forEach((v, i) => { if (v) out.data.set([...INK, 255], i * 4); });
  g.clearRect(0, 0, w, h);
  g.putImageData(out, 0, 0);
  const blob = await c.convertToBlob({ type: 'image/png' });
  return { w, h, png: await blobToDataUrl(blob), ink: inkRatio(mask) };
}

const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(r.result);
  r.onerror = () => reject(r.error);
  r.readAsDataURL(blob);
});

export async function createCanvasBook(colourCanvas, lineCanvas, picture) {
  const { w, h } = picture;
  for (const c of [colourCanvas, lineCanvas]) { c.width = w; c.height = h; }
  const img = new Image();
  img.src = picture.png;
  await img.decode();
  const lines = lineCanvas.getContext('2d');
  lines.clearRect(0, 0, w, h);
  lines.drawImage(img, 0, 0);
  const alpha = lines.getImageData(0, 0, w, h).data;
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) mask[i] = alpha[i * 4 + 3] > 127 ? 1 : 0;

  const colour = colourCanvas.getContext('2d', { willReadFrequently: true });
  const cache = new Map(); // "x,y" -> region, so replays after undo are instant

  function regionAt(x, y) {
    const k = `${x},${y}`;
    if (!cache.has(k)) cache.set(k, region(mask, w, h, x, y));
    return cache.get(k);
  }

  // Paint one region with a solid colour, a gradient crayon (url(#g-id)), or null to erase.
  function paint(pixels, value, data) {
    if (!value) {
      for (const i of pixels) data[i * 4 + 3] = 0;
      return;
    }
    const grad = value.match(/#g-(\w+)/)?.[1];
    if (!grad) {
      const [r, g, b] = hexRgb(value);
      for (const i of pixels) data.set([r, g, b, 255], i * 4);
      return;
    }
    let x0 = w, y0 = h, x1 = 0, y1 = 0;
    for (const i of pixels) {
      const x = i % w, y = (i / w) | 0;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    const stops = GRADIENTS[grad].map(hexRgb);
    const span = Math.max(1, (x1 - x0) + (y1 - y0));
    for (const i of pixels) {
      const t = ((i % w) - x0 + ((i / w) | 0) - y0) / span; // diagonal, like the SVG crayons
      data.set([...mix(stops, t), 255], i * 4);
    }
  }

  return {
    // fills: [{ x, y, c }] in order; later fills win. Returns false if the tap hit no area.
    render(fills) {
      const img = colour.createImageData(w, h);
      for (const f of fills) {
        const px = regionAt(f.x, f.y);
        if (px) paint(px, f.c, img.data);
      }
      colour.putImageData(img, 0, 0);
    },
    hits: (x, y) => !!regionAt(x, y),
    // Picture with white paper, colours and lines flattened, for Save / thumbnails.
    flatten(maxSide = w) {
      const s = Math.min(1, maxSide / Math.max(w, h));
      const c = document.createElement('canvas');
      c.width = Math.round(w * s);
      c.height = Math.round(h * s);
      const g = c.getContext('2d');
      g.fillStyle = '#fff';
      g.fillRect(0, 0, c.width, c.height);
      g.drawImage(colourCanvas, 0, 0, c.width, c.height);
      g.drawImage(lineCanvas, 0, 0, c.width, c.height);
      return c;
    },
  };
}

const hexRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

function mix(stops, t) {
  const pos = Math.min(0.9999, Math.max(0, t)) * (stops.length - 1);
  const i = Math.floor(pos);
  const f = pos - i;
  return stops[i].map((v, k) => Math.round(v + (stops[i + 1][k] - v) * f));
}
