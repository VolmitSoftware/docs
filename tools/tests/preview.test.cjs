const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mkdtemp, mkdir, writeFile, rm, symlink, realpath } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const renderer = import('../preview-markdown.mjs');
const preview = import('../theme-preview.mjs');
const shell = `<!doctype html><html><head><title>Hosted title</title>
<meta name="description" content="Hosted description"><meta property="og:title" content="Hosted title">
<script>var siteConfig = {title: "VolmitSoftware"}</script>
<script src="/_assets/js/app.js"></script>
<link rel="stylesheet" href="/theme/minimal-brutalism.css?v=old">
<script src="/theme/minimal-brutalism.js?v=old"></script></head><body><div id="root">
<page locale="en" path="home" title="Hosted title" description="Hosted description" :page-id="12" sidebar="W10=">
<template slot="contents"><div>Hosted content</div></template>
<template slot="comments"><div>Comments</div></template></page></div></body></html>`;
const documentSource = (body, title = 'Local title') => `---
title: ${JSON.stringify(title)}
description: Local description
published: true
date: 2026-10-13T00:00:00.000Z
dateCreated: 2026-10-01T00:00:00.000Z
tags: plugin, commands
editor: markdown
---
${body}
`;
const translationRequest = (namespace) => ({
  operationName: null,
  variables: { locale: 'en', namespace },
  extensions: {},
  query: 'query ($locale: String!, $namespace: String!) {\n  localization {\n    translations(locale: $locale, namespace: $namespace) {\n      key\n      value\n      __typename\n    }\n    __typename\n  }\n}\n'
});

