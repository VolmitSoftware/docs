const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '../../theme/minimal-brutalism.js'), 'utf8');
const catalog = [{ name: 'Adapt', path: 'adapt', href: '/adapt', description: 'Skills', sections: [
  { title: 'Skills', groups: [{ title: '', links: [{ title: 'Catalog', href: '/adapt/10-skills-catalog' }] }] }
] }];

async function page(t, cached, response) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('error', (...args) => errors.push(args));
  const dom = new JSDOM('<div id="root"><div class="v-application"><main class="v-main"><div class="v-main__wrap">'
    + '<div class="page-header-section"><div class="page-header-headings"><div class="headline">Adapt</div></div></div>'
    + '<div class="contents"><p>Skill reference</p><ul class="links-list"><li><a href="/adapt/10-skills-catalog">Catalog</a></li></ul></div>'
    + '</div></main></div></div>', { url: 'https://docs.test/adapt', runScripts: 'outside-only', virtualConsole });
  t.after(() => dom.window.close());
  const { window } = dom;
  Object.defineProperty(window.document, 'readyState', { value: 'complete' });
  window.MutationObserver = class { observe() {} disconnect() {} };
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
  window.cancelAnimationFrame = window.clearTimeout;
  const timeout = window.setTimeout.bind(window);
  window.setTimeout = (callback, delay, ...args) => timeout(callback, delay === 2500 ? 35 : delay, ...args);
  if (cached) window.sessionStorage.setItem('volmit-catalog', JSON.stringify(cached));
  let signal;
  window.fetch = (url, options) => {
    signal = options.signal;
    return response ? Promise.resolve(response) : new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(new window.DOMException('Navigation request timed out', 'AbortError')), { once: true });
    });
  };
  window.eval(source);
  await new Promise((resolve) => setImmediate(resolve));
  return { window, errors, signal: () => signal };
}

test('a cached navigation shell does not cancel the pending catalog request deadline', async (t) => {
  const state = await page(t, catalog);
  assert.ok(state.window.document.querySelector('.volmit-project-bar'));
  assert.equal(state.signal().aborted, false);
  await new Promise((resolve) => setTimeout(resolve, 55));
  assert.equal(state.signal().aborted, true);
  assert.ok(state.window.document.querySelector('.volmit-project-bar'));
  assert.equal(state.window.document.documentElement.classList.contains('volmit-loading'), false);
});

test('failed, invalid, and timed-out navigation loads leave the original article readable', async (t) => {
  for (const response of [
    { ok: false, status: 503 },
    { ok: true, json: async () => ({ projects: [] }) },
    null
  ]) {
    await t.test(response === null ? 'timeout' : response.ok ? 'invalid JSON shape' : 'HTTP failure', async (child) => {
      const state = await page(child, null, response);
      if (response === null) await new Promise((resolve) => setTimeout(resolve, 55));
      const { document } = state.window;
      assert.equal(document.querySelector('.contents p').textContent, 'Skill reference');
      assert.equal(document.querySelector('.contents a').getAttribute('href'), '/adapt/10-skills-catalog');
      assert.equal(document.querySelector('.volmit-project-bar'), null);
      assert.equal(document.documentElement.classList.contains('volmit-loading'), false);
      assert.equal(document.documentElement.classList.contains('volmit-ready'), true);
      assert.equal(state.errors.length, 1);
    });
  }
});
