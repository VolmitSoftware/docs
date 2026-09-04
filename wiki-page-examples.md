---
title: "Wiki.js Page Examples"
description: "Short examples for writing consistent Volmit Wiki.js pages"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "meta, wikijs, style-guide, examples"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Use these patterns for pages in this repository. Keep each page focused, put
the most common task first, and link to a separate reference page when a table
or explanation becomes hard to scan.

- [Page structure](#page-structure)
- [Links and navigation](#links-and-navigation)
- [Notes and warnings](#notes-and-warnings)
- [Tables and code](#tables-and-code)
- [Images and media](#images-and-media)
- [Optional Wiki.js features](#optional-wikijs-features)
- [Page check](#page-check)
{.grid-list}

## Page structure

Every Markdown page starts with Wiki.js frontmatter:

~~~yaml
---
title: "Shaped Portals: Getting started"
description: "Build and use a custom Nether or End portal"
published: true
date: 2026-09-03T00:00:00.000Z
tags: "shapedportals, getting-started"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---
~~~

Wiki.js renders the page title, so start the content at `##`. Preserve
`dateCreated` and update `date` when the page changes.

A useful page order is:

1. One short summary
2. The main task or answer
3. Settings, commands, or edge cases
4. Troubleshooting
5. Related pages

Use direct headings such as **Install the plugin**, **Commands**, and
**Portal limits**. Avoid headings that only repeat the product name.

## Links and navigation

Use absolute wiki routes:

~~~markdown
[Getting started](/shapedportals/00-overview)
[Build from source](/shapedportals/04-architecture-limits#build-from-source)
~~~

Do not link to repository paths such as
`shapedportals/00-overview.md`. Add an explicit anchor when a heading must
keep the same URL after its text changes:

~~~markdown
## Build your first portal {#build-your-first-portal}
~~~

For a short page index, use a normal list. Use a link list when each item needs
a description:

~~~markdown
- [Getting started *Build Nether and End portals*](/shapedportals/00-overview)
- [Configuration *Change frame materials and size limits*](/shapedportals/01-installation-configuration)
- [Troubleshooting *Fix activation and travel problems*](/shapedportals/02-portal-behavior-events#troubleshooting)
{.links-list}
~~~

## Notes and warnings

Wiki.js styles a blockquote according to the class placed below it.

> Shaped Portals uses Minecraft's native destination search.
{.is-info}

> Back up configuration files before replacing them.
{.is-warning}

> Stop the server before deleting saved portal data.
{.is-danger}

Use callouts only when the information needs more attention than the
surrounding text.

## Tables and code

Tables work well for commands, permissions, and settings:

| Command | Permission | Purpose |
|---|---|---|
| `/sp status` | `shapedportals.command` | Show plugin status |
| `/sp config` | `shapedportals.config` | Open the settings menu |
| `/sp portals` | `shapedportals.portals` | List saved portals |

{.dense}

Put the command or key first so readers can scan the left column. Keep long
explanations outside the table.

Use a language on fenced code blocks:

~~~toml
[portal]
maximumInteriorBlocks = 256
~~~

Use `text` for paths or console output:

~~~text
plugins/ShapedPortals/
~~~

## Images and media

Store wiki assets under a stable public path and write useful alternative text:

~~~markdown
![Shaped Portals configuration menu](/shapedportals-assets/config-menu.png)
~~~

Size and alignment helpers are available when the image renderer is enabled:

~~~markdown
![Shaped Portals logo](/home-assets/shapedportals.jpg =160x){.align-center}
~~~

When media has not been captured yet, use a plain placeholder that says what
belongs there:

~~~html
<div class="media-placeholder" role="img"
     aria-label="Placeholder for the portal configuration menu">
  Configuration menu image goes here
</div>
~~~

A placeholder should name the screen or action to record. Remove it when the
real image, GIF, or video is added.

## Optional Wiki.js features

Raw HTML, tabs, diagrams, math, footnotes, and other renderer modules depend on
the Wiki.js administration settings. Keep required instructions readable
without them.

### Tabs

~~~markdown
## Server platform {.tabset}

### Paper

Paper-specific instructions.

### Folia

Folia-specific instructions.

## Next section
~~~

### Native disclosure

`details` keeps optional information out of the main reading path when raw
HTML is allowed:

~~~html
<details>
  <summary>Show advanced settings</summary>
  <p>Place optional details here.</p>
</details>
~~~

Use the shared theme for reusable styling. Inline CSS is acceptable for a
small one-off layout, but repeated components belong in
`theme/minimal-brutalism.css`. Do not place JavaScript in documentation
pages.

See the [Wiki.js Markdown editor documentation](https://docs.requarks.io/editors/markdown)
and [rendering pipeline](https://docs.requarks.io/en/rendering) for the
installed renderer options.

## Page check

- The opening tells the reader what the page covers.
- The common task appears before background detail.
- Headings are descriptive and follow a clear order.
- Commands, permissions, defaults, and examples match the plugin.
- Links use wiki routes and describe their destination.
- Images have alternative text.
- Tables fit on mobile or can scroll horizontally.
- Important meaning does not depend on color alone.
- The page works in light and dark themes.
- The page contains only information meant for readers.
