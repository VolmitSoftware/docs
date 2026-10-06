const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '../../theme/minimal-brutalism.js'), 'utf8');

function project(name, projectPath, extra = {}) {
  return {
    name,
    path: projectPath,
    href: '/' + projectPath,
    description: name + ' documentation',
    color: extra.color || '#2dd4bf',
    ...(extra.featured ? { featured: true } : {}),
    group: extra.group || 'Plugins',
    sections: extra.sections || [
      { title: 'Start here', links: [{ title: 'Installation', href: `/${projectPath}/01-installation` }] },
      { title: 'Authoring', links: [{ title: 'Dimensions', href: `/${projectPath}/11-dimensions` }] }
    ]
  };
}

function catalog() {
  const featured = [
    ['Iris', 'iris', '#2dd4bf'],
    ['Adapt', 'adapt', '#fb7185'],
    ['Wormholes', 'wormholes', '#f5b942'],
    ['Gloss', 'gloss', '#c084fc'],
    ['React', 'react', '#38bdf8']
  ].map(([name, projectPath, color]) => project(name, projectPath, { featured: true, color }));
  const rest = ['Foundation', 'HiddenOre', 'Rift', 'Shaped Portals', 'SkyPrime', 'Static', 'GamemodeSwitcher', 'BileTools', 'VolmLib', 'Multiplexor']
    .map((name) => project(name, name.toLowerCase().replace(/ /g, '')));
  return [...featured, ...rest];
}

function shell(title, caption, body) {
  return `<div id="root"><div class="v-application"><header class="nav-header"><div class="v-toolbar__content"><div class="layout row">
    <div class="flex"><div class="nav-header-inner"><div class="v-toolbar__content">Volmit</div></div></div>
    <div class="flex md4"><div class="v-toolbar__content"><div class="v-input v-text-field"><input type="text" aria-label="Search..."></div></div></div>
    <div class="flex"></div>
  </div></div></header>
  <main class="v-main"><div class="v-main__wrap">
    <div class="page-header-section"><div class="page-header-headings"><div class="headline">${title}</div><div class="caption">${caption}</div></div></div>
    <div class="contents">${body}</div>
  </div></main></div></div>`;
}

function lostShell() {
  return `<div id="root"><div class="v-application"><div class="notfound"><div class="notfound-content"><img alt="Not Found"><div class="headline">Not Found</div><div class="subheading">This page does not exist.</div><a href="/">Home</a></div></div></div></div>`;
}

async function boot(pathname, body, title = 'Page', caption = 'Caption', options = {}) {
  const dom = new JSDOM(options.lost ? lostShell() : shell(title, caption, body), {
    url: 'https://docs.test' + pathname,
    runScripts: 'outside-only'
  });
  const { window } = dom;
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
  window.cancelAnimationFrame = (id) => window.clearTimeout(id);
  let observerCalls = 0;
  const observers = [];
  if (options.liveObserver) {
    const NativeObserver = window.MutationObserver;
    window.MutationObserver = class extends NativeObserver {
      constructor(callback) {
        super((records, observer) => {
          observerCalls += 1;
          if (observerCalls > 30) {
            throw new Error('Theme mount loop');
          }
          callback(records, observer);
        });
        observers.push(this);
      }
    };
  } else {
    window.MutationObserver = class { observe() {} disconnect() {} };
  }
  const calls = [];
  window.fetch = (url, options = {}) => {
    const target = String(url);
    calls.push({ target, options });
    if (target.includes('projects.json')) {
      return Promise.resolve({ ok: true, json: async () => catalog() });
    }
    if (target.includes('graphql')) {
      const payload = JSON.parse(options.body);
      const query = payload.variables.query;
      return Promise.resolve({
        ok: true,
        json: async () => ({
          data: {
            pages: {
              search: {
                results: [
                  { title: 'Adapt install ' + query, path: 'adapt/01-installation', description: 'Other project' },
                  { title: 'Iris platforms ' + query, path: 'iris/01-installation-platforms', description: 'Inside Iris' }
                ]
              }
            }
          }
        })
      });
    }
    return Promise.resolve({ ok: false, json: async () => ({}) });
  };
  window.eval(source);
  await new Promise((resolve) => setTimeout(resolve, 30));
  return {
    window,
    calls,
    observerCalls: () => observerCalls,
    close: () => {
      for (const observer of observers) {
        observer.disconnect();
      }
      dom.window.close();
    }
  };
}

