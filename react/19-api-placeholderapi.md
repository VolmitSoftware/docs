---
title: "API - PlaceholderAPI"
description: "React documentation: API - PlaceholderAPI"
published: true
date: 2026-08-25T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

React provides read-only `%react_...%` placeholders. Install PlaceholderAPI before React, or run `/react reload` after installing it.

## Common keys

| Placeholder | Value |
|---|---|
| `%react_available%` | Whether React has a current metric snapshot |
| `%react_tps%` | Server TPS |
| `%react_mspt%` | Mean tick time |
| `%react_mspt-p95%` | 95th-percentile tick time |
| `%react_health%` | Server health from 0 to 100 |
| `%react_entities%` | Loaded entities |
| `%react_chunks%` | Loaded chunks |
| `%react_ground-items%` | Dropped items |
| `%react_memory.used%` | Used heap in MiB |
| `%react_memory.free%` | Remaining heap headroom in MiB |
| `%react_world.mspt%` | Requesting player's world tick time |

Use any React sampler with:

```text
%react_sampler.<sampler-id>%
```

Examples:

```text
%react_sampler.tick-time%
%react_sampler.chunks%
%react_sampler.guardianpets-pets-live%
```

Values use plain numbers without units. Add units in your format, such as `%react_mspt% ms`.

`---` means the key is known but currently unavailable. A literal placeholder means the key is unknown or the expansion is not registered. Use `/react sampler list` to find active sampler IDs.
