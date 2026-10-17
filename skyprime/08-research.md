---
title: SkyPrime - Island research
description: Research branches, requirements, permanent upgrade grants and exclusive choices
published: true
date: 2026-10-14T00:00:00.000Z
tags: skyprime, research, progression, configuration
editor: markdown
dateCreated: 2026-10-08T23:00:00.000Z
---

Research is shared by an island's team. Nodes combine challenge completion, held resources, island level, credits and earlier research to grant permanent upgrade levels. Operators configure the tree in `plugins/SkyPrime/config/research.toml`.

## Using the tree

Open `/sky research` or select Research in the island menu. The browser sorts nodes by order and ID, with category filtering and 45 entries per page. Select a node or use `/sky research <id>` to inspect its requirements and grants; long requirement lists have their own pages. The refresh control updates displayed state without rescanning island value.

All island members with `skyprime.use` can inspect visible nodes. Research purchases also require the island role action `UPGRADES`, held by owners and managers by default. Eligible players select Review research and confirm within 30 seconds. Closing or cancelling the confirmation spends nothing.

Confirmation rechecks membership, authority, current level, challenge completions, previous research, exclusive choices, held materials and available credits. Configuration changes that affect the quoted research policy, upgrade rules, level divisor or maximum radius invalidate the preview. Another teammate completing the same node or a conflicting branch prevents the purchase.

## Requirements and grants

- Every listed prerequisite node must already be researched.
- Every listed mission must have at least one recorded completion. A later repeating mission window does not erase its lifetime completion requirement.
- `requiredLevel` uses current island value divided by the configured level divisor. It does not use the historical peak used by milestones.
- Required materials are checked in the confirming player's 36 storage slots. Armor and offhand items do not count. Material matching includes named or otherwise customized items of that material; their metadata is not a requirement. Items remain in the inventory.
- `cost` spends island credits. The debit, research completion and upgrade grants are saved together before a success message.

Each grant sets an upgrade track to at least the configured level. A grant of `TEAM = 2` changes level zero or one to two and leaves level three unchanged; it does not add two levels. Grants use the existing ten upgrade tracks and their configured limits and effects. Expansion grants increase the island radius only for newly granted levels, capped by the maximum radius.

Grants are permanent purchased levels. Editing, disabling or removing a research node does not retract them or repay credits. Existing upgrade settings still control their runtime effects. Ordinary upgrade purchases remain available, including tracks granted by a different research branch.

## Exclusive choices and persistence

Nodes with the same nonempty `exclusiveGroup` are alternatives. Completing one permanently blocks the other nodes in that group for the island. Descendants normally use an empty group and depend on their selected branch; placing a descendant in the same group as its prerequisite would make it impossible to complete and is rejected.

Completion records freeze the exclusive group and timestamp. Removing or editing a completed definition does not release that saved group. Renaming a node creates a different identity; saved completions retain the original ID. Research and upgrade grants survive terrain resets and ownership transfers. Deleting the island removes its research with the island aggregate. There is no research refund or respec command.

Research uses the island aggregate in `storage/islands.json`, schema 9. The `research` map stores each node ID's `exclusiveGroup` and `unlockedAt`; each island can retain up to 4,096 historical completions. Back up the complete storage directory and terrain as described in [operations and recovery](/skyprime/04-operations-recovery).

## Configuration

The root `enabled` switch controls new research and browsing. Up to 256 definitions live under `[nodes.<id>]`. Node IDs, categories, prerequisite IDs and exclusive groups use 1 to 32 lowercase letters, digits, underscores or hyphens, beginning with a letter or digit. An empty exclusive group means the node is not an exclusive choice.

| Field | Accepted values and behavior |
| --- | --- |
| `enabled` | Whether this node can be browsed and researched |
| `cost` | 0 to 1,000,000,000,000 island credits |
| `requiredLevel` | 0 to 1,000,000,000,000 current island levels |
| `prerequisites` | Up to 32 research IDs; all must be completed |
| `requiredMissions` | Up to 32 enabled mission IDs; each needs a lifetime completion |
| `requiredItems` | Up to 32 item materials, 1 to 2,304 each, at most 2,304 combined; the minimum required stacks must fit 36 storage slots |
| `exclusiveGroup` | Empty or a shared choice-group ID |
| `grants` | Upgrade track names mapped to levels 1 to 1,000, bounded by each track's configured maximum; an empty map is allowed for prerequisite-only nodes |
| `presentation` | Name, icon, description, category, order and `hiddenWhenLocked`, using the same bounds as [challenges](/skyprime/01-installation-configuration#progression-settings) |

Every referenced node and mission must exist. Enabled nodes cannot depend on disabled nodes. Cycles, prerequisite paths requiring two choices from the same exclusive group, invalid materials and grants above upgrade limits reject the complete candidate. Invalid reloads retain the previous configuration.

`hiddenWhenLocked` hides a node until its research prerequisites are complete. Other requirements such as materials, level and credits leave the node visible for inspection. Completed nodes remain visible if enabled. Disabled nodes are omitted from browsing and command completion.

This example defines a root followed by a production choice. Add another node with `exclusiveGroup = "production"` and the same root prerequisite to create an alternative.

```toml
enabled = true

[nodes.workshop]
enabled = true
cost = 100
requiredLevel = 0
prerequisites = []
requiredMissions = []
requiredItems = { OAK_LOG = 32 }
exclusiveGroup = ""
grants = {}

[nodes.workshop.presentation]
displayName = "&bWorkshop"
icon = "CRAFTING_TABLE"
description = ["Prepare the island for research."]
category = "foundations"
order = 0
hiddenWhenLocked = false

[nodes.farming]
enabled = true
cost = 1000
requiredLevel = 5
prerequisites = ["workshop"]
requiredMissions = []
requiredItems = { WHEAT = 64 }
exclusiveGroup = "production"
grants = { CROP = 1 }

[nodes.farming.presentation]
displayName = "&bFarming"
icon = "WHEAT"
description = ["Choose farming for the island's production research."]
category = "agriculture"
order = 10
hiddenWhenLocked = false
```

Files reload automatically. `/sky config` edits existing scalar settings, including entries in prerequisite and mission arrays; add or remove nodes, fields and array elements in TOML. The main menu Research slot is `research` in `config/menus.toml`, default 33.

## Default tree

The default tree is enabled and has seven nodes. All material requirements retain items; no default node requires a challenge, but operators can add mission IDs.

| Node | Prerequisite | Credits | Level | Materials | Grants |
| --- | --- | --- | --- | --- | --- |
| `foundations` | None | 100 | 0 | 32 oak logs | Opens branches |
| `exploration` | `foundations` | 750 | 0 | 64 cobblestone | Expansion 1 |
| `outposts` | `exploration` | 1,500 | 10 | 16 iron ingots | Homes 2 |
| `industry` | `foundations` | 1,000 | 0 | 128 cobblestone | Generator 1 |
| `metallurgy` | `industry` | 4,000 | 10 | 32 iron ingots, 8 gold ingots | Generator 2, Drops 1 |
| `agriculture` | `foundations` | 1,000 | 0 | 64 wheat | Crop 1 |
| `irrigation` | `agriculture` | 3,000 | 10 | 128 wheat, 16 iron ingots | Crop 2 |

Industry and agriculture share the `production` exclusive group. Exploration remains available alongside either choice.