async function boot(t) {
  const { createPreviewServer } = await preview;
  const directory = await realpath(await mkdtemp(path.join(tmpdir(), 'volmit-preview-')));
  const calls = [];
  const server = createPreviewServer({
    root: directory,
    fetchUpstream: async (url, options) => {
      calls.push({ url: String(url), options });
      if (new URL(url).pathname === '/en/home') return new Response(shell, { headers: { 'content-type': 'text/html' } });
      return new Response('{"data":{"pages":{"search":{"results":[]}}}}', { headers: { 'content-type': 'application/json' } });
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  });
  return { directory, calls, url: `http://127.0.0.1:${server.address().port}` };
}

test('Markdown preserves Wiki.js attributes, image sizes, tables, HTML, and code', async () => {
  const { renderMarkdownPage } = await renderer;
  const source = documentSource(`## Commands {#commands}

- [Guide *Command reference*](/plugin/commands)
{.links-list}

> Save first.
{.is-warning}

| Command | Meaning |
|---|---|
| \`set <on\\|off>\` | Select a value |

{.dense}

![Logo](/home-assets/logo.png =96x){.align-center}

<section aria-label="Custom content"><p>Raw HTML</p></section>

\`\`\`java
int count = 2;
\`\`\`
`);
  const page = renderMarkdownPage(source, 'plugin/commands');
  const fragment = JSDOM.fragment(page.html);
  assert.equal(fragment.querySelector('ul.links-list a').textContent, 'Guide Command reference');
  assert.equal(fragment.querySelector('blockquote.is-warning p').textContent, 'Save first.');
  assert.equal(fragment.querySelectorAll('.table-container table.dense tbody td').length, 2);
  assert.equal(fragment.querySelector('tbody code').textContent, 'set <on|off>');
  assert.equal(fragment.querySelector('img.align-center').getAttribute('width'), '96');
  assert.equal(fragment.querySelector('section[aria-label]').textContent, 'Raw HTML');
  assert.equal(fragment.querySelector('pre.prismjs code.language-java').textContent, 'int count = 2;\n');
  assert.ok(fragment.querySelector('code .token.keyword'));
  assert.equal(fragment.querySelector('div').getAttribute('v-pre'), 'true');
  assert.deepEqual(page.metadata.tags, ['plugin', 'commands']);
});

test('heading IDs preserve explicit anchors and remain unique in nested outlines', async () => {
  const { renderMarkdownPage } = await renderer;
  const page = renderMarkdownPage(documentSource('## Usage\n\n### Usage\n\n## Reserved {#usage-2}\n\n<h2 id="custom">HTML heading</h2>'), 'plugin/reference');
  assert.deepEqual(page.toc, [
    { title: 'Usage', anchor: '#usage', children: [{ title: 'Usage', anchor: '#usage-3', children: [] }] },
    { title: 'Reserved', anchor: '#usage-2', children: [] },
    { title: 'HTML heading', anchor: '#custom', children: [] }
  ]);
});

test('local content and metadata replace the original Vue input before mount', async () => {
  const { renderMarkdownPage, applyLocalPage } = await renderer;
  const page = renderMarkdownPage(documentSource('## Local marker\n\nLiteral {{ template }} example.', 'Local "quoted" title'), 'plugin/deep/reference');
  const dom = new JSDOM(applyLocalPage(shell, page));
  const component = dom.window.document.querySelector('page');
  const slot = component.querySelector('template[slot="contents"]');
  assert.equal(component.getAttribute('path'), 'plugin/deep/reference');
  assert.equal(component.getAttribute('title'), 'Local "quoted" title');
  assert.equal(component.getAttribute('filename'), 'plugin/deep/reference.md');
  assert.equal(component.getAttribute('updated-at'), '2026-10-13T00:00:00.000Z');
  assert.equal(slot.content.textContent.includes('Literal {{ template }} example.'), true);
  assert.equal(slot.content.textContent.includes('Hosted content'), false);
  assert.deepEqual(JSON.parse(Buffer.from(component.getAttribute('toc'), 'base64').toString()), page.toc);
  assert.equal(dom.window.document.title, 'Local "quoted" title | VolmitSoftware');
  assert.equal(dom.window.document.querySelector('meta[name="description"]').content, 'Local description');
  assert.equal(dom.window.document.querySelectorAll('[data-volmit-theme-preview]').length, 2);
  assert.equal(dom.window.document.querySelector('script[src="/_assets/js/app.js"]').getAttribute('src'), '/_assets/js/app.js');
  assert.equal(component.querySelector('template[slot="comments"]').content.textContent, 'Comments');
  dom.window.close();
});

test('plain mode omits the custom theme while keeping local content', async () => {
  const { renderMarkdownPage, applyLocalPage } = await renderer;
  const html = applyLocalPage(shell, renderMarkdownPage(documentSource('Local marker'), 'home'), { plain: true });
  assert.equal(html.includes('minimal-brutalism'), false);
  assert.equal(html.includes('__volmit_theme'), false);
  assert.equal(html.includes('Local marker'), true);
});

test('nested routes and locale prefixes read current disk contents on every request', async (t) => {
  const app = await boot(t);
  await mkdir(path.join(app.directory, 'plugin/deep'), { recursive: true });
  const filename = path.join(app.directory, 'plugin/deep/reference.md');
  await writeFile(filename, documentSource('Initial local marker'));
  const first = await fetch(`${app.url}/en/plugin/deep/reference`);
  assert.equal(first.status, 200);
  assert.equal(first.headers.get('x-volmit-preview-source'), 'local');
  assert.match(await first.text(), /Initial local marker/);
  await writeFile(filename, documentSource('Changed local marker'));
  const second = await fetch(`${app.url}/plugin/deep/reference`);
  assert.match(await second.text(), /Changed local marker/);
  assert.equal(app.calls.length, 1);
  const head = await fetch(`${app.url}/plugin/deep/reference`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
});

test('local media supports byte ranges and HEAD without fetching production', async (t) => {
  const app = await boot(t);
  await mkdir(path.join(app.directory, 'plugin-assets'));
  await writeFile(path.join(app.directory, 'plugin-assets/demo.webm'), '0123456789');
  const partial = await fetch(`${app.url}/plugin-assets/demo.webm`, { headers: { range: 'bytes=2-5' } });
  assert.equal(partial.status, 206);
  assert.equal(partial.headers.get('content-range'), 'bytes 2-5/10');
  assert.equal(partial.headers.get('content-type'), 'video/webm');
  assert.equal(await partial.text(), '2345');
  const invalid = await fetch(`${app.url}/plugin-assets/demo.webm`, { headers: { range: 'bytes=20-' } });
  assert.equal(invalid.status, 416);
  const head = await fetch(`${app.url}/plugin-assets/demo.webm`, { method: 'HEAD' });
  assert.equal(head.headers.get('content-length'), '10');
  assert.equal(await head.text(), '');
  assert.equal(app.calls.length, 0);
});

test('documentation search forwards only its exact approved query and variables', async (t) => {
  const app = await boot(t);
  const { searchQuery } = await preview;
  for (const [route, method, body] of [
    ['/graphql', 'POST', JSON.stringify({ query: 'mutation { pages { delete(id: 1) } }' })],
    ['/graphql?query=mutation', 'GET', undefined],
    ['/graphql', 'POST', JSON.stringify([{ query: searchQuery, variables: { query: 'iris' } }])],
    ['/graphql', 'POST', 'x'.repeat(9000)],
    ['/page', 'DELETE', undefined],
    ['/login', 'POST', 'credentials']
  ]) {
    const response = await fetch(app.url + route, { method, body });
    assert.equal(response.status, method === 'GET' ? 404 : 405);
  }
  assert.equal(app.calls.length, 0);
  const response = await fetch(`${app.url}/graphql`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: searchQuery, variables: { query: 'iris' }, extensions: { ignored: true } })
  });
  assert.equal(response.status, 200);
  assert.equal(app.calls.length, 1);
  assert.equal(app.calls[0].url, 'https://docs.volmitsoftware.com/graphql');
  assert.deepEqual(JSON.parse(app.calls[0].options.body), { query: searchQuery, variables: { query: 'iris' } });
});

