const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '../../theme/minimal-brutalism.js'), 'utf8');
const installation = { title: 'Installation', href: '/iris/20-installation' };
const configuration = { title: 'Configuration', href: '/iris/03-configuration' };
const api = { title: 'API', href: '/iris/01-api' };
const catalog = [{
  name: 'Iris', path: 'iris', href: '/iris', description: 'World generation', color: '#2dd4bf', group: 'Plugins',
  sections: [
    { title: 'Start here', groups: [{ title: '', links: [installation, configuration] }] },
    { title: 'Authoring', groups: [{ title: 'Pack structure', links: [configuration, api] }] }
  ]
}];

async function boot(href, title) {
  const dom = new JSDOM(`<div id="root"><div class="v-application">
    <header class="nav-header"><div class="v-toolbar__content"><div class="layout row">
      <div class="flex"><div class="nav-header-inner"><div class="v-toolbar__content">Volmit</div></div></div>
      <div class="flex md4"><div class="v-toolbar__content"><div class="v-input v-text-field"><input type="text" aria-label="Search..."></div></div></div>
      <div class="flex"></div>
    </div></div></header>
    <main class="v-main"><div class="v-main__wrap">
      <div class="page-header-section"><div class="page-header-headings"><div class="headline">${title}</div></div></div>
      <div class="contents"><p>Page content</p></div>
    </div></main></div></div>`, { url: 'https://docs.test' + href, runScripts: 'outside-only' });
  const { window } = dom;
  window.MutationObserver = class { observe() {} disconnect() {} };
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  const frames = new Set();
  window.requestAnimationFrame = (callback) => {
    const id = window.setTimeout(() => {
      frames.delete(id);
      callback();
    }, 0);
    frames.add(id);
    return id;
  };
  window.cancelAnimationFrame = (id) => {
    frames.delete(id);
    window.clearTimeout(id);
  };
  window.fetch = async (url) => String(url).includes('projects.json')
    ? { ok: true, json: async () => catalog }
    : { ok: false, json: async () => ({}) };

  async function settle() {
    const deadline = Date.now() + 2000;
    while (Date.now() < deadline) {
      if (window.document.documentElement.classList.contains('volmit-ready') && frames.size === 0) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    assert.fail('Page navigation did not settle');
  }

  async function navigate(nextHref, nextTitle, body = '<p>Page content</p>') {
    dom.reconfigure({ url: 'https://docs.test' + nextHref });
    window.document.querySelector('.headline').textContent = nextTitle;
    const content = window.document.createElement('div');
    content.className = 'contents';
    content.innerHTML = body;
    window.document.querySelector('.contents').replaceWith(content);
    window.dispatchEvent(new window.PopStateEvent('popstate'));
    await settle();
  }

  window.eval(source);
  try {
    await settle();
  } catch (error) {
    window.close();
    throw error;
  }
  return { window, navigate, settle };
}

test('breadcrumbs name the current page and link back to the project', async () => {
  const { window, navigate } = await boot(installation.href, installation.title);
  try {
    for (const [page, group] of [[installation, 'Start here'], [api, 'Pack structure']]) {
      await navigate(page.href, page.title);
      const breadcrumb = window.document.querySelector('nav[aria-label="Breadcrumb"]');
      const entries = [...breadcrumb.querySelectorAll('ol > li')];
      assert.equal(entries.length, 3);
      assert.equal(entries[0].querySelector('a').textContent, 'Iris');
      assert.equal(entries[0].querySelector('a').getAttribute('href'), '/iris');
      assert.equal(entries[1].querySelector('span:last-child').textContent, group);
      assert.equal(entries[1].querySelector('a'), null);
      assert.equal(breadcrumb.querySelectorAll('[aria-current="page"]').length, 1);
      assert.equal(breadcrumb.querySelector('[aria-current="page"]').textContent, page.title);
      assert.equal(breadcrumb.querySelector('[aria-current="page"]').tagName, 'SPAN');
      assert.equal(window.document.querySelector('.reference-nav a[href="/iris"]').textContent, 'Project overview');
    }
  } finally {
    window.close();
  }
});

for (const [label, href, title, expected] of [
  ['first', installation.href, installation.title, [['next', configuration.href, configuration.title]]],
  ['middle', configuration.href, configuration.title, [['prev', installation.href, installation.title], ['next', api.href, api.title]]],
  ['last', api.href, api.title, [['prev', configuration.href, configuration.title]]],
  ['unknown', '/iris/unlisted-page', 'Unlisted page', []],
  ['overview', '/iris', 'Iris', []]
]) {
  test(label + ' page offers only the available adjacent reference pages', async () => {
    const { window } = await boot(href, title);
    try {
      const sequence = window.document.querySelector('nav[aria-label="Page sequence"]');
      if (!expected.length) {
        assert.equal(sequence, null);
      } else {
        assert.ok(sequence);
        assert.deepEqual([...sequence.querySelectorAll('a')].map((anchor) => [
          anchor.rel, anchor.getAttribute('href'), anchor.querySelector('strong').textContent
        ]), expected);
        assert.equal(sequence.closest('.contents'), null);
      }
      const breadcrumb = window.document.querySelector('nav[aria-label="Breadcrumb"]');
      assert.equal(breadcrumb.querySelector('[aria-current="page"]').textContent, title);
      if (label === 'overview') {
        assert.equal(breadcrumb.querySelector('a').getAttribute('href'), '/');
        assert.equal(breadcrumb.querySelector('a').textContent, 'All projects');
        assert.equal(window.document.querySelector('.reference-nav [aria-current="page"]').getAttribute('href'), '/iris');
      }
    } finally {
      window.close();
    }
  });
}

test('page replacements keep one current location and preserve both search fields', async () => {
  const { window, navigate, settle } = await boot(configuration.href, configuration.title);
  try {
    const siteSearch = window.document.querySelector('.nav-header .v-text-field input');
    const projectSearch = window.document.querySelector('input[aria-label="Search Iris"]');
    siteSearch.value = 'all projects query';
    projectSearch.value = 'iris query';
    for (let index = 0; index < 3; index += 1) {
      await navigate(configuration.href, 'Configuration reference', '<p>Updated configuration content</p>');
      window.dispatchEvent(new window.PopStateEvent('popstate'));
      await settle();
      assert.equal(window.document.querySelectorAll('nav[aria-label="Breadcrumb"]').length, 1);
      assert.equal(window.document.querySelector('nav[aria-label="Breadcrumb"] [aria-current="page"]').textContent, 'Configuration reference');
      assert.equal(window.document.querySelectorAll('nav[aria-label="Page sequence"]').length, 1);
      assert.deepEqual([...window.document.querySelectorAll('nav[aria-label="Page sequence"] a')].map((anchor) => anchor.getAttribute('href')), [installation.href, api.href]);
      assert.equal(window.document.querySelector('.contents').textContent, 'Updated configuration content');
    }
    await navigate('/iris', 'Iris', '<h2 id="start">Start here</h2><p>Choose a reference page.</p>');
    assert.equal(window.document.querySelector('nav[aria-label="Page sequence"]'), null);
    assert.equal(window.document.querySelectorAll('nav[aria-label="Breadcrumb"]').length, 1);
    assert.equal(window.document.querySelector('nav[aria-label="Breadcrumb"] [aria-current="page"]').textContent, 'Iris');
    assert.equal(window.document.querySelectorAll('.nav-header input').length, 2);
    assert.equal(window.document.querySelector('.nav-header .v-text-field input').value, 'all projects query');
    assert.equal(window.document.querySelector('input[aria-label="Search Iris"]').value, 'iris query');
    assert.equal(window.document.querySelector('.volmit-search-host').classList.contains('is-split'), true);
    await navigate('/iris/unlisted-page', 'Unlisted page');
    assert.equal(window.document.querySelector('nav[aria-label="Page sequence"]'), null);
    assert.equal(window.document.querySelector('nav[aria-label="Breadcrumb"] [aria-current="page"]').textContent, 'Unlisted page');
  } finally {
    window.close();
  }
});
