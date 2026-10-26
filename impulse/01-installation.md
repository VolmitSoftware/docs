---
title: "Impulse installation"
description: "Minecraft requirements and data files"
published: true
date: 2026-10-22T00:00:00.000Z
tags: "impulse"
editor: markdown
dateCreated: 2026-10-22T00:00:00.000Z
---

Impulse targets Minecraft 26.1 through 26.3 on Java 25 or newer. Server targets are Spigot, Paper, Purpur, Leaf, Folia, and Canvas.

## Install

1. Place the Impulse distribution JAR in the server's `plugins/` folder.
2. Start the server with Java 25 or newer.
3. Run `/impulse debug version` and `/impulse status`.
4. Open `/impulse config` to adjust settings.

Startup downloads the runtime libraries the distribution requires. Keep the resulting library cache available for subsequent starts.

## Files

| Path | Purpose |
| --- | --- |
| `plugins/Impulse/config.toml` | Server settings and machine tiers |
| `plugins/Impulse/languages/en_US.toml` | Default English messages |
| `plugins/Impulse/languages/<locale>.toml` | Installed translations and local edits |
| `plugins/Impulse/languages/language-preferences.properties` | Saved player language choices |

Machine ownership, level, pause state, redstone mode, and inventory are stored with the dispenser in the world. Back up worlds together with the plugin data folder.

## Folia

World and inventory actions run on their owning region. Machines act only on loaded, owned targets. Most machine actions require the owner to be online in the same region; turning off the initial owner-online gate does not permit unsafe access to players in another region.

See [Configuration](/impulse/03-configuration) and [Integrations](/impulse/06-integrations).
