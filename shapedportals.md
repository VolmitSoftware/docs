---
title: "Shaped Portals"
description: "Build custom-shaped Nether and End portals and manage them in-game"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "shapedportals, portals, folia, configuration"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<div class="sp-home">
<section class="sp-hero" aria-labelledby="sp-introduction">
  <div>
    <p class="sp-kicker">Shaped Portals</p>
    <h2 id="sp-introduction">Build portals that fit the build.</h2>
    <p>Make upright Nether portals and horizontal End portals with custom sizes and outlines. Travel still works through Minecraft's native portal system.</p>
    <nav class="sp-actions" aria-label="Get started">
      <a class="sp-primary" href="/shapedportals/00-overview#build-your-first-portal">Build your first portal</a>
      <a href="/shapedportals/01-installation-configuration">Install and configure</a>
    </nav>
  </div>
</section>

<section class="sp-section" aria-labelledby="sp-portal-types">
  <h2 id="sp-portal-types">Two portal types</h2>
  <div class="sp-types">
    <article>
      <p class="sp-kicker">Nether</p>
      <h3>Upright frames</h3>
      <p>Build a closed frame in one vertical plane, then light the inside. Obsidian and crying obsidian are allowed by default.</p>
    </article>
    <article>
      <p class="sp-kicker">End</p>
      <h3>Horizontal frames</h3>
      <p>Build a closed ring of End Portal Frames, then insert an eye into every frame block.</p>
    </article>
  </div>
  <p class="sp-note"><strong>Shape, not routing.</strong> The plugin changes which portal frames can activate and keeps managed surfaces intact. Minecraft still handles travel and destination selection.</p>
</section>
</div>

## At a glance

| | |
|---|---|
| Server software | Spigot 1.20.1 or newer, including Paper and Folia |
| Java | Whatever your server version needs: 17, 21, or 25 |
| Main command | `/shapedportals` (`/shapedportal`, `/sp`) |
| Config file | `plugins/ShapedPortals/config.toml` |
| Portal records | `plugins/ShapedPortals/portals.json` |

## Start here

- [Getting started *Build either portal type, and the command and permission reference*](/shapedportals/00-overview)
- [Installation and configuration *Install the plugin, use the settings menu, and change portal rules*](/shapedportals/01-installation-configuration)
- [Portal behavior *How portals are saved, repaired, protected, and removed*](/shapedportals/02-portal-behavior-events)
{.links-list}

## Reference

- [Compatibility and operations *Server versions, Java, Folia limits, and debug reports*](/shapedportals/03-compatibility-operations)
- [Developer reference *Geometry, the registry, the Wormholes handoff, and builds*](/shapedportals/04-architecture-limits)
- [Languages *Choosing a language and editing messages*](/languages)
{.links-list}

## Support

- [Download *spigotmc.org*](https://www.spigotmc.org/resources/shaped-portals.95595/)
- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [Source *github.com/VolmitSoftware/ShapedPortals*](https://github.com/VolmitSoftware/ShapedPortals)
{.links-list}
