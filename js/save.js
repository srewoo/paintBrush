// "Save picture": renders the current page's SVG to a PNG download. Stylesheets don't apply inside an
// SVG drawn as an image, so each element's computed paint is copied onto the clone as attributes.
const SIZE = 1600;
const PROPS = ['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray',
  'paint-order', 'font-family', 'font-size', 'font-weight', 'text-anchor', 'dominant-baseline', 'opacity'];

export async function savePng(svg, title) {
  const copy = svg.cloneNode(true);
  const src = [...svg.querySelectorAll('*')];
  [...copy.querySelectorAll('*')].forEach((el, n) => {
    const cs = getComputedStyle(src[n]);
    for (const p of PROPS) el.setAttribute(p, cs.getPropertyValue(p));
  });
  copy.querySelectorAll('.nums').forEach((n) => n.remove()); // number labels are a guide, not part of the art
  copy.querySelectorAll('[style], [class]').forEach((el) => { el.removeAttribute('style'); el.removeAttribute('class'); });
  copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  copy.setAttribute('width', SIZE);
  copy.setAttribute('height', SIZE);
  copy.setAttribute('viewBox', '0 0 400 400');
  copy.insertAdjacentHTML('afterbegin', document.getElementById('defs').innerHTML);

  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE + 180;
    const g = canvas.getContext('2d');
    g.fillStyle = '#fff';
    g.fillRect(0, 0, canvas.width, canvas.height);
    g.drawImage(img, 0, 0, SIZE, SIZE);
    g.fillStyle = '#2b2620';
    g.font = '900 96px ui-rounded, "Arial Rounded MT Bold", system-ui, sans-serif';
    g.textAlign = 'center';
    g.fillText(title, SIZE / 2, SIZE + 120);
    const blob = await new Promise((done) => canvas.toBlob(done, 'image/png'));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${title.replace(/[^\w -]/g, '').trim() || 'my-picture'}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  } finally {
    URL.revokeObjectURL(url);
  }
}
