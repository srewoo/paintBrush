# paintBrush art guide

Every page is a 400×400 SVG drawn as inner markup in `pages/<age>/<file>.js`:

```js
export default [{ title: 'Cow', art: `…inner SVG…` }, …];
```

The app wraps `art` in `<svg class="art age-<age>" viewBox="0 0 400 400">` with a background rect. `art.css` gives every shape a black round stroke and a white fill.

## Markup rules

- **No `stroke`, `fill`, `style` or `id` attributes.** No text, gradients, scripts or external refs. `transform` is fine. Helper functions at the top of a file are fine, as long as the export is plain strings.
- **Colourable parts:** each one is its own **closed** shape (`path … Z`, `circle`, `ellipse`, `rect`, `polygon`) with no class. Order shapes back to front.
- **Open detail lines** (smiles, fur strokes, veins) use `class="l"`. They are unfilled and ignore taps.
- **Small solid black bits** (pupils, noses) use `class="k"`.
- **Keep `title`s stable.** Saved colours are keyed by title and shape order, so a redrawn page starts blank.

## Drawing quality: what makes a page "professional"

1. **Draw, don't assemble.** Bodies and limbs are one flowing Bézier silhouette (`C`/`Q`/`S`), not ellipses plus rectangles glued together. Limbs taper and bend at joints. Wings, manes, tails and fins grow out of the body.
2. **One clean outline per part.** Lines must not run through a subject. Background lines (horizon, hills, rainbow, mountains, water) stop at the subject's silhouette: draw the subject on top, and never cross an outline with an `l` line that's meant to sit behind it.
3. **No slivers.** Overlaps must not leave thin wedges or crumbs to colour. If two shapes meet, either share an edge exactly or overlap generously.
4. **Ground bleeds off the page.** Ground, water and hills extend past the canvas: x from -20 to 420, bottom to 420. Never draw a box with visible left, right or bottom edges.
5. **Purposeful scenery.** Use 2–4 background elements that frame the subject. No scattered identical clouds or suns as filler, and no clutter competing with the subject.
6. **Consistent cast.** Animals and toddler objects have friendly faces: round eyes with a `k` pupil and a simple smile.
7. **Recognisable at thumbnail size.** The silhouette alone should tell you what it is.

## Age targets (checked by `node tools/lint.mjs <file>`)

| Age | Line | Parts | Smallest part | Style |
|---|---|---|---|---|
| 2–3 | 6px | 3–10 | ≥ 1200 u² (≈ 35×35) | one big chunky subject, 0–2 background shapes |
| 4–6 | 4px | 10–35 | ≥ 180 u² (≈ 13×13) | subject + simple setting |
| 7–9 | 2.5px | 35–90 | ≥ 70 u² (≈ 8×8) | detailed scene with depth, or a pattern |

`node tools/lint.mjs pages/<age>/<file>.js` must show ✓ for every page: no tiny parts, no fully hidden parts, and not over the part limit. `npm run preview -- <file> <out.png>` renders a grid to eyeball.
