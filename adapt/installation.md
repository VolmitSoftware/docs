---
title: Adapt — Installation
description: Requirements and setup for Adapt
published: true
date: 2026-08-19T00:00:00.000Z
tags: adapt, installation
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Requirements

| | |
|---|---|
| Server software | Paper or a Paper fork |
| Optional integrations | PlaceholderAPI, WorldGuard, Factions, ChestProtect, Residence |

All integrations are `softdepend`. Adapt runs without any of them. When they are present, Adapt respects region and claim protection. Abilities do not bypass them.

## Install

1. Copy `Adapt-x.x.x.jar` into `plugins/`.
2. Restart the server.
3. Adapt writes configs to `plugins/Adapt/` on first run.

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

`/adapt default all` resets everything. It archives the previous settings. It does not delete them.

If you upgrade across a version that changed the config schema, run:

```
/adapt migrate-configs
```

This command rewrites all skill and adaptation configs to the canonical current format.

## Clearing player data

```
/adapt clear xp | knowledge | adaptations | stats
```

These commands operate across all skill lines. To remove a player entirely:

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
