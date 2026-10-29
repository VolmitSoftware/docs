---
title: "Temper: Repair stations"
description: "Place and manage public or private repair anvils"
published: true
date: 2026-10-28T00:00:00.000Z
tags: "temper, stations"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Registered anvil stations open Temper’s repair interface. Their location, owner, public access, and individual visual settings are saved under `storage/`. Brief Windows file locks are retried when saving; a persistent save failure disables station use and edits until restart.

## Place and configure a station

Use `/temper station give` to receive an anvil, then place it with `temper.station.place`. New stations are public by default. Look at an owned station and run `/temper station edit` to open its settings.

| Control | What it changes |
|---|---|
| Public access | Allow other players to use this station |
| Hologram | Show this station’s localized label when Gloss displays are available |
| Item preview | Show cosmetic previews for repairs opened at this station |
| Effects | Allow this station’s particles and repair sounds |

Click a control to toggle it. Back and Close leave the menu; inventory items cannot be placed inside it. Edits reject stale station data, so reopen settings if another change occurs. `/temper station access public` and `/temper station access private` also set access directly.

Public access permits using the station, not editing it or breaking it. Owners need `temper.station.manage` to change settings; each edit rechecks that permission. Operators with `temper.station.admin` can override ownership checks.

## Anvil interaction

`stations.interaction=RIGHT_CLICK` opens repairs on right-click. `SNEAK_RIGHT_CLICK` requires sneaking and leaves normal clicks to the vanilla anvil interface. `stations.interceptVanilla=true` applies the selected interaction to ordinary anvils too; registered stations do not require that toggle.

Station access is checked when opening the interface and when confirmation starts. Confirmation requires the player to remain within seven blocks of the station. Equipment remains in the player’s inventory during quotes and visual previews.

## Holograms, previews, and effects

Gloss supplies localized labels and temporary floating item copies. Labels show accessible registered stations within the configured distance and per-player display limit. Inaccessible stations and stations without an active label or ambient effect do not consume that limit. Ordinary anvils can show the selected item preview but do not receive persistent station labels.

Preview duration and distance are bounded by `stations.visuals`. Visual copies cannot be collected and never take custody of equipment. Without a compatible Gloss API, repairs remain available and holograms/item previews are disabled. Sound and particle settings remain usable without Gloss.

Ambient particles are off by default. Configure the global particle type/count and repair sound/volume/pitch in `/temper config`; each registered station also has its own Effects toggle.

## Protection

Station handling respects cancelled placement and interaction events. Registered stations resist falling and piston movement. `stations.indestructible` controls breaking and explosion protection. Disabled-world rules apply to both stations and command repairs, using case-insensitive world names or UUIDs.

## Related pages

- [Configuration *Station defaults and visual limits*](/temper/03-configuration)
- [Repairs and pricing *Quotes and payment*](/temper/05-repairs-pricing)
- [Integrations *Gloss and Vault*](/temper/07-integrations)
{.links-list}