test('home shows five featured projects and the full catalog', async () => {
  const { window, close } = await boot('/', '<p>Home</p>', 'Documentation', 'Installation, configuration, commands, and APIs');
  try {
    const featured = [...window.document.querySelectorAll('.featured-card h3')].map((node) => node.textContent);
    const directory = [...window.document.querySelectorAll('.directory-card h3')].map((node) => node.textContent);
    assert.deepEqual(featured, ['Iris', 'Adapt', 'Wormholes', 'Gloss', 'React']);
    assert.equal(directory.length, 10);
    assert.equal(directory.some((name) => featured.includes(name)), false);
    assert.equal(new Set([...featured, ...directory]).size, 15);
    assert.equal(window.document.querySelector('.directory-search input').placeholder, 'Filter by name');
    assert.equal(window.document.querySelector('.volmit-plugin-search'), null);
    assert.equal(window.document.documentElement.dataset.project, undefined);
  } finally {
    close();
  }
});

test('filtering the directory can show a featured project once', async () => {
  const { window, close } = await boot('/', '<p>Home</p>', 'Documentation', 'Installation, configuration, commands, and APIs');
  try {
    const input = window.document.querySelector('.directory-search input');
    input.value = 'iris';
    input.dispatchEvent(new window.Event('input'));
    assert.equal(window.document.querySelector('.featured-grid').hidden, true);
    assert.deepEqual([...window.document.querySelectorAll('.directory-card h3')].map((node) => node.textContent), ['Iris']);
  } finally {
    close();
  }
});

test('site search uses the project dropdown and searches every project', async () => {
  const { window, close } = await boot('/iris', '<h2 id="start">Start here</h2>', 'Iris', 'Iris documentation: Iris');
  try {
    const input = window.document.querySelector('.nav-header .v-text-field input');
    input.value = 'platforms';
    input.dispatchEvent(new window.Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 250));
    const field = input.closest('.v-text-field');
    const hits = [...field.querySelectorAll('.plugin-search-hit')].map((node) => node.getAttribute('href'));
    assert.deepEqual(hits, ['/adapt/01-installation', '/iris/01-installation-platforms']);
    assert.equal(field.querySelector('.plugin-search-results').hidden, false);
  } finally {
    close();
  }
});

test('project overview groups every section and splits search', async () => {
  const body = `<section class="volmit-headliner"><h2 id="editor">Build</h2></section>
    <table><thead><tr><th></th><th></th></tr></thead><tbody><tr><td>Java</td><td>25</td></tr></tbody></table>
    <h2 id="start">Start here</h2><ul class="links-list"><li><a href="/iris/01-installation">Installation</a></li></ul>
    <h2 id="concepts">Concepts and worlds</h2><ul class="links-list"><li><a href="/iris/05">Concepts</a></li></ul>
    <h2 id="authoring">Authoring a pack</h2><h3 id="terrain">Terrain</h3><ul class="links-list"><li><a href="/iris/14">Generators</a></li></ul>
    <h2 id="examples">Examples and operations</h2><p>Examples</p>
    <h2 id="api">Developer API</h2><p>API</p>`;
  const { window, close } = await boot('/iris', body, 'Iris', 'Iris world generation engine for Paper and Folia');
  try {
    assert.equal(window.document.querySelectorAll('.landing-group').length, 5);
    assert.equal(window.document.querySelector('.volmit-headliner').closest('.landing-group'), null);
    assert.equal(window.document.querySelector('table').classList.contains('spec-strip-plain'), true);
    const tabs = [...window.document.querySelectorAll('.project-tabs a')].map((node) => node.textContent);
    assert.deepEqual(tabs, ['Overview', 'Start here', 'Concepts and worlds', 'Authoring a pack', 'Examples and operations', 'Developer API']);
    assert.equal(window.document.querySelector('.volmit-section-sidebar'), null);
    const pluginInput = window.document.querySelector('.volmit-plugin-search input');
    assert.equal(pluginInput.getAttribute('aria-label'), 'Search Iris');
    assert.equal(pluginInput.placeholder, 'Search Iris');
    assert.equal(window.document.querySelector('.volmit-search-host').classList.contains('is-split'), true);
    assert.equal(window.document.querySelector('.nav-header .v-text-field input').getAttribute('aria-label'), 'Search...');
    assert.equal(window.document.documentElement.dataset.project, 'iris');
    assert.equal(window.document.documentElement.style.getPropertyValue('--volmit-project'), '#2dd4bf');
  } finally {
    close();
  }
});

