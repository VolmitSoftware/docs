const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '../../theme/minimal-brutalism.js'), 'utf8');

async function page(t, pathname = '/iris/configuration') {
  const dom = new JSDOM(`<div id="root"><div class="v-application">
    <header class="nav-header"><div class="nav-header-inner"><div class="v-toolbar__content"><img src="/logo.svg" alt=""><span>Volmit Software</span></div></div></header>
    <main class="v-main"><div class="v-main__wrap"><header class="page-header-section"><div class="page-header-headings"><div class="headline">Configuration</div></div></header>
    <article class="contents"><h2>Settings</h2><p>Configuration details.</p></article></div></main>
    </div></div>`, { url: 'https://docs.test' + pathname, runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const { window } = dom;
  const brandNodes = [...window.document.querySelector('.nav-header-inner .v-toolbar__content').childNodes];
  const scrolls = [];
  window.HTMLElement.prototype.scrollIntoView = function (options) { scrolls.push({ node: this, options }); };
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.MutationObserver = class { observe() {} disconnect() {} };
  window.requestAnimationFrame = callback => window.setTimeout(callback, 0);
  window.cancelAnimationFrame = id => window.clearTimeout(id);
  window.fetch = async () => ({ ok: true, json: async () => [{
    name: 'Iris', path: 'iris', href: '/iris', description: 'World generation',
    sections: [{ title: 'Configuration', groups: [{ title: '', links: [{ title: 'Configuration', href: '/iris/configuration' }] }] }]
  }] });
  window.eval(source);
  await new Promise(resolve => setTimeout(resolve, 30));
  return { window, document: window.document, brandNodes, scrolls };
}

test('the header preserves brand nodes inside a native home link and mounts one skip destination', async t => {
  const { window, document, brandNodes } = await page(t);
  const app = document.querySelector('.v-application');
  const home = app.querySelector('.volmit-home-link');
  const skip = app.querySelector('.volmit-skip-link');
  assert.equal(home.tagName, 'A');
  assert.equal(home.getAttribute('href'), '/');
  assert.equal(home.getAttribute('aria-label'), 'Volmit Software documentation home');
  assert.deepEqual([...home.childNodes], brandNodes);
  assert.equal(app.firstElementChild, skip);
  assert.equal(skip.tagName, 'A');
  assert.equal(skip.textContent, 'Skip to content');
  assert.equal(skip.getAttribute('href'), '#volmit-main-content');
  assert.equal(document.getElementById('volmit-main-content'), document.querySelector('.v-main'));
  assert.equal(home.dispatchEvent(new window.MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 1 })), true);
  window.dispatchEvent(new window.PopStateEvent('popstate'));
  await new Promise(resolve => setTimeout(resolve, 30));
  assert.equal(app.querySelectorAll('.volmit-home-link').length, 1);
  assert.equal(app.querySelectorAll('.volmit-skip-link').length, 1);
  assert.deepEqual([...home.childNodes], brandNodes);
});

test('skip activation focuses and scrolls the current article heading after a soft navigation', async t => {
  const { window, document, scrolls } = await page(t);
  const skip = document.querySelector('.volmit-skip-link');
  const heading = document.querySelector('.page-header-headings .headline');
  skip.click();
  assert.equal(document.activeElement, heading);
  assert.equal(heading.tabIndex, -1);
  assert.equal(scrolls.at(-1).node, heading);
  assert.equal(scrolls.at(-1).options.block, 'start');
  assert.equal(scrolls.at(-1).options.behavior, 'instant');
  const replacement = document.createElement('div');
  replacement.className = 'headline';
  replacement.textContent = 'Replacement page';
  heading.replaceWith(replacement);
  window.dispatchEvent(new window.PopStateEvent('popstate'));
  await new Promise(resolve => setTimeout(resolve, 30));
  skip.click();
  assert.equal(document.activeElement, replacement);
  assert.equal(scrolls.at(-1).node, replacement);
  assert.equal(document.querySelectorAll('.volmit-skip-link').length, 1);
});

test('the home page skip link focuses the rendered directory heading', async t => {
  const { document, scrolls } = await page(t, '/');
  const heading = document.querySelector('.home-directory h1');
  assert.ok(heading);
  document.querySelector('.volmit-skip-link').click();
  assert.equal(document.activeElement, heading);
  assert.equal(heading.tabIndex, -1);
  assert.equal(scrolls.at(-1).node, heading);
});
