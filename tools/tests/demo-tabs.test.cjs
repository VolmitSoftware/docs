const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '../../theme/minimal-brutalism.js'), 'utf8');

function demonstration(id) {
  return `<div class="wormholes-demo" data-demo="${id}">${['standard', 'clientview'].map(client =>
    `<div class="wormholes-demo-variant" data-client="${client}"><p>${client}</p>` + ['pov', 'observer'].map(view =>
      `<video src="/wormholes-assets/demos/${id}-${client}-${view}.webm" controls></video>`).join('') + '</div>').join('')}</div>`;
}

async function page(t) {
  const dom = new JSDOM('<div id="root"><div class="v-application"><main class="v-main"><div class="contents">'
    + ['wand-creation', 'rune-creation', 'portal-linking'].map(demonstration).join('')
    + '<div class="adapt-demo"><video src="/adapt-assets/demo-pov.webm"></video><video src="/adapt-assets/demo-observer.webm"></video></div>'
    + '</div></main></div></div>', { url: 'https://example.test/wormholes/03-building-portals', runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const { window } = dom;
  const observers = [];
  window.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
    unobserve() {}
  };
  window.MutationObserver = class { observe() {} };
  window.fetch = () => new Promise(() => {});
  Object.defineProperty(window.document, 'readyState', { value: 'complete' });
  Object.defineProperty(window.document, 'hidden', { value: false, configurable: true });
  for (const video of window.document.querySelectorAll('video')) {
    let paused = true;
    Object.defineProperty(video, 'paused', { get: () => paused });
    video.play = () => { paused = false; video.dispatchEvent(new window.Event('play')); return Promise.resolve(); };
    video.pause = () => { paused = true; video.dispatchEvent(new window.Event('pause')); };
  }
  window.eval(source);
  await new Promise(resolve => setImmediate(resolve));
  return {
    window,
    demos: [...window.document.querySelectorAll('.wormholes-demo')],
    visible(container, value) {
      for (const observer of observers) observer.callback([{ target: container, isIntersecting: value, intersectionRatio: value ? 1 : 0 }]);
    }
  };
}

test('each demonstration mounts independent client tabs and paired perspectives', async t => {
  const { window, demos } = await page(t);
  for (const demo of demos) {
    const clients = [...demo.querySelectorAll(':scope > .demo-header [role="tab"]')];
    assert.deepEqual(clients.map(tab => tab.textContent), ['WITHOUT Wormholes mod', 'WITH Wormholes mod']);
    assert.equal(clients[0].getAttribute('aria-selected'), 'true');
    assert.equal(clients[1].getAttribute('aria-selected'), 'false');
    for (const tab of demo.querySelectorAll('[role="tab"]')) {
      const panel = window.document.getElementById(tab.getAttribute('aria-controls'));
      assert.equal(panel.getAttribute('aria-labelledby'), tab.id);
    }
    assert.equal(demo.querySelectorAll('video').length, 4);
  }
  demos[0].querySelectorAll(':scope > .demo-header button')[1].click();
  assert.equal(demos[0].querySelector('[data-client="clientview"]').hidden, false);
  assert.equal(demos[1].querySelector('[data-client="clientview"]').hidden, true);
  window.dispatchEvent(new window.PopStateEvent('popstate'));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(demos[0].querySelectorAll(':scope > .demo-header').length, 1);
  assert.equal(window.document.querySelectorAll('.adapt-demo .demo-tab').length, 2);
});

test('keyboard navigation selects client and perspective tabs with roving focus', async t => {
  const { window, demos } = await page(t);
  const clientTabs = demos[0].querySelector(':scope > .demo-header [role="tablist"]');
  assert.ok(clientTabs, 'Client controls must expose a tablist');
  clientTabs.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }));
  assert.equal(window.document.activeElement.textContent, 'WITH Wormholes mod');
  assert.equal(window.document.activeElement.tabIndex, 0);
  const variant = demos[0].querySelector('[data-client="clientview"]');
  const perspectives = variant.querySelector('[role="tablist"]');
  perspectives.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
  assert.equal(window.document.activeElement.textContent, 'Third person');
  assert.equal(variant.querySelector('video[src$="-pov.webm"]').parentElement.hidden, true);
  assert.equal(variant.querySelector('video[src$="-observer.webm"]').parentElement.hidden, false);
});

test('inactive client, inactive perspective, offscreen, and background clips pause', async t => {
  const { window, demos, visible } = await page(t);
  const demo = demos[0];
  const first = demo.querySelector('video[src$="standard-pov.webm"]');
  const third = demo.querySelector('video[src$="standard-observer.webm"]');
  visible(demo, true);
  assert.equal(first.paused, false);
  assert.equal(third.paused, true);
  const perspectiveTabs = demo.querySelector('[data-client="standard"] .demo-tabs');
  assert.ok(perspectiveTabs, 'Perspective controls must exist');
  perspectiveTabs.querySelectorAll('button')[1].click();
  assert.equal(first.paused, true);
  assert.equal(third.paused, false);
  demo.querySelectorAll(':scope > .demo-header button')[1].click();
  assert.equal(third.paused, true);
  const modded = demo.querySelector('video[src$="clientview-pov.webm"]');
  assert.equal(modded.paused, false);
  visible(demo, false);
  assert.equal(modded.paused, true);
  visible(demo, true);
  assert.equal(modded.paused, false);
  Object.defineProperty(window.document, 'hidden', { value: true, configurable: true });
  window.document.dispatchEvent(new window.Event('visibilitychange'));
  assert.equal(modded.paused, true);
});
