---
title: "GUI Customization"
description: "Change Adapt menu size, icons, ordering, and resource-pack models"
published: true
date: 2026-09-28T21:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Menu settings are `[gui]` in `plugins/Adapt/adapt.toml`, plus root `guiShowAllSkills` and `customModels`. A valid save refreshes open menus.

Material names are trimmed, stripped of any namespace before `:`, uppercased, and spaces become underscores. `AIR` and legacy materials are refused. An unknown material keeps the built-in icon.

`models.toml` overrides a material icon when `customModels` is true and the entry names a real model. A generated placeholder does not.

`skillOrder` and `adaptationOrder` pin listed registry names first. Matching is case-insensitive. Blank entries are skipped. A repeated name keeps its first position. Several differently cased keys for one skill are concatenated. Unknown names are ignored. Disabled entries can be ordered and are not drawn. Order does not change who can use a skill.

`skillsGuiRows` of `0` sizes each page from the cards on that page. `2` through `6` fix the height, and one of those rows is navigation. Right-click Previous or Next jumps five pages. `/adapt configure` edits `skillsGuiRows`. Icon and order maps are read-only there.

`guiShowAllSkills` false lists skills with XP, knowledge, or a learned adaptation. True lists every enabled skill the player may use, without writing an empty skill line. `/adapt debug mode` shows every skill and adaptation and treats use permission as granted.

## Reference

### Keys

```toml
guiShowAllSkills = false

[gui]
skillsGuiRows = 0
skillOrder = []

[gui.skillIcons]

[gui.adaptationIcons]

[gui.adaptationOrder]
```

| Key | Default | What it does |
|---|---|---|
| `guiShowAllSkills` | `false` | `true` lists every enabled, permitted skill in the skills menu instead of only skills with progress |
| `gui.skillsGuiRows` | `0` | Skills menu height in rows. `0` auto-sizes per page |
| `gui.skillIcons` | empty | Skill registry name to Bukkit material name |
| `gui.adaptationIcons` | empty | Adaptation registry name to Bukkit material name |
| `gui.skillOrder` | empty | Skill registry names pinned to the front of the skills menu, in this order |
| `gui.adaptationOrder` | empty | Skill registry name to that skill's ordered adaptation registry names |

`guiBackButton` (default `true`) reserves the navigation row. `customModels` (default `true`) enables `models.toml`. Both are root keys in `adapt.toml`.

### skillsGuiRows values

| Value | Behavior |
|---|---|
| `0` | Auto-size to the page's contents |
| `2` to `6` | Fixed viewport height, always that many rows |
| `1` | Raised to `2` with a warning, the navigation row needs a row of its own |
| `< 0` | Treated as `0` (auto) with a warning |
| `> 6` | Clamped to `6` with a warning |

### Skills menu layout

Five cards per row. One navigation row is always reserved. Six rows maximum. Left-click steps one page. Right-click jumps five.

### Icon precedence

```
models.toml (when it actually overrides, and customModels = true)
  > gui.skillIcons / gui.adaptationIcons
  > built-in icon
```

### models.toml format

`plugins/Adapt/models.toml`, dotted-path tables holding `material`, `model` and `modelKey`:

```toml
[skill.stealth]
material = "PHANTOM_MEMBRANE"
model = 0
modelKey = "minecraft:empty"

[adaptation.stealth-shadowmeld.icon]
material = "BLACK_DYE"
model = 14
modelKey = "minecraft:empty"

[adaptation.stealth-shadowmeld.level-2]
material = "BLACK_DYE"
model = 15
modelKey = "minecraft:empty"
```

| Path | Used for |
|---|---|
| `skill.<name>` | The skill card in the skills menu |
| `adaptation.<name>.icon` | The adaptation entry in a skill's list |
| `adaptation.<name>.level-<n>` | The level-`n` button in an adaptation's window |
| `snippets.gui.level.<n>` | Fallback level button when the adaptation defines none |

`model` is a custom model data number, `0` meaning none. `modelKey` is an item-model namespaced key, defaulting to `minecraft:empty`.

### Example

```toml
guiShowAllSkills = false

[gui]
skillsGuiRows = 4
skillOrder = ["stealth", "axes", "hunter"]

[gui.skillIcons]
stealth = "PHANTOM_MEMBRANE"
"axes" = "netherite axe"

[gui.adaptationIcons]
stealth-shadowmeld = "minecraft:black_dye"

[gui.adaptationOrder]
stealth = ["stealth-shadowmeld", "stealth-cutpurse"]
```

### Player preference controls

The adaptation level screen reserves a bottom row for registered player controls, with navigation above it. Level cards paginate within the remaining space and the inventory never exceeds six rows. `guiBackButton = false` hides Back without removing preference controls. Adaptations without registered preferences retain their ordinary layout.

Click a preference to update its item in the current window. Left-click advances and right-click reverses through permitted unlocked values. Names and lore show the effective value; red/lime panes indicate Off/On, and gray items indicate unavailable or server-controlled choices. Dependent controls appear only when applicable: Blink's Reactive direction is hidden below level 2 and in Manual mode. Changing activation adds or removes it in the same open window; its saved direction is retained while hidden. Reset clears personal overrides. Large sets of controls have their own row pagination, separate from the level page.

Server policy lives in the adaptation configuration under `playerPreferences`; see [configuration](/adapt/01-installation-configuration#player-preferences). Blink's controls and unlocks are listed in [Rift](/adapt/27-skill-rift#rift-blink-rift-blink).

## Language editor

The language editor uses 36 entries across the first four rows. The bottom row is Back, Previous, Search or Clear Search, Next, and Close. Skill and adaptation messages use the same icons as the gameplay menus. Other groups use the shared category icons.
