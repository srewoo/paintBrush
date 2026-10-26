// Checks for the upload flood-fill. Run: npm test
import assert from 'node:assert/strict';
import { lineMask, dilate, region, inkRatio } from '../js/fill.js';

// 7×7 paper with a closed 5×5 square outline: the inside (3×3 = 9 px) and outside must stay apart.
const w = 7, h = 7;
const rgba = new Uint8ClampedArray(w * h * 4).fill(255);
const ink = (x, y) => rgba.set([0, 0, 0, 255], (y * w + x) * 4);
for (let i = 1; i <= 5; i++) { ink(i, 1); ink(i, 5); ink(1, i); ink(5, i); }

const mask = lineMask(rgba, w, h);
assert.equal(mask.reduce((a, b) => a + b, 0), 16, 'square outline is 16 line pixels');
assert.equal(region(mask, w, h, 3, 3).length, 9, 'inside fills only the 3×3 interior');
assert.equal(region(mask, w, h, 0, 0).length, 49 - 16 - 9, 'outside fills everything else');
assert.equal(region(mask, w, h, 1, 3, 1).length > 0, true, 'a tap on a line snaps to nearby paper');
assert.equal(region(new Uint8Array(4).fill(1), 2, 2, 0, 0), null, 'all-ink image has no region');

// A one-pixel gap leaks; dilating closes it.
const gap = mask.slice();
gap[1 * w + 3] = 0;
assert.equal(region(gap, w, h, 3, 3).length, 49 - 15, 'gap lets the fill escape');
assert.ok(dilate(mask, w, h).reduce((a, b) => a + b, 0) > 16, 'dilate thickens lines');

// Transparent pixels are paper, not ink.
assert.equal(lineMask(new Uint8ClampedArray([0, 0, 0, 0]), 1, 1)[0], 0);
assert.equal(inkRatio(mask), 16 / 49);
console.log('fill: all checks passed');
