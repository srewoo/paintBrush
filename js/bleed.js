// Many drawings end their ground/water shape a little inside the page, which shows up as a hard
// "box" border around the bottom of the picture. Stretch any such shape so it bleeds off the left,
// right and bottom edges. Measured once per drawing in a hidden on-page probe (getBBox needs layout),
// then applied to every copy: the book page, the flip sheet, thumbnails, saved pictures.
// ponytail: geometric heuristic (wide, low, edge within 40 units of the border); fix in the art if a page needs more.
const SHAPES = ':is(path, rect, polygon, ellipse):not(.l, .k, .bg)';
const cache = new Map(); // art string -> [[element index, transform]]

export function bleedGround(svg, art) {
  if (!cache.has(art)) cache.set(art, measure(svg));
  const all = svg.querySelectorAll('*');
  for (const [i, transform] of cache.get(art)) {
    all[i].setAttribute('transform', `${transform} ${all[i].getAttribute('transform') ?? ''}`.trim());
    all[i].setAttribute('vector-effect', 'non-scaling-stroke');
  }
}

function measure(svg) {
  const host = document.createElement('div');
  host.style.cssText = 'position:absolute;left:-9999px;top:0;width:400px;height:400px;visibility:hidden';
  const probe = svg.cloneNode(true);
  host.append(probe);
  document.body.append(host);
  const all = [...probe.querySelectorAll('*')];
  const fixes = [];
  all.forEach((el, i) => {
    if (!el.matches(SHAPES)) return;
    const b = el.getBBox();
    const right = b.x + b.width;
    const bottom = b.y + b.height;
    // Edges sitting on the page border count too: half their outline would still show as a frame.
    const shortLeft = b.x > -3 && b.x < 40;
    const shortRight = right < 403 && right > 360;
    if (b.width < 300 || b.y < 180 || bottom < 340 || !(shortLeft || shortRight)) return;
    const x0 = shortLeft ? -12 : b.x;
    const sx = ((shortRight ? 412 : right) - x0) / b.width;
    const sy = bottom < 404 ? (412 - b.y) / b.height : 1;
    fixes.push([i, `translate(${x0.toFixed(1)} ${b.y.toFixed(1)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(${(-b.x).toFixed(1)} ${(-b.y).toFixed(1)})`]);
  });
  host.remove();
  return fixes;
}
