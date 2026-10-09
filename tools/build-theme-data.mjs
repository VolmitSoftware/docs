import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "theme/projects.json");
const groups = new Map([
  ["choose a plugin", "Plugins"],
  ["plugins", "Plugins"],
  ["developer tools", "Developer tools"]
]);
const projectMeta = new Map([
  ["iris", { color: "#2dd4bf", featured: true }],
  ["adapt", { color: "#fb7185", featured: true }],
  ["wormholes", { color: "#f5b942", featured: true }],
  ["gloss", { color: "#c084fc", featured: true }],
  ["react", { color: "#38bdf8", featured: true }],
  ["foundation", { color: "#a8a29e" }],
  ["hiddenore", { color: "#e7c15a" }],
  ["rift", { color: "#e4e4e7" }],
  ["shapedportals", { color: "#e879f9" }],
  ["skyprime", { color: "#7dd3fc" }],
  ["static", { color: "#cbd5e1" }],
  ["gamemodeswitcher", { color: "#bef264" }],
  ["biletools", { color: "#4ade80" }],
  ["volmlib", { color: "#d4d4d8" }],
  ["servermultiplexor", { color: "#818cf8" }]
]);

function plainText(value) {
  return value.replace(/<[^>]*>/g, " ").replace(/\{\.[^}]*\}/g, "")
    .replace(/[`*_]/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function labelParts(value) {
  const annotation = value.match(/\s+\*([^*]+)\*\s*$/);
  return {
    title: plainText(annotation ? value.slice(0, annotation.index) : value),
    description: annotation ? plainText(annotation[1]) : ""
  };
}

function pageHref(value) {
  if (!/^\/(?!\/)/.test(value)) {
    return null;
  }
  const pathname = value.split(/[?#]/, 1)[0].replace(/\.md$/, "").replace(/\/$/, "");
  return /^\/[a-z0-9][a-z0-9/_-]*$/i.test(pathname) && !pathname.includes("//") ? pathname : null;
}

function frontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const fields = new Map();
  for (const line of (match?.[1] ?? "").split(/\r?\n/)) {
    const property = line.match(/^([a-zA-Z]+):\s*(.*?)\s*$/);
    if (property) {
      fields.set(property[1], property[2].replace(/^(["'])(.*)\1$/, "$2"));
    }
  }
  return { fields, body: match ? source.slice(match[0].length) : source };
}

function sections(source) {
  const result = [];
  const headings = [...source.matchAll(/^##\s+(.+)$/gm)];
  let start = 0;
  let title = "Documentation";
  for (const heading of headings) {
    result.push({ title, body: source.slice(start, heading.index) });
    title = plainText(heading[1]);
    start = heading.index + heading[0].length;
  }
  result.push({ title, body: source.slice(start) });
  return result;
}

function links(source) {
  const result = [];
  const pattern = /<a\b([^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*)>([\s\S]*?)<\/a>|(?<!!)\[([^\]\n]+)\]\(([^\s)]+)\)/gi;
  for (const match of source.matchAll(pattern)) {
    const html = match[3];
    const href = pageHref(match[2] ?? match[5]);
    if (!href) {
      continue;
    }
    const title = html?.match(/<strong\b[^>]*>([\s\S]*?)<\/strong>/i)?.[1];
    const description = html?.match(/<span\b[^>]*class=["'][^"']*text--secondary[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[1];
    const mark = html?.match(/<span\b[^>]*class=["'][^"']*project-mark[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[1];
    const icon = html?.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1];
    const label = labelParts(title ?? html ?? match[4]);
    const lineStart = source.lastIndexOf("\n", match.index) + 1;
    const prefix = source.slice(lineStart, match.index);
    result.push({
      href,
      title: label.title,
      description: description ? plainText(description) : label.description,
      ...(icon ? { icon } : {}),
      ...(mark ? { mark: plainText(mark) } : {}),
      priority: /^\s*(?:[-*+]\s|\|)/.test(prefix) ? 2 : html ? 1 : 0
    });
  }
  return result;
}

async function readPage(href) {
  try {
    return frontmatter(await readFile(path.join(root, `${href.slice(1)}.md`), "utf8"));
  } catch (error) {
    throw new Error(`Cannot read documentation page ${href}`, { cause: error });
  }
}

function navigation(source, projectHref) {
  const candidates = sections(source).map((section) => {
    const groups = [];
    const headings = [...section.body.matchAll(/^###\s+(.+)$/gm)];
    let start = 0;
    let title = "";
    for (const heading of headings) {
      groups.push({ title, links: links(section.body.slice(start, heading.index)).filter((link) => link.href !== projectHref) });
      title = plainText(heading[1]);
      start = heading.index + heading[0].length;
    }
    groups.push({ title, links: links(section.body.slice(start)).filter((link) => link.href !== projectHref) });
    return { title: section.title, groups };
  });
  const preferred = new Map();
  for (const section of candidates) {
    for (const group of section.groups) {
      for (const link of group.links) {
        if (!preferred.has(link.href) || preferred.get(link.href).priority < link.priority) {
          preferred.set(link.href, link);
        }
      }
    }
  }
  return candidates.map((section) => ({
    title: section.title,
    groups: section.groups.map((group) => ({
      title: group.title,
      links: group.links.filter((link) => preferred.get(link.href) === link)
        .map(({ title, href }) => ({ title, href }))
    })).filter((group) => group.links.length > 0)
  })).filter((section) => section.groups.length > 0);
}

async function buildCatalog() {
  const home = await readPage("/home");
  const projects = [];
  const seen = new Set();
  for (const section of sections(home.body)) {
    const group = groups.get(section.title.toLowerCase());
    if (!group) {
      continue;
    }
    for (const link of links(section.body)) {
      if (!/^\/[^/]+$/.test(link.href) || seen.has(link.href)) {
        continue;
      }
      seen.add(link.href);
      const landing = await readPage(link.href);
      if (landing.fields.get("published") === "false") {
        continue;
      }
      const projectSections = navigation(landing.body, link.href);
      for (const projectSection of projectSections) {
        for (const group of projectSection.groups) {
          for (const entry of group.links) {
            await readPage(entry.href);
          }
        }
      }
      const meta = projectMeta.get(link.href.slice(1));
      projects.push({
        name: link.title || landing.fields.get("title"),
        path: link.href.slice(1),
        href: link.href,
        description: link.description || landing.fields.get("description") || "",
        ...(link.icon ? { icon: link.icon } : { mark: link.mark || link.title.slice(0, 1) }),
        ...(meta?.color ? { color: meta.color } : {}),
        ...(meta?.featured ? { featured: true } : {}),
        group,
        sections: projectSections
      });
    }
  }
  if (projects.length === 0) {
    throw new Error("No published projects found in the homepage project sections");
  }
  return projects;
}

const argumentsList = process.argv.slice(2);
if (argumentsList.some((argument) => argument !== "--check")) {
  throw new Error("Usage: node tools/build-theme-data.mjs [--check]");
}
const catalog = await buildCatalog();
const serialized = `${JSON.stringify(catalog, null, 2)}\n`;
if (argumentsList.includes("--check")) {
  if (await readFile(outputPath, "utf8") !== serialized) {
    throw new Error("Theme project catalog is stale. Run node tools/build-theme-data.mjs");
  }
  console.log(`Theme catalog is current: ${catalog.length} projects`);
} else {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serialized);
  console.log(`Built theme catalog: ${catalog.length} projects`);
}
