import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nativeRoutes = new Set(['a', 'login', 'logout', 'register', 'search', 'tags']);

async function pages(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await pages(location));
    else if (entry.name.endsWith('.md')) files.push(location);
  }
  return files;
}

async function exists(location) {
  try {
    return (await stat(location)).isFile();
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false;
    throw error;
  }
}

const missing = [];
let checked = 0;
for (const file of await pages(root)) {
  const source = await readFile(file, 'utf8');
  let fence = null;
  for (const [index, line] of source.split('\n').entries()) {
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
      continue;
    }
    if (fence) continue;
    for (const match of line.matchAll(/\]\((\/[^\s)]+)\)/g)) {
      const href = new URL(match[1], 'https://docs.local');
      if (href.origin !== 'https://docs.local') continue;
      const destination = decodeURIComponent(href.pathname).replace(/^\/+|\/+$/g, '');
      if (!destination || nativeRoutes.has(destination.split('/')[0])) continue;
      checked += 1;
      if (!await exists(path.join(root, destination + '.md')) && !await exists(path.join(root, destination))) {
        missing.push(path.relative(root, file) + ':' + (index + 1) + ' ' + match[1]);
      }
    }
  }
}
if (missing.length) throw new Error('Missing documentation links:\n' + missing.join('\n'));
console.log('Documentation links are valid: ' + checked + ' destinations');
