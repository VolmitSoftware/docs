---
title: "Shaped Portals: Getting Started"
description: "Build a portal, look up commands, and check permissions"
published: true
date: 2026-08-30T00:00:00.000Z
tags: "shapedportals, portals, commands, permissions"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<style>
.sp-reference { max-width: 1120px; margin: 0 auto; line-height: 1.7; }
.sp-reference h2 { margin-top: 2.4rem; padding-bottom: .5rem; border-bottom: 1px solid rgba(127,127,127,.25); font-size: 1.5rem; scroll-margin-top: 5rem; }
.sp-reference h3 { margin-top: 1.6rem; scroll-margin-top: 5rem; }
.sp-reference .sp-nav { display: flex; flex-wrap: wrap; gap: .4rem; margin: 0 0 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(127,127,127,.25); }
.sp-reference .sp-nav a { display: block; padding: .4rem .75rem; border: 1px solid transparent; border-radius: 6px; text-decoration: none; color: inherit; font-size: .9rem; }
.sp-reference .sp-nav a:hover, .sp-reference .sp-nav a[aria-current="page"] { background: rgba(146,93,198,.12); border-color: rgba(146,93,198,.35); }
.sp-reference a:focus-visible, .sp-reference summary:focus-visible { outline: 3px solid #a66bdd; outline-offset: 3px; }
.sp-reference table { width: 100%; display: table; table-layout: fixed; border-collapse: collapse; font-size: .93rem; }
.sp-reference th, .sp-reference td { padding: .8rem; vertical-align: top; text-align: left; overflow-wrap: anywhere; border: 1px solid rgba(127,127,127,.22); }
.sp-reference th:first-child { width: 32%; }
.sp-reference .sp-commands th:first-child { width: 35%; }
.sp-reference .sp-commands th:last-child { width: 20%; }
.sp-reference .sp-permissions th:first-child { width: 40%; }
.sp-reference .sp-permissions th:nth-child(2) { width: 18%; }
.sp-reference .sp-settings th:first-child { width: 35%; }
.sp-reference .sp-settings th:nth-child(2) { width: 22%; }
.sp-reference th { background: rgba(146,93,198,.09); }
.sp-reference td code { white-space: normal; overflow-wrap: anywhere; }
.sp-reference pre { max-width: 100%; overflow-x: auto; }
.sp-reference .sp-media { min-height: 170px; margin: 1.3rem 0; padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: .4rem; border: 1px dashed rgba(127,127,127,.5); border-radius: 8px; background: rgba(146,93,198,.04); text-align: center; }
.sp-reference .sp-media span { max-width: 42rem; font-size: .9rem; }
.sp-reference blockquote, .sp-reference .sp-caution { margin: 1.3rem 0; padding: .9rem 1.1rem; border: 1px solid rgba(127,127,127,.35); border-radius: 6px; background: rgba(127,127,127,.05); color: inherit; }
.sp-reference blockquote p, .sp-reference .sp-caution p { margin: 0; }
.sp-reference details { margin: 1rem 0; padding: .85rem 1rem; border: 1px solid rgba(127,127,127,.3); border-radius: 6px; }
.sp-reference summary { cursor: pointer; font-weight: 600; }
.sp-reference details[open] summary { margin-bottom: .8rem; }
.sp-reference .sp-related { margin-top: 2.5rem; padding-top: 1rem; border-top: 1px solid rgba(127,127,127,.25); }
@media (max-width: 600px) {
  .sp-reference table, .sp-reference tbody { display: block; }
  .sp-reference thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .sp-reference tr { display: block; margin: .7rem 0; padding: .3rem 0; border: 1px solid rgba(127,127,127,.25); border-radius: 6px; }
  .sp-reference td { display: block; width: auto; padding: .4rem .8rem; border: 0; font-size: .92rem; }
  .sp-reference td:first-child { font-weight: 600; }
  .sp-reference td::before { font-weight: 600; }
  .sp-reference .sp-commands td:nth-child(3)::before { content: "Run from: "; }
  .sp-reference .sp-permissions td:nth-child(2)::before, .sp-reference .sp-settings td:nth-child(2)::before { content: "Default: "; }
  .sp-reference .sp-nav { gap: .15rem; }
  .sp-reference .sp-nav a { padding: .4rem .5rem; }
}
</style>

<div class="sp-reference">
<nav class="sp-nav" aria-label="Shaped Portals guides"><a href="/shapedportals">Home</a><a href="/shapedportals/00-overview" aria-current="page">Build &amp; commands</a><a href="/shapedportals/01-installation-configuration">Configuration</a><a href="/shapedportals/02-portal-behavior-events">Portal behavior</a><a href="/shapedportals/03-compatibility-operations">Server setup</a></nav>

Shaped Portals uses normal Nether portal blocks, so Minecraft still handles travel and destination creation.

[Build a portal](#build-your-first-portal) · [Shape rules](#valid-shapes) · [Commands](#commands) · [Permissions](#permissions)

## Build your first portal

1. [Install Shaped Portals](/shapedportals/01-installation-configuration#install).
2. Build a closed, upright frame using obsidian, crying obsidian, or both.
3. Leave the inside empty and light it with flint and steel.
4. Wait for the portal to fill, then walk through.

The default interior size is **2 to 256 blocks**.

## Valid shapes

| Rule | What to build |
|---|---|
| Upright and flat | One vertical surface along the X or Z axis, not a floor or a 3D tunnel |
| Closed boundary | Configured frame blocks around the entire interior |
| Connected interior | Interior blocks touch by an edge; diagonal contact alone is not enough |
| Empty inside | Only configured replaceable blocks; air, fire, and soul fire by default |
| Within limits | Up to 64 blocks wide and 64 blocks high by default, still subject to the 256-block area limit |
| One Folia region | The full shape must be owned by one active region during creation |

Stepped edges, concave corners, and frame-material islands are allowed as long as the interior stays connected. Shapes that are valid in both vertical axes are rejected as ambiguous.

Server owners can change these limits in [Portal settings](/shapedportals/01-installation-configuration#portal-rules). The hard ceilings are 4,096 interior blocks and 512 blocks per dimension.

## Commands

Use `/shapedportals`, `/shapedportal`, or `/sp`.

| Command | What it does | Run from |
|---|---|---|
| `/sp` | Open command help | Player or console |
| `/sp status` | Show portal counts and creation statistics | Player or console |
| `/sp config` | Open the in-game configuration and language editor | Player |
| `/sp language [locale]` | Choose a language, or open the picker when omitted | Player |
| `/sp portals [page]` | List managed portals; page defaults to 1 | Player or console |
| `/sp teleport` | Open the portal list; `/sp teleport list` does the same | Player or console |
| `/sp teleport <UUID/prefix>` | Move to a safe spot beside the chosen portal | Player |
| `/sp debug` | Save a diagnostic report and upload it when enabled | Player or console |

{.sp-commands}

`/sp tp` is an alias for `/sp teleport`. Configuration files reload automatically by default.

### Find and visit a portal

Run `/sp portals`, then click a portal entry to visit it. You need the list permission to view entries and the teleport permission to travel.

You can also supply its full UUID or a unique prefix of at least eight characters:

```text
/sp teleport <portal UUID>
```

Use an ID from the list. Teleportation looks for clear standing space over a solid floor.

<div class="sp-caution"><p><strong>Unsafe teleport confirmation:</strong> if no safe spot exists, players with the additional unsafe permission can repeat the same teleport within 10 seconds. This can place you inside blocks or over a drop. It does not clear space or create a platform, and it cannot bypass an unavailable world, inactive portal, or another plugin's teleport cancellation.</p></div>

### Change the language

```text
/sp language de_DE
```

This selects German. Omit the locale to open the language picker. See [Language files](/shapedportals/01-installation-configuration#language-files) for available locales and message editing.

### Create a diagnostic report

<div class="sp-caution"><p><strong>Public upload is on by default.</strong> Before running <code>/sp debug</code>, set <code>debug.uploadEnabled = false</code> in the Diagnostics editor or configuration if the report should stay on your server. Reports include server, plugin, portal, configuration, and system details.</p></div>

Reports are also saved under `plugins/ShapedPortals/debug/`.

## Permissions

**Everyone** means the default is `true`; **Operators** means `op`. Permission plugins can change these grants. There is no declared wildcard or parent permission that grants the other nodes.

| Permission | Default | Allows |
|---|---|---|
| `shapedportals.create` | Everyone | Ignite shaped portals when creation permission checks are enabled |
| `shapedportals.command` | Everyone | Use help and status |
| `shapedportals.config` | Operators | Use the configuration editor and language command |
| `shapedportals.debug` | Operators | Generate diagnostic reports, including uploads when enabled |
| `shapedportals.portals` | Operators | List portals, including through bare `/sp teleport` |
| `shapedportals.teleport` | Operators | Teleport to a selected portal |
| `shapedportals.teleport.unsafe` | Operators | Confirm an unsafe landing; also needs `shapedportals.teleport` |

{.sp-permissions}

World restrictions, shape rules, and protection plugins still apply when a player has creation permission.

<div class="sp-related"><a href="/shapedportals">Shaped Portals home</a> · <a href="/shapedportals/01-installation-configuration">Installation &amp; configuration</a> · <a href="/shapedportals/02-portal-behavior-events#troubleshooting">Troubleshooting</a></div>

</div>
