---
title: "placeholders"
description: "PlaceholderAPI keys HiddenOre publishes"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "hiddenore, api"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
HiddenOre provides three server-wide PlaceholderAPI values.

| Placeholder | Value |
|---|---|
| `%hiddenore_available%` | `true` while HiddenOre is available |
| `%hiddenore_seeded%` | `true` for seeded generation, `false` for pure random, or `---` when unavailable |
| `%hiddenore_drop-rules%` | Number of active drop rules, or `---` when unavailable |

PlaceholderAPI must be installed. Values are the same for every player.

```yaml
lines:
  - "HiddenOre: %hiddenore_available%"
  - "Seeded veins: %hiddenore_seeded%"
  - "Drop rules: %hiddenore_drop-rules%"
```

An unchanged `%hiddenore_...%` string means the expansion or key was not found.
