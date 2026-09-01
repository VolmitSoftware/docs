---
title: "Shaped Portals: Compatibility & Operations"
description: "Server requirements, Folia limits, React integration, and server checks"
published: true
date: 2026-09-01T00:00:00.000Z
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
<nav class="sp-nav" aria-label="Shaped Portals guides"><a href="/shapedportals">Home</a><a href="/shapedportals/00-overview">Build &amp; commands</a><a href="/shapedportals/01-installation-configuration">Configuration</a><a href="/shapedportals/02-portal-behavior-events">Portal behavior</a><a href="/shapedportals/03-compatibility-operations" aria-current="page">Server setup</a><a href="/shapedportals/04-architecture-limits">Developer reference</a></nav>

Shaped Portals supports Spigot 1.20.1 and newer compatible servers. It does not require a client mod or resource pack.

[Requirements](#platform-matrix) · [Java](#java-runtime-floors) · [Native portals](#native-portal-compatibility) · [Diagnostics](#diagnostic-reports) · [React](#react-plugin-api-pack)

## Platform matrix

| Platform | Requirement or limit |
|---|---|
| Spigot, Paper, and compatible servers | Version 1.20.1 or newer |
| Folia | Supported; a portal cannot cross independently owned regions |
| Client | No mod or resource pack required |

## Java runtime floors

| Minecraft server range | Java requirement |
|---|---|
| 1.20.1 to 1.20.4 | Java 17 or the version required by your server |
| 1.20.5 to 1.21.11 | Java 21 or newer as required by your server |
| 26.1 to 26.2 | Java 25 |

Check [Paper's system requirements](https://docs.papermc.io/paper/getting-started/) and the [Minecraft 1.20.5 release notes](https://www.minecraft.net/article/minecraft-java-edition-1-20-5) for server runtime requirements.

## Folia and chunk loading

Creation needs the whole shape to belong to one active region. This is not the same as a one-chunk size limit.

Integrity checks skip unloaded chunks. Administrative teleport commands can prepare destination and nearby landing chunks, then check them on their owning regions.

## Native portal compatibility

Shaped Portals writes ordinary `NETHER_PORTAL` and `END_PORTAL` blocks. Minecraft controls travel, Nether coordinate scaling, destination search, and generated destination frames. The plugin does not use NMS, packets, or a client mod.

Nether proposals fire a cancellable `PortalCreateEvent` with reason `FIRE`. Shaped End creation respects the Eye of Ender interaction and asks `BlockCanBuildEvent` about every proposed cell because Bukkit has no End-activation `PortalCreateEvent` reason. See [Ignition and protection plugins](/shapedportals/02-portal-behavior-events#ignition-and-protection-plugins) for the event sequence.

## Diagnostic reports

`/sp debug` saves a timestamped report under `plugins/ShapedPortals/debug/`. The report includes ShapedPortals service state, effective settings, registry records by portal type and axis, creation and rejection counts, installed plugins, server and world details, scheduler state, TPS and MSPT, Java and operating-system data, memory pools, CPU load, garbage collectors, buffer pools, storage, known-file hashes, and plugin artifact identity.

The local report is written first. When `debug.uploadEnabled` is `true`, Shaped Portals also uploads it to the public mclo.gs service and returns a clickable link. Disable the setting before running the command when the report must remain local.

## React Plugin API pack

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

1. Extract `react-api-packs/shapedportals-runtime.toml` from the Shaped Portals jar.
2. Copy it into `plugins/React/plugin-apis/`, or install it through React Web.
3. Run `/react plugin-api reload`.

See [React Plugin API Packs](/react/20-api-plugin-api-packs) for pack setup and status.

These measurements stay on your server and are separate from bStats. Rates need two samples, and session totals reset when Shaped Portals restarts.

<div class="sp-related"><a href="/shapedportals/02-portal-behavior-events#troubleshooting">Troubleshooting</a> · <a href="/shapedportals/04-architecture-limits">Developer reference</a> · <a href="https://volmitsoftware.com/discord">Discord</a></div>

</div>
