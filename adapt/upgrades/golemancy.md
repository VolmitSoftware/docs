---
title: "Upgrades - Golemancy"
description: "Golemancy upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you mutate Golemancy (see [Mutations](/adapt/35-mutations)), and they replace the [Golemancy](/adapt/34-skill-golemancy) adaptations they fuse.

Each Golemancy upgrade works by giving you its fused adaptations back. While you hold the upgrade, each fused adaptation works, unless its section says otherwise, for you at its own top level when the upgrade is at level 3, one level lower for each upgrade level short of 3, and never below level 1. With default settings, a 5-level adaptation works at level 3, 4 and 5 at upgrade levels 1, 2 and 3, and a 3-level adaptation works at level 1, 2 and 3. Each fused adaptation keeps its own controls, personal settings and config file, as described on the [Golemancy](/adapt/34-skill-golemancy) page. Recipes and infusions those levels unlock are available to you.

## Upgrades

### Grand Overseer (`upgraded-golemancy-grand-overseer`)

3 levels · 13, 13 and 16 knowledge · Fuses Overseer, Golem Mending and Stasis

Gives you Overseer, Golem Mending and Stasis at the levels above, and extends their reach by 50%, 75% or 100% at levels 1, 2 and 3. The extra reach applies to the Crook signal radius, the Sic range, the distance at which Golem Mending counts you as near a golem for regeneration, and the distance you can move before a Stasis packing channel breaks.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `reachBonusBase` | `0.25` | Fraction added to the signal radius, Sic range, mending distance and packing reach before level scaling. |
| `reachBonusPerLevel` | `0.25` | Fraction added to the reach per level. |

### Forgemaster (`upgraded-golemancy-forgemaster`)

3 levels · 15, 14 and 18 knowledge · Fuses Animus Binding, Node Weaving, Guardian Core, Gatherer Core, Harvester Core, Lumber Core, Breaker Core, Rancher Core, Sorter Core, Angler Core, Frost Frame, Copper Frame, Iron Frame and Bone Frame

From level 1, gives you Animus Binding, Node Weaving and every core at their top level, so you can bind golems, craft and place nodes, and run every core as before the merge. The frames follow the levels above: with default settings, Frost, Copper and Iron Frame work at level 3, 4 and 5 and Bone Frame at level 1, 2 and 3, for your golems and bone servants. On a server version without copper golems, Copper Frame is left out.

No upgrade-specific config keys.

### Runeforged (`upgraded-golemancy-runeforged`)

3 levels · 13, 13 and 16 knowledge · Fuses Runic Augments and Masterwork

Gives you Runic Augments and Masterwork at the levels above, so you can infuse and slot runes and make masterworks as those adaptations allow.

Every golem you own, masterwork or not, also gets 1 extra rune slot on top of its body's slots, your Runic Augments slots and any masterwork slot. From level 2, the runes of every golem you own act one tier higher: a tier 1 rune uses tier 2 values, a tier 2 rune uses tier 3 values, and a tier 3 rune uses tier 3 values plus 25%. A rune above your Runic Augments tier limit stays inert. Masterworks get 1 more rune slot on top of that. Your golems keep these perks while you are offline, at the level you last had.

**Twin cores.** Any golem, not only a masterwork, can take a second role core in the second core slot of its menu. You can have 2, 4 or any number of twin-cored golems at levels 1, 2 and 3, counting unloaded and packed ones. The first two cost only the core; each one after that also takes a Masterwork Heart from your inventory, which is not returned. The second core works at 75% speed. Taking the second core out frees the twin. When your level allows fewer twins than you have, the extra twins keep their second core but it idles. A masterwork's own second core from Masterwork level 2 does not count as a twin and works at full speed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `extraRuneSlots` | `1` | Rune slots every golem you own gets on top of its other slots, up to 9. |
| `masterworkRuneSlots` | `1` | Rune slots a masterwork golem gets on top of every other slot, up to 9. |
| `tierUpLevel` | `2` | Runeforged level at which every golem's runes act one tier higher. |
| `tierThreeBoost` | `0.25` | Fraction added to a tier 3 rune's values once runes act one tier higher; 0.25 is 25% more. |
| `twinCoresByLevel` | `[2, 4, -1]` | Golems that may hold a twin core at once, by Runeforged level; -1 means all. |
| `freeTwins` | `2` | Twin-cored golems you may have before each further twin core also costs a Masterwork Heart. |
| `secondCoreSpeed` | `0.75` | Work speed of a twin golem's second core; 0.75 is 75% of the first core's speed. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Golemancy](/adapt/34-skill-golemancy).
