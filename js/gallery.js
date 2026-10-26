// Thumbnail grid dialog, used for "All pages" and "My finished pages".
// items: [{ svg: SVGElement, label, finished, current, open() }]
export function openGrid(title, items, emptyText) {
  const dlg = document.getElementById('grid');
  dlg.querySelector('h2').textContent = title;
  const thumbs = dlg.querySelector('#thumbs');
  thumbs.replaceChildren(...items.map((it) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'thumb';
    if (it.current) b.setAttribute('aria-current', 'page');
    b.append(it.svg, it.label);
    if (it.finished) b.insertAdjacentHTML('beforeend', '<span class="done-badge" aria-label="finished">★</span>');
    b.addEventListener('click', () => { dlg.close(); it.open(); });
    return b;
  }));
  if (!items.length) thumbs.innerHTML = `<p class="empty">${emptyText}</p>`;
  dlg.showModal();
}
