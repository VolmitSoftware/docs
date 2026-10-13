const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '../../theme/minimal-brutalism.js'), 'utf8');

async function boot(t, options = {}) {
  const dom = new JSDOM(`<div id="root"><div class="v-application">
    <header class="nav-header"><div class="v-toolbar__content"><div class="layout row">
      <div class="flex"><div class="nav-header-inner"><div class="v-toolbar__content"><span>Volmit</span></div></div></div>
      <div class="flex"><div class="v-text-field"><input aria-label="Search..."></div></div>
      <div class="flex"><div class="nav-header-inner"><div class="v-toolbar__content"><div class="spacer"></div><a href="/login">Log in</a></div></div></div>
    </div></div></header>
    <main class="v-main"><div class="v-main__wrap">
      <div class="page-header-section"><div class="page-header-headings"><div class="headline">Iris</div></div></div>
      <div class="contents"><p>World generation</p></div>
    </div></main>
  </div></div>`, { url: 'https://docs.test/iris', runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const { window } = dom;
  const { document } = window;
  const app = document.querySelector('.v-application');
  const configuredDark = options.darkMode ?? true;
  window.siteConfig = { darkMode: configuredDark };
  if (options.saved) {
    window.localStorage.setItem('volmit-color-mode', options.saved);
  }
  if (options.blockedStorage) {
    Object.defineProperty(window, 'localStorage', {
      get() { throw new window.DOMException('Storage is blocked', 'SecurityError'); }
    });
  }
  const commits = [];
  let nativeDark = configuredDark;
  let store = null;
  const theme = {
    get dark() { return nativeDark; },
    set dark(value) {
      nativeDark = value;
      const renderedDark = store?.state.site.dark ?? value;
      app.classList.toggle('theme--dark', renderedDark);
      app.classList.toggle('theme--light', !renderedDark);
    }
  };
  if (options.withStore !== false) {
    store = {
      state: { site: { dark: configuredDark } },
      commit(name, dark) {
        assert.equal(name, 'site/SET_DARK');
        commits.push(dark);
        this.state.site.dark = dark;
        theme.dark = dark;
      }
    };
  }
  app.__vue__ = { $vuetify: { theme }, ...(store ? { $store: store } : {}) };
  theme.dark = configuredDark;
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
  window.fetch = async () => ({ ok: true, json: async () => [{
    name: 'Iris', path: 'iris', href: '/iris', description: 'World generation', color: '#2dd4bf',
    sections: [{ title: 'Start here', groups: [{ title: '', links: [{ title: 'Installation', href: '/iris/installation' }] }] }]
  }] });
  async function settle() {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const deadline = Date.now() + 2000;
    while (Date.now() < deadline) {
      if (document.documentElement.classList.contains('volmit-ready') && frames.size === 0) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    assert.fail('Theme mode did not settle');
  }
  window.eval(source);
  const initialMode = document.documentElement.dataset.volmitTheme;
  await settle();
  return { window, document, app, theme, store, commits, initialMode, settle };
}

function assertMode(page, mode) {
  assert.equal(page.document.documentElement.dataset.volmitTheme, mode);
  assert.equal(page.app.classList.contains('theme--dark'), mode === 'dark');
  assert.equal(page.app.classList.contains('theme--light'), mode === 'light');
  assert.equal(page.theme.dark, mode === 'dark');
  if (page.store) {
    assert.equal(page.store.state.site.dark, mode === 'dark');
  }
  const button = page.document.querySelector('.volmit-theme-toggle');
  const next = mode === 'dark' ? 'light' : 'dark';
  assert.equal(button.tagName, 'BUTTON');
  assert.equal(button.type, 'button');
  assert.equal(button.getAttribute('aria-label'), 'Switch to ' + next + ' theme');
  assert.equal(button.title, 'Switch to ' + next + ' theme');
  assert.equal(button.querySelector('svg').dataset.lucide, mode === 'dark' ? 'sun' : 'moon');
}

for (const [name, options, expected] of [
  ['configured dark default', { darkMode: true }, 'dark'],
  ['configured light default', { darkMode: false }, 'light'],
  ['saved light preference', { darkMode: true, saved: 'light' }, 'light'],
  ['saved dark preference', { darkMode: false, saved: 'dark' }, 'dark'],
  ['invalid saved preference', { darkMode: false, saved: 'sepia' }, 'light']
]) {
  test('initial paint and native app honor the ' + name, async (t) => {
    const page = await boot(t, options);
    assert.equal(page.initialMode, expected);
    assertMode(page, expected);
    assert.equal(page.window.siteConfig.darkMode, expected === 'dark');
  });
}

test('the header toggle persists both modes without replacing either search', async (t) => {
  const page = await boot(t);
  const { document, window, settle } = page;
  const button = document.querySelector('.volmit-theme-toggle');
  const login = document.querySelector('a[href="/login"]');
  const siteSearch = document.querySelector('input[aria-label="Search..."]');
  const projectSearch = document.querySelector('input[aria-label="Search Iris"]');
  siteSearch.value = 'site query';
  projectSearch.value = 'project query';
  assert.equal(button.nextElementSibling, login);
  button.click();
  await settle();
  assertMode(page, 'light');
  assert.equal(window.localStorage.getItem('volmit-color-mode'), 'light');
  const reload = await boot(t, { saved: window.localStorage.getItem('volmit-color-mode') });
  assertMode(reload, 'light');
  button.click();
  await settle();
  assertMode(page, 'dark');
  assert.equal(window.localStorage.getItem('volmit-color-mode'), 'dark');
  assert.deepEqual(page.commits, [false, true]);
  assert.equal(document.querySelector('input[aria-label="Search..."]'), siteSearch);
  assert.equal(document.querySelector('input[aria-label="Search Iris"]'), projectSearch);
  assert.equal(siteSearch.value, 'site query');
  assert.equal(projectSearch.value, 'project query');
});

test('native theme changes update the toggle and survive later mounts', async (t) => {
  for (const withStore of [true, false]) {
    const page = await boot(t, { withStore });
    if (page.store) {
      page.store.commit('site/SET_DARK', false);
    } else {
      page.theme.dark = false;
    }
    await page.settle();
    assertMode(page, 'light');
    assert.equal(page.window.localStorage.getItem('volmit-color-mode'), 'light');
    page.window.dispatchEvent(new page.window.PopStateEvent('popstate'));
    await page.settle();
    assertMode(page, 'light');
    assert.deepEqual(page.commits, withStore ? [false] : []);
  }
});

test('header action replacement restores one working theme toggle', async (t) => {
  const page = await boot(t, { saved: 'light' });
  const { document, window, settle } = page;
  const actions = document.querySelector('.volmit-theme-toggle').parentElement;
  const login = document.querySelector('a[href="/login"]');
  for (let index = 0; index < 3; index += 1) {
    actions.replaceChildren(login);
    await settle();
    window.dispatchEvent(new window.PopStateEvent('popstate'));
    await settle();
    assert.equal(document.querySelectorAll('.volmit-theme-toggle').length, 1);
    assert.equal(document.querySelector('.volmit-theme-toggle').nextElementSibling, login);
    assertMode(page, 'light');
  }
  document.querySelector('.volmit-theme-toggle').click();
  await settle();
  assertMode(page, 'dark');
});

test('blocked browser storage still allows theme switching', async (t) => {
  const page = await boot(t, { blockedStorage: true });
  assertMode(page, 'dark');
  page.document.querySelector('.volmit-theme-toggle').click();
  await page.settle();
  assertMode(page, 'light');
  page.document.querySelector('.volmit-theme-toggle').click();
  await page.settle();
  assertMode(page, 'dark');
});
