import MarkdownIt from 'markdown-it';
import attributes from 'markdown-it-attrs';
import imageSize from 'markdown-it-imsize';
import { parse } from 'yaml';
import { JSDOM } from 'jsdom';
import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';

loadLanguages(['bash', 'groovy', 'java', 'javascript', 'json', 'kotlin', 'powershell', 'python', 'toml', 'yaml']);

const markdown = new MarkdownIt({ html: true, linkify: true })
  .use(imageSize)
  .use(attributes);

markdown.renderer.rules.fence = (tokens, index) => {
  const token = tokens[index];
  const language = token.info.trim().split(/\s+/)[0].toLowerCase();
  const grammar = Prism.languages[language];
  const content = grammar
    ? Prism.highlight(token.content, grammar, language)
    : markdown.utils.escapeHtml(token.content);
  return `<pre class="prismjs line-numbers" v-pre="true"><code class="language-${markdown.utils.escapeHtml(language || 'none')}">${content}</code></pre>\n`;
};

function headingId(text) {
  return text.trim().toLowerCase().normalize('NFKD')
    .replace(/\p{Mark}/gu, '')
    .replace(/[^\p{Letter}\p{Number}_\s-]/gu, '')
    .replace(/\s+/g, '-') || 'section';
}

function dateText(value) {
  return value instanceof Date ? value.toISOString() : String(value ?? '');
}

export function renderMarkdownPage(source, pagePath) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatter) throw new Error(`Missing Wiki.js frontmatter: ${pagePath}`);
  const data = parse(frontmatter[1]);
  if (!data || typeof data.title !== 'string') throw new Error(`Missing page title: ${pagePath}`);
  const fragment = JSDOM.fragment(markdown.render(source.slice(frontmatter[0].length)));
  const document = fragment.ownerDocument;
  const toc = [];
  const parents = [];
  const usedIds = new Set([...fragment.querySelectorAll('[id]')].map((node) => node.id));

  for (const heading of fragment.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
    const title = heading.textContent.trim();
    if (!heading.id) {
      const base = headingId(title);
      let id = base;
      let suffix = 2;
      while (usedIds.has(id)) id = `${base}-${suffix++}`;
      heading.id = id;
      usedIds.add(id);
    }
    heading.classList.add('toc-header');
    const anchor = document.createElement('a');
    anchor.className = 'toc-anchor';
    anchor.href = `#${heading.id}`;
    anchor.textContent = '¶';
    anchor.setAttribute('aria-hidden', 'true');
    heading.prepend(anchor, ' ');
    const entry = { title, anchor: `#${heading.id}`, children: [] };
    const level = Number(heading.tagName.slice(1));
    while (parents.length && parents.at(-1).level >= level) parents.pop();
    (parents.at(-1)?.entry.children ?? toc).push(entry);
    parents.push({ level, entry });
  }

  for (const table of fragment.querySelectorAll('table')) {
    if (table.parentElement?.classList.contains('table-container')) continue;
    const wrapper = document.createElement('div');
    wrapper.className = 'table-container';
    table.replaceWith(wrapper);
    wrapper.append(table);
  }
  for (const link of fragment.querySelectorAll('a[href]')) {
    const href = link.getAttribute('href');
    if (href.startsWith('/') && !href.startsWith('//')) link.classList.add('is-internal-link', 'is-valid-page');
    else if (/^https?:\/\//i.test(href)) link.classList.add('is-external-link');
  }

  const container = document.createElement('div');
  container.setAttribute('v-pre', 'true');
  container.append(fragment);
  return {
    html: container.outerHTML,
    toc,
    metadata: {
      path: pagePath,
      title: data.title,
      description: String(data.description ?? ''),
      tags: (Array.isArray(data.tags) ? data.tags : String(data.tags ?? '').split(','))
        .map((tag) => String(tag).trim()).filter(Boolean),
      date: dateText(data.date),
      dateCreated: dateText(data.dateCreated),
      published: data.published !== false
    }
  };
}

export function applyLocalPage(shell, page, { plain = false } = {}) {
  const dom = new JSDOM(shell);
  const document = dom.window.document;
  const component = document.querySelector('#root > page');
  const slot = component?.querySelector('template[slot="contents"]');
  if (!component || !slot) throw new Error('The upstream response does not contain a Wiki.js page shell');
  const metadata = page.metadata;
  component.setAttribute('path', metadata.path);
  component.setAttribute('locale', 'en');
  component.setAttribute('title', metadata.title);
  component.setAttribute('description', metadata.description);
  component.setAttribute('filename', `${metadata.path}.md`);
  component.setAttribute('created-at', metadata.dateCreated);
  component.setAttribute('updated-at', metadata.date);
  component.setAttribute(':is-published', String(metadata.published));
  component.setAttribute(':page-id', '0');
  component.setAttribute(':tags', JSON.stringify(metadata.tags.map((tag) => ({ tag, title: tag }))));
  component.setAttribute('toc', Buffer.from(JSON.stringify(page.toc)).toString('base64'));
  slot.innerHTML = page.html;
  document.title = `${metadata.title} | VolmitSoftware`;
  for (const [selector, value] of [
    ['meta[name="description"]', metadata.description],
    ['meta[property="og:title"]', metadata.title],
    ['meta[property="og:description"]', metadata.description]
  ]) document.querySelector(selector)?.setAttribute('content', value);

  for (const node of document.querySelectorAll('link[href],script[src],script[data-volmit-theme]')) {
    const target = node.getAttribute('href') ?? node.getAttribute('src') ?? '';
    if (node.hasAttribute('data-volmit-theme') || /^\/(?:__volmit_theme\.(?:css|js)|theme\/minimal-brutalism\.(?:css|js))(?:\?|$)/.test(target)) node.remove();
  }
  if (!plain) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/__volmit_theme.css';
    link.setAttribute('data-volmit-theme-preview', '');
    const script = document.createElement('script');
    script.src = '/__volmit_theme.js';
    script.setAttribute('data-volmit-theme-preview', '');
    document.head.append(link, script);
  }
  const html = dom.serialize();
  dom.window.close();
  return html;
}
