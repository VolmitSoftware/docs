import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const host = "127.0.0.1";
const port = Number.parseInt(process.env.PORT ?? "4177", 10);
const upstreamOrigin = "https://docs.volmitsoftware.com";
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const themePath = path.resolve(scriptDirectory, "../theme/minimal-brutalism.css");
const fontDirectory = path.resolve(scriptDirectory, "../home-assets/fonts");

const fontContentTypes = new Map([
  [".ttf", "font/ttf"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"]
]);

function copyHeaders(source, response) {
  for (const [name, value] of source.entries()) {
    if (["content-encoding", "content-length", "transfer-encoding", "content-security-policy"].includes(name)) {
      continue;
    }
    response.setHeader(name, value);
  }
}

function rewriteLocation(value) {
  return value?.startsWith(upstreamOrigin) ? value.slice(upstreamOrigin.length) || "/" : value;
}

function readBody(request) {
  if (request.method === "GET" || request.method === "HEAD") {
    return Promise.resolve(undefined);
  }
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}

async function proxy(request, response) {
  const localUrl = new URL(request.url ?? "/", `http://${host}:${port}`);

  if (localUrl.pathname === "/__volmit_theme.css") {
    const css = await readFile(themePath);
    response.writeHead(200, {
      "content-type": "text/css; charset=utf-8",
      "cache-control": "no-store"
    });
    response.end(css);
    return;
  }

  if (localUrl.pathname.startsWith("/home-assets/fonts/")) {
    const fontName = path.basename(localUrl.pathname);
    const fontPath = path.join(fontDirectory, fontName);
    const contentType = fontContentTypes.get(path.extname(fontName).toLowerCase());
    if (!contentType || fontName !== localUrl.pathname.slice("/home-assets/fonts/".length)) {
      response.writeHead(404);
      response.end();
      return;
    }
    const font = await readFile(fontPath);
    response.writeHead(200, {
      "content-type": contentType,
      "cache-control": "no-store"
    });
    response.end(font);
    return;
  }

  const upstreamUrl = new URL(localUrl.pathname + localUrl.search, upstreamOrigin);
  const body = await readBody(request);
  const upstreamResponse = await fetch(upstreamUrl, {
    method: request.method,
    headers: {
      accept: request.headers.accept ?? "*/*",
      "accept-language": request.headers["accept-language"] ?? "en-US,en;q=0.9",
      ...(request.headers["content-type"] ? { "content-type": request.headers["content-type"] } : {}),
      "user-agent": request.headers["user-agent"] ?? "Volmit theme preview"
    },
    body,
    redirect: "manual"
  });

  copyHeaders(upstreamResponse.headers, response);
  const location = rewriteLocation(upstreamResponse.headers.get("location"));
  if (location) {
    response.setHeader("location", location);
  }

  const contentType = upstreamResponse.headers.get("content-type") ?? "";
  if (contentType.includes("text/html")) {
    const source = await upstreamResponse.text();
    const themeLink = localUrl.searchParams.get("plain") === "1"
      ? ""
      : '<link rel="stylesheet" href="/__volmit_theme.css" data-volmit-theme-preview>';
    const html = source.replace("</head>", `${themeLink}</head>`);
    response.statusCode = upstreamResponse.status;
    response.setHeader("cache-control", "no-store");
    response.end(html);
    return;
  }

  response.statusCode = upstreamResponse.status;
  response.end(Buffer.from(await upstreamResponse.arrayBuffer()));
}

const server = http.createServer((request, response) => {
  proxy(request, response).catch((error) => {
    response.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
    response.end(`Preview proxy failed: ${error.message}`);
  });
});

server.listen(port, host, () => {
  console.log(`Volmit wiki theme preview: http://${host}:${port}`);
  console.log(`Original styling: http://${host}:${port}/?plain=1`);
});
