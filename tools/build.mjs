// Build the Chrome Web Store upload: sync manifest.json's version from package.json, then zip the
// extension files into dist/paintbrush-<version>.zip. Usage: npm run build (or npm run release:patch).
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const FILES = ['manifest.json', 'background.js', 'book.html', 'book.css', 'book.js', 'art.css', 'privacy.html', 'studio.html', 'studio.css', 'studio.js', 'icons', 'js', 'pages'];

const { version } = JSON.parse(readFileSync(`${root}package.json`, 'utf8'));
// Chrome only accepts 1-4 dot-separated integers (no "-beta" style suffixes).
if (!/^\d+(\.\d+){0,3}$/.test(version)) throw new Error(`package.json version "${version}" is not a valid Chrome extension version`);

// Edit just the version field so the manifest's hand formatting is kept.
const manifestPath = `${root}manifest.json`;
const VERSION_FIELD = /("version"\s*:\s*")[^"]*(")/;
const manifest = readFileSync(manifestPath, 'utf8');
if (!VERSION_FIELD.test(manifest)) throw new Error('No "version" field found in manifest.json');
const synced = manifest.replace(VERSION_FIELD, `$1${version}$2`);
if (synced !== manifest) writeFileSync(manifestPath, synced);

const missing = FILES.filter((f) => !existsSync(`${root}${f}`));
if (missing.length) throw new Error(`Missing files: ${missing.join(', ')}`);

const out = `dist/paintbrush-${version}.zip`;
mkdirSync(`${root}dist`, { recursive: true });
rmSync(`${root}${out}`, { force: true });
execFileSync('zip', ['-rq', out, ...FILES, '-x', '*.DS_Store', '-x', '*.md'], { cwd: root, stdio: 'inherit' });
console.log(`Built ${out} (manifest version ${version})`);
