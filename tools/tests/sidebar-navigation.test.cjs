const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '../../theme/minimal-brutalism.js'), 'utf8');
const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '../../theme/projects.json'), 'utf8'));

test('Iris pack navigation retains its five authoring groups and every destination', () => {
  const section = catalog.find((project) => project.path === 'iris').sections.find((section) => section.title === 'Authoring a pack');
  assert.deepEqual(section.groups.map((group) => group.title), [
    'Pack structure', 'Terrain', 'Image maps', 'Structures and objects', 'Surfaces and loot'
  ]);
  const destinations = section.groups.flatMap((group) => group.links.map((page) => page.href));
  assert.equal(destinations.length, 31);
  assert.equal(new Set(destinations).size, 31);
  assert.equal(section.groups.find((group) => group.title === 'Terrain').links.some((page) => page.href === '/iris/36-rivers'), true);
  for (const project of catalog) {
    for (const section of project.sections) {
      assert.equal(Object.hasOwn(section, 'links'), false);
      assert.ok(section.groups.length > 0);
    }
  }
});

async function boot(savedState) {
  const dom = new JSDOM(`<div id="root"><div class="v-application">
    <header class="nav-header"></header><main class="v-main"><div class="v-main__wrap">
    <div class="page-header-section"><div class="page-header-headings"><div class="headline">Dimensions</div></div></div>
    <div class="contents"><p>Reference</p></div></div></main></div></div>`, {
    url: 'https://docs.test/iris/11-dimensions', runScripts: 'outside-only'
  });
  const { window } = dom;
  if (savedState) {
    window.sessionStorage.setItem('volmit-sidebar-state', savedState);
  }
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
  window.eval(source);
  async function waitForSidebar(href) {
    const deadline = Date.now() + 2000;
    while (Date.now() < deadline) {
      if (window.document.documentElement.classList.contains('volmit-ready')
        && window.document.querySelector('.volmit-section-sidebar [aria-current="page"]')?.getAttribute('href') === href
        && frames.size === 0) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    assert.fail('Sidebar navigation did not settle for ' + href);
  }
  try {
    await waitForSidebar('/iris/11-dimensions');
  } catch (error) {
    window.close();
    throw error;
  }
  return { dom, window, waitForSidebar };
}

test('sidebar renders subgroup context and keeps browsing state within a project', async () => {
  const { dom, window, waitForSidebar } = await boot();
  try {
    const sidebar = window.document.querySelector('.volmit-section-sidebar');
    assert.ok(sidebar);
    assert.equal(sidebar.querySelector('[aria-current="page"]').textContent, 'Dimensions');
    assert.deepEqual([...sidebar.querySelectorAll('.reference-subgroup-heading')].map((heading) => heading.textContent), [
      'Pack structure', 'Terrain', 'Image maps', 'Structures and objects', 'Surfaces and loot'
    ]);
    const start = [...sidebar.querySelectorAll('.reference-section-toggle')].find((toggle) => toggle.textContent === 'Start here');
    start.click();
    assert.equal(start.getAttribute('aria-expanded'), 'true');
    assert.ok(window.document.getElementById(start.getAttribute('aria-controls')));
    sidebar.scrollTop = 175;
    window.dispatchEvent(new window.PageTransitionEvent('pagehide'));
    const reload = await boot(window.sessionStorage.getItem('volmit-sidebar-state'));
    try {
      const restored = reload.window.document.querySelector('.volmit-section-sidebar');
      assert.equal(restored.scrollTop, 175);
      assert.equal([...restored.querySelectorAll('.reference-section-toggle')].find((toggle) => toggle.textContent === 'Start here').getAttribute('aria-expanded'), 'true');
    } finally {
      reload.window.close();
    }
    dom.reconfigure({ url: 'https://docs.test/iris/14-generators-noise' });
    window.dispatchEvent(new window.PopStateEvent('popstate'));
    await waitForSidebar('/iris/14-generators-noise');
    const next = window.document.querySelector('.volmit-section-sidebar');
    const toggles = [...next.querySelectorAll('.reference-section-toggle')];
    assert.equal(toggles.find((toggle) => toggle.textContent === 'Start here').getAttribute('aria-expanded'), 'true');
    assert.equal(toggles.find((toggle) => toggle.textContent === 'Authoring a pack').getAttribute('aria-expanded'), 'true');
    assert.equal(next.scrollTop, 175);
    assert.equal(next.querySelector('[aria-current="page"]').getAttribute('href'), '/iris/14-generators-noise');
    assert.equal(toggles.find((toggle) => toggle.textContent === 'Developer API').getAttribute('aria-expanded'), 'false');
    dom.reconfigure({ url: 'https://docs.test/iris/90-api-getting-started' });
    window.dispatchEvent(new window.PopStateEvent('popstate'));
    await waitForSidebar('/iris/90-api-getting-started');
    assert.equal([...window.document.querySelectorAll('.reference-section-toggle')].find((toggle) => toggle.textContent === 'Developer API').getAttribute('aria-expanded'), 'true');
    dom.reconfigure({ url: 'https://docs.test/gloss/02-configuration' });
    window.dispatchEvent(new window.PopStateEvent('popstate'));
    await waitForSidebar('/gloss/02-configuration');
    assert.equal(window.document.querySelector('.volmit-section-sidebar').dataset.project, 'gloss');
    assert.equal(window.document.querySelector('.volmit-section-sidebar').scrollTop, 0);
    assert.equal([...window.document.querySelectorAll('.reference-section-toggle[aria-expanded="true"]')].length, 1);
  } finally {
    window.close();
  }
});
