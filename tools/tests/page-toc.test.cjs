const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '../../theme/minimal-brutalism.js'), 'utf8');
const project = {
  name: 'Iris', path: 'iris', href: '/iris', description: 'World generation',
  sections: [{ title: 'Reference', groups: [{ title: '', links: [
    { title: 'Configuration', href: '/iris/configuration' }
  ] }] }]
};

async function boot(options = {}) {
  const body = options.body ?? '<h2 id="commands">Commands</h2><p>First section.</p><h3 id="commands-2">Commands</h3><p>Second section.</p>';
  const dom = new JSDOM(`<div id="root"><div class="v-application" style="--volmit-header-height:160px">
    <header class="nav-header"></header><main class="v-main"><div class="v-main__wrap">
    <header class="page-header-section"><div class="page-header-headings"><div class="headline">Configuration</div></div></header>
    <div class="page-col-sd"><div class="page-toc-card"><a href="#commands">Legacy outline</a></div></div>
    <article class="contents">${body}</article><button id="outside">Outside control</button>
    </div></main></div></div>`, {
    url: 'https://docs.test' + (options.pathname ?? '/iris/configuration'), runScripts: 'outside-only'
  });
  const { window } = dom;
  Object.defineProperty(window, 'innerWidth', { value: options.width ?? 390, writable: true });
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.MutationObserver = class { observe() {} disconnect() {} };
  window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
  window.cancelAnimationFrame = (id) => window.clearTimeout(id);
  window.fetch = async () => ({ ok: true, json: async () => [project] });
  const positions = { commands: 260, 'commands-2': 600 };
  window.document.querySelector('.nav-header').getBoundingClientRect = () => ({ bottom: 160 });
  window.document.querySelector('.headline').getBoundingClientRect = () => ({ top: 220 });
  for (const heading of window.document.querySelectorAll('.contents h2,.contents h3')) {
    heading.getBoundingClientRect = () => ({ top: positions[heading.id] ?? 400 });
  }
  options.beforeMount?.(window);
  window.eval(source);
  await new Promise((resolve) => setTimeout(resolve, 30));
  const app = window.document.querySelector('.v-application');
  return {
    window, app, positions,
    main: window.document.querySelector('main'),
    panel: window.document.querySelector('.volmit-page-toc'),
    toggle: window.document.querySelector('.page-toc-toggle'),
    close: () => window.close()
  };
}

test('one generated outline replaces the legacy TOC and identifies duplicate labels independently', async () => {
  const page = await boot();
  try {
    assert.equal(page.window.document.querySelector('.page-toc-card'), null);
    assert.equal(page.main.classList.contains('has-page-toc'), true);
    assert.equal(page.panel.parentElement, page.main);
    assert.equal(page.panel.querySelector('.page-toc-title').textContent, 'On this page');
    assert.deepEqual([...page.panel.querySelectorAll('a')].map((item) => item.getAttribute('href')), ['#commands', '#commands-2']);
    assert.deepEqual([...page.panel.querySelectorAll('[aria-current]')].map((item) => item.getAttribute('href')), ['#commands']);
    page.positions['commands-2'] = 260;
    page.window.document.dispatchEvent(new page.window.Event('scroll'));
    assert.deepEqual([...page.panel.querySelectorAll('[aria-current]')].map((item) => item.getAttribute('href')), ['#commands-2']);
    assert.equal(page.main.style.getPropertyValue('--volmit-toc-top'), '220px');
  } finally { page.close(); }
});

