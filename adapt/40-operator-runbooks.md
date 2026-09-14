---
title: "Updates and Recovery"
description: "Update Adapt, restore player data, and troubleshoot common problems"
published: true
date: 2026-09-14T00:36:31.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-12T00:00:00.000Z
---

Back up `plugins/Adapt/` before an update. Back up the database too when SQL storage is enabled. For first-time setup, see [Installation and Configuration](/adapt/01-installation-configuration).

## Updating

1. Stop every backend using the same player data.
2. Back up the plugin folder and SQL database.
3. Replace the jar on every backend.
4. Start one backend first and check configuration and storage initialization.
5. Start the remaining backends after the first one is healthy.

Do not mix backend versions when Redis handoff uses `Adapt:data:v2`. The transfer format has no compatibility decoder.

Older nested or JSON configuration layouts are not migrated. Let Adapt create the current root TOML layout, then copy across only the settings you still need.

## Reload or restart

| Change | Action |
|---|---|
| `adapt.toml` gameplay settings | Save the file or use the config menu |
| Skill or adaptation TOML | Save the file |
| `models.toml` | Save the file |
| `mutations.toml` | Save the file or run `/adapt mutations reload` |
| Locale override | Save the file |
| SQL, Redis, metrics, update checks | Restart |
| Added, removed, enabled, or disabled integration plugin | Restart |

Malformed TOML is rejected while the previous settings remain active. Check the console after every reload.

## Local player data

Local mode stores one profile at `data/players/<uuid>.json`.

- A corrupt profile remains on disk. Adapt does not replace it with an empty profile.
- `<uuid>.json.pending-delete` is reset or purge recovery state, not a temporary file.
- A player with an unavailable profile can still join Minecraft, but Adapt remains inactive.

Restore the backed-up profile, restart if needed, and have the player reconnect.

## SQL recovery

SQL mode requires both `ADAPT_DATA` and `ADAPT_DATA_FENCE` to use InnoDB. Adapt refuses SQL startup when either table uses another engine.

Convert a backed-up legacy table with:

```sql
ALTER TABLE ADAPT_DATA ENGINE=InnoDB;
ALTER TABLE ADAPT_DATA_FENCE ENGINE=InnoDB;
```

A failed fenced save may create `data/players/<uuid>.json.pending-sql`. Stop every backend, back up the file and database, then compare the recovery envelope with the current SQL owner and sequence. Remove a recovery file only after choosing the authoritative profile.

Do not rename raw JSON into a pending SQL recovery file. Adapt preserves incompatible recovery data and keeps the affected profile inactive.

## Common problems

| Symptom | Check |
|---|---|
| Bookshelf does not open | Side face, both hands, sneaking, activator block setting, and local protection |
| Skill or adaptation is missing | Enable setting, progress visibility, `adapt.use` permissions, and required integration |
| Ability does nothing | World, game mode, protection, conflict settings, and player profile availability |
| Learning fails | Knowledge, available power, permanent confirmation, and Vault balance |
| Changes do not apply | TOML parse error or a restart-bound setting |
| Adapt is unavailable after a server switch | SQL fence, Redis subscription, staged transfer, and pending recovery file |
| Player data appears corrupt or empty | Stop writes and restore from backup before resetting anything |

Use a non-operator account when checking permissions. Operator status bypasses most gates.

## Related guides

- [Commands and Permissions](/adapt/04-commands-permissions)
- [Cross-Server SQL and Redis](/adapt/39-velocity-cross-server)
- [Protection and Region Policy](/adapt/08-protection-region-policy)
- [Integrations](/adapt/09-integrations)
- [Mutations Overview](/adapt/34-mutations-overview)
- [Items, Orbs and Bound Objects](/adapt/36-items-orbs-bound-objects)
