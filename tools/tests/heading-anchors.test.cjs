const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readdir, readFile } = require('node:fs/promises');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..', '..');
const renderer = import('../preview-markdown.mjs');

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

test('every heading anchor link points at a heading on its page', async () => {
  const { renderMarkdownPage } = await renderer;
  const ids = new Map();
  const links = [];
  for (const file of await pages(root)) {
    const page = path.relative(root, file).replace(/\.md$/, '').split(path.sep).join('/');
    const source = await readFile(file, 'utf8');
    if (!source.startsWith('---')) continue;
    const { html } = renderMarkdownPage(source, page);
    const document = new JSDOM(html).window.document;
    ids.set(page, new Set([...document.querySelectorAll('[id]')].map((node) => node.id)));
    for (const link of document.querySelectorAll('a[href*="#"]')) {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) links.push({ page, target: page, anchor: href.slice(1) });
      else if (href.startsWith('/') && !href.startsWith('//')) {
        const url = new URL(href, 'https://docs.local');
        links.push({ page, target: decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, ''), anchor: decodeURIComponent(url.hash.slice(1)) });
      }
    }
  }
  const broken = links
    .filter((link) => link.anchor && ids.has(link.target) && !ids.get(link.target).has(link.anchor))
    .map((link) => `${link.page} -> /${link.target}#${link.anchor}`);
  assert.deepEqual(broken, []);
});