test('popup enters its current link and Escape restores the trigger', async () => {
  const page = await boot();
  try {
    page.toggle.click();
    assert.equal(page.toggle.getAttribute('aria-expanded'), 'true');
    assert.equal(page.window.document.activeElement, page.panel.querySelector('[aria-current]'));
    page.window.document.activeElement.dispatchEvent(new page.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assert.equal(page.app.classList.contains('show-page-toc'), false);
    assert.equal(page.toggle.getAttribute('aria-expanded'), 'false');
    assert.equal(page.window.document.activeElement, page.toggle);
  } finally { page.close(); }
});

test('outside pointer and focus dismiss the popup without stranding focus in it', async () => {
  const page = await boot();
  try {
    const outside = page.window.document.querySelector('#outside');
    page.toggle.click();
    outside.dispatchEvent(new page.window.Event('pointerdown', { bubbles: true }));
    assert.equal(page.app.classList.contains('show-page-toc'), false);
    assert.equal(page.window.document.activeElement, page.toggle);
    page.toggle.click();
    outside.focus();
    assert.equal(page.app.classList.contains('show-page-toc'), false);
    assert.equal(page.window.document.activeElement, outside);
  } finally { page.close(); }
});

test('section selection closes the popup and gives focus to its heading', async () => {
  const page = await boot();
  try {
    page.toggle.click();
    page.panel.querySelector('a[href="#commands-2"]').click();
    assert.equal(page.app.classList.contains('show-page-toc'), false);
    assert.equal(page.window.document.activeElement.id, 'commands-2');
    assert.equal(page.toggle.getAttribute('aria-expanded'), 'false');
  } finally { page.close(); }
});

test('popup clears its trigger and has a keyboard-operable close control', async () => {
  const page = await boot();
  try {
    page.toggle.getBoundingClientRect = () => ({ bottom: 220 });
    page.toggle.click();
    assert.equal(page.main.style.getPropertyValue('--volmit-toc-popup-top'), '228px');
    const close = page.panel.querySelector('.page-toc-close');
    assert.equal(close.getAttribute('aria-label'), 'Close table of contents');
    close.focus();
    close.click();
    assert.equal(page.app.classList.contains('show-page-toc'), false);
    assert.equal(page.window.document.activeElement, page.toggle);
  } finally { page.close(); }
});

test('replaced article headings with identical labels get fresh focus targets', async () => {
  const page = await boot();
  try {
    const article = page.window.document.querySelector('.contents');
    article.innerHTML = '<h2 id="commands">Commands</h2><h3 id="commands-2">Commands</h3>';
    page.window.dispatchEvent(new page.window.Event('pagereveal'));
    page.toggle.click();
    page.panel.querySelector('a[href="#commands-2"]').click();
    assert.equal(page.window.document.activeElement, article.querySelector('#commands-2'));
  } finally { page.close(); }
});

test('opening the outline closes the mobile page drawer', async () => {
  const page = await boot();
  try {
    const navigation = page.window.document.querySelector('.mobile-section-toggle');
    navigation.click();
    assert.equal(page.app.classList.contains('show-section-menu'), true);
    page.toggle.click();
    assert.equal(page.app.classList.contains('show-section-menu'), false);
    assert.equal(navigation.getAttribute('aria-expanded'), 'false');
    assert.equal(page.app.classList.contains('show-page-toc'), true);
  } finally { page.close(); }
});

test('overview and heading-free references have no redundant outline or reserved rail', async () => {
  for (const options of [{ pathname: '/iris' }, { body: '<p>No sections.</p>' }]) {
    const page = await boot(options);
    try {
      assert.equal(page.panel, null);
      assert.equal(page.toggle, null);
      assert.equal(page.main.classList.contains('has-page-toc'), false);
      assert.equal(page.window.document.querySelector('.page-toc-card'), null);
    } finally { page.close(); }
  }
});

test('crossing to desktop clears popup state and future marker offsets use the actual header', async () => {
  const page = await boot();
  try {
    page.toggle.click();
    page.window.innerWidth = 1440;
    page.window.document.querySelector('.nav-header').getBoundingClientRect = () => ({ bottom: 72 });
    page.positions['commands-2'] = 230;
    page.window.dispatchEvent(new page.window.Event('resize'));
    assert.equal(page.toggle.getAttribute('aria-expanded'), 'false');
    assert.deepEqual([...page.panel.querySelectorAll('[aria-current]')].map((item) => item.getAttribute('href')), ['#commands']);
  } finally { page.close(); }
});

test('severity callouts label their first paragraph while preserving original content and quote semantics', async () => {
  const body = `<blockquote class="is-danger"><p>Use <strong>care</strong> with <a href="/iris">this setting</a>.</p><p>Keep this paragraph.</p></blockquote>
    <blockquote class="is-warning"><p>Stop the server.</p></blockquote>
    <blockquote class="is-info"><p>See the reference.</p></blockquote>
    <blockquote class="is-success"><p>Installation complete.</p></blockquote>
    <blockquote><p>Ordinary quoted text.</p></blockquote>`;
  let original;
  const page = await boot({ body, beforeMount: (window) => {
    original = window.document.querySelector('.is-danger p');
  } });
  try {
    const document = page.window.document;
    assert.deepEqual([...document.querySelectorAll('.callout-label')].map((node) => node.textContent), ['Caution:', 'Warning:', 'Note:', 'Success:']);
    assert.equal(document.querySelector('.is-danger p'), original);
    assert.equal(original.parentElement.tagName, 'BLOCKQUOTE');
    assert.equal(original.textContent, 'Caution: Use care with this setting.');
    assert.equal(original.querySelector('strong').textContent, 'care');
    assert.equal(original.querySelector('a').getAttribute('href'), '/iris');
    assert.equal(original.nextElementSibling.textContent, 'Keep this paragraph.');
    assert.equal(document.querySelector('blockquote:not([class])').innerHTML, '<p>Ordinary quoted text.</p>');
  } finally { page.close(); }
});

test('callout labels stay singular across mounts and are recreated after article replacement', async () => {
  const page = await boot({ body: '<blockquote class="is-danger"><p>Existing text.</p></blockquote>' });
  try {
    const document = page.window.document;
    for (let index = 0; index < 3; index += 1) {
      page.window.dispatchEvent(new page.window.Event('pagereveal'));
    }
    assert.equal(document.querySelectorAll('.callout-label').length, 1);
    assert.equal(document.querySelector('blockquote p').textContent, 'Caution: Existing text.');
    document.querySelector('.contents').innerHTML = '<blockquote class="is-warning"><p>Replacement text.</p></blockquote>';
    page.window.dispatchEvent(new page.window.Event('pagereveal'));
    assert.equal(document.querySelectorAll('.callout-label').length, 1);
    assert.equal(document.querySelector('blockquote p').textContent, 'Warning: Replacement text.');
  } finally { page.close(); }
});
