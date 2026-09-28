---
title: "Updates"
description: "Replace Adapt and reload configuration"
published: true
date: 2026-09-28T18:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-12T00:00:00.000Z
---

Back up `plugins/Adapt/` before replacing the jar. Back up the database when `sql.enabled` is true. Stop every backend that shares that data, then start them on the same jar. `Adapt:data:v2` has no mixed-version decoder.

| Change | Action |
|---|---|
| Gameplay settings in `adapt.toml` | Save, or use `/adapt configure` |
| Skill or adaptation TOML | Save |
| `models.toml`, `mutations.toml`, locale overrides | Save. Mutations also reload with `/adapt mutations reload` |
| SQL, Redis, metrics, update checks | Restart |
| Install, remove, enable, or disable an integration | Restart |

Malformed TOML is rejected. The previous settings stay active.

Local profiles are `data/players/<uuid>.json`. A file Adapt cannot read is left in place. `<uuid>.json.pending-delete` is reset or purge state. `<uuid>.json.pending-sql` is a failed fenced SQL write. See [Cross-server SQL and Redis](/adapt/39-velocity-cross-server).

`/adapt default all` archives `adapt.toml` and the skill and adaptation files into `config-archive/<timestamp>/`, then regenerates them. It leaves `mutations.toml`, `models.toml`, language files, and player data alone.
