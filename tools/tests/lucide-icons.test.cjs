const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '../../theme/minimal-brutalism.js'), 'utf8');
const settle = () => new Promise((resolve) => setTimeout(resolve, 30));

async function boot(body, pathname = '/login', beforeMount) {
  const dom = new JSDOM(`<div id="root"><div class="v-application">${body}</div></div>`, {
    url: 'https://docs.test' + pathname, runScripts: 'outside-only'
  });
  const { window } = dom;
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
  window.cancelAnimationFrame = (id) => window.clearTimeout(id);
  window.fetch = async () => ({ ok: true, json: async () => [{
    name: 'Iris', path: 'iris', href: '/iris', description: 'World generation',
    sections: [{ title: 'Reference', groups: [{ title: '', links: [{ title: 'Page', href: '/iris/page' }] }] }]
  }] });
  let mutations = 0;
  const observers = [];
  const NativeObserver = window.MutationObserver;
  window.MutationObserver = class extends NativeObserver {
    constructor(callback) {
      super((records, observer) => {
        mutations += 1;
        callback(records, observer);
      });
      observers.push(this);
    }
  };
  beforeMount?.(window);
  window.eval(source);
  await settle();
  return { window, document: window.document, mutations: () => mutations, close: () => {
    for (const observer of observers) {
      observer.disconnect();
    }
    window.close();
  } };
}

test('auth icons preserve native controls and react to class-only password visibility changes', async () => {
  let original;
  let activations = 0;
  const page = await boot('<button aria-label="Show password"><i class="v-icon mdi mdi-eye-off"></i></button>', '/login', (window) => {
    original = window.document.querySelector('i');
    window.document.querySelector('button').addEventListener('click', () => activations += 1);
  });
  try {
    assert.equal(page.document.querySelector('i'), original);
    assert.equal(original.querySelector('svg').dataset.lucide, 'eye-off');
    assert.equal(original.querySelector('svg').namespaceURI, 'http://www.w3.org/2000/svg');
    assert.equal(original.getAttribute('aria-hidden'), 'true');
    original.className = 'v-icon mdi mdi-eye';
    await settle();
    assert.equal(original.querySelector('svg').dataset.lucide, 'eye');
    assert.equal(original.querySelectorAll('svg').length, 1);
    page.document.querySelector('button').click();
    assert.equal(activations, 1);
    assert.equal(page.document.querySelector('button').getAttribute('aria-label'), 'Show password');
  } finally { page.close(); }
});

test('late native icons map their glyph rather than MDI animation modifiers', async () => {
  const page = await boot('<div id="late"></div>');
  try {
    page.document.querySelector('#late').innerHTML = '<i class="v-icon mdi mdi-spin mdi-rotate-90 mdi-cached"></i><i class="v-icon mdi mdi-form-textbox-password"></i>';
    await settle();
    assert.deepEqual([...page.document.querySelectorAll('svg')].map((node) => node.dataset.lucide), ['refresh-cw', 'key-round']);
    assert.equal(page.document.querySelector('.mdi-cached').classList.contains('mdi-spin'), true);
    const count = page.mutations();
    await settle();
    assert.equal(page.mutations(), count);
    assert.ok(count < 10);
  } finally { page.close(); }
});

test('text-only font aliases retain one Lucide SVG on subsequent mounts', async () => {
  const page = await boot('<button aria-label="Search"><i class="v-icon">search</i></button>');
  try {
    const icon = page.document.querySelector('i');
    const svg = icon.querySelector('svg');
    page.document.querySelector('.v-application').append(page.document.createElement('div'));
    await settle();
    assert.equal(icon.querySelector('svg'), svg);
    assert.equal(svg.dataset.lucide, 'search');
    assert.equal(icon.hidden, false);
    assert.equal(icon.querySelectorAll('svg').length, 1);
  } finally { page.close(); }
});

