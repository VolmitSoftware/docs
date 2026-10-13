import http from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, realpath, stat } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { applyLocalPage, renderMarkdownPage } from './preview-markdown.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultUpstream = 'https://docs.volmitsoftware.com';
export const searchQuery = 'query ($query: String!) { pages { search(query: $query) { results { title path description } } } }';
const localizationQuery = `query ($locale: String!, $namespace: String!) {
  localization {
    translations(locale: $locale, namespace: $namespace) {
      key
      value
      __typename
    }
    __typename
  }
}
`;
const localFiles = new Map([
  ['/__volmit_theme.css', 'theme/minimal-brutalism.css'],
  ['/__volmit_theme.js', 'theme/minimal-brutalism.js'],
  ['/theme/minimal-brutalism.css', 'theme/minimal-brutalism.css'],
  ['/theme/minimal-brutalism.js', 'theme/minimal-brutalism.js'],
  ['/theme/projects.json', 'theme/projects.json']
]);
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'], ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'], ['.gif', 'image/gif'],
  ['.svg', 'image/svg+xml'], ['.webp', 'image/webp'], ['.avif', 'image/avif'],
  ['.ico', 'image/x-icon'], ['.mp4', 'video/mp4'], ['.webm', 'video/webm'],
  ['.ttf', 'font/ttf'], ['.otf', 'font/otf'], ['.woff', 'font/woff'], ['.woff2', 'font/woff2'],
  ['.pdf', 'application/pdf']
]);

function finish(response, status, text, method = 'GET') {
  response.writeHead(status, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
  response.end(method === 'HEAD' ? undefined : text);
}

export async function containedFile(root, relativePath) {
  const location = path.resolve(root, relativePath);
  if (!location.startsWith(root + path.sep)) return null;
  try {
    const resolved = await realpath(location);
    if (!resolved.startsWith(root + path.sep) || !(await stat(resolved)).isFile()) return null;
    return resolved;
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return null;
    throw error;
  }
}

async function serveFile(request, response, filename) {
  const size = (await stat(filename)).size;
  const headers = {
    'content-type': contentTypes.get(path.extname(filename).toLowerCase()) ?? 'application/octet-stream',
    'cache-control': 'no-store', 'accept-ranges': 'bytes', 'x-content-type-options': 'nosniff'
  };
  let start = 0;
  let end = size - 1;
  let status = 200;
  if (request.headers.range) {
    const range = request.headers.range.match(/^bytes=(\d*)-(\d*)$/);
    if (range && (range[1] || range[2])) {
      start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
      end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    }
    if (!range || (!range[1] && !range[2]) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size) {
      response.writeHead(416, { ...headers, 'content-range': `bytes */${size}` });
      response.end();
      return;
    }
    status = 206;
    headers['content-range'] = `bytes ${start}-${end}/${size}`;
  }
  headers['content-length'] = size === 0 ? 0 : end - start + 1;
  response.writeHead(status, headers);
  if (request.method === 'HEAD' || size === 0) response.end();
  else await pipeline(createReadStream(filename, { start, end }), response);
}

async function graphqlBody(request) {
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length <= 8192) chunks.push(chunk);
  }
  if (length > 8192) return null;
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (Array.isArray(value)) {
      if (value.length < 1 || value.length > 2) return null;
      const translations = [];
      for (const operation of value) {
        if (operation?.query !== localizationQuery || operation.variables?.locale !== 'en' || !['common', 'auth'].includes(operation.variables?.namespace)) return null;
        translations.push({ query: localizationQuery, variables: { locale: 'en', namespace: operation.variables.namespace } });
      }
      return JSON.stringify(translations);
    }
    if (value.query !== searchQuery || typeof value.variables?.query !== 'string' || value.variables.query.length > 2000) return null;
    return JSON.stringify({ query: searchQuery, variables: { query: value.variables.query } });
  } catch { return null; }
}

