---
title: "API: Placeholders"
description: "Read Gloss state through PlaceholderAPI"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss provides three PlaceholderAPI keys:

| Placeholder | Value |
|---|---|
| `%gloss_available%` | `true` while Gloss is available |
| `%gloss_menu.open%` | Whether the player has a Gloss menu open |
| `%gloss_menu.id%` | Open menu ID, or `---` |

Use dots inside the key. `%gloss_menu_open%` is not valid.

Gloss also resolves normal PlaceholderAPI placeholders inside holograms, scoreboards, tablists, MOTD text, menus, panels, bubbles, indicators, and drop labels when that surface has a player context.

To expose your own values, register a normal PlaceholderAPI expansion. Gloss will resolve it from configured text:

```text
<green>Mana: %myplugin_mana%
```

Do not parse `%gloss_menu.id%` from Java to inspect session state. Use `GlossAPI` and the menu handle APIs instead.
