---
title: "Rift: Teleporting"
description: "Travel to loaded-world spawns and evacuation behavior"
published: true
date: 2026-10-17T00:00:00.000Z
tags: "rift, teleportation, permissions"
editor: markdown
dateCreated: 2026-10-09T00:00:00.000Z
---

Rift teleports players to the spawn of a loaded world. Teleport commands do not load worlds or create missing storage.

## Commands

| Command | Permission |
|---|---|
| `/rift tp <world>` | `rift.teleport` |
| `/rift send <player> <world>` | `rift.teleport.others` |

`tp` also accepts the alias `teleport`. The sender must be a player for `tp`; console can use `send` with an online player.

```none
/rift load resource
/rift tp resource
/rift send ExamplePlayer resource
```

Use the world's Rift command name. A managed custom spawn applies when enabled; otherwise the current server spawn is used. If that spot is inside blocks, in the air, or over lava, Rift moves the player up or down to the nearest solid floor with two clear blocks above it. World access permissions, player limits, departure/entry restrictions, and cancellations from other plugins can prevent travel. Travel restrictions apply only between different worlds; they do not block teleporting within the same world.

## Related settings

Configure `evacuationWorld` to select the loaded destination used when unloading a world. An empty setting selects the primary world.

Unload evacuation ignores player limits and departure and entry rules, so a full or locked world can't block an unload. World access permissions still apply: a player who can't enter the evacuation world goes to the first loaded world they can enter, and the unload stops if there is none. Another plugin cancelling the teleport also stops the unload.

Use `/rift policy respawn <name> <destination>` for death respawns. Read [World policies](/rift/05-world-policies) for its access and fallback rules.

Use `/rift policy first-join <name> <destination>` or `/rift policy login <name> <destination>` to route joins from the world the server initially selects. Their in-game world pickers include a default/reset option. These policies select loaded managed spawns, without loading worlds or following chains of redirects.

Title, action-bar, and sound feedback are independently configurable under [Configuration and localization](/rift/04-configuration-localization).
