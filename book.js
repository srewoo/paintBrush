import { GROUPS } from './js/data.js';
import { drawGradients } from './js/colors.js';
import { findTargets } from './js/reach.js';
import { drawOverlays, numberFor, STICKER_SIZE } from './js/overlay.js';
import { createPalette } from './js/palette.js';
import { createZoom } from './js/zoom.js';
import { celebrate } from './js/cheer.js';
import { openGrid } from './js/gallery.js';
import { parentGate } from './js/gate.js';
import { savePng } from './js/save.js';
import { sfx, setMuted, isMuted } from './js/sound.js';
import { labelShapes, bindShapeKeys } from './js/shapekeys.js';
import { confirmTwice, setupPrint, askConfirm, flipSheet } from './js/controls.js';
import { ageCard } from './js/home.js';
import { bleedGround } from './js/bleed.js';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FLIP_MS = REDUCED ? 0 : 700;
const UNDO_LIMIT = 25;
const $ = (id) => document.getElementById(id);
const page = $('page');

const saved = await chrome.storage.local.get(['fills', 'stickers', 'finished', 'undo', 'indexes', 'muted', 'locked', 'numberMode']);
const fills = saved.fills ?? {}; // { "<age>/<title>": { [shape index]: colour } }
const stickers = saved.stickers ?? {}; // { "<age>/<title>": [{ e, x, y }] }
const finished = saved.finished ?? {}; // { "<age>/<title>": true }
const undo = saved.undo ?? {}; // { "<age>/<title>": [{ f, s }] } snapshots, survives reloads
const indexes = saved.indexes ?? {}; // last page per age group
let locked = saved.locked ?? false;
let numberMode = saved.numberMode ?? false;
setMuted(saved.muted ?? false);

let group = GROUPS[1];
let index = 0;
let targets = []; // tappable shapes on the open page, from findTargets()
let busy = false;

const key = (i = index, g = group) => `${g.id}/${g.pages[i].title}`;
const persist = () => chrome.storage.local.set({ fills, stickers, finished, undo, indexes, locked, numberMode, muted: isMuted() });
const svgOf = (el) => el.querySelector('svg.art');
const ageLabel = (g) => `Ages ${g.id.replace('-', '–')}`;

drawGradients($('defs'));
const palette = createPalette({ tabs: $('sets'), grid: $('palette'), chip: $('current'), onPick: () => {} });
const zoom = createZoom(page, (z) => {
  $('zoomOut').disabled = z === 1;
  $('zoomLevel').textContent = `${Math.round(z * 100)}%`;
});

// Draw a page (art + saved colours + stickers) into any container: the book, the flip sheet, thumbnails.
function render(el, i, g = group) {
  const p = g.pages[i];
  el.innerHTML = `<svg class="art age-${g.id}" viewBox="0 0 400 400" role="img" aria-label="${p.title}">
    <rect class="bg" width="400" height="400"/>${p.art}</svg>
    <h2>${i ? p.title : `<span class="hint">${p.title}</span>`}</h2><span class="num">${i || ''}</span>`;
  bleedGround(svgOf(el), p.art);
  paintFills(svgOf(el), key(i, g));
  drawOverlays(svgOf(el), { age: g.id, stickers: stickers[key(i, g)] });
}

function paintFills(svg, k) {
  const map = fills[k] ?? {};
  svg.querySelectorAll('*').forEach((el, n) => { el.style.fill = map[n] ?? ''; });
}

function refresh() {
  const svg = svgOf(page);
  paintFills(svg, key());
  drawOverlays(svg, {
    age: group.id, pageKey: key(), stickers: stickers[key()],
    targets: numberMode ? targets : null, filled: fills[key()] ?? {},
  });
  progress();
}

function show(i) {
  index = i;
  $('stage').querySelectorAll('.cheer').forEach((c) => c.remove()); // a cheer belongs to the page that earned it
  render(page, i);
  zoom.reset();
  targets = findTargets(svgOf(page));
  labelShapes(svgOf(page), targets, (t, n) => (numberMode ? `Part ${n + 1}, color ${numberFor(key(), t.k)}` : `Part ${n + 1}`));
  refresh();
  $('count').textContent = `${ageLabel(group)} · ${i ? `Page ${i} of ${group.pages.length - 1}` : 'Cover'}`;
  $('prev').disabled = i === 0;
  $('next').disabled = i === group.pages.length - 1;
  indexes[group.id] = i;
  persist();
}

