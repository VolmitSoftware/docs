(() => {
  if (window.volmitGraphite) {
    return;
  }
  window.volmitGraphite = true;
  const scriptUrl = new URL(document.currentScript?.src || '/theme/minimal-brutalism.js', window.location.href);
  const catalogUrl = new URL('/theme/projects.json', scriptUrl.origin);
  catalogUrl.search = scriptUrl.search;
  const reservedPaths = new Set(['a', 'login', 'logout', 'register', 'forgot', 'verify']);
  let catalog = [];
  let catalogSettled = false;
  let loadingTimeout = null;
  let contentNode = null;
  let mountedPath = null;
  let scheduled = false;
  let pageObserver = null;
  let pageWatching = false;
  let pluginSearchGeneration = 0;
  let stopLostField = null;
  let dialog = null;
  let opener = null;
  const demoPlayers = new Map();
  const wormholePlayers = new Map();
  const pausedDemos = new WeakSet();
  let demoSequence = 0;
  let demoPerspective = savedDemoPerspective();
  const demoObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const player = demoPlayers.get(entry.target);
      if (player) {
        player.visible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
        updateDemoPlayback(player);
      }
      const wormhole = wormholePlayers.get(entry.target);
      if (wormhole) {
        wormhole.visible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
        updateWormholePlayback(wormhole);
      }
    }
  }, { threshold: [0, 0.1] });


  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined) {
      node.textContent = text;
    }
    return node;
  }

  function link(title, href, className) {
    const anchor = element('a', className, title);
    anchor.href = href;
    return anchor;
  }

  function normalizedPath() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts[0] && /^[a-z]{2}(?:-[a-z]{2})?$/i.test(parts[0])) {
      parts.shift();
    }
    return parts.join('/');
  }

  function projectIcon(project, className) {
    const icon = element('span', className);
    icon.setAttribute('aria-hidden', 'true');
    if (project.icon) {
      const image = element('img');
      image.src = project.icon;
      image.alt = '';
      image.width = 32;
      image.height = 32;
      icon.append(image);
    } else {
      icon.classList.add('directory-mark');
      icon.textContent = project.mark || project.name.charAt(0);
    }
    return icon;
  }

  function mountHeader(app) {
    const searchButton = app.querySelector('.nav-header .mdi-magnify')?.closest('button');
    searchButton?.setAttribute('aria-label', 'Search documentation');
    const lockup = document.querySelector('.nav-header-inner .v-toolbar__content');
    if (lockup && !lockup.classList.contains('volmit-home-link')) {
      lockup.classList.add('volmit-home-link');
      lockup.setAttribute('role', 'link');
      lockup.setAttribute('tabindex', '0');
      lockup.setAttribute('aria-label', 'Volmit Software documentation home');
      lockup.addEventListener('click', () => window.location.assign('/'));
      lockup.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          window.location.assign('/');
        }
      });
    }
  }

  function currentProject() {
    return catalog.find((project) => normalizedPath().split('/')[0] === project.path);
  }

  function validColor(value) {
    return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) ? value : '';
  }

  function pageCount(project) {
    return project.sections.reduce((total, section) => total + section.links.length, 0);
  }

  function applyProjectChrome(project) {
    const root = document.documentElement;
    const color = validColor(project?.color);
    if (project && color) {
      root.style.setProperty('--volmit-project', color);
      root.dataset.project = project.path;
      return;
    }
    root.style.removeProperty('--volmit-project');
    delete root.dataset.project;
  }

  function paintProjectColor(node, project) {
    const color = validColor(project.color);
    if (color) {
      node.style.setProperty('--volmit-project', color);
    }
  }

  function projectCard(project, featuredCard) {
    const card = link('', project.href, featuredCard ? 'featured-card' : 'directory-card');
    paintProjectColor(card, project);
    const copy = element('div', 'directory-card-copy');
    const count = pageCount(project);
    copy.append(element('h3', null, project.name), element('p', null, project.description));
    if (featuredCard) {
      copy.append(element('small', null, count + (count === 1 ? ' page' : ' pages')));
    }
    card.append(projectIcon(project, 'directory-icon'), copy);
    if (!featuredCard && project.group === 'Developer tools') {
      card.append(element('span', 'directory-type', 'Tool'));
    }
    return card;
  }

  function articleRoot(content) {
    const children = [...content.children].filter((node) => !node.classList.contains('landing-group'));
    if (children.length === 1 && children[0].tagName === 'DIV') {
      return children[0];
    }
    return content;
  }

  function mountLandingGroups(content) {
    if (content.querySelector(':scope > .landing-group')) {
      return;
    }
    let group = null;
    for (const node of Array.from(content.childNodes)) {
      if (node.nodeType === 1 && node.tagName === 'H2') {
        group = element('section', 'landing-group');
        node.before(group);
        group.append(node);
      } else if (group) {
        group.append(node);
      }
    }
  }

  function mountSpecStrip(content) {
    const table = Array.from(content.querySelectorAll('table')).find((node) => !node.closest('.landing-group'));
    if (!table) {
      return;
    }
    table.classList.add('spec-strip');
    const headers = [...table.querySelectorAll('thead th')].map((cell) => cell.textContent.trim());
    if (headers.length > 0 && headers.every((text) => text === '')) {
      table.classList.add('spec-strip-plain');
    }
  }

  function hideGeneratedCaption(main, project) {
    const caption = main.querySelector('.page-header-headings .caption');
    const title = main.querySelector('.page-header-headings .headline')?.textContent.replace(/\s+/g, ' ').trim();
    if (!caption || !title) {
      return;
    }
    const text = caption.textContent.replace(/\s+/g, ' ').trim();
    caption.hidden = text.toLowerCase() === (project.name + ' documentation: ' + title).toLowerCase();
  }

  let stopTocWatch = null;
  let stopTocAlign = null;

  function alignReferenceToc(main) {
    stopTocAlign?.();
    stopTocAlign = null;
    const toc = main.querySelector('.page-col-sd');
    const title = main.querySelector('.page-header-headings .headline');
    if (!main.classList.contains('volmit-reference-page') || !toc || !title) {
      toc?.style.removeProperty('margin-top');
      return;
    }
    const header = title.closest('.page-header-section') || title;
    const row = toc.parentElement;
    const apply = () => {
      if (!toc.isConnected || !row || toc.offsetParent === null) {
        toc.style.removeProperty('margin-top');
        return;
      }
      const next = Math.round(title.getBoundingClientRect().top - row.getBoundingClientRect().top);
      const applied = Number.parseFloat(toc.style.marginTop) || 0;
      if (Math.abs(next - applied) > 1) {
        toc.style.marginTop = next + 'px';
      }
    };
    apply();
    const cleanups = [];
    if (typeof window.ResizeObserver === 'function') {
      const observer = new window.ResizeObserver(apply);
      observer.observe(header);
      if (title !== header) {
        observer.observe(title);
      }
      cleanups.push(() => observer.disconnect());
    }
    window.addEventListener('resize', apply);
    cleanups.push(() => window.removeEventListener('resize', apply));
    stopTocAlign = () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  }

  function headingLabel(node) {
    if (!node) {
      return '';
    }
    const copy = node.cloneNode(true);
    for (const anchor of copy.querySelectorAll('.toc-anchor, .header-anchor')) {
      anchor.remove();
    }
    return copy.textContent.replace(/¶/g, '').replace(/\s+/g, ' ').trim();
  }

  function mountPageToc(app, main, content) {
    const header = main.querySelector('.page-header-section');
    if (!header) {
      stopTocWatch?.();
      stopTocWatch = null;
      main.querySelector('.page-toc-toggle')?.remove();
      main.querySelector('.volmit-page-toc')?.remove();
      return;
    }
    const headings = [...content.querySelectorAll('h2[id], h3[id]')].filter((heading) => !heading.closest('.volmit-headliner'));
    const signature = headings.map((heading) => heading.tagName + '\n' + heading.id + '\n' + headingLabel(heading)).join('\n');
    if (main.querySelector('.volmit-page-toc')?.dataset.signature === signature && header.querySelector('.page-toc-toggle')) {
      return;
    }
    stopTocWatch?.();
    stopTocWatch = null;
    let panel = main.querySelector('.volmit-page-toc');
    if (!panel) {
      panel = element('nav', 'volmit-page-toc');
      panel.id = 'volmit-page-toc';
      panel.setAttribute('aria-label', 'On this page');
      main.append(panel);
    }
    panel.dataset.signature = signature;
    panel.replaceChildren();
    let button = header.querySelector('.page-toc-toggle');
    if (!button) {
      button = element('button', 'page-toc-toggle', 'On this page');
      button.type = 'button';
      button.setAttribute('aria-controls', panel.id);
      button.addEventListener('click', () => {
        const open = app.classList.toggle('show-page-toc');
        button.setAttribute('aria-expanded', String(open));
      });
      const mobile = header.querySelector('.mobile-section-toggle');
      if (mobile) {
        mobile.after(button);
      } else {
        header.prepend(button);
      }
    }
    button.setAttribute('aria-expanded', String(app.classList.contains('show-page-toc')));
    button.hidden = headings.length === 0;
    for (const heading of headings) {
      const item = link(headingLabel(heading), '#' + heading.id, heading.tagName === 'H3' ? 'is-sub' : '');
      item.addEventListener('click', () => {
        app.classList.remove('show-page-toc');
        button.setAttribute('aria-expanded', 'false');
      });
      panel.append(item);
    }
    const toc = main.querySelector('.page-toc-card');
    const items = toc ? [...toc.querySelectorAll('.v-list-item')] : [];
    function mark() {
      const marker = 140;
      let current = headings[0] ?? null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= marker) {
          current = heading;
        }
      }
      const currentLabel = headingLabel(current);
      for (const item of [...items, ...panel.querySelectorAll('a')]) {
        const title = item.matches('a') ? headingLabel(item) : headingLabel(item.querySelector('.v-list-item__title'));
        const on = currentLabel !== '' && title === currentLabel;
        item.classList.toggle('is-current', on);
        if (on) {
          item.setAttribute('aria-current', 'location');
        } else {
          item.removeAttribute('aria-current');
        }
      }
    }
    const scroller = main;
    scroller.addEventListener('scroll', mark, { passive: true });
    document.addEventListener('scroll', mark, { passive: true });
    stopTocWatch = () => {
      scroller.removeEventListener('scroll', mark);
      document.removeEventListener('scroll', mark);
    };
    mark();
  }

  function localPluginHits(project, query) {
    const needle = query.toLowerCase();
    const hits = [];
    if (project.name.toLowerCase().includes(needle)) {
      hits.push({ title: project.name, href: project.href, description: 'Overview' });
    }
    for (const section of project.sections) {
      for (const page of section.links) {
        if (page.title.toLowerCase().includes(needle)) {
          hits.push({ title: page.title, href: page.href, description: section.title });
        }
      }
    }
    return hits;
  }

  async function fetchPageHits(query) {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        query: 'query ($query: String!) { pages { search(query: $query) { results { title path description } } } }',
        variables: { query }
      })
    });
    if (!response.ok) {
      throw new Error('Plugin search failed');
    }
    const payload = await response.json();
    return (payload?.data?.pages?.search?.results ?? [])
      .filter((hit) => hit && hit.path)
      .map((hit) => ({
        title: hit.title,
        href: '/' + String(hit.path).replace(/^\/+/, ''),
        description: hit.description || ''
      }));
  }

  async function remotePluginHits(project, query) {
    const prefix = project.path + '/';
    return (await fetchPageHits(query)).filter((hit) => {
      const path = hit.href.replace(/^\/+/, '');
      return path === project.path || path.startsWith(prefix);
    });
  }

  function localSiteHits(query) {
    return catalog.flatMap((project) => localPluginHits(project, query).map((hit) => ({
      ...hit,
      description: hit.description ? project.name + ' · ' + hit.description : project.name
    })));
  }

  function mergeHits(local, remote) {
    const seen = new Set();
    const hits = [];
    for (const hit of [...local, ...remote]) {
      if (!hit?.href || seen.has(hit.href)) {
        continue;
      }
      seen.add(hit.href);
      hits.push(hit);
    }
    return hits;
  }

  function bindSearchField(scope, input, results, localHits, remoteHits, emptyText) {
    if (input.dataset.volmitBound === 'true') {
      return;
    }
    input.dataset.volmitBound = 'true';
    let requestId = 0;
    let timer = 0;
    let active = -1;
    function paint(hits, query) {
      results.replaceChildren();
      active = -1;
      if (query.trim().length < 2) {
        results.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        return;
      }
      results.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      if (!hits.length) {
        results.append(element('p', 'plugin-search-empty', emptyText()));
        return;
      }
      for (const hit of hits.slice(0, 8)) {
        const option = element('a', 'plugin-search-hit');
        option.href = hit.href;
        option.setAttribute('role', 'option');
        option.append(element('strong', null, hit.title));
        if (hit.description) {
          option.append(element('small', null, hit.description));
        }
        results.append(option);
      }
    }
    function schedule() {
      const query = input.value.trim();
      const id = ++requestId;
      window.clearTimeout(timer);
      if (query.length < 2) {
        paint([], query);
        return;
      }
      const local = localHits(query);
      paint(local, query);
      timer = window.setTimeout(async () => {
        try {
          const remote = await remoteHits(query);
          if (id === requestId) {
            paint(mergeHits(local, remote), query);
          }
        } catch {
          if (id === requestId) {
            paint(local, query);
          }
        }
      }, 160);
    }
    input.addEventListener('input', schedule);
    scope.addEventListener('keydown', (event) => {
      const options = [...results.querySelectorAll('.plugin-search-hit')];
      if (event.key === 'Escape') {
        results.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        input.focus();
        return;
      }
      if (!options.length || event.target !== input) {
        return;
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        active = event.key === 'ArrowDown' ? (active + 1) % options.length : (active - 1 + options.length) % options.length;
        for (const [index, option] of options.entries()) {
          option.classList.toggle('is-active', index === active);
        }
        options[active].focus();
      } else if (event.key === 'Enter' && active >= 0) {
        event.preventDefault();
        options[active].click();
      }
    });
  }

  function searchProject(search, fallback) {
    return catalog.find((item) => item.path === search.dataset.project) || fallback;
  }

  function labelPluginSearch(input, project) {
    const label = 'Search ' + project.name;
    input.placeholder = label;
    input.setAttribute('aria-label', label);
  }

  function unwrapPluginSearch(field) {
    const host = field?.parentElement;
    if (!host?.classList.contains('volmit-search-host')) {
      return;
    }
    host.classList.remove('is-split');
    host.replaceWith(field);
  }

  function ensureSearchHost(field) {
    const parent = field.parentElement;
    if (parent?.classList.contains('volmit-search-host')) {
      return parent;
    }
    const host = element('div', 'volmit-search-host');
    field.replaceWith(host);
    host.append(field);
    return host;
  }

  function mountPluginSearch(app, project) {
    const field = app.querySelector('.nav-header .v-text-field');
    if (!field || !project) {
      pluginSearchGeneration += 1;
      app.querySelector('.volmit-plugin-search')?.remove();
      unwrapPluginSearch(field);
      app.classList.remove('has-plugin-search');
      return;
    }
    pluginSearchGeneration += 1;
    const generation = pluginSearchGeneration;
    const host = ensureSearchHost(field);
    const existing = host.querySelector('.volmit-plugin-search');
    if (existing) {
      if (existing.dataset.project !== project.path) {
        existing.dataset.project = project.path;
        const current = existing.querySelector('input');
        labelPluginSearch(current, project);
        current.value = '';
        const list = existing.querySelector('.plugin-search-results');
        list.replaceChildren();
        list.hidden = true;
        current.setAttribute('aria-expanded', 'false');
      }
      host.classList.add('volmit-search-host');
      app.classList.add('has-plugin-search');
      window.requestAnimationFrame(() => {
        if (generation === pluginSearchGeneration) {
          host.classList.add('is-split');
        }
      });
      return;
    }
    const search = element('div', 'volmit-plugin-search');
    search.dataset.project = project.path;
    const input = element('input');
    input.type = 'search';
    labelPluginSearch(input, project);
    input.autocomplete = 'off';
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    const results = element('div', 'plugin-search-results');
    results.id = 'volmit-plugin-results-' + project.path;
    results.setAttribute('role', 'listbox');
    results.hidden = true;
    input.setAttribute('aria-controls', results.id);
    const label = element('label', 'volmit-plugin-field');
    label.append(input);
    search.append(label, results);
    field.after(search);
    host.classList.add('volmit-search-host');
    app.classList.add('has-plugin-search');
    window.requestAnimationFrame(() => {
      if (generation === pluginSearchGeneration) {
        host.classList.add('is-split');
      }
    });
    bindSearchField(
      search,
      input,
      results,
      (query) => localPluginHits(searchProject(search, project), query),
      (query) => remotePluginHits(searchProject(search, project), query),
      () => 'No pages in ' + searchProject(search, project).name
    );
  }

  function mountSiteSearch(app) {
    const input = app.querySelector('.nav-header .v-text-field input');
    const field = input?.closest('.v-text-field');
    if (!input || !field) {
      return;
    }
    let results = field.querySelector(':scope > .plugin-search-results');
    if (!results) {
      results = element('div', 'plugin-search-results');
      results.id = 'volmit-site-results';
      results.setAttribute('role', 'listbox');
      results.hidden = true;
      input.setAttribute('aria-controls', results.id);
      field.append(results);
    }
    bindSearchField(field, input, results, localSiteHits, fetchPageHits, () => 'No matching pages');
  }

  function buildProjectDialog(app) {
    if (dialog?.isConnected) {
      return;
    }
    dialog = element('dialog', 'project-dialog');
    dialog.setAttribute('aria-labelledby', 'volmit-project-dialog-title');
    const heading = element('div', 'picker-heading');
    const copy = element('div');
    const title = element('h2', null, 'Switch project');
    title.id = 'volmit-project-dialog-title';
    copy.append(title, element('p', null, 'Choose a project to open its documentation.'));
    const close = element('button', 'picker-close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close project picker');
    close.addEventListener('click', () => dialog.close());
    heading.append(copy, close);
    const label = element('label', 'picker-search');
    const input = element('input');
    input.type = 'search';
    input.placeholder = 'Find a project…';
    input.autocomplete = 'off';
    label.append(element('span', 'sr-only', 'Find a project'), input);
    const meta = element('div', 'picker-meta');
    const count = element('span', 'project-count');
    count.setAttribute('role', 'status');
    meta.append(element('span', null, 'Projects'), count);
    const results = element('nav', 'picker-results');
    results.setAttribute('aria-label', 'Projects');
    const empty = element('p', 'picker-empty', 'No projects match your search. Try another name.');
    const footer = element('div', 'picker-footer');
    footer.append(link('All projects', '/'), element('span', null, 'Arrow keys to browse · Enter to open'));
    dialog.append(heading, label, meta, results, empty, footer);
    app.append(dialog);

    function render() {
      const query = input.value.trim().toLowerCase();
      const matches = catalog.filter((project) => (project.name + ' ' + project.description).toLowerCase().includes(query));
      results.replaceChildren();
      count.textContent = matches.length + (matches.length === 1 ? ' project' : ' projects');
      empty.hidden = matches.length > 0;
      const active = currentProject();
      for (const project of matches) {
        const anchor = link('', project.href, 'picker-project');
        paintProjectColor(anchor, project);
        const body = element('span');
        body.append(element('strong', null, project.name), element('small', null, project.description));
        anchor.append(projectIcon(project, 'picker-icon'), body);
        if (project.path === active?.path) {
          anchor.setAttribute('aria-current', 'page');
          anchor.append(element('span', 'current-project', 'Current'));
        }
        results.append(anchor);
      }
    }
    input.addEventListener('input', render);
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        dialog.close();
        return;
      }
      const entries = Array.from(results.querySelectorAll('a'));
      if (!entries.length) {
        return;
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const focused = entries.indexOf(document.activeElement);
        const index = event.key === 'ArrowDown' ? (focused + 1) % entries.length : focused < 0 ? entries.length - 1 : (focused - 1 + entries.length) % entries.length;
        entries[index].focus();
        entries[index].scrollIntoView({ block: 'nearest' });
      } else if (event.key === 'Enter' && event.target === input) {
        event.preventDefault();
        entries[0].click();
      }
    });
    dialog.addEventListener('click', (event) => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
        dialog.close();
      }
    });
    dialog.addEventListener('close', () => {
      opener?.setAttribute('aria-expanded', 'false');
    });
    dialog.addEventListener('volmit-open', () => {
      input.value = '';
      render();
      dialog.showModal();
      input.focus();
    });
  }

  function projectButton(project) {
    const button = element('button', 'project-switch');
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Switch project, current project ' + project.name);
    const copy = element('span', 'project-switch-copy');
    copy.append(element('strong', null, project.name), element('small', null, 'Project documentation'));
    const chevron = element('span', 'switch-chevron', '⌄');
    chevron.setAttribute('aria-hidden', 'true');
    button.append(projectIcon(project, 'project-switch-icon'), copy, chevron);
    button.addEventListener('click', () => {
      opener = button;
      button.setAttribute('aria-expanded', 'true');
      dialog.dispatchEvent(new Event('volmit-open'));
    });
    return button;
  }

  function closeSectionMenu(app, restoreFocus) {
    app.classList.remove('show-section-menu');
    const menu = app.querySelector('#volmit-page-navigation');
    menu?.removeAttribute('aria-modal');
    menu?.removeAttribute('role');
    const toggle = app.querySelector('.mobile-section-toggle');
    toggle?.setAttribute('aria-expanded', 'false');
    if (restoreFocus) {
      toggle?.focus();
    }
  }

  function mobileControls(app, main, menu) {
    const toggle = element('button', 'mobile-section-toggle', 'Page navigation');
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'volmit-page-navigation');
    menu.id = 'volmit-page-navigation';
    toggle.addEventListener('click', () => {
      const expanded = app.classList.toggle('show-section-menu');
      toggle.setAttribute('aria-expanded', String(expanded));
      if (expanded) {
        menu.setAttribute('role', 'dialog');
        menu.setAttribute('aria-modal', 'true');
        menu.querySelector('.mobile-nav-close')?.focus();
        const active = menu.querySelector('[aria-current="page"]');
        const scroller = menu.closest('.volmit-section-sidebar') || menu;
        if (active) {
          scroller.scrollTop = Math.max(0, active.offsetTop - scroller.clientHeight / 2);
        }
      } else {
        menu.removeAttribute('aria-modal');
        menu.removeAttribute('role');
      }
    });
    const close = element('button', 'mobile-nav-close', 'Close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close page navigation');
    close.addEventListener('click', () => closeSectionMenu(app, true));
    menu.prepend(close);
    const backdrop = element('button', 'section-menu-backdrop');
    backdrop.type = 'button';
    backdrop.tabIndex = -1;
    backdrop.setAttribute('aria-label', 'Close page navigation');
    backdrop.addEventListener('click', () => closeSectionMenu(app, true));
    main.append(backdrop);
    const header = main.querySelector('.page-header-section');
    header?.prepend(toggle);
  }

  const sidebarWidthKey = 'volmit-sidebar-width';
  const sidebarWidthMin = 240;
  const sidebarWidthMax = 480;

  function sidebarWidthLimit() {
    if (window.innerWidth < 960) {
      return sidebarWidthMax;
    }
    return Math.min(sidebarWidthMax, Math.max(sidebarWidthMin, window.innerWidth - 640));
  }

  function applySidebarWidth(app, width, remember) {
    const next = Math.round(Math.min(sidebarWidthLimit(), Math.max(sidebarWidthMin, width)));
    app.style.setProperty('--volmit-sidebar-width', next + 'px');
    const handle = app.querySelector('.sidebar-resize');
    if (handle) {
      handle.setAttribute('aria-valuenow', String(next));
    }
    if (remember) {
      try {
        window.localStorage.setItem(sidebarWidthKey, String(next));
      } catch {
        // Private browsing can reject storage. The width still applies for this page.
      }
    }
    return next;
  }

  function mountSidebarResize(app, sidebar) {
    const handle = element('button', 'sidebar-resize');
    handle.type = 'button';
    handle.setAttribute('aria-label', 'Resize documentation sidebar');
    handle.setAttribute('role', 'separator');
    handle.setAttribute('aria-orientation', 'vertical');
    handle.setAttribute('aria-valuemin', String(sidebarWidthMin));
    handle.setAttribute('aria-valuemax', String(sidebarWidthMax));
    let stored = 320;
    try {
      const raw = window.localStorage.getItem(sidebarWidthKey);
      const value = Number(raw);
      if (raw !== null && Number.isFinite(value) && value > 0) {
        stored = value;
      }
    } catch {
      stored = 320;
    }
    handle.setAttribute('aria-valuenow', String(applySidebarWidth(app, stored, false)));
    handle.addEventListener('keydown', (event) => {
      const current = Number.parseInt(app.style.getPropertyValue('--volmit-sidebar-width'), 10);
      if (event.key === 'ArrowRight') {
        applySidebarWidth(app, current + 16, true);
      } else if (event.key === 'ArrowLeft') {
        applySidebarWidth(app, current - 16, true);
      } else if (event.key === 'Home') {
        applySidebarWidth(app, sidebarWidthMin, true);
      } else if (event.key === 'End') {
        applySidebarWidth(app, sidebarWidthLimit(), true);
      } else {
        return;
      }
      event.preventDefault();
    });
    handle.addEventListener('pointerdown', (event) => {
      if (window.innerWidth < 960) {
        return;
      }
      event.preventDefault();
      handle.setPointerCapture?.(event.pointerId);
      const startX = event.clientX;
      const startWidth = sidebar.getBoundingClientRect().width;
      const move = (moveEvent) => {
        applySidebarWidth(app, startWidth + moveEvent.clientX - startX, true);
      };
      const stop = () => {
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', stop);
        handle.removeEventListener('pointercancel', stop);
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', stop);
      handle.addEventListener('pointercancel', stop);
    });
    sidebar.append(handle);
  }

  function mountProjectNavigation(app, main, content, project, path) {
    const overview = path === project.path;
    main.classList.add(overview ? 'volmit-project-overview' : 'volmit-reference-page');
    if (overview) {
      const bar = element('aside', 'volmit-project-bar');
      bar.setAttribute('aria-label', project.name + ' navigation');
      bar.append(projectButton(project));
      const nav = element('nav', 'project-tabs');
      nav.setAttribute('aria-label', project.name + ' page sections');
      const home = link('Overview', project.href);
      home.setAttribute('aria-current', 'page');
      nav.append(home);
      for (const heading of Array.from(articleRoot(content).querySelectorAll(':scope > h2[id]'))) {
        const copy = heading.cloneNode(true);
        copy.querySelector('.toc-anchor')?.remove();
        const anchor = link(copy.textContent.trim(), '#' + heading.id);
        anchor.addEventListener('click', () => closeSectionMenu(app, false));
        nav.append(anchor);
      }
      bar.append(nav, link('All projects', '/', 'all-projects'));
      main.prepend(bar);
      mobileControls(app, main, nav);
      return;
    }
    const sidebar = element('aside', 'volmit-section-sidebar');
    sidebar.setAttribute('aria-label', project.name + ' documentation');
    const nav = element('nav', 'reference-nav');
    nav.setAttribute('aria-label', project.name + ' documentation');
    nav.append(link('All projects', '/', 'parent'), projectButton(project));
    const current = '/' + path;
    let anyOpen = false;
    for (const section of project.sections) {
      const open = section.links.some((page) => page.href === current) || (path === project.path && section.title === 'Start here');
      anyOpen = anyOpen || open;
      const block = element('div', 'reference-section');
      const toggle = element('button', 'reference-section-toggle', section.title);
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', String(open));
      const links = element('div', 'reference-section-links');
      links.hidden = !open;
      for (const page of section.links) {
        const anchor = link(page.title, page.href);
        if (page.href === current) {
          anchor.classList.add('active');
          anchor.setAttribute('aria-current', 'page');
        }
        links.append(anchor);
      }
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(expanded));
        links.hidden = !expanded;
      });
      block.append(toggle, links);
      nav.append(block);
    }
    if (!anyOpen) {
      const toggle = nav.querySelector('.reference-section-toggle');
      const links = nav.querySelector('.reference-section-links');
      if (toggle && links) {
        toggle.setAttribute('aria-expanded', 'true');
        links.hidden = false;
      }
    }
    const footer = element('div', 'sidebar-footer');
    footer.append(link('Community support', 'https://volmitsoftware.com/discord'), link('Source on GitHub', 'https://github.com/VolmitSoftware'));
    nav.append(footer);
    sidebar.append(nav);
    mountSidebarResize(app, sidebar);
    main.prepend(sidebar);
    mobileControls(app, main, nav);
    window.requestAnimationFrame(() => {
      const active = nav.querySelector('[aria-current="page"]');
      if (active && window.innerWidth >= 960) {
        sidebar.scrollTop = Math.max(0, active.offsetTop - sidebar.clientHeight / 2);
      }
    });
  }

  function mountDirectory(main) {
    const home = element('section', 'home-directory');
    home.setAttribute('aria-labelledby', 'directory-title');
    const intro = element('header', 'directory-intro');
    const heading = element('div');
    const title = element('h1', null, 'Documentation');
    title.id = 'directory-title';
    heading.append(element('p', 'directory-eyebrow', 'Volmit Software'), title, element('p', 'directory-description', 'Installation, configuration, commands, and APIs for every Volmit project.'));
    intro.append(heading, link('Community support', 'https://volmitsoftware.com/discord', 'community-link'));
    const browser = element('section', 'project-browser');
    browser.setAttribute('aria-labelledby', 'projects-title');
    const tools = element('div', 'directory-tools');
    const toolHeading = element('div');
    const toolTitle = element('h2', null, 'All projects');
    toolTitle.id = 'projects-title';
    toolHeading.append(toolTitle, element('p', null, 'Choose a project to open its documentation.'));
    const label = element('label', 'directory-search');
    const searchIcon = element('i', 'v-icon notranslate mdi mdi-magnify');
    searchIcon.setAttribute('aria-hidden', 'true');
    const input = element('input');
    input.type = 'search';
    input.placeholder = 'Filter by name';
    input.autocomplete = 'off';
    label.append(searchIcon, element('span', 'sr-only', 'Filter by name'), input);
    tools.append(toolHeading, label);
    const filterRow = element('div', 'directory-filter-row');
    const filters = element('div', 'directory-filters');
    filters.setAttribute('role', 'group');
    filters.setAttribute('aria-label', 'Filter projects');
    const count = element('p', 'directory-result-count');
    count.setAttribute('role', 'status');
    count.setAttribute('aria-live', 'polite');
    const featured = element('div', 'featured-grid');
    const grid = element('div', 'directory-grid');
    const empty = element('div', 'directory-empty');
    const clear = element('button', null, 'Clear search and filters');
    clear.type = 'button';
    empty.append(element('h3', null, 'No matching projects'), element('p', null, 'Try a different name or search term.'), clear);
    let category = 'All projects';
    const buttons = [];
    for (const group of ['All projects', ...new Set(catalog.map((project) => project.group))]) {
      const button = element('button', null, group + ' ');
      button.type = 'button';
      button.dataset.group = group;
      button.append(element('span', null, String(catalog.filter((project) => group === 'All projects' || project.group === group).length)));
      button.addEventListener('click', () => {
        category = group;
        render();
      });
      buttons.push(button);
      filters.append(button);
    }
    function render() {
      const query = input.value.trim().toLowerCase();
      const matches = catalog.filter((project) => (category === 'All projects' || project.group === category) && (project.name + ' ' + project.description).toLowerCase().includes(query));
      const showFeatured = category === 'All projects' && query === '';
      featured.replaceChildren();
      featured.hidden = !showFeatured;
      if (showFeatured) {
        const order = ['iris', 'adapt', 'wormholes', 'gloss', 'react'];
        const picks = catalog.filter((project) => project.featured).sort((left, right) => {
          const leftIndex = order.indexOf(left.path);
          const rightIndex = order.indexOf(right.path);
          return (leftIndex < 0 ? order.length : leftIndex) - (rightIndex < 0 ? order.length : rightIndex);
        });
        for (const project of picks) {
          featured.append(projectCard(project, true));
        }
      }
      grid.replaceChildren();
      const listed = showFeatured ? matches.filter((project) => !project.featured) : matches;
      for (const project of listed) {
        grid.append(projectCard(project, false));
      }
      for (const button of buttons) {
        button.setAttribute('aria-pressed', String(button.dataset.group === category));
      }
      empty.hidden = matches.length > 0;
      count.textContent = matches.length + ' of ' + catalog.length + ' projects';
    }
    input.addEventListener('input', render);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        input.value = '';
        render();
      }
    });
    clear.addEventListener('click', () => {
      input.value = '';
      category = 'All projects';
      render();
      input.focus();
    });
    filterRow.append(filters, count);
    browser.append(tools, filterRow, featured, grid, empty);
    const footer = element('footer', 'directory-footer');
    const languages = link('', '/languages');
    languages.append(element('strong', null, 'Languages & translations'), element('span', null, 'Messages and language settings shared across the plugins.'));
    const resources = element('div');
    resources.append(link('Source on GitHub', 'https://github.com/VolmitSoftware'), link('Contribute to the docs', '/contributing'));
    footer.append(languages, resources);
    home.append(intro, browser, footer);
    main.querySelector('.v-main__wrap').append(home);
    main.classList.add('volmit-home-page');
    render();
  }

  function clearPageShell(main, app) {
    for (const node of main.querySelectorAll('.volmit-project-bar,.volmit-section-sidebar,.home-directory,.mobile-section-toggle,.section-menu-backdrop,.page-toc-toggle,.volmit-page-toc')) {
      node.remove();
    }
    stopTocAlign?.();
    stopTocAlign = null;
    main.classList.remove('volmit-home-page', 'volmit-project-overview', 'volmit-reference-page');
    app.classList.remove('show-page-toc');
    closeSectionMenu(app, false);
  }

  function savedDemoPerspective() {
    try {
      return window.localStorage.getItem('adapt-demo-perspective') === 'third-person' ? 'third-person' : 'first-person';
    } catch {
      return 'first-person';
    }
  }

  function pauseDemo(video) {
    if (!video.paused) {
      pausedDemos.add(video);
      video.pause();
    }
  }

  function updateDemoPlayback(player) {
    const selected = player.views.has(demoPerspective) ? demoPerspective : player.views.keys().next().value;
    for (const [perspective, view] of player.views) {
      const active = perspective === selected;
      view.panel.hidden = !active;
      view.tab.setAttribute('aria-selected', String(active));
      view.tab.tabIndex = active ? 0 : -1;
      if (!active || !player.visible || document.hidden || !player.playing) {
        pauseDemo(view.video);
      } else if (view.video.paused) {
        view.video.play().catch((error) => {
          if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
            console.error('Unable to play the skill demonstration.', error);
          }
        });
      }
    }
  }

  function selectDemoPerspective(perspective) {
    if (perspective === demoPerspective) {
      return;
    }
    demoPerspective = perspective;
    for (const player of demoPlayers.values()) {
      for (const view of player.views.values()) {
        pauseDemo(view.video);
      }
    }
    for (const player of demoPlayers.values()) {
      updateDemoPlayback(player);
    }
    for (const player of wormholePlayers.values()) {
      for (const variant of player.variants.values()) {
        for (const view of variant.views.values()) {
          pauseDemo(view.video);
        }
      }
      updateWormholePlayback(player);
    }
    try {
      window.localStorage.setItem('adapt-demo-perspective', perspective);
    } catch {
      return;
    }
  }

  function mountDemo(container) {
    const editor = container.querySelector('video[src$="-editor.webm"]');
    const first = container.querySelector('video[src$="-pov.webm"]') || editor;
    const third = container.querySelector('video[src$="-observer.webm"]');
    if (!first) {
      return;
    }
    const choices = [[editor ? 'editor' : 'first-person', editor ? 'Browser editor' : 'First person', first]];
    if (third) {
      choices.push(['third-person', 'Third person', third]);
    }
    const player = { views: new Map(), visible: false, playing: true };
    demoPlayers.set(container, player);
    const header = element('div', 'demo-header');
    const tabs = element('div', 'demo-tabs');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Perspective for all demonstrations');
    header.append(tabs, element('span', 'demo-scope', 'All demos'));
    if (choices.length > 1) {
      container.prepend(header);
    }
    const id = 'adapt-demo-' + ++demoSequence;
    for (const [perspective, label, video] of choices) {
      video.autoplay = false;
      video.muted = true;
      video.preload = 'none';
      pauseDemo(video);
      if (!video.hasAttribute('aria-label')) {
        video.setAttribute('aria-label', label + ' demonstration');
      }
      const tab = element('button', 'demo-tab', label);
      tab.type = 'button';
      tab.id = id + '-' + perspective + '-tab';
      tab.setAttribute('role', 'tab');
      const panel = element('div', 'demo-panel');
      panel.id = id + '-' + perspective;
      if (choices.length > 1) {
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
      } else {
        panel.setAttribute('aria-label', label + ' demonstration');
      }
      tab.setAttribute('aria-controls', panel.id);
      panel.append(video);
      tabs.append(tab);
      container.append(panel);
      player.views.set(perspective, { tab, panel, video });
      tab.addEventListener('click', () => selectDemoPerspective(perspective));
      video.addEventListener('play', () => {
        if (video.paused) {
          return;
        }
        const selected = player.views.has(demoPerspective) ? demoPerspective : player.views.keys().next().value;
        if (perspective !== selected || !player.visible || document.hidden) {
          pauseDemo(video);
          return;
        }
        player.playing = true;
      });
      video.addEventListener('pause', () => {
        if (pausedDemos.delete(video)) {
          return;
        }
        player.playing = false;
        updateDemoPlayback(player);
      });
    }
    tabs.addEventListener('keydown', (event) => {
      let perspective;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        perspective = demoPerspective === 'first-person' ? 'third-person' : 'first-person';
      } else if (event.key === 'Home') {
        perspective = 'first-person';
      } else if (event.key === 'End') {
        perspective = 'third-person';
      } else {
        return;
      }
      event.preventDefault();
      selectDemoPerspective(perspective);
      player.views.get(perspective).tab.focus();
    });
    container.classList.add('demo-ready');
    updateDemoPlayback(player);
    demoObserver.observe(container);
  }

  function mountDemos(content) {
    for (const [container, player] of demoPlayers) {
      if (!container.isConnected) {
        demoObserver.unobserve(container);
        for (const view of player.views.values()) {
          pauseDemo(view.video);
        }
        demoPlayers.delete(container);
      }
    }
    for (const container of content.querySelectorAll('.adapt-demo,.gloss-demo')) {
      if (!demoPlayers.has(container)) {
        mountDemo(container);
      }
    }
    for (const [container, player] of wormholePlayers) {
      if (!container.isConnected) {
        demoObserver.unobserve(container);
        for (const variant of player.variants.values()) {
          for (const view of variant.views.values()) {
            pauseDemo(view.video);
          }
        }
        wormholePlayers.delete(container);
      }
    }
    for (const container of content.querySelectorAll('.wormholes-demo')) {
      if (!wormholePlayers.has(container)) {
        mountWormholeDemo(container);
      }
    }
  }

  function demoTab(tabs, panel, id, label) {
    const tab = element('button', 'demo-tab', label);
    tab.type = 'button';
    tab.id = id + '-tab';
    tab.setAttribute('role', 'tab');
    panel.id = id;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    tab.setAttribute('aria-controls', panel.id);
    tabs.append(tab);
    return tab;
  }

  function demoKeyboard(tabs, choices, current, select) {
    tabs.addEventListener('keydown', (event) => {
      if (event.target.closest('[role="tablist"]') !== tabs) {
        return;
      }
      const keys = Array.from(choices.keys());
      const index = keys.indexOf(current());
      let next;
      if (event.key === 'ArrowLeft') {
        next = keys[(index + keys.length - 1) % keys.length];
      } else if (event.key === 'ArrowRight') {
        next = keys[(index + 1) % keys.length];
      } else if (event.key === 'Home') {
        next = keys[0];
      } else if (event.key === 'End') {
        next = keys[keys.length - 1];
      } else {
        return;
      }
      event.preventDefault();
      select(next);
      choices.get(next).tab.focus();
    });
  }

  function updateWormholePlayback(player) {
    const perspective = player.variants.get(player.client).views.has(demoPerspective) ? demoPerspective : 'first-person';
    player.camera.value = perspective;
    for (const [client, variant] of player.variants) {
      const selected = client === player.client;
      variant.panel.hidden = !selected;
      variant.tab.setAttribute('aria-selected', String(selected));
      variant.tab.tabIndex = selected ? 0 : -1;
      for (const [perspective, view] of variant.views) {
        const active = perspective === player.camera.value;
        view.panel.hidden = !active;
        if (!selected || !active || !player.visible || document.hidden || !player.playing) {
          pauseDemo(view.video);
        } else if (view.video.paused) {
          view.video.play().catch((error) => {
            if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
              console.error('Unable to play the portal demonstration.', error);
            }
          });
        }
      }
    }
  }

  function mountWormholeDemo(container) {
    const perspectives = [['first-person', 'First person'], ['third-person', container.dataset.observerLabel || 'Third person']];
    const variants = new Map();
    for (const client of ['standard', 'clientview']) {
      const panel = container.querySelector('.wormholes-demo-variant[data-client="' + client + '"]');
      const first = panel?.querySelector('video[src$="-pov.webm"]');
      const third = panel?.querySelector('video[src$="-observer.webm"]');
      if (!panel || !first) {
        return;
      }
      variants.set(client, { panel, videos: new Map([['first-person', first], ...(third ? [['third-person', third]] : [])]), views: new Map() });
    }
    const player = { variants, client: 'standard', visible: false, playing: true, camera: element('select') };
    const id = 'wormholes-demo-' + ++demoSequence;
    const header = element('div', 'demo-header');
    const tabs = element('div', 'demo-tabs');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Wormholes client for this demonstration');
    const cameraLabel = element('label', 'demo-camera');
    cameraLabel.append(element('span', null, 'Camera'), player.camera);
    player.camera.setAttribute('aria-label', 'Camera view for all demonstrations');
    for (const [perspective, name] of perspectives) {
      if (![...variants.values()].every(variant => variant.videos.has(perspective))) {
        continue;
      }
      const option = element('option', null, name);
      option.value = perspective;
      player.camera.append(option);
    }
    player.camera.addEventListener('change', () => selectDemoPerspective(player.camera.value));
    header.append(tabs);
    if (player.camera.options.length > 1) {
      header.append(cameraLabel);
    }
    container.prepend(header);
    for (const [client, variant] of variants) {
      const label = client === 'clientview' ? 'Client mod' : 'No client mod';
      variant.panel.querySelector(':scope > p')?.remove();
      variant.tab = demoTab(tabs, variant.panel, id + '-' + client, label);
      variant.tab.addEventListener('click', () => {
        player.client = client;
        updateWormholePlayback(player);
      });
      for (const [perspective, name] of perspectives) {
        const video = variant.videos.get(perspective);
        if (!video) {
          continue;
        }
        video.autoplay = false;
        video.muted = true;
        video.preload = 'none';
        video.setAttribute('aria-label', label + ', ' + name.toLowerCase() + ' demonstration');
        pauseDemo(video);
        const panel = element('div', 'demo-panel');
        panel.append(video);
        variant.panel.append(panel);
        variant.views.set(perspective, { panel, video });
        video.addEventListener('play', () => {
          if (video.paused) {
            return;
          }
          if (player.client !== client || player.camera.value !== perspective || !player.visible || document.hidden) {
            pauseDemo(video);
            return;
          }
          player.playing = true;
        });
        video.addEventListener('pause', () => {
          if (pausedDemos.delete(video)) {
            return;
          }
          player.playing = false;
          updateWormholePlayback(player);
        });
      }
    }
    demoKeyboard(tabs, variants, () => player.client, (client) => {
      player.client = client;
      updateWormholePlayback(player);
    });
    wormholePlayers.set(container, player);
    container.classList.add('demo-ready');
    updateWormholePlayback(player);
    demoObserver.observe(container);
  }

  function finishLoading() {
    const root = document.documentElement;
    root.classList.remove('volmit-loading');
    root.classList.add('volmit-ready');
    window.clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }

  function readCachedCatalog() {
    try {
      const data = JSON.parse(window.sessionStorage.getItem('volmit-catalog') || '');
      if (Array.isArray(data) && data.length && data.every(validProject)) {
        return data;
      }
    } catch {
      return null;
    }
    return null;
  }

  function rememberCatalog(data) {
    try {
      window.sessionStorage.setItem('volmit-catalog', JSON.stringify(data));
    } catch {
      // Storage can be unavailable or full.
    }
  }

  function lostPath() {
    try {
      return decodeURIComponent(window.location.pathname);
    } catch {
      return window.location.pathname;
    }
  }

  function lostRandom(start) {
    let seed = start;
    return () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  }

  function lostParticles(sky) {
    const count = 2200;
    const canvas = element('canvas', 'volmit-lost-particles');
    canvas.dataset.count = String(count);
    canvas.setAttribute('aria-hidden', 'true');
    sky.append(canvas);
    if (typeof CanvasRenderingContext2D !== 'function') {
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }
    const next = lostRandom(404);
    const stars = new Float32Array(count * 5);
    for (let index = 0; index < count; index += 1) {
      const offset = index * 5;
      if (next() < 0.42) {
        const along = next();
        stars[offset] = along;
        stars[offset + 1] = 0.06 + along * 0.46 + (next() - 0.5) * 0.18;
      } else {
        stars[offset] = next();
        stars[offset + 1] = next();
      }
      stars[offset + 2] = 0.2 + next() * 0.8;
    }
    const pointer = { x: -1, y: -1, vx: 0, vy: 0 };
    let width = 1;
    let height = 1;
    let dust = null;
    function resize() {
      width = sky.clientWidth || window.innerWidth || 1;
      height = sky.clientHeight || window.innerHeight || 1;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      dust = context.createLinearGradient(0, height * 0.02, width, height * 0.62);
      dust.addColorStop(0, 'rgba(125, 211, 252, 0)');
      dust.addColorStop(0.38, 'rgba(125, 211, 252, 0.55)');
      dust.addColorStop(0.55, 'rgba(251, 113, 133, 0.42)');
      dust.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    resize();
    const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function onPointer(event) {
      const rect = sky.getBoundingClientRect();
      const x = rect.width ? (event.clientX - rect.left) / rect.width : 0;
      const y = rect.height ? (event.clientY - rect.top) / rect.height : 0;
      if (pointer.x >= 0) {
        pointer.vx = x - pointer.x;
        pointer.vy = y - pointer.y;
      }
      pointer.x = x;
      pointer.y = y;
    }
    function draw() {
      context.clearRect(0, 0, width, height);
      const shiftX = pointer.x < 0 ? 0 : (pointer.x - 0.5) * -36;
      const shiftY = pointer.y < 0 ? 0 : (pointer.y - 0.5) * -22;
      context.save();
      context.translate(shiftX, shiftY);
      context.fillStyle = dust;
      context.beginPath();
      context.ellipse(width * 0.5, height * 0.48, width * 0.62, height * 0.2, -0.4, 0, Math.PI * 2);
      context.fill();
      context.restore();
      for (let index = 0; index < count; index += 1) {
        const offset = index * 5;
        let x = stars[offset];
        let y = stars[offset + 1];
        const depth = stars[offset + 2];
        let vx = stars[offset + 3];
        let vy = stars[offset + 4];
        if (!reduced && pointer.x >= 0) {
          const dx = (x - pointer.x) * width;
          const dy = (y - pointer.y) * height;
          const distance = Math.hypot(dx, dy);
          const reach = 150;
          if (distance < reach) {
            const falloff = (1 - distance / reach) ** 2;
            const scale = falloff * (0.42 + depth * 0.7);
            vx += pointer.vx * scale;
            vy += pointer.vy * scale;
            vx += (dx / (distance + 1)) * falloff * 0.003;
            vy += (dy / (distance + 1)) * falloff * 0.003;
          }
        }
        const speedPx = Math.hypot(vx * width, vy * width);
        if (speedPx > 28) {
          const limit = 28 / speedPx;
          vx *= limit;
          vy *= limit;
        }
        vx *= 0.84;
        vy *= 0.84;
        if (!reduced) {
          x += 0.00004 * depth;
        }
        x += vx;
        y += vy * (width / height);
        if (x < -0.04) x += 1.08;
        if (x > 1.04) x -= 1.08;
        if (y < -0.04) y += 1.08;
        if (y > 1.04) y -= 1.08;
        stars[offset] = x;
        stars[offset + 1] = y;
        stars[offset + 3] = vx;
        stars[offset + 4] = vy;
        const px = x * width + shiftX * depth;
        const py = y * height + shiftY * depth;
        const speed = Math.hypot(vx * width, vy * width);
        const size = 1.4 + depth * 1.8;
        const featured = index % 48 === 0;
        context.fillStyle = index % 70 === 0 ? '#fb7185' : index % 45 === 0 ? '#7dd3fc' : '#ffffff';
        context.strokeStyle = context.fillStyle;
        if (speed > 2) {
          context.globalAlpha = 0.8;
          context.beginPath();
          context.moveTo(px, py);
          context.lineTo(px - vx * width * 8, py - vy * width * 8);
          context.lineWidth = Math.max(1.2, size * 0.55);
          context.stroke();
        } else if (featured) {
          context.globalAlpha = 0.4;
          context.beginPath();
          context.arc(px, py, size + 2.2, 0, Math.PI * 2);
          context.fill();
          context.globalAlpha = 1;
          context.beginPath();
          context.arc(px, py, 1.3, 0, Math.PI * 2);
          context.fill();
        } else {
          context.globalAlpha = 0.92 + depth * 0.08;
          context.fillRect(px - size / 2, py - size / 2, size, size);
        }
      }
      context.globalAlpha = 1;
      pointer.vx *= 0.8;
      pointer.vy *= 0.8;
    }
    draw();
    const fit = () => {
      resize();
      draw();
    };
    if (reduced) {
      stopLostField = () => window.removeEventListener('resize', resize);
      window.addEventListener('resize', resize);
      window.requestAnimationFrame(fit);
      return;
    }
    let frame = 0;
    let fitted = false;
    const loop = () => {
      if (!fitted) {
        fit();
        fitted = true;
      } else if (!document.hidden) {
        draw();
      }
      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('resize', resize);
    stopLostField = () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', resize);
    };
  }

  function lostSky() {
    const sky = element('div', 'volmit-lost-sky');
    sky.setAttribute('aria-hidden', 'true');
    lostParticles(sky);
    return sky;
  }

  function mountLostPage(app) {
    const host = app.querySelector('.notfound');
    if (!host) {
      return false;
    }
    const path = lostPath();
    let panel = host.querySelector('.volmit-lost');
    if (panel?.dataset.path === path && panel.querySelector('.volmit-lost-particles')) {
      host.querySelector('.notfound-content')?.setAttribute('hidden', '');
      finishLoading();
      return true;
    }
    stopLostField?.();
    stopLostField = null;
    panel = panel || element('section', 'volmit-lost');
    panel.dataset.path = path;
    panel.replaceChildren();
    panel.setAttribute('aria-labelledby', 'volmit-lost-title');
    const title = element('h1', null, '404');
    title.id = 'volmit-lost-title';
    const copy = element('div', 'volmit-lost-copy');
    copy.append(
      element('p', 'volmit-lost-kicker', 'Out of range'),
      title,
      element('p', 'volmit-lost-note', 'Nothing is charted at this path.'),
      element('p', 'volmit-lost-path', path),
      link('Documentation home', '/', 'volmit-lost-home')
    );
    panel.append(lostSky(), copy);
    host.querySelector('.notfound-content')?.setAttribute('hidden', '');
    if (!panel.isConnected) {
      host.append(panel);
    }
    finishLoading();
    return true;
  }

  function pausePageObserver() {
    if (!pageWatching) {
      return;
    }
    pageObserver.disconnect?.();
    pageWatching = false;
  }

  function resumePageObserver() {
    if (pageWatching) {
      return;
    }
    if (!pageObserver) {
      pageObserver = new MutationObserver(scheduleMount);
    }
    pageObserver.observe(document.documentElement, { childList: true, subtree: true });
    pageWatching = true;
  }

  function mount() {
    pausePageObserver();
    try {
      mountPage();
    } finally {
      resumePageObserver();
    }
  }

  function mountPage() {
    if (document.readyState === 'loading') {
      return;
    }
    const lostApp = document.querySelector('.v-application');
    if (lostApp && mountLostPage(lostApp)) {
      return;
    }
    stopLostField?.();
    stopLostField = null;
    const path = normalizedPath();
    const app = document.querySelector('.v-application');
    const main = app?.querySelector('.v-main');
    const content = main?.querySelector('.contents');
    if (!app || !main || !content || reservedPaths.has(path.split('/')[0])) {
      return;
    }
    const theme = app.__vue__?.$vuetify?.theme;
    if (theme && !theme.dark) {
      theme.dark = true;
    }
    mountHeader(app);
    mountDemos(content);
    if (!catalogSettled) {
      return;
    }
    const onHome = !path || path === 'home';
    const project = onHome ? null : currentProject();
    applyProjectChrome(project);
    mountPluginSearch(app, project);
    mountSiteSearch(app);
    try {
      if (contentNode === content && mountedPath === path) {
        return;
      }
      contentNode = content;
      mountedPath = path;
      clearPageShell(main, app);
      if (!catalog.length) {
        return;
      }
      buildProjectDialog(app);
      if (onHome) {
        mountDirectory(main);
      } else if (project) {
        mountProjectNavigation(app, main, content, project, path);
        if (path === project.path) {
          const article = articleRoot(content);
          mountLandingGroups(article);
          mountSpecStrip(article);
        }
        hideGeneratedCaption(main, project);
      }
    } finally {
      finishLoading();
      if (project) {
        mountPageToc(app, main, content);
      }
      alignReferenceToc(main);
    }
  }

  function scheduleMount() {
    if (scheduled) {
      return;
    }
    scheduled = true;
    window.queueMicrotask(() => {
      scheduled = false;
      mount();
    });
  }

  function validLink(link) {
    return link && typeof link.title === 'string' && typeof link.href === 'string'
      && link.href.startsWith('/') && !link.href.startsWith('//');
  }

  function validProject(project) {
    return project && typeof project.name === 'string' && typeof project.path === 'string'
      && validLink({ title: project.name, href: project.href })
      && typeof project.description === 'string' && Array.isArray(project.sections)
      && project.sections.every((section) => section && typeof section.title === 'string'
        && Array.isArray(section.links) && section.links.every(validLink));
  }

  async function start() {
    if (reservedPaths.has(normalizedPath().split('/')[0])) {
      return;
    }
    const root = document.documentElement;
    root.classList.add('volmit-loading');
    const opener = document.currentScript;
    if (document.readyState === 'loading' && opener && !opener.async && !opener.defer) {
      // Keep the first paint behind the outgoing page until this document is themed.
      document.write('<script type="module" blocking="render">await new Promise((resolve)=>{const started=performance.now();const tick=()=>{if(document.documentElement.classList.contains("volmit-ready")||performance.now()-started>1500)resolve();else setTimeout(tick,16);};tick();});<\/script>');
    }
    const cached = readCachedCatalog();
    if (cached) {
      catalog = cached;
      catalogSettled = true;
    }
    window.addEventListener('pagereveal', () => {
      mount();
    });
    if (window.siteConfig) {
      window.siteConfig.darkMode = true;
    }
    const controller = new AbortController();
    loadingTimeout = window.setTimeout(() => {
      finishLoading();
      controller.abort();
    }, 2500);
    resumePageObserver();
    document.addEventListener('DOMContentLoaded', scheduleMount, { once: true });
    window.addEventListener('popstate', scheduleMount);
    document.addEventListener('visibilitychange', () => {
      for (const player of demoPlayers.values()) {
        updateDemoPlayback(player);
      }
      for (const player of wormholePlayers.values()) {
        updateWormholePlayback(player);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab' && !dialog?.open && window.innerWidth < 960) {
        const menu = document.querySelector('.show-section-menu #volmit-page-navigation');
        const entries = menu ? Array.from(menu.querySelectorAll('a[href],button')).filter((node) => node.getClientRects().length > 0) : [];
        if (entries.length && event.shiftKey && (document.activeElement === entries[0] || !menu.contains(document.activeElement))) {
          event.preventDefault();
          entries[entries.length - 1].focus();
        } else if (entries.length && !event.shiftKey && (document.activeElement === entries[entries.length - 1] || !menu.contains(document.activeElement))) {
          event.preventDefault();
          entries[0].focus();
        }
      }
      if (event.key === 'Escape' && !dialog?.open) {
        const app = document.querySelector('.v-application.show-section-menu');
        if (app) {
          closeSectionMenu(app, true);
        }
      }
    });
    scheduleMount();
    try {
      const response = await fetch(catalogUrl, {
        cache: 'no-cache',
        credentials: 'same-origin',
        signal: controller.signal
      });
      if (!response.ok) {
        throw new Error('Project catalog request failed with HTTP ' + response.status);
      }
      const data = await response.json();
      if (!Array.isArray(data) || !data.length || !data.every(validProject)) {
        throw new Error('The project catalog is invalid.');
      }
      const next = data.sort((left, right) => left.name.localeCompare(right.name));
      if (JSON.stringify(next) !== JSON.stringify(catalog)) {
        catalog = next;
        mountedPath = null;
        contentNode = null;
      }
      rememberCatalog(catalog);
    } catch (error) {
      console.error('Unable to load the documentation navigation.', error);
    } finally {
      catalogSettled = true;
      mount();
    }
  }

  start();
})();
