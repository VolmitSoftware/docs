const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '../../theme/minimal-brutalism.js'), 'utf8');

function demonstration(id, views = ['pov', 'observer']) {
  return `<div class="wormholes-demo" data-demo="${id}">${['standard', 'clientview'].map(client =>
    `<div class="wormholes-demo-variant" data-client="${client}"><p>${client}</p>` + views.map(view =>
      `<video src="/wormholes-assets/demos/${id}-${client}-${view}.webm" controls></video>`).join('') + '</div>').join('')}</div>`;
}

async function page(t, perspective, single = false, reducedMotion = false) {
  const dom = new JSDOM('<div id="root"><div class="v-application"><main class="v-main"><div class="contents">'
    + ['wand-creation', 'rune-creation', 'portal-linking'].map(id => demonstration(id, single && id !== 'portal-linking' ? ['pov'] : ['pov', 'observer'])).join('')
    + '<div class="adapt-demo"><video src="/adapt-assets/demo-pov.webm"></video><video src="/adapt-assets/demo-observer.webm"></video></div>'
    + '<div class="gloss-demo"><p>Inventory menus. Minecraft client. Silent capture.</p><video src="/gloss-assets/demos/inventory-menus-pov.webm" aria-label="Inventory menus in Minecraft"></video></div>'
    + '<div class="gloss-demo"><p>Menu authoring. Browser editor. Silent capture.</p><video src="/gloss-assets/demos/menu-editor.webm" aria-label="Menu authoring in the browser editor"></video></div>'
    + '</div></main></div></div>', { url: 'https://example.test/wormholes/03-building-portals', runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const { window } = dom;
  window.matchMedia = (query) => ({ matches: reducedMotion && query === '(prefers-reduced-motion: reduce)', media: query });
  if (perspective) window.localStorage.setItem('adapt-demo-perspective', perspective);
  const observers = [];
  window.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
    unobserve() {}
  };
  window.MutationObserver = class { observe() {} disconnect() {} };
  window.requestAnimationFrame = callback => window.setTimeout(callback, 0);
  window.cancelAnimationFrame = id => window.clearTimeout(id);
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
  await new Promise(resolve => setTimeout(resolve, 20));
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
    assert.deepEqual(clients.map(tab => tab.textContent), ['No client mod', 'Client mod']);
    assert.equal(demo.querySelectorAll('[role="tablist"]').length, 1);
    assert.equal(demo.querySelectorAll('[role="tab"]').length, 2);
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
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.equal(demos[0].querySelectorAll(':scope > .demo-header').length, 1);
  assert.equal(window.document.querySelectorAll('.adapt-demo .demo-tab').length, 2);
});

test('single-view Gloss clips preserve labels and play independently of saved perspective', async t => {
  const { window, visible } = await page(t, 'third-person');
  const demos = [...window.document.querySelectorAll('.gloss-demo')];
  for (const demo of demos) {
    const video = demo.querySelector('video');
    const label = video.getAttribute('aria-label');
    assert.equal(demo.classList.contains('demo-ready'), true);
    assert.equal(demo.querySelector('.demo-header'), null);
    assert.equal(demo.querySelector('[role="tablist"]'), null);
    visible(demo, true);
    assert.equal(video.parentElement.hidden, false);
    assert.equal(video.paused, false);
    assert.equal(video.getAttribute('aria-label'), label);
    visible(demo, false);
    assert.equal(video.paused, true);
    visible(demo, true);
    assert.equal(video.paused, false);
  }
});

test('keyboard navigation selects client tabs and the camera uses a separate selector', async t => {
  const { window, demos } = await page(t);
  const clientTabs = demos[0].querySelector(':scope > .demo-header [role="tablist"]');
  assert.ok(clientTabs, 'Client controls must expose a tablist');
  clientTabs.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }));
  assert.equal(window.document.activeElement.textContent, 'Client mod');
  assert.equal(window.document.activeElement.tabIndex, 0);
  const variant = demos[0].querySelector('[data-client="clientview"]');
  const camera = demos[0].querySelector('select');
  assert.ok(camera, 'Camera control must exist independently of the client tabs');
  camera.value = 'third-person';
  camera.dispatchEvent(new window.Event('change', { bubbles: true }));
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
  const camera = demo.querySelector('select');
  camera.value = 'third-person';
  camera.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.equal(first.paused, true);
  assert.equal(third.paused, false);
  demo.querySelectorAll(':scope > .demo-header button')[1].click();
  assert.equal(third.paused, true);
  const modded = demo.querySelector('video[src$="clientview-observer.webm"]');
  assert.equal(modded.paused, false);
  visible(demo, false);
  assert.equal(modded.paused, true);
  visible(demo, true);
  assert.equal(modded.paused, false);
  Object.defineProperty(window.document, 'hidden', { value: true, configurable: true });
  window.document.dispatchEvent(new window.Event('visibilitychange'));
  assert.equal(modded.paused, true);
});