// Counts only shapes a child can actually reach, so every page can be finished.
function progress() {
  const map = fills[key()] ?? {};
  const done = targets.filter((t) => map[t.k]).length;
  const total = targets.length;
  const complete = total > 0 && done === total;
  $('progressText').textContent = complete ? 'All colored, great job!' : `${done} of ${total} parts colored`;
  $('progressFill').style.width = `${total ? (100 * done) / total : 0}%`;
  $('findMissed').hidden = !done || complete;
  if (complete) finished[key()] = true; else delete finished[key()];
  return complete;
}

// Every change goes through here: snapshot for undo, apply, repaint, celebrate on completion, save.
function commit(change) {
  const k = key();
  const before = { f: { ...(fills[k] ?? {}) }, s: [...(stickers[k] ?? [])] };
  const wasDone = progress();
  change(k);
  (undo[k] ??= []).push(before);
  if (undo[k].length > UNDO_LIMIT) undo[k].shift();
  refresh();
  if (progress() && !wasDone) {
    celebrate($('stage'), REDUCED);
    sfx.cheer();
  }
  persist();
}

function paint(el) {
  const n = [...svgOf(page).querySelectorAll('*')].indexOf(el);
  if (n < 0) return;
  const { value } = palette.tool;
  commit((k) => {
    const map = (fills[k] ??= {});
    if (value) map[n] = value; else delete map[n];
  });
  value ? sfx.pop() : sfx.erase();
}

// Sticker tool: tap empty space to place one, tap an existing sticker to peel it off.
function stick(x, y) {
  const r = STICKER_SIZE[group.id] * 0.6;
  commit((k) => {
    const list = (stickers[k] ??= []);
    const hit = list.findIndex((s) => Math.hypot(s.x - x, s.y - y) < r);
    if (hit >= 0) list.splice(hit, 1); else list.push({ e: palette.tool.value, x, y });
  });
  sfx.sticker();
}

page.addEventListener('click', (e) => {
  const svg = svgOf(page);
  if (busy || !svg?.contains(e.target)) return;
  if (palette.tool.kind === 'sticker') {
    const at = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    stick(at.x, at.y);
  } else if (e.target !== svg) {
    paint(e.target);
  }
});
bindShapeKeys(page, () => targets, (el, t) => {
  if (palette.tool.kind === 'sticker') stick(t.x, t.y); else paint(el);
});

async function turn(to) {
  if (busy || to < 0 || to >= group.pages.length || to === index) return;
  busy = true;
  sfx.flip();
  const forward = to > index;
  const sheet = document.createElement('section');
  sheet.className = 'page sheet';
  if (forward) { sheet.innerHTML = page.innerHTML; show(to); } else render(sheet, to);
  $('stage').append(sheet);
  await flipSheet(sheet, forward, FLIP_MS);
  if (!forward) show(to);
  sheet.remove();
  busy = false;
}

function openGroup(g, i = indexes[g.id] ?? 0) {
  group = g;
  $('welcome').hidden = true;
  $('app').hidden = false;
  $('zoomTools').hidden = g.id === '2-3';
  show(Math.min(i, g.pages.length - 1));
  $('next').focus();
}

function thumb(g, i) {
  const tmp = document.createElement('div');
  render(tmp, i, g);
  return svgOf(tmp);
}

function goHome() {
  // Welcome cards show each group's first page, with colours the child already added.
  $('ages').replaceChildren(...GROUPS.map((g) => ageCard(g, {
    label: ageLabel(g), art: thumb(g, 1), onOpen: () => openGroup(g),
    started: g.pages.filter((_, i) => i && Object.keys(fills[key(i, g)] ?? {}).length).length,
    done: g.pages.filter((_, i) => i && finished[key(i, g)]).length,
  })));
  const count = GROUPS.reduce((n, g) => n + g.pages.filter((_, i) => i && finished[key(i, g)]).length, 0);
  $('gallery').querySelector('.lbl').textContent = `My finished pages${count ? ` (${count})` : ''}`;
  $('app').hidden = true;
  $('welcome').hidden = false;
}
const guarded = (action) => async () => { if (!locked || await parentGate()) action(); };

