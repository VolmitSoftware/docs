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
      } else {
        menu.removeAttribute('aria-modal');
        menu.removeAttribute('role');
      }
    });
    const close = element('button', 'mobile-nav-close', 'Close page navigation');
    close.type = 'button';
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
      for (const heading of Array.from(content.querySelectorAll('h2[id]')).slice(0, 4)) {
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
    nav.append(link('All projects', '/', 'parent'), projectButton(project), link('Overview', project.href));
    const current = '/' + path;
    for (const section of project.sections) {
      nav.append(element('h3', null, section.title));
      for (const page of section.links) {
        const anchor = link(page.title, page.href);
        if (page.href === current) {
          anchor.classList.add('active');
          anchor.setAttribute('aria-current', 'page');
        }
        nav.append(anchor);
      }
    }
    const footer = element('div', 'sidebar-footer');
    footer.append(link('Community support', 'https://volmitsoftware.com/discord'), link('Source on GitHub', 'https://github.com/VolmitSoftware'));
    nav.append(footer);
    sidebar.append(nav);
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
    input.placeholder = 'Find a project…';
    input.autocomplete = 'off';
    label.append(searchIcon, element('span', 'sr-only', 'Find a project'), input);
    tools.append(toolHeading, label);
    const filterRow = element('div', 'directory-filter-row');
    const filters = element('div', 'directory-filters');
    filters.setAttribute('role', 'group');
    filters.setAttribute('aria-label', 'Filter projects');
    const count = element('p', 'directory-result-count');
    count.setAttribute('role', 'status');
    count.setAttribute('aria-live', 'polite');
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
      grid.replaceChildren();
      for (const project of matches) {
        const card = link('', project.href, 'directory-card');
        const copy = element('div', 'directory-card-copy');
        copy.append(element('h3', null, project.name), element('p', null, project.description));
        card.append(projectIcon(project, 'directory-icon'), copy);
        if (project.group === 'Developer tools') {
          card.append(element('span', 'directory-type', 'Tool'));
        }
        grid.append(card);
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
    browser.append(tools, filterRow, grid, empty);
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
    for (const node of main.querySelectorAll('.volmit-project-bar,.volmit-section-sidebar,.home-directory,.mobile-section-toggle,.section-menu-backdrop')) {
      node.remove();
    }
    main.classList.remove('volmit-home-page', 'volmit-project-overview', 'volmit-reference-page');
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
    for (const [perspective, view] of player.views) {
      const active = perspective === demoPerspective;
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
    const first = container.querySelector('video[src$="-pov.webm"]');
    const third = container.querySelector('video[src$="-observer.webm"]');
    if (!first || !third) {
      return;
    }
    const player = { views: new Map(), visible: false, playing: true };
    demoPlayers.set(container, player);
    const header = element('div', 'demo-header');
    const tabs = element('div', 'demo-tabs');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Perspective for all demonstrations');
    header.append(tabs, element('span', 'demo-scope', 'All demos'));
    container.prepend(header);
    const id = 'adapt-demo-' + ++demoSequence;
    for (const [perspective, label, video] of [['first-person', 'First person', first], ['third-person', 'Third person', third]]) {
      video.autoplay = false;
      video.muted = true;
      video.preload = 'none';
      pauseDemo(video);
      video.setAttribute('aria-label', label + ' demonstration');
      const tab = element('button', 'demo-tab', label);
      tab.type = 'button';
      tab.id = id + '-' + perspective + '-tab';
      tab.setAttribute('role', 'tab');
      const panel = element('div', 'demo-panel');
      panel.id = id + '-' + perspective;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
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
        if (perspective !== demoPerspective || !player.visible || document.hidden) {
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
    for (const container of content.querySelectorAll('.adapt-demo')) {
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
    player.camera.value = demoPerspective;
    for (const [client, variant] of player.variants) {
      const selected = client === player.client;
      variant.panel.hidden = !selected;
      variant.tab.setAttribute('aria-selected', String(selected));
      variant.tab.tabIndex = selected ? 0 : -1;
      for (const [perspective, view] of variant.views) {
        const active = perspective === demoPerspective;
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
      if (!panel || !first || !third) {
        return;
      }
      variants.set(client, { panel, videos: [first, third], views: new Map() });
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
      const option = element('option', null, name);
      option.value = perspective;
      player.camera.append(option);
    }
    player.camera.addEventListener('change', () => selectDemoPerspective(player.camera.value));
    header.append(tabs, cameraLabel);
    container.prepend(header);
    for (const [client, variant] of variants) {
      const label = client === 'clientview' ? 'Client mod' : 'No client mod';
      variant.panel.querySelector(':scope > p')?.remove();
      variant.tab = demoTab(tabs, variant.panel, id + '-' + client, label);
      variant.tab.addEventListener('click', () => {
        player.client = client;
        updateWormholePlayback(player);
      });
      for (const [index, [perspective, name]] of perspectives.entries()) {
        const video = variant.videos[index];
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
          if (player.client !== client || demoPerspective !== perspective || !player.visible || document.hidden) {
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
    document.documentElement.classList.remove('volmit-loading');
    window.clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }

  function mount() {
    if (document.readyState === 'loading') {
      return;
    }
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
      if (!path || path === 'home') {
        mountDirectory(main);
      } else {
        const project = currentProject();
        if (project) {
          mountProjectNavigation(app, main, content, project, path);
        }
      }
    } finally {
      finishLoading();
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
    if (window.siteConfig) {
      window.siteConfig.darkMode = true;
    }
    const controller = new AbortController();
    loadingTimeout = window.setTimeout(() => {
      finishLoading();
      controller.abort();
    }, 2500);
    new MutationObserver(scheduleMount).observe(root, { childList: true, subtree: true });
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
      catalog = data.sort((left, right) => left.name.localeCompare(right.name));
    } catch (error) {
      console.error('Unable to load the documentation navigation.', error);
    } finally {
      catalogSettled = true;
      mount();
    }
  }

  start();
})();