test('unknown decorative glyphs disappear while unknown controls retain their name and a safe fallback', async () => {
  const page = await boot('<i id="decoration" class="v-icon mdi mdi-unmapped"></i><button aria-label="Native action"><i class="v-icon mdi mdi-other"></i></button>');
  try {
    assert.equal(page.document.querySelector('#decoration').hidden, true);
    assert.equal(page.document.querySelector('#decoration').childNodes.length, 0);
    assert.equal(page.document.querySelector('button svg').dataset.lucide, 'circle-help');
    assert.equal(page.document.querySelector('button').getAttribute('aria-label'), 'Native action');
    page.document.querySelector('#decoration').className = 'v-icon mdi mdi-tag';
    await settle();
    assert.equal(page.document.querySelector('#decoration').hidden, false);
    assert.equal(page.document.querySelector('#decoration svg').dataset.lucide, 'tag');
  } finally { page.close(); }
});

test('documentation links, section chevrons, and picker controls share Lucide without changing accessible text', async () => {
  const page = await boot(`<header class="nav-header"></header><main class="v-main"><div class="v-main__wrap">
    <header class="page-header-section"><div class="page-header-headings"><div class="headline">Reference</div></div></header>
    <article class="contents"><h2 id="start"><a class="toc-anchor" href="#start">¶</a> Start</h2>
    <a class="is-external-link" href="https://example.com">Reference manual</a></article></div></main>`, '/iris/page');
  try {
    const external = page.document.querySelector('.is-external-link');
    assert.equal(external.textContent, 'Reference manual');
    assert.equal(external.querySelector('svg').dataset.lucide, 'external-link');
    assert.equal(external.querySelector('svg').getAttribute('aria-hidden'), 'true');
    const anchor = page.document.querySelector('.toc-anchor');
    assert.equal(anchor.getAttribute('href'), '#start');
    assert.equal(anchor.getAttribute('aria-label'), 'Link to Start');
    assert.equal(anchor.querySelector('svg').dataset.lucide, 'link');
    assert.equal(page.document.querySelector('.reference-section-toggle > svg').dataset.lucide, 'chevron-right');
    assert.equal(page.document.querySelector('.switch-chevron > svg').dataset.lucide, 'chevron-down');
    assert.equal(page.document.querySelector('.picker-close > svg').dataset.lucide, 'x');
    page.window.dispatchEvent(new page.window.Event('pagereveal'));
    await settle();
    assert.equal(external.querySelectorAll('svg').length, 1);
    assert.equal(anchor.querySelectorAll('svg').length, 1);
  } finally { page.close(); }
});

test('password controls replace generic icon names while preserving explicit names', async () => {
  const page = await boot('<div class="v-input"><input type="password"><button aria-label="append icon"><i class="v-icon mdi mdi-eye-off"></i></button></div>');
  try {
    const control = page.document.querySelector('button');
    assert.equal(control.getAttribute('aria-label'), 'Toggle password visibility');
    control.setAttribute('aria-label', 'Show account password');
    page.document.querySelector('i').className = 'v-icon mdi mdi-eye';
    await settle();
    assert.equal(control.getAttribute('aria-label'), 'Show account password');
  } finally { page.close(); }
});

test('auth fields keep native labels and gain stable names when only placeholders are present', async () => {
  const page = await boot('<section class="login"><input id="email" placeholder="Email Address">'
    + '<input id="named" placeholder="Password" aria-label="Account password">'
    + '<label for="labelled">Email confirmation</label><input id="labelled" placeholder="Email">'
    + '<input id="reference" placeholder="Code" aria-labelledby="description"><span id="description">Recovery code</span></section>');
  try {
    assert.equal(page.document.querySelector('#email').getAttribute('aria-label'), 'Email Address');
    assert.equal(page.document.querySelector('#named').getAttribute('aria-label'), 'Account password');
    assert.equal(page.document.querySelector('#labelled').hasAttribute('aria-label'), false);
    assert.equal(page.document.querySelector('#reference').hasAttribute('aria-label'), false);
  } finally { page.close(); }
});
