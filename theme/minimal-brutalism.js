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


  // Lucide 0.468.0, ISC; see lucide-LICENSE.txt.
  const lucideIcons = {
    'key-round': [["path",{"d":"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"}],["circle",{"cx":"16.5","cy":"7.5","r":".5","fill":"currentColor"}]],
    'loader-circle': [["path",{"d":"M21 12a9 9 0 1 1-6.219-8.56"}]],
    'square-check': [["rect",{"width":"18","height":"18","x":"3","y":"3","rx":"2"}],["path",{"d":"m9 12 2 2 4-4"}]],
    'square': [["rect",{"width":"18","height":"18","x":"3","y":"3","rx":"2"}]],
    'square-minus': [["rect",{"width":"18","height":"18","x":"3","y":"3","rx":"2"}],["path",{"d":"M8 12h8"}]],
    'circle-dot': [["circle",{"cx":"12","cy":"12","r":"10"}],["circle",{"cx":"12","cy":"12","r":"1"}]],
    'circle': [["circle",{"cx":"12","cy":"12","r":"10"}]],
    'list': [["path",{"d":"M3 12h.01"}],["path",{"d":"M3 18h.01"}],["path",{"d":"M3 6h.01"}],["path",{"d":"M8 12h13"}],["path",{"d":"M8 18h13"}],["path",{"d":"M8 6h13"}]],
    'list-tree': [["path",{"d":"M21 12h-8"}],["path",{"d":"M21 6H8"}],["path",{"d":"M21 18h-8"}],["path",{"d":"M3 6v4c0 1.1.9 2 2 2h3"}],["path",{"d":"M3 10v6c0 1.1.9 2 2 2h3"}]],
    'file-text': [["path",{"d":"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"}],["path",{"d":"M14 2v4a2 2 0 0 0 2 2h4"}],["path",{"d":"M10 9H8"}],["path",{"d":"M16 13H8"}],["path",{"d":"M16 17H8"}]],
    'search': [["circle",{"cx":"11","cy":"11","r":"8"}],["path",{"d":"m21 21-4.3-4.3"}]],
    'user': [["path",{"d":"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"}],["circle",{"cx":"12","cy":"7","r":"4"}]],
    'tags': [["path",{"d":"m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"}],["path",{"d":"M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z"}],["circle",{"cx":"6.5","cy":"9.5","r":".5","fill":"currentColor"}]],
    'tag': [["path",{"d":"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"}],["circle",{"cx":"7.5","cy":"7.5","r":".5","fill":"currentColor"}]],
    'house': [["path",{"d":"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"}],["path",{"d":"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}]],
    'pencil': [["path",{"d":"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}],["path",{"d":"m15 5 4 4"}]],
    'github': [["path",{"d":"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"}],["path",{"d":"M9 18c-4.51 2-5-2-7-2"}]],
    'share-2': [["circle",{"cx":"18","cy":"5","r":"3"}],["circle",{"cx":"6","cy":"12","r":"3"}],["circle",{"cx":"18","cy":"19","r":"3"}],["line",{"x1":"8.59","x2":"15.42","y1":"13.51","y2":"17.49"}],["line",{"x1":"15.41","x2":"8.59","y1":"6.51","y2":"10.49"}]],
    'printer': [["path",{"d":"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"}],["path",{"d":"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"}],["rect",{"x":"6","y":"14","width":"12","height":"8","rx":"1"}]],
    'refresh-cw': [["path",{"d":"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{"d":"M21 3v5h-5"}],["path",{"d":"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{"d":"M8 16H3v5"}]],
    'arrow-up': [["path",{"d":"m5 12 7-7 7 7"}],["path",{"d":"M12 19V5"}]],
    'history': [["path",{"d":"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}],["path",{"d":"M3 3v5h5"}],["path",{"d":"M12 7v5l4 2"}]],
    'code-xml': [["path",{"d":"m18 16 4-4-4-4"}],["path",{"d":"m6 8-4 4 4 4"}],["path",{"d":"m14.5 4-5 16"}]],
    'zap': [["path",{"d":"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"}]],
    'copy': [["rect",{"width":"14","height":"14","x":"8","y":"8","rx":"2","ry":"2"}],["path",{"d":"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]],
    'corner-up-right': [["polyline",{"points":"15 14 20 9 15 4"}],["path",{"d":"M4 20v-7a4 4 0 0 1 4-4h12"}]],
    'trash-2': [["path",{"d":"M3 6h18"}],["path",{"d":"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}],["path",{"d":"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"}],["line",{"x1":"10","x2":"10","y1":"11","y2":"17"}],["line",{"x1":"14","x2":"14","y1":"11","y2":"17"}]],
    'chevron-right': [["path",{"d":"m9 18 6-6-6-6"}]],
    'chevron-left': [["path",{"d":"m15 18-6-6 6-6"}]],
    'chevron-down': [["path",{"d":"m6 9 6 6 6-6"}]],
    'chevron-up': [["path",{"d":"m18 15-6-6-6 6"}]],
    'x': [["path",{"d":"M18 6 6 18"}],["path",{"d":"m6 6 12 12"}]],
    'menu': [["line",{"x1":"4","x2":"20","y1":"12","y2":"12"}],["line",{"x1":"4","x2":"20","y1":"6","y2":"6"}],["line",{"x1":"4","x2":"20","y1":"18","y2":"18"}]],
    'check': [["path",{"d":"M20 6 9 17l-5-5"}]],
    'circle-check': [["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"m9 12 2 2 4-4"}]],
    'info': [["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"M12 16v-4"}],["path",{"d":"M12 8h.01"}]],
    'triangle-alert': [["path",{"d":"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"}],["path",{"d":"M12 9v4"}],["path",{"d":"M12 17h.01"}]],
    'circle-alert': [["circle",{"cx":"12","cy":"12","r":"10"}],["line",{"x1":"12","x2":"12","y1":"8","y2":"12"}],["line",{"x1":"12","x2":"12.01","y1":"16","y2":"16"}]],
    'circle-help': [["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"}],["path",{"d":"M12 17h.01"}]],
    'external-link': [["path",{"d":"M15 3h6v6"}],["path",{"d":"M10 14 21 3"}],["path",{"d":"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]],
    'link': [["path",{"d":"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}],["path",{"d":"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"}]],
    'log-in': [["path",{"d":"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"}],["polyline",{"points":"10 17 15 12 10 7"}],["line",{"x1":"15","x2":"3","y1":"12","y2":"12"}]],
    'log-out': [["path",{"d":"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}],["polyline",{"points":"16 17 21 12 16 7"}],["line",{"x1":"21","x2":"9","y1":"12","y2":"12"}]],
    'settings': [["path",{"d":"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"}],["circle",{"cx":"12","cy":"12","r":"3"}]],
    'ellipsis-vertical': [["circle",{"cx":"12","cy":"12","r":"1"}],["circle",{"cx":"12","cy":"5","r":"1"}],["circle",{"cx":"12","cy":"19","r":"1"}]],
    'ellipsis': [["circle",{"cx":"12","cy":"12","r":"1"}],["circle",{"cx":"19","cy":"12","r":"1"}],["circle",{"cx":"5","cy":"12","r":"1"}]],
    'file': [["path",{"d":"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"}],["path",{"d":"M14 2v4a2 2 0 0 0 2 2h4"}]],
    'folder': [["path",{"d":"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"}]],
    'folder-open': [["path",{"d":"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"}]],
    'lock': [["rect",{"width":"18","height":"11","x":"3","y":"11","rx":"2","ry":"2"}],["path",{"d":"M7 11V7a5 5 0 0 1 10 0v4"}]],
    'globe': [["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"}],["path",{"d":"M2 12h20"}]],
    'book-open': [["path",{"d":"M12 7v14"}],["path",{"d":"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"}]],
    'download': [["path",{"d":"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["polyline",{"points":"7 10 12 15 17 10"}],["line",{"x1":"12","x2":"12","y1":"15","y2":"3"}]],
    'upload': [["path",{"d":"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["polyline",{"points":"17 8 12 3 7 8"}],["line",{"x1":"12","x2":"12","y1":"3","y2":"15"}]],
    'play': [["polygon",{"points":"6 3 20 12 6 21 6 3"}]],
    'pause': [["rect",{"x":"14","y":"4","width":"4","height":"16","rx":"1"}],["rect",{"x":"6","y":"4","width":"4","height":"16","rx":"1"}]],
    'maximize': [["path",{"d":"M8 3H5a2 2 0 0 0-2 2v3"}],["path",{"d":"M21 8V5a2 2 0 0 0-2-2h-3"}],["path",{"d":"M3 16v3a2 2 0 0 0 2 2h3"}],["path",{"d":"M16 21h3a2 2 0 0 0 2-2v-3"}]],
    'minimize': [["path",{"d":"M8 3v3a2 2 0 0 1-2 2H3"}],["path",{"d":"M21 8h-3a2 2 0 0 1-2-2V3"}],["path",{"d":"M3 16h3a2 2 0 0 1 2 2v3"}],["path",{"d":"M16 21v-3a2 2 0 0 1 2-2h3"}]],
    'volume-2': [["path",{"d":"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"}],["path",{"d":"M16 9a5 5 0 0 1 0 6"}],["path",{"d":"M19.364 18.364a9 9 0 0 0 0-12.728"}]],
    'volume-x': [["path",{"d":"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"}],["line",{"x1":"22","x2":"16","y1":"9","y2":"15"}],["line",{"x1":"16","x2":"22","y1":"9","y2":"15"}]],
    'sun': [["circle",{"cx":"12","cy":"12","r":"4"}],["path",{"d":"M12 2v2"}],["path",{"d":"M12 20v2"}],["path",{"d":"m4.93 4.93 1.41 1.41"}],["path",{"d":"m17.66 17.66 1.41 1.41"}],["path",{"d":"M2 12h2"}],["path",{"d":"M20 12h2"}],["path",{"d":"m6.34 17.66-1.41 1.41"}],["path",{"d":"m19.07 4.93-1.41 1.41"}]],
    'moon': [["path",{"d":"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"}]],
    'save': [["path",{"d":"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"}],["path",{"d":"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"}],["path",{"d":"M7 3v4a1 1 0 0 0 1 1h7"}]],
    'eye': [["path",{"d":"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"}],["circle",{"cx":"12","cy":"12","r":"3"}]],
    'eye-off': [["path",{"d":"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"}],["path",{"d":"M14.084 14.158a3 3 0 0 1-4.242-4.242"}],["path",{"d":"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"}],["path",{"d":"m2 2 20 20"}]],
    'clock': [["circle",{"cx":"12","cy":"12","r":"10"}],["polyline",{"points":"12 6 12 12 16 14"}]],
    'mail': [["rect",{"width":"20","height":"16","x":"2","y":"4","rx":"2"}],["path",{"d":"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"}]],
    'shield-check': [["path",{"d":"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}],["path",{"d":"m9 12 2 2 4-4"}]],
  };

  const wikiIconNames = {
    'arrow_upward': 'arrow-up', 'keyboard_arrow_down': 'chevron-down', 'keyboard_arrow_up': 'chevron-up',
    'keyboard_arrow_left': 'chevron-left', 'keyboard_arrow_right': 'chevron-right',
    'more_vert': 'ellipsis-vertical', 'more_horiz': 'ellipsis', 'account_circle': 'user',
    'clipboard-account': 'user', 'form-textbox-password': 'key-round', 'loading': 'loader-circle',
    'checkbox-marked': 'square-check', 'checkbox-blank-outline': 'square', 'minus-box': 'square-minus',
    'radiobox-marked': 'circle-dot', 'radiobox-blank': 'circle', 'format-list-bulleted': 'list',
    'file-tree': 'list-tree', 'text-box-outline': 'file-text', 'menu-open': 'menu',
    'magnify': 'search', 'account': 'user', 'account-circle': 'user', 'account-outline': 'user',
    'tag-multiple': 'tags', 'tag-multiple-outline': 'tags', 'tag': 'tag', 'tag-outline': 'tag',
    'home': 'house', 'home-outline': 'house', 'pencil': 'pencil', 'pencil-outline': 'pencil',
    'github': 'github', 'share-variant': 'share-2', 'printer': 'printer', 'cached': 'refresh-cw',
    'refresh': 'refresh-cw', 'arrow-up': 'arrow-up', 'arrow-up-bold': 'arrow-up',
    'arrow-up-bold-circle': 'arrow-up', 'chevron-up': 'chevron-up', 'chevron-down': 'chevron-down',
    'chevron-left': 'chevron-left', 'chevron-right': 'chevron-right', 'menu-down': 'chevron-down',
    'menu-right': 'chevron-right', 'menu': 'menu', 'close': 'x', 'close-circle': 'x',
    'close-circle-outline': 'x', 'history': 'history', 'code-tags': 'code-xml',
    'lightning-bolt': 'zap', 'lightning-bolt-outline': 'zap', 'content-duplicate': 'copy',
    'content-copy': 'copy', 'content-save-move-outline': 'corner-up-right', 'content-save': 'save',
    'trash-can': 'trash-2', 'trash-can-outline': 'trash-2', 'delete': 'trash-2',
    'check': 'check', 'check-circle': 'circle-check', 'check-circle-outline': 'circle-check',
    'information': 'info', 'information-outline': 'info', 'alert': 'triangle-alert',
    'alert-circle': 'circle-alert', 'alert-circle-outline': 'circle-alert',
    'help-circle': 'circle-help', 'help-circle-outline': 'circle-help',
    'open-in-new': 'external-link', 'link': 'link', 'link-variant': 'link',
    'login': 'log-in', 'logout': 'log-out', 'cog': 'settings', 'cog-outline': 'settings',
    'dots-vertical': 'ellipsis-vertical', 'dots-horizontal': 'ellipsis',
    'file': 'file', 'file-document': 'file', 'file-document-outline': 'file',
    'folder': 'folder', 'folder-outline': 'folder', 'folder-open': 'folder-open',
    'lock': 'lock', 'lock-outline': 'lock', 'earth': 'globe', 'web': 'globe',
    'book-open': 'book-open', 'book-open-variant': 'book-open', 'download': 'download',
    'upload': 'upload', 'play': 'play', 'pause': 'pause', 'fullscreen': 'maximize',
    'fullscreen-exit': 'minimize', 'volume-high': 'volume-2', 'volume-off': 'volume-x',
    'white-balance-sunny': 'sun', 'weather-night': 'moon', 'eye': 'eye', 'eye-off': 'eye-off',
    'clock-outline': 'clock', 'email': 'mail', 'email-outline': 'mail', 'shield-check': 'shield-check'
  };

  function lucideIcon(name) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const attributes = {
      class: 'volmit-lucide volmit-lucide-icon', viewBox: '0 0 24 24', width: '24', height: '24',
      fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round',
      'stroke-linejoin': 'round', 'aria-hidden': 'true', focusable: 'false', 'data-lucide': name
    };
    for (const [key, value] of Object.entries(attributes)) {
      svg.setAttribute(key, value);
    }
    for (const [tag, properties] of lucideIcons[name]) {
      const child = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (const [key, value] of Object.entries(properties)) {
        child.setAttribute(key, value);
      }
      svg.append(child);
    }
    return svg;
  }

  function mountAuthFields(app) {
    for (const input of app.querySelectorAll('.login input[placeholder], .register input[placeholder]')) {
      if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby') && !input.labels?.length) {
        const label = input.placeholder.trim();
        if (label) {
          input.setAttribute('aria-label', label);
        }
      }
    }
  }

  function mountWikiIcons(app) {
    for (const icon of app.querySelectorAll('.v-icon')) {
      const glyphs = [...icon.classList].filter((name) => name.startsWith('mdi-') && !/^mdi-(?:spin|rotate-\d+|flip-[hv]|\d+px)$/.test(name));
      const mdi = glyphs.find((name) => Object.prototype.hasOwnProperty.call(wikiIconNames, name.slice(4))) || glyphs[0];
      const key = mdi?.slice(4) || icon.textContent.trim().replace(/^mdi-/, '') || icon.dataset.volmitWikiIcon || '';
      icon.dataset.volmitWikiIcon = key;
      const control = icon.closest('button, a, [role="button"]') || (icon.classList.contains('v-icon--link') ? icon : null);
      const mapped = Object.prototype.hasOwnProperty.call(wikiIconNames, key) ? wikiIconNames[key]
        : Object.prototype.hasOwnProperty.call(lucideIcons, key) ? key : null;
      const name = mapped || (control ? 'circle-help' : null);
      icon.classList.add('volmit-lucide-icon');
      if (!name) {
        icon.replaceChildren();
        icon.dataset.volmitIconHidden = 'true';
        icon.hidden = true;
        continue;
      }
      if (icon.dataset.volmitIconHidden === 'true') {
        icon.hidden = false;
        delete icon.dataset.volmitIconHidden;
      }
      if (control && (name === 'eye' || name === 'eye-off') && control.closest('.v-input')?.querySelector('input')
        && /^(?:append|prepend) icon$/i.test(control.getAttribute('aria-label') || '') && !control.hasAttribute('aria-labelledby')) {
        control.setAttribute('aria-label', 'Toggle password visibility');
      }
      if (control && !control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
        const text = control.cloneNode(true);
        for (const child of text.querySelectorAll('.v-icon, svg')) {
          child.remove();
        }
        if (control === icon || !text.textContent.trim()) {
          const label = { x: 'Close', house: 'Home', user: 'Account', 'circle-help': 'More options', 'arrow-up': 'Return to top' }[name];
          const password = (name === 'eye' || name === 'eye-off') && control.closest('.v-input')?.querySelector('input');
          control.setAttribute('aria-label', control.getAttribute('title') || (password ? 'Toggle password visibility' : label || name.replace(/-/g, ' ')));
        }
      }
      if (control === icon) {
        icon.removeAttribute('aria-hidden');
      } else if (!icon.hasAttribute('aria-label')) {
        icon.setAttribute('aria-hidden', 'true');
      }
      if (icon.querySelector(':scope > svg')?.dataset.lucide !== name) {
        icon.replaceChildren(lucideIcon(name));
      }
    }
    for (const anchor of app.querySelectorAll('.contents a.is-external-link')) {
      if (!anchor.querySelector(':scope > svg.volmit-lucide')) {
        anchor.append(lucideIcon('external-link'));
      }
    }
    for (const anchor of app.querySelectorAll('.contents .toc-anchor, .contents .header-anchor')) {
      const heading = anchor.closest('h1,h2,h3,h4,h5,h6');
      if (!anchor.hasAttribute('aria-label')) {
        anchor.setAttribute('aria-label', 'Link to ' + headingLabel(heading));
      }
      if (!anchor.querySelector(':scope > svg.volmit-lucide')) {
        anchor.replaceChildren(lucideIcon('link'));
      }
    }
  }

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
    const title = app.querySelector('.page-header-headings .headline');
    title?.setAttribute('role', 'heading');
    title?.setAttribute('aria-level', '1');
    const searchButton = app.querySelector('.nav-header .mdi-magnify')?.closest('button');
    searchButton?.setAttribute('aria-label', 'Search documentation');
    const lockup = document.querySelector('.nav-header-inner .v-toolbar__content');
    if (lockup && !lockup.querySelector(':scope > .volmit-home-link')) {
      const home = link('', '/', 'volmit-home-link');
      home.setAttribute('aria-label', 'Volmit Software documentation home');
      home.append(...lockup.childNodes);
      lockup.append(home);
    }
    const main = app.querySelector('.v-main');
    if (main && !app.querySelector('.volmit-skip-link')) {
      const skip = link('Skip to content', '#volmit-main-content', 'volmit-skip-link');
      skip.addEventListener('click', (event) => {
        event.preventDefault();
        const current = app.querySelector('.home-directory h1') || app.querySelector('.page-header-headings .headline');
        const target = current || app.querySelector('.contents');
        if (target) {
          target.tabIndex = -1;
          target.focus({ preventScroll: true });
          target.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
      });
      app.prepend(skip);
    }
    if (main && main.id !== 'volmit-main-content') {
      main.id = 'volmit-main-content';
    }
  }

  function currentProject() {
    return catalog.find((project) => normalizedPath().split('/')[0] === project.path);
  }

  function validColor(value) {
    return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) ? value : '';
  }

  function pageCount(project) {
    return project.sections.reduce((total, section) => total + section.groups.reduce((count, group) => count + group.links.length, 0), 0);
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

  function rowDestination(row) {
    const anchors = [...row.querySelectorAll('a')];
    if (anchors.length !== 1) {
      return null;
    }
    const anchor = anchors[0];
    const href = anchor.getAttribute('href')?.trim();
    if (!href || href === '#' || /^(?:javascript|data):/i.test(href)) {
      return null;
    }
    const controls = row.querySelectorAll('button,input,textarea,select,details,summary,iframe,video,audio,img,form,[contenteditable]:not([contenteditable="false"]),[tabindex],[role]');
    if ([...controls].some((node) => node !== anchor)) {
      return null;
    }
    return anchor;
  }

  function linkIsFirst(anchor, container, allowDescription) {
    const before = document.createRange();
    before.selectNodeContents(container);
    before.setEndBefore(anchor);
    if (before.toString().trim()) {
      return false;
    }
    const after = document.createRange();
    after.selectNodeContents(container);
    after.setStartAfter(anchor);
    const suffix = after.toString().trim();
    return !suffix || (allowDescription && /^(?:[:\u2013\u2014]|-\s)/.test(suffix));
  }

  function mountLinkRows(content) {
    for (const table of content.querySelectorAll('table')) {
      const rows = [...table.querySelectorAll(':scope > tbody > tr')];
      const links = rows.map((row) => {
        const cells = [...row.children];
        const anchor = rowDestination(row);
        if (!anchor || cells.some((cell) => cell.tagName !== 'TD' || cell.colSpan !== 1 || cell.rowSpan !== 1) ||
            !cells[0]?.contains(anchor) || cells[0].querySelector('ul,ol,pre,blockquote,div,h1,h2,h3,h4,h5,h6') ||
            !linkIsFirst(anchor, cells[0], false)) {
          return null;
        }
        return anchor;
      });
      const eligible = !table.matches('.spec-strip') && !table.parentElement.closest('table') &&
        !table.querySelector('table') && rows.length >= 2 && links.every(Boolean);
      table.classList.toggle('volmit-link-table', eligible);
      const headers = [...(table.tHead?.rows[table.tHead.rows.length - 1]?.cells || [])];
      if (eligible && headers.every((cell) => cell.tagName === 'TH' && cell.colSpan === 1 && cell.rowSpan === 1)) {
        for (const header of headers) {
          if (!header.hasAttribute('scope')) {
            header.scope = 'col';
          }
        }
      }
      for (const row of rows) {
        for (const [index, cell] of [...row.cells].entries()) {
          let label = cell.querySelector(':scope > .volmit-cell-label');
          const text = headers.length === row.cells.length ? headers[index]?.textContent.trim() : '';
          if (!eligible || index === 0 || !text) {
            label?.remove();
            continue;
          }
          if (!label) {
            label = element('span', 'volmit-cell-label');
            label.setAttribute('aria-hidden', 'true');
            cell.prepend(label);
          }
          if (label.textContent !== text) {
            label.textContent = text;
          }
        }
        row.classList.toggle('volmit-link-row', eligible);
        for (const anchor of row.querySelectorAll('a')) {
          anchor.classList.toggle('volmit-row-link', eligible);
        }
      }
    }
    for (const list of content.querySelectorAll('ul:not(.links-list):not(.grid-list)')) {
      const rows = [...list.children];
      const links = rows.map((row) => {
        const anchor = rowDestination(row);
        if (row.tagName !== 'LI' || !anchor || row.querySelector('ul,ol,table,pre,blockquote,div,h1,h2,h3,h4,h5,h6,hr') ||
            row.querySelectorAll('p').length > 1 || !linkIsFirst(anchor, row, true)) {
          return null;
        }
        return anchor;
      });
      const eligible = !list.parentElement.closest('li') && rows.length >= 2 && links.every(Boolean);
      list.classList.toggle('volmit-link-list', eligible);
      for (const row of rows) {
        row.classList.toggle('volmit-link-item', eligible);
        for (const anchor of row.querySelectorAll('a')) {
          anchor.classList.toggle('volmit-row-link', eligible);
          anchor.classList.toggle('volmit-list-link', eligible);
        }
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
  let tocAlignment = null;
  let tocHeadingNodes = [];

  function tocHeaderBottom(app) {
    const bottom = app.querySelector('.nav-header')?.getBoundingClientRect().bottom || 0;
    return bottom || Number.parseFloat(window.getComputedStyle(app).getPropertyValue('--volmit-header-height')) || 72;
  }

  function closePageToc(app, restoreFocus) {
    const open = app.classList.contains('show-page-toc');
    app.classList.remove('show-page-toc');
    const toggle = app.querySelector('.page-toc-toggle');
    toggle?.setAttribute('aria-expanded', 'false');
    if (open && restoreFocus) {
      toggle?.focus();
    }
  }

  function alignReferenceToc(main) {
    const toc = main.querySelector('.volmit-page-toc');
    const title = main.querySelector('.page-header-headings .headline');
    const header = title?.closest('.page-header-section') || title;
    if (main.classList.contains('volmit-reference-page') && tocAlignment?.main === main && tocAlignment.toc === toc
      && tocAlignment.title === title && tocAlignment.header === header && toc?.isConnected && title?.isConnected) {
      tocAlignment.apply();
      return;
    }
    stopTocAlign?.();
    stopTocAlign = null;
    if (!main.classList.contains('volmit-reference-page') || !toc || !title) {
      main.style.removeProperty('--volmit-toc-top');
      return;
    }
    const app = main.closest('.v-application');
    const apply = () => {
      if (!toc.isConnected || !app) {
        main.style.removeProperty('--volmit-toc-top');
        return;
      }
      const next = Math.round(Math.max(tocHeaderBottom(app) + 24, title.getBoundingClientRect().top));
      const applied = Number.parseFloat(main.style.getPropertyValue('--volmit-toc-top')) || 0;
      if (Math.abs(next - applied) > 1) {
        main.style.setProperty('--volmit-toc-top', next + 'px');
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
    main.addEventListener('scroll', apply, { passive: true });
    document.addEventListener('scroll', apply, { passive: true });
    cleanups.push(() => main.removeEventListener('scroll', apply), () => document.removeEventListener('scroll', apply));
    tocAlignment = { main, toc, title, header, apply };
    stopTocAlign = () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
      tocAlignment = null;
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

  function mountCalloutLabels(content) {
    const labels = [
      ['is-danger', 'Caution'], ['is-warning', 'Warning'],
      ['is-info', 'Note'], ['is-success', 'Success']
    ];
    for (const blockquote of content.querySelectorAll('blockquote:is(.is-danger, .is-warning, .is-info, .is-success)')) {
      const severity = labels.find(([name]) => blockquote.classList.contains(name));
      let paragraph = blockquote.querySelector(':scope > p');
      if (!paragraph) {
        paragraph = element('p');
        blockquote.prepend(paragraph);
      }
      let label = paragraph.querySelector(':scope > .callout-label');
      if (!label) {
        label = element('span', 'callout-label');
        paragraph.prepend(label, document.createTextNode(' '));
      }
      label.textContent = severity[1] + ':';
    }
  }

  function mountPageToc(app, main, content) {
    const header = main.querySelector('.page-header-section');
    const headings = [...content.querySelectorAll('h2[id], h3[id]')].filter((heading) => !heading.closest('.volmit-headliner'));
    main.querySelector('.page-toc-card')?.remove();
    if (!header || !main.classList.contains('volmit-reference-page') || !headings.length) {
      stopTocWatch?.();
      stopTocWatch = null;
      closePageToc(app, false);
      main.classList.remove('has-page-toc');
      main.querySelector('.page-toc-toggle')?.remove();
      main.querySelector('.volmit-page-toc')?.remove();
      tocHeadingNodes = [];
      return;
    }
    main.classList.add('has-page-toc');
    const signature = headings.map((heading) => heading.tagName + '\n' + heading.id + '\n' + headingLabel(heading)).join('\n');
    if (main.querySelector('.volmit-page-toc')?.dataset.signature === signature && header.querySelector('.page-toc-toggle')
      && headings.length === tocHeadingNodes.length && headings.every((heading, index) => heading === tocHeadingNodes[index])) {
      return;
    }
    stopTocWatch?.();
    stopTocWatch = null;
    tocHeadingNodes = headings;
    let panel = main.querySelector('.volmit-page-toc');
    if (!panel) {
      panel = element('nav', 'volmit-page-toc');
      panel.id = 'volmit-page-toc';
      panel.setAttribute('aria-label', 'On this page');
      main.append(panel);
    }
    panel.dataset.signature = signature;
    panel.replaceChildren();
    const panelHeader = element('div', 'page-toc-header');
    const close = element('button', 'page-toc-close', 'Close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close table of contents');
    close.addEventListener('click', () => closePageToc(app, true));
    panelHeader.append(element('div', 'page-toc-title', 'On this page'), close);
    const links = element('div', 'page-toc-links');
    panel.append(panelHeader, links);
    let button = header.querySelector('.page-toc-toggle');
    if (!button) {
      button = element('button', 'page-toc-toggle', 'On this page');
      button.type = 'button';
      button.setAttribute('aria-controls', panel.id);
      button.addEventListener('click', () => {
        if (app.classList.contains('show-page-toc')) {
          closePageToc(app, true);
          return;
        }
        closeSectionMenu(app, false);
        positionPopup();
        app.classList.add('show-page-toc');
        button.setAttribute('aria-expanded', 'true');
        (panel.querySelector('[aria-current="location"]') || panel.querySelector('a'))?.focus();
      });
      const mobile = header.querySelector('.mobile-section-toggle');
      if (mobile) {
        mobile.after(button);
      } else {
        header.prepend(button);
      }
    }
    button.setAttribute('aria-expanded', String(app.classList.contains('show-page-toc')));
    function positionPopup() {
      const minimum = tocHeaderBottom(app) + 12;
      const desired = Math.max(minimum, button.getBoundingClientRect().bottom + 8);
      const top = Math.min(desired, Math.max(minimum, window.innerHeight - 160));
      main.style.setProperty('--volmit-toc-popup-top', Math.round(top) + 'px');
    }
    const entries = [];
    for (const heading of headings) {
      const item = link(headingLabel(heading), '#' + encodeURIComponent(heading.id), heading.tagName === 'H3' ? 'is-sub' : '');
      item.addEventListener('click', () => {
        closePageToc(app, false);
        if (!heading.hasAttribute('tabindex')) {
          heading.tabIndex = -1;
        }
        heading.focus({ preventScroll: true });
      });
      entries.push({ heading, item });
      links.append(item);
    }
    function mark() {
      const marker = (Number.parseFloat(window.getComputedStyle(headings[0]).scrollMarginTop) || tocHeaderBottom(app) + 100) + 1;
      let current = headings[0] ?? null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= marker) {
          current = heading;
        }
      }
      for (const { heading, item } of entries) {
        const on = heading === current;
        item.classList.toggle('is-current', on);
        if (on) {
          item.setAttribute('aria-current', 'location');
        } else {
          item.removeAttribute('aria-current');
        }
      }
    }
    const scroller = main;
    const onKey = (event) => {
      if (event.key === 'Escape' && app.classList.contains('show-page-toc')) {
        event.preventDefault();
        closePageToc(app, true);
      }
    };
    const onOutside = (event) => {
      if (app.classList.contains('show-page-toc') && !panel.contains(event.target) && !button.contains(event.target)) {
        closePageToc(app, panel.contains(document.activeElement));
      }
    };
    const onFocus = (event) => {
      if (app.classList.contains('show-page-toc') && !panel.contains(event.target) && event.target !== button) {
        closePageToc(app, false);
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1264) {
        closePageToc(app, false);
      } else if (app.classList.contains('show-page-toc')) {
        positionPopup();
      }
      mark();
    };
    scroller.addEventListener('scroll', mark, { passive: true });
    document.addEventListener('scroll', mark, { passive: true });
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('focusin', onFocus);
    window.addEventListener('resize', onResize);
    stopTocWatch = () => {
      scroller.removeEventListener('scroll', mark);
      document.removeEventListener('scroll', mark);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
      document.removeEventListener('focusin', onFocus);
      window.removeEventListener('resize', onResize);
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
      for (const group of section.groups) {
        for (const page of group.links) {
          if (page.title.toLowerCase().includes(needle)) {
            hits.push({ title: page.title, href: page.href, description: group.title ? section.title + ' · ' + group.title : section.title });
          }
        }
      }
    }
    return hits;
  }

  async function fetchPageHits(query, signal) {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      credentials: 'same-origin',
      signal,
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

  async function remotePluginHits(project, query, signal) {
    const prefix = project.path + '/';
    return (await fetchPageHits(query, signal)).filter((hit) => {
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
    let requestTimeout = 0;
    let controller = null;
    let active = -1;
    let replacingResults = false;
    function stopRequests() {
      requestId += 1;
      window.clearTimeout(timer);
      window.clearTimeout(requestTimeout);
      controller?.abort();
      controller = null;
      requestTimeout = 0;
    }
    function dismiss() {
      stopRequests();
      active = -1;
      for (const option of results.querySelectorAll('.plugin-search-hit')) {
        option.classList.remove('is-active');
        option.setAttribute('aria-selected', 'false');
      }
      results.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    }
    input.__volmitSearch = { cancel: dismiss };
    function paint(hits, query) {
      const focused = results.contains(document.activeElement) ? document.activeElement.getAttribute('href') : null;
      replacingResults = true;
      try {
        results.replaceChildren();
      } finally {
        replacingResults = false;
      }
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
      for (const [index, hit] of hits.slice(0, 8).entries()) {
        const option = element('a', 'plugin-search-hit');
        option.href = hit.href;
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', String(hit.href === focused));
        option.append(element('strong', null, hit.title));
        if (hit.description) {
          option.append(element('small', null, hit.description));
        }
        results.append(option);
        if (hit.href === focused) {
          active = index;
          option.classList.add('is-active');
          option.focus();
        }
      }
    }
    function schedule() {
      const query = input.value.trim();
      stopRequests();
      const id = requestId;
      if (query.length < 2) {
        paint([], query);
        return;
      }
      const local = localHits(query);
      paint(local, query);
      timer = window.setTimeout(async () => {
        const requestController = new AbortController();
        controller = requestController;
        const deadline = window.setTimeout(() => requestController.abort(), 5000);
        requestTimeout = deadline;
        try {
          const remote = await remoteHits(query, requestController.signal);
          if (id === requestId && scope.isConnected && input.value.trim() === query) {
            paint(mergeHits(local, remote), query);
          }
        } catch {
          if (id === requestId && scope.isConnected && input.value.trim() === query) {
            paint(local, query);
          }
        } finally {
          window.clearTimeout(deadline);
          if (controller === requestController) {
            controller = null;
            requestTimeout = 0;
          }
        }
      }, 160);
    }
    input.addEventListener('input', schedule);
    scope.addEventListener('focusout', (event) => {
      if (!replacingResults && !scope.contains(event.relatedTarget)) {
        dismiss();
      }
    });
    scope.addEventListener('keydown', (event) => {
      const options = [...results.querySelectorAll('.plugin-search-hit')];
      if (event.key === 'Escape') {
        dismiss();
        input.focus();
        return;
      }
      if (results.hidden || !options.length || (event.target !== input && !results.contains(event.target))) {
        return;
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const focused = options.indexOf(document.activeElement);
        if (focused >= 0) {
          active = focused;
        }
        active = event.key === 'ArrowDown' ? (active + 1) % options.length : active < 0 ? options.length - 1 : (active - 1 + options.length) % options.length;
        for (const [index, option] of options.entries()) {
          option.classList.toggle('is-active', index === active);
          option.setAttribute('aria-selected', String(index === active));
        }
        options[active].focus();
      } else if (event.key === 'Enter' && event.target === input && active >= 0) {
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
      app.querySelector('.volmit-plugin-search input')?.__volmitSearch?.cancel();
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
        current.__volmitSearch?.cancel();
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
      (query, signal) => remotePluginHits(searchProject(search, project), query, signal),
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
    const close = element('button', 'picker-close');
    close.append(lucideIcon('x'));
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
    copy.append(element('strong', null, project.name));
    const chevron = element('span', 'switch-chevron');
    chevron.append(lucideIcon('chevron-down'));
    chevron.setAttribute('aria-hidden', 'true');
    button.append(projectIcon(project, 'project-switch-icon'), copy, chevron);
    button.addEventListener('click', () => {
      opener = button;
      button.setAttribute('aria-expanded', 'true');
      dialog.dispatchEvent(new Event('volmit-open'));
    });
    return button;
  }

  let sectionInertNodes = [];

  function isolateSectionMenu(app, menu) {
    for (const [node, inert] of sectionInertNodes) {
      node.inert = inert;
    }
    sectionInertNodes = [];
    let branch = menu;
    while (branch && branch !== app) {
      for (const sibling of branch.parentElement?.children || []) {
        if (sibling !== branch && !sibling.matches('.section-menu-backdrop, .project-dialog, script, style')) {
          sectionInertNodes.push([sibling, sibling.inert]);
          sibling.inert = true;
        }
      }
      branch = branch.parentElement;
    }
  }

  function closeSectionMenu(app, restoreFocus) {
    for (const [node, inert] of sectionInertNodes) {
      node.inert = inert;
    }
    sectionInertNodes = [];
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
        closePageToc(app, false);
        menu.setAttribute('role', 'dialog');
        menu.setAttribute('aria-modal', 'true');
        isolateSectionMenu(app, menu);
        menu.querySelector('.mobile-nav-close')?.focus();
        const active = menu.querySelector('[aria-current="page"]');
        const scroller = menu.closest('.volmit-section-sidebar') || menu;
        if (active) {
          scroller.scrollTop = Math.max(0, active.offsetTop - scroller.clientHeight / 2);
        }
      } else {
        closeSectionMenu(app, false);
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
    let stored = 288;
    try {
      const raw = window.localStorage.getItem(sidebarWidthKey);
      const value = Number(raw);
      if (raw !== null && Number.isFinite(value) && value > 0) {
        stored = value;
      }
    } catch {
      stored = 288;
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

  const sidebarStateKey = 'volmit-sidebar-state';
  let sidebarState = readSidebarState();

  function readSidebarState() {
    try {
      const saved = JSON.parse(window.sessionStorage.getItem(sidebarStateKey));
      if (saved && typeof saved.project === 'string' && Array.isArray(saved.expanded)
        && saved.expanded.every((key) => typeof key === 'string') && Number.isFinite(saved.scrollTop) && saved.scrollTop >= 0) {
        return { project: saved.project, expanded: new Set(saved.expanded), scrollTop: saved.scrollTop };
      }
    } catch {}
    return null;
  }

  function rememberSidebar(main) {
    const sidebar = main?.querySelector('.volmit-section-sidebar');
    if (!sidebar) {
      return;
    }
    sidebarState = {
      project: sidebar.dataset.project,
      expanded: new Set([...sidebar.querySelectorAll('.reference-section-toggle[aria-expanded="true"]')].map((toggle) => toggle.dataset.section)),
      scrollTop: sidebar.scrollTop
    };
    try {
      window.sessionStorage.setItem(sidebarStateKey, JSON.stringify({ ...sidebarState, expanded: [...sidebarState.expanded] }));
    } catch {}
  }

  window.addEventListener('pagehide', () => rememberSidebar(document.querySelector('.v-main')));

  function mountProjectNavigation(app, main, content, project, path) {
    const overview = path === project.path;
    const previous = sidebarState?.project === project.path ? sidebarState : null;
    if (sidebarState?.project !== project.path) {
      sidebarState = null;
      try {
        window.sessionStorage.removeItem(sidebarStateKey);
      } catch {}
    }
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
    sidebar.dataset.project = project.path;
    sidebar.setAttribute('aria-label', project.name + ' documentation');
    const nav = element('nav', 'reference-nav');
    nav.setAttribute('aria-label', project.name + ' documentation');
    nav.append(link('All projects', '/', 'parent'), projectButton(project));
    const current = '/' + path;
    let anyOpen = false;
    for (const [index, section] of project.sections.entries()) {
      const key = String(index);
      const open = section.groups.some((group) => group.links.some((page) => page.href === current)) || previous?.expanded.has(key) === true;
      anyOpen = anyOpen || open;
      const block = element('div', 'reference-section');
      const toggle = element('button', 'reference-section-toggle', section.title);
      toggle.prepend(lucideIcon('chevron-right'));
      toggle.type = 'button';
      toggle.dataset.section = key;
      toggle.setAttribute('aria-expanded', String(open));
      const links = element('div', 'reference-section-links');
      links.id = 'volmit-reference-section-' + index;
      toggle.setAttribute('aria-controls', links.id);
      links.hidden = !open;
      for (const group of section.groups) {
        const subgroup = element('div', 'reference-subgroup');
        if (group.title) {
          subgroup.append(element('h4', 'reference-subgroup-heading', group.title));
        }
        const pages = element('div', 'reference-subgroup-links');
        for (const page of group.links) {
          const anchor = link(page.title, page.href);
          anchor.addEventListener('click', () => rememberSidebar(main));
          if (page.href === current) {
            anchor.classList.add('active');
            anchor.setAttribute('aria-current', 'page');
          }
          pages.append(anchor);
        }
        subgroup.append(pages);
        links.append(subgroup);
      }
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(expanded));
        links.hidden = !expanded;
        rememberSidebar(main);
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
      if (!sidebar.isConnected || window.innerWidth < 960) {
        return;
      }
      if (previous) {
        sidebar.scrollTop = previous.scrollTop;
      }
      const active = nav.querySelector('[aria-current="page"]');
      if (active) {
        if (!previous) {
          sidebar.scrollTop = Math.max(0, active.offsetTop - sidebar.clientHeight / 2);
        } else {
          const frame = sidebar.getBoundingClientRect();
          const item = active.getBoundingClientRect();
          if (item.top < frame.top) {
            sidebar.scrollTop += item.top - frame.top;
          } else if (item.bottom > frame.bottom) {
            sidebar.scrollTop += item.bottom - frame.bottom;
          }
        }
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
    const searchIcon = lucideIcon('search');
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
    stopTocWatch?.();
    stopTocWatch = null;
    tocHeadingNodes = [];
    closePageToc(app, false);
    rememberSidebar(main);
    for (const node of main.querySelectorAll('.volmit-project-bar,.volmit-section-sidebar,.home-directory,.mobile-section-toggle,.section-menu-backdrop,.page-toc-toggle,.volmit-page-toc')) {
      node.remove();
    }
    stopTocAlign?.();
    stopTocAlign = null;
    main.style.removeProperty('--volmit-toc-top');
    main.style.removeProperty('--volmit-toc-popup-top');
    main.classList.remove('volmit-home-page', 'volmit-project-overview', 'volmit-reference-page', 'has-page-toc');
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
    const player = { views: new Map(), visible: false, playing: !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches };
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
    const player = { variants, client: 'standard', visible: false, playing: !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, camera: element('select') };
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
      pageObserver = new MutationObserver((records) => {
        if (records.some((record) => record.type === 'childList'
          ? !record.target.closest?.('.plugin-search-results,.picker-results,.picker-meta,.featured-grid,.directory-grid,.directory-result-count,.directory-empty')
          : record.target.matches?.('.v-icon'))) {
          scheduleMount();
        }
      });
    }
    pageObserver.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
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
    if (lostApp) {
      mountAuthFields(lostApp);
      mountWikiIcons(lostApp);
    }
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
    mountCalloutLabels(content);
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
      mountLinkRows(content);
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
    window.requestAnimationFrame(() => {
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
        && Array.isArray(section.groups) && section.groups.every((group) => group && typeof group.title === 'string'
          && Array.isArray(group.links) && group.links.every(validLink)));
  }

  async function start() {
    if (reservedPaths.has(normalizedPath().split('/')[0])) {
      resumePageObserver();
      document.addEventListener('DOMContentLoaded', scheduleMount, { once: true });
      scheduleMount();
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
    }, 2500);
    const catalogTimeout = window.setTimeout(() => controller.abort(), 2500);
    resumePageObserver();
    document.addEventListener('DOMContentLoaded', scheduleMount, { once: true });
    window.addEventListener('popstate', scheduleMount);
    window.addEventListener('resize', () => {
      const app = document.querySelector('.v-application.show-section-menu');
      if (app && window.innerWidth >= 960) {
        closeSectionMenu(app, false);
      }
    });
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
      window.clearTimeout(catalogTimeout);
      catalogSettled = true;
      mount();
    }
  }

  start();
})();
