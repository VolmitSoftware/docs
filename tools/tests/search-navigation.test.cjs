const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '../../theme/minimal-brutalism.js'), 'utf8');
const hits = [
  { title: 'Rivers', href: '/iris/36-rivers' },
  { title: 'River Policy', href: '/iris/36b-river-policy' },
  { title: 'River Inspection', href: '/iris/36c-river-inspection' }
];

function boot({ abortAware = false } = {}) {
  const dom = new JSDOM('<div class="v-application"><header class="nav-header"><div class="volmit-search-host"><div class="v-text-field"></div><section class="volmit-plugin-search" data-project="iris"><input aria-expanded="false"><div class="plugin-search-results" role="listbox" hidden></div></section></div></header></div>', {
    url: 'https://docs.test/iris/03-configuration', runScripts: 'outside-only'
  });
  const { window } = dom;
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  const timers = new Map();
  const signals = [];
  let timerId = 0;
  let resolveRemote;
  let rejectRemote;
  window.setTimeout = (callback, delay) => { timers.set(++timerId, { callback, delay }); return timerId; };
  window.clearTimeout = (id) => { timers.delete(id); };
  window.requestAnimationFrame = (callback) => { callback(); return 0; };
  window.eval(source.replace('  start();', '  window.bindSearchFieldForTest = bindSearchField; window.mountPluginSearchForTest = mountPluginSearch; window.fetchPageHitsForTest = fetchPageHits;'));
  const input = window.document.querySelector('input');
  const results = window.document.querySelector('[role="listbox"]');
  const remote = new Promise((resolve, reject) => { resolveRemote = resolve; rejectRemote = reject; });
  window.bindSearchFieldForTest(input.parentElement, input, results, () => hits, (_query, signal) => {
    signals.push(signal);
    if (abortAware) {
      signal.addEventListener('abort', () => rejectRemote(new window.DOMException('Request aborted', 'AbortError')), { once: true });
    }
    return remote;
  }, () => 'No matching pages');
  input.focus();
  input.value = 'river';
  input.dispatchEvent(new window.Event('input'));
  return {
    window, input, results,
    key: (key) => window.document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })),
    startRemote: () => {
      const [id, timer] = [...timers.entries()].find(([, timer]) => timer.delay === 160);
      timers.delete(id);
      return timer.callback();
    },
    expireRemote: () => {
      const [id, timer] = [...timers.entries()].find(([, timer]) => timer.delay === 5000);
      timers.delete(id);
      timer.callback();
    },
    signals, timers,
    resolveRemote,
    close: () => window.close()
  };
}

test('search results accept consecutive Down and Up keys and Escape returns to the input', () => {
  const session = boot();
  try {
    session.key('ArrowDown');
    assert.equal(session.window.document.activeElement.getAttribute('href'), hits[0].href);
    session.key('ArrowDown');
    assert.equal(session.window.document.activeElement.getAttribute('href'), hits[1].href);
    session.key('ArrowUp');
    assert.equal(session.window.document.activeElement.getAttribute('href'), hits[0].href);
    assert.equal(session.results.querySelectorAll('[aria-selected="true"]').length, 1);
    session.key('Escape');
    assert.equal(session.window.document.activeElement, session.input);
    assert.equal(session.results.hidden, true);
    assert.equal(session.input.getAttribute('aria-expanded'), 'false');
    let activated = false;
    session.results.addEventListener('click', (event) => { event.preventDefault(); activated = true; });
    session.key('Enter');
    assert.equal(activated, false);
    session.key('ArrowDown');
    assert.equal(session.window.document.activeElement, session.input);
    assert.equal(session.results.querySelectorAll('[aria-selected="true"]').length, 0);
  } finally {
    session.close();
  }
});

test('Up from the search input selects the last result', () => {
  const session = boot();
  try {
    session.key('ArrowUp');
    assert.equal(session.window.document.activeElement.getAttribute('href'), hits.at(-1).href);
  } finally {
    session.close();
  }
});