test('English shell translations accept the captured single and paired read batches', async (t) => {
  const app = await boot(t);
  for (const namespaces of [['common'], ['auth'], ['common', 'auth']]) {
    const requests = namespaces.map(translationRequest);
    requests[0].extensions = { ignored: true };
    requests[0].variables.ignored = 'extra';
    const response = await fetch(`${app.url}/graphql`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(requests)
    });
    assert.equal(response.status, 200);
    const forwarded = app.calls.at(-1);
    assert.equal(forwarded.url, 'https://docs.volmitsoftware.com/graphql');
    assert.deepEqual(JSON.parse(forwarded.options.body), namespaces.map((namespace) => ({
      query: translationRequest(namespace).query, variables: { locale: 'en', namespace }
    })));
  }
  assert.equal(app.calls.length, 3);
});

test('translation batches reject mutations, other locales, namespaces, and extra operations', async (t) => {
  const app = await boot(t);
  const { searchQuery } = await preview;
  const common = translationRequest('common');
  for (const body of [
    [],
    [common, common, common],
    [null],
    [translationRequest('admin')],
    [{ ...common, variables: { locale: 'fr', namespace: 'common' } }],
    [{ ...common, query: common.query + 'mutation { pages { delete(id: 1) } }' }],
    [common, { query: 'mutation { pages { delete(id: 1) } }' }],
    [common, { query: searchQuery, variables: { query: 'iris' } }]
  ]) {
    const response = await fetch(`${app.url}/graphql`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body)
    });
    assert.equal(response.status, 405);
  }
  assert.equal(app.calls.length, 0);
});

test('missing pages, internal files, and symlinks outside the repository are not served', async (t) => {
  const app = await boot(t);
  const outside = await realpath(await mkdtemp(path.join(tmpdir(), 'volmit-outside-')));
  t.after(() => rm(outside, { recursive: true, force: true }));
  await writeFile(path.join(outside, 'secret.md'), documentSource('Outside content'));
  await symlink(path.join(outside, 'secret.md'), path.join(app.directory, 'escape.md'));
  await mkdir(path.join(app.directory, 'plugin-assets'));
  await symlink(path.join(outside, 'secret.md'), path.join(app.directory, 'plugin-assets/escape.png'));
  for (const route of ['/missing', '/escape', '/package.json', '/.git/config', '/plugin-assets/escape.png', '/plugin-assets/%2e%2e%2f%2e%2e%2fsecret.md']) {
    const response = await fetch(app.url + route);
    assert.ok([400, 404].includes(response.status), `${route}: ${response.status}`);
    assert.equal((await response.text()).includes('Outside content'), false);
  }
  assert.equal(app.calls.length, 0);
});
