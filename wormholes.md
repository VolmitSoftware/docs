---
title: "Wormholes"
description: "Live portals, random teleport, Dimensional Doors, and cross-server travel"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

<style>
.wh-title {
  margin-top: 1rem;
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 800;
  letter-spacing: -.035em;
}

.wh-lead {
  max-width: 46rem;
  margin: 0 auto 1rem;
  font-size: 1.08rem;
  line-height: 1.7;
  opacity: .82;
}

.wh-actions a {
  display: inline-block;
  margin: .2rem;
  padding: .55rem .85rem;
  border: 1px solid rgba(127, 127, 127, .32);
  border-radius: 8px;
  color: inherit;
  text-decoration: none;
  transition: border-color .15s ease, background-color .15s ease, transform .15s ease;
}

.wh-actions a:hover {
  border-color: var(--v-primary-base, #4f8cff);
  background: rgba(79, 140, 255, .08);
  transform: translateY(-1px);
}

.wh-media {
  min-height: 9rem;
  margin: 1.5rem 0 2.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  border: 1px dashed rgba(127, 127, 127, .5);
  border-radius: 10px;
  background: rgba(127, 127, 127, .045);
  text-align: center;
}

.wh-media strong {
  font-size: 1rem;
  color: var(--v-primary-base, #4f8cff);
}

.wh-media span {
  max-width: 46rem;
  line-height: 1.6;
  opacity: .74;
}

.wh-media-grid {
  margin: 1.5rem 0 2.5rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .85rem;
}

.wh-media-grid.three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.wh-media-grid .wh-media {
  min-height: 11rem;
  margin: 0;
}

.wh-steps {
  margin: 1rem 0 2rem;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: .85rem;
  list-style-position: inside;
}

.wh-steps li {
  padding: 1rem;
  border: 1px solid rgba(127, 127, 127, .24);
  border-radius: 10px;
  background: rgba(127, 127, 127, .035);
  line-height: 1.55;
}

.wh-feature-table {
  margin-bottom: 2.5rem;
}

.wh-feature-table td:first-child {
  font-weight: 700;
  white-space: nowrap;
}

@media (max-width: 760px) {
  .wh-steps,
  .wh-media-grid,
  .wh-media-grid.three {
    grid-template-columns: 1fr;
  }

  .wh-feature-table td:first-child {
    white-space: normal;
  }
}
</style>

![Wormholes](/home-assets/wormholes.png =112x){.align-center .radius-16}

## See through the portal. Walk through the portal. {.text-center .wh-title}

Wormholes adds live destination views, local and cross-server travel, random
teleport portals, and survival Dimensional Doors.
{.text-center .wh-lead}

[Install](/wormholes/01-installation-configuration) ·
[Build a portal](/wormholes/03-building-portals) ·
[Commands](/wormholes/09-commands-permissions)
{.text-center .wh-actions}

<div class="wh-media">
  <strong>Media placeholder 1: Gameplay overview</strong>
  <span>Short video or looping GIF approaching a portal, viewing the live destination, and walking through it.</span>
</div>

## Start in three steps

1. [Install Wormholes](/wormholes/01-installation-configuration) and start the
   server once to create `plugins/Wormholes/wormholes.toml`.
2. Craft a Portal Wand, or have an administrator run `/wormholes wand`.
3. [Form a portal](/wormholes/03-building-portals), open its menu, and choose a
   destination.
{.wh-steps}

> Static Wormholes permissions default to `op`. Grant the appropriate portal,
> door, and gateway permissions before non-operators try to build or craft.
{.is-warning}

## What you can build

| Feature | What it does | Guide |
|---|---|---|
| Linked portal | Shows and travels to another portal on the same server | [Portal menus and settings](/wormholes/04-portal-types-menus-settings) |
| Random teleport portal | Searches for a safe destination using world, radius, height, and biome rules | [Random teleport](/wormholes/06-random-teleport-portals) |
| Dimensional Door | Creates paired, personal, or public doors and trapdoors | [Dimensional Doors](/wormholes/07-dimensional-doors) |
| Pocket dimension | Gives personal and public doors a managed room with a return exit | [Pocket dimensions](/wormholes/08-pocket-dimensions) |
| Cross-server gateway | Shows a remote server destination and transfers travelers | [Cross-server networking](/wormholes/10-cross-server-networking) |
{.wh-feature-table}

## Portal controls

Portal owners and administrators manage a portal from its in-game menu. The
menu controls its type, destination, travel direction, projection, access,
appearance, activation range, and optional travel cost.

- Use the Portal Wand while looking at the portal.
- You can also sneak, keep the main hand empty, and right-click the portal.
- Start with [Portal menus and settings](/wormholes/04-portal-types-menus-settings)
  for every available control.

<div class="wh-media-grid">
  <div class="wh-media">
    <strong>Media placeholder 2: Portal home menu</strong>
    <span>Screenshot showing the portal name, destination, type, projection, settings, and destroy controls.</span>
  </div>
  <div class="wh-media">
    <strong>Media placeholder 3: Projection settings</strong>
    <span>Screenshot or short GIF switching between Venticular and PanOptic, paired with the resulting in-world view.</span>
  </div>
</div>

## Special portal systems

Random teleport and Dimensional Doors have their own interfaces and gameplay
flows. Cross-server gateways also add server and portal code exchange.

<div class="wh-media-grid three">
  <div class="wh-media">
    <strong>Media placeholder 4: Random teleport editor</strong>
    <span>RTP overview and editor screenshots with world, radius, biome, landing, rotation, and ready state visible.</span>
  </div>
  <div class="wh-media">
    <strong>Media placeholder 5: Dimensional Doors</strong>
    <span>Short GIF showing placement, opening, entry, and return, plus a screenshot of the access menu.</span>
  </div>
  <div class="wh-media">
    <strong>Media placeholder 6: Cross-server gateway</strong>
    <span>Short video showing the remote destination, gateway crossing, and arrival on the linked server.</span>
  </div>
</div>

## Server setup

| Item | Value |
|---|---|
| Java | 25 |
| Servers | Paper and Folia, with a Spigot 26.2 compatibility build |
| Config | `plugins/Wormholes/wormholes.toml`, schema `3` |
| Command | `/wormholes`, `/wh`, or `/wormhole` |
| Optional plugins | PlaceholderAPI, Iris, Vault, Citizens, and WorldGuard for RTP entry checks |

## More documentation

- [Core concepts](/wormholes/02-concepts)
- [Projection and performance](/wormholes/05-projection-modes-settings)
- [Commands and permissions](/wormholes/09-commands-permissions)
- [Localization](/wormholes/11-localization)
- [PlaceholderAPI](/wormholes/12-placeholderapi)
- [Operator checks and recovery](/wormholes/14-operator-runbooks-smoke-tests)
- [Integrations](/wormholes/15-integrations)
- [Developer and maintainer documentation](/wormholes/20-api-getting-started)
{.grid-list}

## Support and source

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [GitHub *Wormholes source repository*](https://github.com/VolmitSoftware/Wormholes)
{.links-list}