export function createPreviewServer({ root = repositoryRoot, upstreamOrigin = defaultUpstream, fetchUpstream = fetch } = {}) {
  root = path.resolve(root);
  let shellPromise;
  async function shell() {
    if (!shellPromise) {
      shellPromise = fetchUpstream(new URL('/en/home', upstreamOrigin), { signal: AbortSignal.timeout(20000) })
        .then(async (response) => {
          if (!response.ok) throw new Error(`Wiki.js shell returned ${response.status}`);
          return response.text();
        }).catch((error) => { shellPromise = undefined; throw error; });
    }
    return shellPromise;
  }
  async function forward(request, response, pathname, body) {
    const upstream = await fetchUpstream(new URL(pathname, upstreamOrigin), {
      method: request.method,
      headers: { accept: request.headers.accept ?? '*/*', ...(body ? { 'content-type': 'application/json' } : {}) },
      body, redirect: 'manual', signal: AbortSignal.timeout(20000)
    });
    for (const name of ['content-type', 'cache-control']) {
      if (upstream.headers.has(name)) response.setHeader(name, upstream.headers.get(name));
    }
    response.statusCode = upstream.status;
    response.end(request.method === 'HEAD' ? undefined : Buffer.from(await upstream.arrayBuffer()));
  }
  async function handle(request, response) {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      if (request.method === 'POST' && url.pathname === '/graphql' && !url.search) {
        const body = await graphqlBody(request);
        if (body) return forward(request, response, '/graphql', body);
      }
      response.setHeader('allow', 'GET, HEAD');
      return finish(response, 405, 'The preview accepts page reads, documentation search, and English shell translations only.');
    }
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); }
    catch { return finish(response, 400, 'Invalid URL encoding.', request.method); }
    if (pathname.includes('\\') || pathname.includes('\0') || pathname.split('/').some((part) => part === '.' || part === '..')) {
      return finish(response, 400, 'Invalid path.', request.method);
    }
    const localAsset = localFiles.get(pathname) ?? (/^\/[a-z0-9-]+-assets\//i.test(pathname) && contentTypes.has(path.extname(pathname).toLowerCase()) ? pathname.slice(1) : null);
    if (localAsset) {
      const filename = await containedFile(root, localAsset);
      if (!filename) return finish(response, 404, 'Local asset not found.', request.method);
      return serveFile(request, response, filename);
    }
    if (pathname.startsWith('/_assets/') || ['/logo.png', '/favicon.ico'].includes(pathname)) {
      return forward(request, response, url.pathname + url.search);
    }
    const pagePath = pathname.replace(/^\/en(?:\/|$)/, '/').replace(/^\/+|\/+$/g, '') || 'home';
    if (!/^[\p{Letter}\p{Number}_-]+(?:\/[\p{Letter}\p{Number}_-]+)*$/u.test(pagePath)) {
      return finish(response, 404, 'Local documentation page not found.', request.method);
    }
    const filename = await containedFile(root, `${pagePath}.md`);
    if (!filename) return finish(response, 404, 'Local documentation page not found.', request.method);
    const source = await readFile(filename, 'utf8');
    const rendered = renderMarkdownPage(source, pagePath);
    const html = applyLocalPage(await shell(), rendered, { plain: url.searchParams.get('plain') === '1' });
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-volmit-preview-source': 'local' });
    response.end(request.method === 'HEAD' ? undefined : html);
  }
  return http.createServer((request, response) => {
    handle(request, response).catch((error) => {
      if (response.headersSent) { response.destroy(error); return; }
      finish(response, 502, `Preview failed: ${error.message}`, request.method);
    });
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const host = '127.0.0.1';
  const port = Number.parseInt(process.env.PORT ?? '4177', 10);
  const server = createPreviewServer();
  server.listen(port, host, () => {
    console.log(`Local documentation preview: http://${host}:${port}`);
    console.log(`Original Wiki.js styling: http://${host}:${port}/?plain=1`);
    console.log('Markdown, assets, and theme are local. Wiki.js application files, translations, and search use the hosted wiki.');
  });
}
