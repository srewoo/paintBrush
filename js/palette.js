// The crayon box: set tabs (Bright, Soft, Shiny, Mix, Stickers), the crayon grid, and the "current" chip.
import { SETS, GRADIENTS, NUMBERED, STICKERS, TAB_ICONS, crayonSvg, ERASER_SVG } from './colors.js';

const ERASER = { kind: 'color', value: null, name: 'Eraser' };

export function createPalette({ tabs, grid, chip, onPick, stickers = true }) {
  const TABS = [...Object.keys(SETS), ...(stickers ? ['Stickers'] : [])];
  let active = 'Bright';
  let numberMode = false;
  let tool = { kind: 'color', value: SETS.Bright[0][1], name: 'Red' };

  tabs.replaceChildren(...TABS.map((name) => {
    const t = document.createElement('button');
    t.type = 'button';
    t.id = `tab-${name}`;
    t.setAttribute('role', 'tab');
    t.setAttribute('aria-controls', grid.id);
    t.innerHTML = `<span class="tab-icon" style="background:${TAB_ICONS[name] ?? 'none'}">${name === 'Stickers' ? '⭐' : ''}</span>${name}`;
    t.addEventListener('click', () => select(name));
    return t;
  }));
  // Arrow keys move between tabs (and never turn the page).
  tabs.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = TABS[(TABS.indexOf(active) + step + TABS.length) % TABS.length];
    select(next);
    tabs.querySelector(`#tab-${next}`).focus();
  });

  function select(name) {
    active = name;
    for (const t of tabs.children) {
      const on = t.id === `tab-${name}`;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    }
    grid.setAttribute('aria-labelledby', `tab-${name}`);
    draw();
  }

  function items() {
    if (numberMode) return [...NUMBERED.map(([name, value], i) => ({ kind: 'color', value, name, num: i + 1 })), ERASER];
    if (active === 'Stickers') return STICKERS.map((e) => ({ kind: 'sticker', value: e, name: `${e} sticker` }));
    return [...SETS[active].map(([name, value]) => ({ kind: 'color', value, name })), ERASER];
  }

  function draw() {
    tabs.hidden = numberMode;
    grid.replaceChildren(...items().map((it) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = it.kind === 'sticker' ? 'crayon sticker' : 'crayon';
      b.title = it.name;
      b.setAttribute('aria-label', it.num ? `${it.num}: ${it.name}` : it.name);
      b.setAttribute('aria-pressed', String(it.kind === tool.kind && it.value === tool.value));
      b.innerHTML = it.kind === 'sticker'
        ? `<span class="emoji">${it.value}</span>`
        : `${it.value ? crayonSvg(it.value) : ERASER_SVG}${it.num ? `<b class="crayon-num">${it.num}</b>` : ''}<span>${it.name}</span>`;
      b.addEventListener('click', () => pick(it));
      return b;
    }));
    showChip();
  }

  function showChip() {
    chip.innerHTML = tool.kind === 'sticker'
      ? `<span class="chip-emoji">${tool.value}</span>Sticker`
      : `<span class="chip-dot" style="background:${tool.value ? cssFill(tool.value) : '#fff'}"></span>${tool.name}`;
  }

  function pick(it) {
    tool = it;
    for (const b of grid.children) b.setAttribute('aria-pressed', String(b.title === it.name));
    showChip();
    onPick(tool);
  }

  select(active);
  return {
    get tool() { return tool; },
    setNumberMode(on) {
      numberMode = on;
      if (on && tool.kind === 'sticker') tool = { kind: 'color', value: NUMBERED[0][1], name: NUMBERED[0][0] };
      draw();
      onPick(tool);
    },
  };
}

// The chip is HTML, so gradient crayons need their CSS twin instead of url(#id).
function cssFill(value) {
  const id = value.match(/#g-(\w+)/)?.[1];
  return id ? `linear-gradient(135deg, ${GRADIENTS[id].join(', ')})` : value;
}
