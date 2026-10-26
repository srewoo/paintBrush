// "Color your own picture": upload a line drawing, tap to fill, saved locally.
import { drawGradients } from './js/colors.js';
import { createPalette } from './js/palette.js';
import { fileToLineArt, createCanvasBook } from './js/canvasbook.js';
import { listPictures, addPicture, loadPicture, saveFills, deletePicture } from './js/uploads.js';
import { confirmTwice } from './js/controls.js';
import { sfx, setMuted } from './js/sound.js';

const MAX_BYTES = 15 * 1024 * 1024;
const TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/bmp'];
const $ = (id) => document.getElementById(id);

setMuted((await chrome.storage.local.get('muted')).muted ?? false);
drawGradients($('defs'));
const palette = createPalette({ tabs: $('sets'), grid: $('palette'), chip: $('current'), onPick: () => {}, stickers: false });

let current = null; // { meta, book, fills }
let erased = null; // fills before "Erase colors", so Undo can bring them back

function status(text, warn = false) {
  $('status').textContent = text;
  $('status').classList.toggle('warn', warn);
}

async function handleFile(file) {
  if (!file) return;
  if (!TYPES.includes(file.type)) return status('Please choose a PNG, JPG, WebP, GIF or BMP picture.', true);
  if (file.size > MAX_BYTES) return status('That picture is too big (over 15 MB). Try a smaller one.', true);
  status('Turning your picture into a coloring page…');
  try {
    const art = await fileToLineArt(file);
    const meta = await addPicture({ name: file.name.replace(/\.[^.]+$/, '') || 'My picture', ...art });
    await open(meta);
    status(art.ink > 0.35
      ? 'Done, but this looks like a photo or a dark picture. Black-and-white line drawings work best.'
      : 'Ready! Pick a crayon and tap a space between the lines.', art.ink > 0.35);
  } catch (err) {
    status(/quota/i.test(err.message) ? 'Out of space. Delete a picture in "My pictures" first.' : `Couldn't open that picture: ${err.message}`, true);
  }
  await drawMine();
}

async function open(meta) {
  const pic = await loadPicture(meta);
  $('empty').hidden = true;
  $('sheet').hidden = false;
  const book = await createCanvasBook($('colour'), $('lines'), pic);
  current = { meta, book, fills: pic.fills };
  erased = null;
  book.render(current.fills);
  $('save').disabled = $('print').disabled = false;
  for (const b of document.querySelectorAll('.pic > button:first-child')) b.setAttribute('aria-current', String(b.dataset.id === meta.id));
}

function persist() {
  saveFills(current.meta.id, current.fills).catch(() => status('Couldn\'t save. The computer may be out of space.', true));
}

$('colour').addEventListener('click', (e) => {
  if (!current) return;
  const r = e.target.getBoundingClientRect();
  const x = Math.round(((e.clientX - r.left) / r.width) * e.target.width);
  const y = Math.round(((e.clientY - r.top) / r.height) * e.target.height);
  if (!current.book.hits(x, y)) return;
  const c = palette.tool.value;
  current.fills.push({ x, y, c });
  erased = null;
  current.book.render(current.fills);
  c ? sfx.pop() : sfx.erase();
  persist();
});

$('undo').addEventListener('click', () => {
  if (!current) return;
  if (erased) { current.fills = erased; erased = null; }
  else if (!current.fills.pop()) return;
  current.book.render(current.fills);
  persist();
});

const eraseAll = confirmTwice($('clear'), 'Tap again to erase', () => {
  if (!current?.fills.length) return;
  erased = current.fills;
  current.fills = [];
  current.book.render(current.fills);
  sfx.erase();
  persist();
});
$('clear').addEventListener('click', eraseAll);

$('save').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = current.book.flatten().toDataURL('image/png');
  a.download = `${current.meta.name.replace(/[^\w -]/g, '').trim() || 'my-picture'}-colored.png`;
  a.click();
});

$('print').addEventListener('click', () => {
  $('printImg').src = current.book.flatten().toDataURL('image/png');
  $('printImg').decode().then(() => window.print());
});

async function drawMine() {
  const list = await listPictures();
  $('mine').replaceChildren(...list.map((meta) => {
    const wrap = document.createElement('div');
    wrap.className = 'pic';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.id = meta.id;
    btn.title = meta.name;
    btn.setAttribute('aria-label', `Open ${meta.name}`);
    btn.setAttribute('aria-current', String(current?.meta.id === meta.id));
    btn.innerHTML = '<img alt="">';
    loadPicture(meta).then((p) => { btn.querySelector('img').src = p.png; }).catch(() => {});
    btn.addEventListener('click', () => open(meta).catch((err) => status(err.message, true)));
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'del';
    del.innerHTML = '<span class="lbl">✕</span>';
    del.setAttribute('aria-label', `Delete ${meta.name}`);
    del.addEventListener('click', confirmTwice(del, 'Delete?', async () => {
      await deletePicture(meta.id);
      if (current?.meta.id === meta.id) {
        current = null;
        $('sheet').hidden = true;
        $('empty').hidden = false;
        $('save').disabled = $('print').disabled = true;
      }
      drawMine();
    }));
    wrap.append(btn, del);
    return wrap;
  }));
  if (!list.length) $('mine').innerHTML = '<p class="empty-note">Pictures you upload will show up here.</p>';
}

for (const input of [$('file'), $('file2')]) {
  input.addEventListener('change', () => { handleFile(input.files[0]); input.value = ''; });
}
$('drop').addEventListener('dragover', (e) => { e.preventDefault(); $('drop').classList.add('over'); });
$('drop').addEventListener('dragleave', () => $('drop').classList.remove('over'));
$('drop').addEventListener('drop', (e) => {
  e.preventDefault();
  $('drop').classList.remove('over');
  handleFile(e.dataTransfer.files[0]);
});

await drawMine();
const [first] = await listPictures();
if (first) await open(first).catch(() => {});