test('a delayed remote refresh preserves the focused result by its destination', async () => {
  const session = boot();
  try {
    session.key('ArrowDown');
    session.key('ArrowDown');
    const refresh = session.startRemote();
    const replaceChildren = session.results.replaceChildren.bind(session.results);
    session.results.replaceChildren = (...nodes) => {
      session.window.document.activeElement.dispatchEvent(new session.window.FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
      replaceChildren(...nodes);
    };
    session.resolveRemote([{ title: 'River banks', href: '/iris/river-banks' }]);
    await refresh;
    assert.equal(session.signals[0].aborted, false);
    assert.equal(session.results.querySelectorAll('a').length, 4);
    assert.equal(session.window.document.activeElement.getAttribute('href'), hits[1].href);
    assert.equal(session.window.document.activeElement.getAttribute('aria-selected'), 'true');
    session.key('ArrowDown');
    assert.equal(session.window.document.activeElement.getAttribute('href'), hits[2].href);
  } finally {
    session.close();
  }
});

test('a remote request completing after Escape leaves search results dismissed', async () => {
  const session = boot();
  try {
    const refresh = session.startRemote();
    session.key('ArrowDown');
    session.key('Escape');
    assert.equal(session.signals[0].aborted, true);
    session.resolveRemote([{ title: 'River banks', href: '/iris/river-banks' }]);
    await refresh;
    assert.equal(session.results.hidden, true);
    assert.equal(session.input.getAttribute('aria-expanded'), 'false');
    assert.equal(session.window.document.activeElement, session.input);
  } finally {
    session.close();
  }
});

test('a newer query aborts its predecessor and ignores its stale completion', async () => {
  const session = boot();
  try {
    const refresh = session.startRemote();
    session.input.value = 'bank';
    session.input.dispatchEvent(new session.window.Event('input'));
    assert.equal(session.signals[0].aborted, true);
    session.resolveRemote([{ title: 'Stale remote result', href: '/iris/stale' }]);
    await refresh;
    assert.equal(session.results.querySelector('a[href="/iris/stale"]'), null);
    assert.equal(session.input.value, 'bank');
    assert.equal(session.results.hidden, false);
  } finally {
    session.close();
  }
});

test('moving focus between the field and results keeps requests active until focus leaves', async () => {
  const session = boot();
  try {
    const refresh = session.startRemote();
    session.key('ArrowDown');
    assert.equal(session.signals[0].aborted, false);
    session.input.focus();
    assert.equal(session.signals[0].aborted, false);
    const outside = session.window.document.createElement('button');
    session.window.document.body.append(outside);
    outside.focus();
    assert.equal(session.signals[0].aborted, true);
    assert.equal(session.results.hidden, true);
    session.resolveRemote([{ title: 'Late remote result', href: '/iris/late' }]);
    await refresh;
    assert.equal(session.results.hidden, true);
    assert.equal(session.window.document.activeElement, outside);
  } finally {
    session.close();
  }
});

test('switching the project cancels old results without reopening the cleared field', async () => {
  const session = boot();
  try {
    const refresh = session.startRemote();
    session.window.mountPluginSearchForTest(session.window.document.querySelector('.v-application'), { path: 'gloss', name: 'Gloss' });
    assert.equal(session.signals[0].aborted, true);
    assert.equal(session.input.value, '');
    assert.equal(session.input.getAttribute('aria-label'), 'Search Gloss');
    session.resolveRemote([{ title: 'Old Iris result', href: '/iris/late' }]);
    await refresh;
    assert.equal(session.results.hidden, true);
    assert.equal(session.results.children.length, 0);
    assert.equal(session.input.getAttribute('aria-expanded'), 'false');
  } finally {
    session.close();
  }
});

test('a bounded remote timeout aborts transport and keeps the local results usable', async () => {
  const session = boot({ abortAware: true });
  try {
    const refresh = session.startRemote();
    session.expireRemote();
    await refresh;
    assert.equal(session.signals[0].aborted, true);
    assert.equal(session.results.hidden, false);
    assert.equal(session.results.querySelectorAll('a').length, hits.length);
    assert.equal(session.timers.size, 0);
    session.key('ArrowDown');
    assert.equal(session.window.document.activeElement.getAttribute('href'), hits[0].href);
  } finally {
    session.close();
  }
});

test('the remote search transport forwards its cancellation signal', async () => {
  const session = boot();
  try {
    let captured;
    session.window.fetch = async (_url, options) => {
      captured = options.signal;
      return { ok: true, json: async () => ({ data: { pages: { search: { results: [] } } } }) };
    };
    const controller = new session.window.AbortController();
    await session.window.fetchPageHitsForTest('river', controller.signal);
    assert.equal(captured, controller.signal);
  } finally {
    session.close();
  }
});
