const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '../../theme/minimal-brutalism.js'), 'utf8');
const first = '<tr><td><a href="/adapt/11-skill-agility">Agility</a></td><td>Moving and jumping</td><td>Wall jumps</td></tr>';
const second = '<tr><td><a href="/adapt/12-skill-architect">Architect</a></td><td>Placing blocks</td><td>Builder tools</td></tr>';
const table = (rows, attributes = '') => `<table ${attributes}><thead><tr><th>Skill</th><th>Earn XP by</th><th>Adaptations include</th></tr></thead><tbody>${rows}</tbody></table>`;

function descriptionText(cell) {
  const copy = cell.cloneNode(true);
  for (const label of copy.querySelectorAll('.volmit-cell-label')) {
    label.remove();
  }
  return copy.textContent;
}

async function boot(body, beforeMount) {
  const dom = new JSDOM(`<div id="root"><div class="v-application"><header class="nav-header"></header>
    <main class="v-main"><div class="v-main__wrap"><header class="page-header-section">
    <div class="page-header-headings"><div class="headline">Skills catalog</div></div></header>
    <article class="contents">${body}</article></div></main></div></div>`, {
    url: 'https://docs.test/adapt/10-skills-catalog', runScripts: 'outside-only'
  });
  const { window } = dom;
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.MutationObserver = class { observe() {} disconnect() {} };
  window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
  window.cancelAnimationFrame = (id) => window.clearTimeout(id);
  window.fetch = async () => ({ ok: true, json: async () => [{
    name: 'Adapt', path: 'adapt', href: '/adapt', description: 'Skills and adaptations',
    sections: [{ title: 'Skills', groups: [{ title: '', links: [
      { title: 'Skills catalog', href: '/adapt/10-skills-catalog' }
    ] }] }]
  }] });
  beforeMount?.(window.document);
  window.eval(source);
  await new Promise((resolve) => setTimeout(resolve, 30));
  return { window, document: window.document, close: () => window.close() };
}

test('single-destination table rows preserve anchors, rich descriptions, and table semantics', async () => {
  let original;
  const body = table(`<tr><td><a class="existing" href="/adapt/11-skill-agility" target="_blank" rel="noopener" aria-label="Agility guide"><strong>Agility</strong></a></td>
    <td>Moving, <em>sprinting</em>, and <code>jumping</code></td><td><span>Wall jumps</span> and safer landings</td></tr>${second}`);
  const page = await boot(body, (document) => {
    const nativeTable = document.querySelector('table');
    original = { table: nativeTable, head: nativeTable.tHead, body: nativeTable.tBodies[0],
      rows: [...nativeTable.tBodies[0].rows], cells: [...nativeTable.querySelectorAll('td')],
      anchor: nativeTable.querySelector('a'), emphasis: nativeTable.querySelector('em'),
      code: nativeTable.querySelector('code'), description: nativeTable.querySelector('td:last-child span') };
  });
  try {
    const { document } = page;
    assert.equal(document.querySelector('table'), original.table);
    assert.equal(original.table.tHead, original.head);
    assert.ok([...original.head.querySelectorAll('th')].every((header) => header.getAttribute('scope') === 'col'));
    assert.equal(original.table.tBodies[0], original.body);
    assert.ok(original.table.classList.contains('volmit-link-table'));
    assert.deepEqual([...original.body.rows], original.rows);
    assert.deepEqual([...original.table.querySelectorAll('td')], original.cells);
    assert.equal(original.table.querySelector('a'), original.anchor);
    assert.equal(original.anchor.getAttribute('href'), '/adapt/11-skill-agility');
    assert.equal(original.anchor.getAttribute('target'), '_blank');
    assert.equal(original.anchor.getAttribute('rel'), 'noopener');
    assert.equal(original.anchor.getAttribute('aria-label'), 'Agility guide');
    assert.equal(original.anchor.textContent, 'Agility');
    assert.ok(original.anchor.classList.contains('existing'));
    assert.ok(original.anchor.classList.contains('volmit-row-link'));
    assert.equal(original.table.querySelector('em'), original.emphasis);
    assert.equal(original.table.querySelector('code'), original.code);
    assert.equal(original.table.querySelector('td:last-child span:not(.volmit-cell-label)'), original.description);
    assert.equal(descriptionText(original.cells[1]), 'Moving, sprinting, and jumping');
    assert.equal(descriptionText(original.cells[2]), 'Wall jumps and safer landings');
    assert.equal(original.table.querySelectorAll('a').length, 2);
    for (const row of original.rows) {
      assert.ok(row.classList.contains('volmit-link-row'));
      assert.equal(row.hasAttribute('tabindex'), false);
      assert.equal(row.hasAttribute('role'), false);
    }
    original.anchor.focus();
    assert.equal(document.activeElement, original.anchor);
    assert.equal(original.anchor.dispatchEvent(new page.window.MouseEvent('contextmenu', { bubbles: true, cancelable: true })), true);
  } finally { page.close(); }
});