test('Wormholes shares Adapt perspective selection and remembers it across pages', async t => {
  const { window, demos, visible } = await page(t);
  for (const demo of demos) visible(demo, true);
  const adapt = window.document.querySelector('.adapt-demo');
  visible(adapt, true);
  const camera = demos[0].querySelector('select');
  camera.value = 'third-person';
  camera.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.equal(window.localStorage.getItem('adapt-demo-perspective'), 'third-person');
  for (const demo of demos) {
    assert.equal(demo.querySelector('video[src$="standard-pov.webm"]').paused, true);
    assert.equal(demo.querySelector('video[src$="standard-observer.webm"]').paused, false);
    assert.equal(demo.querySelector('select').value, 'third-person');
  }
  assert.equal(adapt.querySelectorAll('.demo-tab')[1].getAttribute('aria-selected'), 'true');
  demos[0].querySelectorAll(':scope > .demo-header button')[1].click();
  assert.equal(demos[0].querySelector('video[src$="clientview-observer.webm"]').paused, false);
  adapt.querySelectorAll('.demo-tab')[0].click();
  assert.equal(demos[0].querySelector('select').value, 'first-person');
  assert.equal(demos[0].querySelector('video[src$="clientview-pov.webm"]').paused, false);
  const restored = await page(t, 'third-person');
  assert.equal(restored.demos[0].querySelector('select').value, 'third-person');
});


test('first-person-only demonstrations play with a saved observer preference and omit camera controls', async t => {
  const { window, demos, visible } = await page(t, 'third-person', true);
  for (const demo of demos.slice(0, 2)) {
    assert.equal(demo.classList.contains('demo-ready'), true);
    assert.equal(demo.querySelectorAll('video').length, 2);
    assert.equal(demo.querySelector('select'), null);
    visible(demo, true);
    const first = demo.querySelector('video[src$="standard-pov.webm"]');
    assert.equal(first.parentElement.hidden, false);
    assert.equal(first.paused, false);
    demo.querySelectorAll(':scope > .demo-header button')[1].click();
    assert.equal(first.paused, true);
    assert.equal(demo.querySelector('video[src$="clientview-pov.webm"]').paused, false);
  }
  const camera = demos[2].querySelector('select');
  camera.value = 'first-person';
  camera.dispatchEvent(new window.Event('change', { bubbles: true }));
  camera.value = 'third-person';
  camera.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.equal(demos[0].querySelector('video[src$="clientview-pov.webm"]').parentElement.hidden, false);
});

test('reduced motion prevents initial playback across client, camera, and single-view demonstrations', async t => {
  const { window, demos, visible } = await page(t, 'third-person', false, true);
  const clips = [...window.document.querySelectorAll('.adapt-demo, .gloss-demo')];
  for (const container of [...demos, ...clips]) visible(container, true);
  assert.ok([...window.document.querySelectorAll('video')].every(video => video.paused));
  demos[0].querySelectorAll(':scope > .demo-header button')[1].click();
  const camera = demos[0].querySelector('select');
  camera.value = 'first-person';
  camera.dispatchEvent(new window.Event('change', { bubbles: true }));
  clips[0].querySelectorAll('.demo-tab')[1].click();
  for (const container of [...demos, ...clips]) {
    visible(container, false);
    visible(container, true);
  }
  assert.ok([...window.document.querySelectorAll('video')].every(video => video.paused));
});

test('reduced motion allows intentional playback and preserves a manual pause', async t => {
  const { window, demos, visible } = await page(t, undefined, false, true);
  const containers = [demos[0], window.document.querySelector('.adapt-demo'), ...window.document.querySelectorAll('.gloss-demo')];
  for (const container of containers) {
    visible(container, true);
    const video = container.querySelector('video');
    assert.equal(video.paused, true);
    await video.play();
    assert.equal(video.paused, false);
    visible(container, false);
    assert.equal(video.paused, true);
    visible(container, true);
    assert.equal(video.paused, false);
    video.pause();
    visible(container, false);
    visible(container, true);
    assert.equal(video.paused, true);
    assert.ok([...container.querySelectorAll('video')].every(clip => clip.paused));
  }
});