test('reference pages collapse other sections and scope plugin search', async () => {
  const { window, close } = await boot(
    '/iris/01-installation',
    '<h2 id="requirements"><a class="toc-anchor" href="#requirements">¶</a> Requirements</h2><h3 id="paper">Paper</h3><p>Install the jar.</p>',
    'Installation',
    'Iris documentation: Installation'
  );
  try {
    const toggles = [...window.document.querySelectorAll('.reference-section-toggle')];
    assert.deepEqual(toggles.map((node) => [node.textContent, node.getAttribute('aria-expanded')]), [
      ['Start here', 'true'],
      ['Authoring', 'false']
    ]);
    assert.equal(window.document.querySelector('.reference-nav a[href="/iris"]'), null);
    assert.equal(window.document.querySelector('.page-header-headings .caption').hidden, true);
    assert.equal(window.document.querySelector('.landing-group'), null);
    const tocButton = window.document.querySelector('.page-toc-toggle');
    assert.equal(tocButton.textContent, 'On this page');
    const tocLinks = [...window.document.querySelectorAll('.volmit-page-toc a')];
    assert.deepEqual(tocLinks.map((node) => [node.textContent, node.getAttribute('href')]), [
      ['Requirements', '#requirements'],
      ['Paper', '#paper']
    ]);
    assert.equal(tocLinks[1].classList.contains('is-sub'), true);
    assert.equal(tocLinks[0].classList.contains('is-sub'), false);
    tocButton.click();
    assert.equal(window.document.querySelector('.v-application').classList.contains('show-page-toc'), true);
    assert.equal(tocButton.getAttribute('aria-expanded'), 'true');
    const input = window.document.querySelector('.volmit-plugin-search input');
    input.value = 'platforms';
    input.dispatchEvent(new window.Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 250));
    const hits = [...window.document.querySelectorAll('.plugin-search-hit')].map((node) => node.getAttribute('href'));
    assert.deepEqual(hits, ['/iris/01-installation-platforms']);
    assert.equal(hits.some((href) => href.startsWith('/adapt')), false);
  } finally {
    close();
  }
});

test('missing pages replace the wiki 404 and keep a way home', async () => {
  const { window, close } = await boot('/missing/page', '', 'Page Not Found', '', { lost: true });
  try {
    const lost = window.document.querySelector('.volmit-lost');
    assert.ok(lost);
    assert.equal(window.document.querySelectorAll('.volmit-lost').length, 1);
    assert.equal(lost.querySelector('h1').textContent, '404');
    assert.equal(lost.querySelector('a').getAttribute('href'), '/');
    assert.equal(lost.querySelector('a').textContent, 'Documentation home');
    assert.match(lost.textContent, /\/missing\/page/);
    const particles = lost.querySelector('.volmit-lost-particles');
    assert.ok(particles);
    assert.ok(Number(particles.dataset.count) >= 2000);
    assert.equal(lost.querySelector('.volmit-lost-planet'), null);
    assert.equal(window.document.querySelector('.notfound-content').hidden, true);
    assert.equal(window.document.querySelector('.home-directory'), null);
    assert.equal(window.document.documentElement.classList.contains('volmit-loading'), false);
    assert.equal(lost.textContent.includes('\u2014'), false);
  } finally {
    close();
  }
});

test('project pages settle instead of rebuilding forever', async () => {
  const { window, observerCalls, close } = await boot(
    '/iris',
    '<h2 id="start">Start here</h2>',
    'Iris',
    'Iris documentation: Iris',
    { liveObserver: true }
  );
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.equal(window.document.documentElement.classList.contains('volmit-loading'), false);
    assert.equal(window.document.querySelectorAll('.volmit-project-bar').length, 1);
    assert.equal(window.document.querySelectorAll('.volmit-page-toc a').length, 1);
    assert.ok(observerCalls() < 30);
  } finally {
    close();
  }
});

test('landing rows share a height and pages crossfade', () => {
  const css = fs.readFileSync(path.join(__dirname, '../../theme/minimal-brutalism.css'), 'utf8');
  assert.equal(css.includes('visibility: hidden'), false);
  assert.match(css, /@view-transition\s*\{\s*navigation:\s*auto;\s*\}/);
  assert.match(css, /volmit-page-in 150ms ease-out both/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*@view-transition\s*\{\s*navigation:\s*none;\s*\}/);
  assert.match(css, /\.landing-group :where\(ul\.links-list, ol\.links-list\) > li > a \{[^}]*justify-content: center;/);
});

test('a real page description stays visible', async () => {
  const { window, close } = await boot(
    '/adapt/11-skill-agility',
    '<h2 id="xp">How you earn Agility XP</h2><p>Movement.</p>',
    'Skill - Agility',
    'Agility XP sources, adaptations, controls, and configuration'
  );
  try {
    assert.equal(window.document.querySelector('.page-header-headings .caption').hidden, false);
    assert.equal(window.document.querySelector('.volmit-plugin-search input').getAttribute('aria-label'), 'Search Adapt');
  } finally {
    close();
  }
});