$('home').addEventListener('click', guarded(goHome));
$('prev').addEventListener('click', () => turn(index - 1));
$('next').addEventListener('click', () => turn(index + 1));
document.addEventListener('keydown', (e) => {
  if (!$('welcome').hidden || document.querySelector('dialog[open]')) return;
  if (e.target.closest('[role=tablist], #palette, svg.art, input')) return;
  if (e.key === 'ArrowRight') turn(index + 1);
  if (e.key === 'ArrowLeft') turn(index - 1);
});

$('undo').addEventListener('click', () => {
  const snap = undo[key()]?.pop();
  if (!snap) return;
  fills[key()] = snap.f;
  stickers[key()] = snap.s;
  refresh();
  persist();
});

// Erase needs a second tap (or the grown-up check when the parent lock is on).
const eraseNow = () => {
  commit((k) => { fills[k] = {}; stickers[k] = []; });
  sfx.erase();
};
const eraseTwice = confirmTwice($('clear'), 'Tap again to erase', eraseNow);
$('clear').addEventListener('click', async () => {
  if (!locked) eraseTwice();
  else if (await parentGate()) eraseNow();
});

$('findMissed').addEventListener('click', () => {
  const map = fills[key()] ?? {};
  const all = [...svgOf(page).querySelectorAll('*')];
  const missed = targets.filter((t) => !map[t.k]);
  if (!missed.length) return;
  if (group.id !== '2-3') zoom.focus(missed[0].x, missed[0].y);
  missed.forEach((t) => all[t.k].classList.add('flash'));
  setTimeout(() => missed.forEach((t) => all[t.k].classList.remove('flash')), 2400);
});
$('zoomIn').onclick = zoom.in; $('zoomOut').onclick = zoom.out;

$('numbers').addEventListener('click', () => {
  numberMode = !numberMode;
  syncToggles();
  palette.setNumberMode(numberMode);
  show(index);
});

const toggleSound = (on) => { setMuted(!on); syncToggles(); persist(); };
$('sound').addEventListener('click', () => toggleSound(isMuted()));

function syncToggles() {
  $('numbers').setAttribute('aria-pressed', String(numberMode));
  $('sound').setAttribute('aria-pressed', String(!isMuted()));
  $('sound').querySelector('.lbl').textContent = isMuted() ? 'Sound off' : 'Sound on';
  $('setSound').checked = !isMuted();
  $('setLock').checked = locked;
}

$('save').addEventListener('click', () => savePng(svgOf(page), group.pages[index].title));
setupPrint($('print'), $('printDlg'));

function openAllPages() {
  $('clearAll').hidden = false;
  openGrid(`${ageLabel(group)} · Pick a page`, group.pages.map((p, i) => ({
    svg: thumb(group, i), label: i ? `${i}. ${p.title}` : 'Cover',
    finished: finished[key(i)], current: i === index, open: () => turn(i),
  })));
}
$('gridBtn').addEventListener('click', openAllPages);

// Clear every page in this age group: grown-up check (if locked) + a second confirmation.
$('clearAll').addEventListener('click', async () => {
  $('grid').close();
  const n = group.pages.length - 1;
  if ((locked && !(await parentGate()))
    || !(await askConfirm($('confirmDlg'), `Erase all ${n} pages in ${ageLabel(group)}? Every color and sticker goes back to blank. This can't be undone.`))) return openAllPages();
  group.pages.forEach((_, i) => { for (const store of [fills, stickers, finished, undo]) delete store[key(i)]; });
  sfx.erase();
  show(index);
  openAllPages();
});

$('gallery').addEventListener('click', () => (($('clearAll').hidden = true), openGrid('My finished pages', GROUPS.flatMap((g) => g.pages
  .map((p, i) => ({ p, i }))
  .filter(({ i }) => i && finished[key(i, g)])
  .map(({ p, i }) => ({ svg: thumb(g, i), label: `${ageLabel(g)} · ${p.title}`, finished: true, open: () => openGroup(g, i) }))),
'Finish a page and it will show up here with a gold star!')));

$('grownups').addEventListener('click', () => $('settings').showModal());
$('setSound').addEventListener('change', (e) => toggleSound(e.target.checked));
$('setLock').addEventListener('change', async (e) => {
  // Turning the lock off is itself a grown-up action.
  if (!e.target.checked && locked && !(await parentGate())) { e.target.checked = true; return; }
  locked = e.target.checked;
  persist();
});

palette.setNumberMode(numberMode);
syncToggles();
goHome();