test('mixed, merged, interactive, nested, and specification tables remain unchanged', async () => {
  const cases = {
    mixed: first + '<tr><td>Architect</td><td>Placing blocks</td><td>Builder tools</td></tr>',
    prefix: first.replace('<td><a', '<td>Read <a') + second,
    suffix: first.replace('</a></td>', '</a> guide</td>') + second,
    multiple: first.replace('Moving and jumping', '<a href="/adapt/other">More</a>') + second,
    control: first.replace('Moving and jumping', '<button>Run action</button>') + second,
    editable: first.replace('Moving and jumping', '<span contenteditable="true">Edit</span>') + second,
    explicitRole: first.replace('Moving and jumping', '<span role="button">Action</span>') + second,
    comboboxRole: first.replace('Moving and jumping', '<span role="combobox">Select a value</span>') + second,
    sliderRole: first.replace('Moving and jumping', '<span role="slider">Adjust a value</span>') + second,
    menuitemRole: first.replace('Moving and jumping', '<span role="menuitem">Choose an action</span>') + second,
    listboxRole: first.replace('Moving and jumping', '<span role="listbox">Choose a value</span>') + second,
    tabStop: first.replace('Moving and jumping', '<span tabindex="0">Focusable</span>') + second,
    media: first.replace('Moving and jumping', '<video controls></video>') + second,
    details: first.replace('Moving and jumping', '<details><summary>More</summary>Details</details>') + second,
    rowspan: first.replace('<td>', '<td rowspan="2">') + second,
    colspan: first.replace('<td>', '<td colspan="2">') + second,
    bodyHeading: first.replace('<td>', '<th>').replace('</td>', '</th>') + second,
    nested: first.replace('Moving and jumping', '<table><tbody><tr><td>Nested</td></tr></tbody></table>') + second,
    firstCellList: first.replace('<td><a', '<td><ul><li><a').replace('</a></td>', '</a></li></ul></td>') + second,
    singleton: first
  };
  const body = Object.entries(cases).map(([name, rows]) => table(rows, `data-case="${name}"`)).join('')
    + table(first + second, 'class="spec-strip" data-case="specification"');
  const page = await boot(body);
  try {
    for (const candidate of page.document.querySelectorAll('table[data-case]')) {
      assert.equal(candidate.classList.contains('volmit-link-table'), false, candidate.dataset.case);
      assert.equal(candidate.querySelectorAll('.volmit-row-link').length, 0, candidate.dataset.case);
    }
  } finally { page.close(); }
});

test('link-led unordered lists enlarge their existing anchors without moving description nodes', async () => {
  let original;
  const body = `<ul id="guides"><li><a href="/adapt/11-skill-agility" aria-label="Agility guide"><strong>Agility</strong></a> - <em>Movement</em> and <code>jumps</code></li>
    <li><p><a href="/adapt/12-skill-architect" target="_blank" rel="noopener">Architect</a>: <span>Builder tools</span></p></li></ul>`;
  const page = await boot(body, (document) => {
    const list = document.querySelector('#guides');
    original = { list, anchors: [...list.querySelectorAll('a')], items: [...list.children],
      paragraph: list.querySelector('p'), emphasis: list.querySelector('em'), code: list.querySelector('code'),
      description: list.querySelector('span'), nodes: [...list.children[0].childNodes], text: list.textContent };
  });
  try {
    const list = page.document.querySelector('#guides');
    assert.equal(list, original.list);
    assert.ok(list.classList.contains('volmit-link-list'));
    assert.deepEqual([...list.children], original.items);
    assert.deepEqual([...list.querySelectorAll('a')], original.anchors);
    assert.deepEqual([...list.children[0].childNodes], original.nodes);
    assert.equal(list.querySelector('p'), original.paragraph);
    assert.equal(list.querySelector('em'), original.emphasis);
    assert.equal(list.querySelector('code'), original.code);
    assert.equal(list.querySelector('span'), original.description);
    assert.equal(list.textContent, original.text);
    assert.equal(original.anchors[0].textContent, 'Agility');
    assert.equal(original.anchors[0].getAttribute('aria-label'), 'Agility guide');
    assert.equal(original.anchors[1].textContent, 'Architect');
    assert.equal(original.anchors[1].getAttribute('target'), '_blank');
    assert.equal(original.anchors[1].getAttribute('rel'), 'noopener');
    for (const item of original.items) {
      assert.ok(item.classList.contains('volmit-link-item'));
      assert.equal(item.hasAttribute('tabindex'), false);
    }
    for (const anchor of original.anchors) {
      assert.ok(anchor.classList.contains('volmit-list-link'));
      assert.ok(anchor.classList.contains('volmit-row-link'));
    }
    assert.equal(list.querySelectorAll('.volmit-link-label,.volmit-link-description').length, 0);
  } finally { page.close(); }
});

