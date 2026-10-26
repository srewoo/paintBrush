// Welcome screen age card: sample page art, age, name, blurb and progress.
export function ageCard(g, { label, art, done, started, onOpen }) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `age-card card-${g.id}`;
  b.innerHTML = `<span class="age-art"></span>
    <strong>${label}</strong><span class="age-name">${g.name}</span>
    <span class="age-blurb">${g.blurb}</span>
    <span class="age-meta">${g.pages.length - 1} pages${done ? ` · ★ ${done} finished` : ''}${started > done ? ` · ${started - done} started` : ''}</span>`;
  b.querySelector('.age-art').append(art);
  b.addEventListener('click', onOpen);
  return b;
}
