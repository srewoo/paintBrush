// Art lint: renders each page in headless Chrome and reports, per page, how many tappable parts it
// has, how many are too tiny for the age group, and how many are fully hidden behind other shapes.
// Usage: node tools/lint.mjs pages/7-9/fantasy.js [more files...]   (exit code 1 if any page fails)
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

// Smallest visible area per part, in viewBox units² (the page is 400×400 units).
const MIN_AREA = { '2-3': 1200, '4-6': 180, '7-9': 70 };
const MAX_PARTS = { '2-3': 10, '4-6': 35, '7-9': 90 };

const files = process.argv.slice(2);
if (!files.length) throw new Error('usage: node tools/lint.mjs pages/<age>/<file>.js ...');
const css = readFileSync(new URL('../art.css', import.meta.url), 'utf8');
let failed = false;

for (const file of files) {
  const age = resolve(file).match(/pages\/(\d-\d)\//)?.[1] ?? '4-6';
  const pages = (await import(`${pathToFileURL(resolve(file)).href}?t=${Date.now()}`)).default;
  const html = `<style>${css} body{margin:0}</style><pre id="out" style="position:absolute;left:-9999px"></pre><div id="host" style="position:fixed;left:0;top:0"></div><script>
    const pages = ${JSON.stringify(pages)};
    const SHAPES = ':is(path, circle, ellipse, rect, polygon, polyline):not(.l, .k, .bg)';
    const host = document.getElementById('host');
    const rows = pages.map((p) => {
      host.innerHTML = '<svg class="art age-${age}" viewBox="0 0 400 400" style="width:800px;height:800px;display:block"><rect class="bg" width="400" height="400"/>' + p.art + '</svg>';
      const svg = host.firstChild, pt = svg.createSVGPoint(), N = 16;
      let parts = 0, tiny = 0, hidden = 0;
      for (const el of svg.querySelectorAll(SHAPES)) {
        const b = el.getBBox(), ctm = el.getScreenCTM();
        let vis = 0;
        for (let a = 0; a < N; a++) for (let c = 0; c < N; c++) {
          pt.x = b.x + b.width * (a + .5) / N; pt.y = b.y + b.height * (c + .5) / N;
          if (!el.isPointInFill(pt)) continue;
          const s = pt.matrixTransform(ctm);
          if (document.elementFromPoint(s.x, s.y) === el) vis++;
        }
        if (!vis) { hidden++; continue; }
        parts++;
        if (vis * b.width * b.height / (N * N) < ${MIN_AREA[age]}) tiny++;
      }
      return { title: p.title, parts, tiny, hidden, bytes: p.art.length };
    });
    document.getElementById('out').textContent = JSON.stringify(rows);
  </script>`;
  const dir = mkdtempSync(join(tmpdir(), 'paintbrush-lint-'));
  writeFileSync(join(dir, 'lint.html'), html);
  const dom = execFileSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless', '--disable-gpu', '--window-size=900,1000', '--virtual-time-budget=20000', '--dump-dom',
    pathToFileURL(join(dir, 'lint.html')).href,
  ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
  const rows = JSON.parse(dom.match(/<pre id="out"[^>]*>([\s\S]*?)<\/pre>/)[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
  console.log(`\n${file} (ages ${age}: min part ${MIN_AREA[age]} u², max ${MAX_PARTS[age]} parts)`);
  for (const r of rows) {
    const bad = r.tiny || r.hidden || r.parts > MAX_PARTS[age];
    if (bad) failed = true;
    console.log(`${bad ? '✗' : '✓'} ${r.title.padEnd(18)} parts ${String(r.parts).padStart(3)}  tiny ${String(r.tiny).padStart(2)}  hidden ${String(r.hidden).padStart(2)}  ${(r.bytes / 1024).toFixed(1)} KB`);
  }
}
process.exitCode = failed ? 1 : 0;
