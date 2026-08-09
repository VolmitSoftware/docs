---
title: Adapt — Installation
description: Requirements and setup for Adapt
published: true
date: 2026-08-09T00:00:00.000Z
tags: adapt, installation
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Requirements

| | |
|---|---|
| Server software | Paper or a Paper fork |
| Optional integrations | PlaceholderAPI, WorldGuard, Factions, ChestProtect, Residence |

All integrations are `softdepend` — Adapt runs without any of them. When present, Adapt
respects region and claim protection so abilities do not bypass them.

## Install

1. Drop `Adapt-x.x.x.jar` into `plugins/`.
2. Restart the server.
3. Configs are written to `plugins/Adapt/` on first run.

## First steps

- Right-click a bookshelf face in game to open the GUI as a player.
- `/adapt gui` opens it without a bookshelf, if you hold `adapt.opengui`.
- `/adapt configure` opens the in-game config editor (`adapt.configurator`).

## Configuration

Adapt writes one config per skill and per adaptation. To reset:

```
/adapt default skill <skill>
/adapt default adaptation <adaptation>
/adapt default all
```

`/adapt default all` resets everything and archives the previous settings rather than
deleting them.

If you upgrade across a version that changed the config schema, run:

```
/adapt migrate-configs
```

This rewrites all skill and adaptation configs to the canonical current format.

## Clearing player data

```
/adapt clear xp | knowledge | adaptations | stats
```

These operate across all skill lines. To remove a player entirely:

```
/adapt reset confirm <player>
```

> **`/adapt reset` is irreversible.** It permanently deletes all Adapt data for that player
> and requires op. Take a backup of `plugins/Adapt/` first.

## Building from source

```
git clone https://github.com/VolmitSoftware/Adapt.git
cd Adapt
./gradlew build
```
