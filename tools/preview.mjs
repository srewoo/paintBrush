// Renders one pages/*.js file to a PNG grid for eyeballing the art.
// Usage: node tools/preview.mjs pages/4-6/farm.js /path/out.png  (line width follows the age folder)
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [file, out] = process.argv.slice(2);
if (!file || !out) throw new Error('usage: node tools/preview.mjs pages/<file>.js <out.png>');

const pages = (await import(pathToFileURL(resolve(file)).href + `?t=${Date.now()}`)).default;
const css = readFileSync(new URL('../art.css', import.meta.url), 'utf8');
const age = resolve(file).match(/pages\/(\d-\d)\//)?.[1] ?? '4-6';
const cells = pages.map((p) => `<figure>
  <svg class="art age-${age}" viewBox="0 0 400 400"><rect class="bg" width="400" height="400"/>${p.art}</svg>
  <figcaption>${p.title}</figcaption></figure>`).join('');
const html = `<style>${css} body{margin:0;display:grid;grid-template-columns:repeat(5,300px);gap:10px;padding:10px;font:20px sans-serif}
figure{margin:0;border:1px solid #ccc} svg{width:300px;height:300px;display:block} figcaption{text-align:center}</style>${cells}`;
const htmlPath = out.replace(/\.png$/, '.html');
writeFileSync(htmlPath, html);
const rows = Math.ceil(pages.length / 5);
execFileSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless', '--disable-gpu', '--hide-scrollbars', `--screenshot=${out}`,
  `--window-size=1570,${rows * 345 + 20}`, pathToFileURL(htmlPath).href,
], { stdio: 'ignore' });
console.log(`${pages.length} pages -> ${out}`);
