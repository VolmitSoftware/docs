---
title: "Shaped Portals: Compatibility & Operations"
description: "Server requirements, Folia limits, React integration, and server checks"
published: true
date: 2026-08-30T00:00:00.000Z
tags: "shapedportals, compatibility, java, folia"
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
<nav class="sp-nav" aria-label="Shaped Portals guides"><a href="/shapedportals">Home</a><a href="/shapedportals/00-overview">Build &amp; commands</a><a href="/shapedportals/01-installation-configuration">Configuration</a><a href="/shapedportals/02-portal-behavior-events">Portal behavior</a><a href="/shapedportals/03-compatibility-operations" aria-current="page">Server setup</a></nav>

Shaped Portals uses Bukkit APIs without NMS or client mods. Match the server's Java requirements, and test portal creation and travel on your server build before opening it to players.

[Requirements](#platform-matrix) · [Java](#java-runtime-floors) · [React](#react-plugin-api-pack) · [Server checks](#operational-checklist)

## Platform matrix

| Platform | Requirement or limit |
|---|---|
| Spigot and compatible servers | Source baseline is Spigot 1.20.1; plugin metadata declares Bukkit API 1.20 |
| Paper | Uses the same plugin jar; server builds must provide the required Bukkit APIs |
| Folia | Supported scheduling model is region-owned; a portal cannot be created across independently owned regions |
| Client | No client mod or resource pack is required by the plugin |

The build checks API compatibility against Spigot 1.20.1, Paper 26.1.2, and Spigot 26.2. These are compile checks, not a guarantee that every server build or plugin combination works at runtime.

## Java runtime floors

The jar contains Java 17 bytecode. A newer server may need a newer runtime.

| Minecraft server range | Java requirement |
|---|---|
| 1.20.1 to 1.20.4 | Java 17 minimum for this plugin; follow your server distribution's requirements |
| 1.20.5 to 1.21.11 | Java 21 or the newer version required by your server |
| 26.1 to 26.2 | Java 25 |

Check [Paper's system requirements](https://docs.papermc.io/paper/getting-started/) and the [Minecraft 1.20.5 release notes](https://www.minecraft.net/article/minecraft-java-edition-1-20-5) for server runtime requirements.

### Why the floor is not 1.17

Java 17 bytecode alone does not make the linked Bukkit and shared-library APIs compatible with older Minecraft versions. The complete plugin is built against the 1.20.1 baseline; 1.17 is not a supported target.

## Folia and chunk loading

Creation needs the whole shape to belong to one active region. This is not the same as a one-chunk size limit.

Integrity checks skip unloaded chunks. Administrative teleport commands can prepare destination and nearby landing chunks, then check them on their owning regions.

## React Plugin API Pack

React is optional. The **ShapedPortals Runtime** pack adds these samplers:

| Sampler | Reports |
|---|---|
| Managed Portals | Number of registered portals |
| Portal Interior Cells | Number of managed interior cells |
| Portal Creation Attempts | Creation attempts per second |
| Created Portals | Successful creations per second |
| Rejected Portal Attempts | Rejections per second |
| Portal Creation Success | Percentage of attempts that succeeded |

### Install the pack

1. Extract `react-api-packs/shapedportals-runtime.toml` from the Shaped Portals jar. Source builds also provide it under `build/distributions/react-api-packs/`.
2. Copy it into `plugins/React/plugin-apis/`, or install it through React Web.
3. Run `/react plugin-api reload`.

See [React Plugin API Packs](/react/20-api-plugin-api-packs) for pack setup and status.

These measurements stay on your server and are separate from bStats. Attempt totals and success percentage reset when Shaped Portals restarts. Success percentage is unavailable until the first attempt; rate samplers need two samples. Ordinary terrain fires do not count as portal attempts.

<details>
<summary>Integration metric keys</summary>
<table>
<thead><tr><th>Metric key</th><th>Value</th></tr></thead>
<tbody>
<tr><td><code>shapedportals.managed-portals</code></td><td>Registered portal count</td></tr>
<tr><td><code>shapedportals.interior-cells</code></td><td>Managed interior count</td></tr>
<tr><td><code>shapedportals.creation-attempts-total</code></td><td>Session attempt total</td></tr>
<tr><td><code>shapedportals.created-portals-total</code></td><td>Session success total</td></tr>
<tr><td><code>shapedportals.rejected-attempts-total</code></td><td>Session rejection total</td></tr>
<tr><td><code>shapedportals.creation-success-percent</code></td><td>Session success percentage</td></tr>
</tbody>
</table>
<p>The provider reads registry counts and session counters without accessing worlds, chunks, entities, or inventories during sampling. React discovers it through the shared VolmLib integration bridge; Shaped Portals does not require React to run.</p>
</details>

## Operational checklist

Before players use the plugin, check the following on your server build:

| Area | Check |
|---|---|
| Startup and commands | Plugin enables cleanly; help, status, editor, language picker, and portal list work for the intended permission groups |
| Shapes | Test stepped and concave frames, both axes, size limits, open frames, and blocked interiors |
| Ignition and protection | Test flint and steel, placed fire, fire charges, and denied actions in protected areas |
| Travel | Enter and return through a portal; try administrative teleportation to a loaded and unloaded destination |
| Persistence | Restart and unload/reload chunks; check the frame still works |
| Integrity | Break a frame, change a boundary, remove a portal cell, and try relevant WorldEdit changes |
| Configuration | Save a valid edit, then an invalid one; check the previous working configuration stays active |
| Languages and display | Select a locale, edit a message, cancel chat entry, and check overlays alongside other plugins |
| Optional metrics | Check bStats opt-out and React sampler values if those features are used |

Use a real Minecraft client to check rendering, sounds, and menu readability. Review the console for scheduler, region-ownership, or persistence errors.

**Before requesting support:** reproduce the problem, note what you expected, and create a [diagnostic report](/shapedportals/00-overview#create-a-diagnostic-report). Disable public uploading first if your report must stay local.

## Build and local publication

Build instructions and artifact details are in the [Developer reference](/shapedportals/04-architecture-limits#build-from-source).

<div class="sp-related"><a href="/shapedportals/02-portal-behavior-events#troubleshooting">Troubleshooting</a> · <a href="/shapedportals/04-architecture-limits">Developer reference</a> · <a href="https://volmitsoftware.com/discord">Discord</a></div>

</div>
