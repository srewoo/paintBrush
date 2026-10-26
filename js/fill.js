// Turning an uploaded line drawing into tap-to-fill regions. Pure functions on pixel arrays (no DOM),
// so they run in tests: `lineMask` finds the dark "wall" pixels, `region` flood-fills the area a tap lands in.

// 1 = line pixel (dark), 0 = paper. Transparent pixels count as paper.
export function lineMask(rgba, w, h, threshold = 150) {
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const a = rgba[i * 4 + 3] / 255;
    const luma = (0.299 * rgba[i * 4] + 0.587 * rgba[i * 4 + 1] + 0.114 * rgba[i * 4 + 2]) * a + 255 * (1 - a);
    mask[i] = luma < threshold ? 1 : 0;
  }
  return mask;
}

// Thicken lines by one pixel so hairline gaps (JPEG noise, anti-aliasing) don't let a fill leak out.
export function dilate(mask, w, h) {
  const out = mask.slice();
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      if (x > 0) out[y * w + x - 1] = 1;
      if (x < w - 1) out[y * w + x + 1] = 1;
      if (y > 0) out[(y - 1) * w + x] = 1;
      if (y < h - 1) out[(y + 1) * w + x] = 1;
    }
  }
  return out;
}

// Pixel indices of the paper area containing (x, y), 4-connected, bounded by line pixels.
// A tap that lands on a line snaps to the nearest paper pixel within `snap` px. Returns null if none.
export function region(mask, w, h, x, y, snap = 4) {
  const start = nearestPaper(mask, w, h, Math.round(x), Math.round(y), snap);
  if (start < 0) return null;
  const seen = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  const out = [];
  let top = 0;
  stack[top++] = start;
  seen[start] = 1;
  while (top) {
    const i = stack[--top];
    out.push(i);
    const px = i % w;
    const neighbours = [px > 0 ? i - 1 : -1, px < w - 1 ? i + 1 : -1, i - w, i + w];
    for (const n of neighbours) {
      if (n < 0 || n >= w * h || seen[n] || mask[n]) continue;
      seen[n] = 1;
      stack[top++] = n;
    }
  }
  return Int32Array.from(out);
}

function nearestPaper(mask, w, h, x, y, snap) {
  for (let r = 0; r <= snap; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const px = x + dx;
        const py = y + dy;
        if (px >= 0 && py >= 0 && px < w && py < h && !mask[py * w + px]) return py * w + px;
      }
    }
  }
  return -1;
}

// Share of the image that is line pixels: a photo or a dark picture comes out far higher than line art.
export const inkRatio = (mask) => mask.reduce((n, v) => n + v, 0) / mask.length;