test('prose, multiple destinations, nested lists, ordered instructions, and existing card lists stay untouched', async () => {
  const cases = {
    prefix: '<li>Read <a href="/a">A</a></li><li>Read <a href="/b">B</a></li>',
    prose: '<li><a href="/a">A</a> explains settings.</li><li><a href="/b">B</a> explains recipes.</li>',
    multiple: '<li><a href="/a">A</a> or <a href="/b">B</a></li><li><a href="/c">C</a></li>',
    sameDestination: '<li><a href="/a">A</a><a href="/a">Again</a></li><li><a href="/b">B</a></li>',
    nested: '<li><a href="/a">A</a><ul><li><a href="/nested">Nested</a></li></ul></li><li><a href="/b">B</a></li>',
    control: '<li><a href="/a">A</a><button>Action</button></li><li><a href="/b">B</a></li>',
    roleControl: '<li><a href="/a">A</a>: <span role="combobox">Select a value</span></li><li><a href="/b">B</a></li>',
    media: '<li><a href="/a">A</a><img src="test.png" alt="Sample"></li><li><a href="/b">B</a></li>',
    paragraphs: '<li><p><a href="/a">A</a></p><p>Another paragraph.</p></li><li><a href="/b">B</a></li>',
    mixed: '<li><a href="/a">A</a></li><li>Ordinary text.</li>',
    codeBlock: '<li><a href="/a">A</a><pre> - run a command</pre></li><li><a href="/b">B</a></li>',
    quote: '<li><a href="/a">A</a><blockquote> - quotation</blockquote></li><li><a href="/b">B</a></li>',
    table: '<li><a href="/a">A</a><table><tbody><tr><td> - data</td></tr></tbody></table></li><li><a href="/b">B</a></li>',
    block: '<li><a href="/a">A</a><div> - block content</div></li><li><a href="/b">B</a></li>',
    heading: '<li><a href="/a">A</a><h3> - subsection</h3></li><li><a href="/b">B</a></li>',
    divider: '<li><a href="/a">A</a><hr></li><li><a href="/b">B</a></li>',
    singleton: '<li><a href="/a">A</a></li>'
  };
  const plain = '<li><a href="/a">A</a></li><li><a href="/b">B</a></li>';
  const body = Object.entries(cases).map(([name, items]) => `<ul data-case="${name}">${items}</ul>`).join('')
    + `<ol data-case="ordered">${plain}</ol><ul class="links-list" data-case="cards">${plain}</ul><ul class="grid-list" data-case="grid">${plain}</ul>`
    + '<p id="prose">Read <a href="/a">the guide</a> before you continue.</p>';
  let originals;
  const page = await boot(body, (document) => {
    originals = [...document.querySelectorAll('[data-case],#prose')].map((node) => ({ node, html: node.innerHTML }));
  });
  try {
    for (const { node, html } of originals) {
      assert.equal(node.classList.contains('volmit-link-list'), false, node.dataset.case || 'paragraph');
      assert.equal(node.querySelectorAll('.volmit-row-link').length, 0, node.dataset.case || 'paragraph');
      assert.equal(node.innerHTML, html, node.dataset.case || 'paragraph');
    }
  } finally { page.close(); }
});

test('repeated mounts and replacement articles remain idempotent and keep one native link per row', async () => {
  const body = table(first + second) + '<ul><li><a href="/a">A</a></li><li><a href="/b">B</a></li></ul>';
  const page = await boot(body);
  try {
    const article = page.document.querySelector('.contents');
    const anchors = [...article.querySelectorAll('a')];
    for (let index = 0; index < 3; index += 1) {
      page.window.dispatchEvent(new page.window.Event('pagereveal'));
    }
    assert.deepEqual([...article.querySelectorAll('a')], anchors);
    assert.equal(article.querySelectorAll('.volmit-row-link').length, 4);
    assert.equal(article.querySelectorAll('[tabindex], [role="link"], [role="button"]').length, 0);
    article.innerHTML = body;
    page.window.dispatchEvent(new page.window.Event('pagereveal'));
    const replacements = [...article.querySelectorAll('a')];
    assert.equal(replacements.length, 4);
    assert.ok(replacements.every((anchor) => anchor.classList.contains('volmit-row-link')));
    assert.ok(replacements.every((anchor) => !anchors.includes(anchor)));
    assert.deepEqual(replacements.map((anchor) => anchor.getAttribute('href')), ['/adapt/11-skill-agility', '/adapt/12-skill-architect', '/a', '/b']);
  } finally { page.close(); }
});

test('rows lose their stretched-link treatment when an additional destination appears', async () => {
  const page = await boot(table(first + second) + '<ul><li><a href="/a">A</a></li><li><a href="/b">B</a></li></ul>');
  try {
    const table = page.document.querySelector('.contents table');
    const list = page.document.querySelector('.contents ul');
    assert.ok(table.classList.contains('volmit-link-table'));
    assert.ok(list.classList.contains('volmit-link-list'));
    const tableExtra = page.document.createElement('a');
    tableExtra.href = '/extra-table';
    tableExtra.textContent = 'Another destination';
    table.tBodies[0].rows[0].cells[1].append(tableExtra);
    const listExtra = page.document.createElement('a');
    listExtra.href = '/extra-list';
    listExtra.textContent = 'Another destination';
    list.children[0].append(listExtra);
    page.window.dispatchEvent(new page.window.Event('pagereveal'));
    assert.equal(table.classList.contains('volmit-link-table'), false);
    assert.equal(list.classList.contains('volmit-link-list'), false);
    assert.equal(table.querySelectorAll('.volmit-link-row,.volmit-row-link').length, 0);
    assert.equal(list.querySelectorAll('.volmit-link-item,.volmit-list-link,.volmit-row-link').length, 0);
    assert.equal(table.querySelectorAll('a').length, 3);
    assert.equal(table.querySelectorAll('.volmit-cell-label').length, 0);
    assert.equal(list.querySelectorAll('a').length, 3);
    assert.equal(tableExtra.getAttribute('href'), '/extra-table');
    assert.equal(listExtra.getAttribute('href'), '/extra-list');
  } finally { page.close(); }
});

test('mobile field labels use column headers without replacing content or duplicating accessible header names', async () => {
  let original;
  const body = table(first + second).replace('Earn XP by', 'Earn <strong>XP</strong> by').replace('<th>Skill', '<th scope="row">Skill');
  const page = await boot(body, (document) => {
    const candidate = document.querySelector('table');
    original = { head: candidate.tHead, headers: [...candidate.tHead.querySelectorAll('th')],
      anchors: [...candidate.querySelectorAll('a')],
      nodes: [...candidate.querySelectorAll('tbody td')].map((cell) => [...cell.childNodes]) };
  });
  try {
    const candidate = page.document.querySelector('.contents table');
    const cells = [...candidate.querySelectorAll('tbody td')];
    assert.equal(candidate.tHead, original.head);
    assert.deepEqual([...candidate.tHead.querySelectorAll('th')], original.headers);
    assert.equal(original.headers[0].getAttribute('scope'), 'row');
    assert.ok(original.headers.slice(1).every((header) => header.getAttribute('scope') === 'col'));
    assert.equal(candidate.tHead.hidden, false);
    assert.notEqual(candidate.tHead.getAttribute('aria-hidden'), 'true');
    assert.deepEqual([...candidate.querySelectorAll('a')], original.anchors);
    for (const [index, cell] of cells.entries()) {
      const labels = [...cell.querySelectorAll(':scope > .volmit-cell-label')];
      if (index % 3 === 0) {
        assert.equal(labels.length, 0);
      } else {
        assert.equal(labels.length, 1);
        assert.equal(labels[0].textContent, index % 3 === 1 ? 'Earn XP by' : 'Adaptations include');
        assert.equal(labels[0].getAttribute('aria-hidden'), 'true');
        assert.equal(labels[0].hasAttribute('tabindex'), false);
      }
      const contents = [...cell.childNodes].filter((node) => !labels.includes(node));
      assert.deepEqual(contents, original.nodes[index]);
    }
    const labels = [...candidate.querySelectorAll('.volmit-cell-label')];
    for (let index = 0; index < 3; index += 1) {
      page.window.dispatchEvent(new page.window.Event('pagereveal'));
    }
    assert.deepEqual([...candidate.querySelectorAll('.volmit-cell-label')], labels);
    original.headers[1].textContent = 'XP sources';
    page.window.dispatchEvent(new page.window.Event('pagereveal'));
    assert.equal(candidate.querySelectorAll('.volmit-cell-label').length, 4);
    assert.deepEqual([...candidate.querySelectorAll('tbody td:nth-child(2) > .volmit-cell-label')].map((label) => label.textContent), ['XP sources', 'XP sources']);
    assert.equal(original.anchors[0].textContent, 'Agility');
    assert.equal(original.anchors[1].textContent, 'Architect');
  } finally { page.close(); }
});
