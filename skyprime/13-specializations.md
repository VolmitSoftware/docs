---
title: 13 - Island Specializations
description: Configurable island paths, benefits, requirements and switching rules
published: true
date: 2026-10-21T00:00:00.000Z
tags: skyprime, progression, specializations
editor: markdown
dateCreated: 2026-10-10T09:47:33.780Z
---

Island specializations give each island one configurable set of ongoing benefits. Choosing another path replaces those benefits without removing purchased upgrades or completed research. Selection, credit cost and activity history save together.

## Choosing a specialization

Open `/is specialization` or the island menu's Specialization button. `/is specialization <path>` opens a configured path directly. The browser shows requirements, cost, benefits and current selection; Review opens a separate confirmation showing the old and new benefits. Confirmations expire after 30 seconds and reject changes to the selection, actor, configuration or upgrade rules.

Browsing requires `skyprime.use` and `skyprime.specialization`. Changing also requires `skyprime.specialization.change` and the island `SPECIALIZATION` action. Both plugin permissions default to everyone; owners and managers have the island action, while members need a custom role granting it. Selection is shared by the whole island, not chosen per player.

| Default path | Benefits |
| --- | --- |
| Farming (`farmer`) | 1.25× eligible harvest yield and 15 percentage points of crop-growth chance |
| Mining (`miner`) | One generator tier and 1.10× mission credits |
| Building (`builder`) | One bonus level each of Speed, Jump and Homes |
| Exploration (`explorer`) | 1.25× ordinary fishing yield, 1.15× mission credits and one Speed level |

The defaults have no progression requirement, cost zero for the initial choice and 2,500 island credits when switching to them. The default switching cooldown is 24 hours after every selection, including the first. Costs come from the destination path. There is no refund for the previous choice and no command that skips confirmation.

## Configuring paths

`config/specializations.toml` reloads live. The root fields are `enabled`, `switchCooldownMillis` and `paths`. Up to 128 paths can use IDs of 1–32 characters: lowercase letters, digits, underscores and hyphens, beginning with a letter or digit. The cooldown accepts 0–31,536,000,000 milliseconds. The configuration editor exposes scalar fields through `specializations.<field>`; existing requirement entries are editable through numeric keys. Use TOML to add or remove paths or collection entries.

Each `paths.<id>` definition contains:

| Field | Meaning |
| --- | --- |
| `enabled` | Whether this path can be selected and provide benefits |
| `presentation` | Display name, inventory item icon, description lines, category, order and `hiddenWhenLocked` |
| `initialCost` / `switchCost` | Island-credit charge for first selection / any later selection; 0–1,000,000,000,000 |
| `requiredLevel` | Current island level required to select; 0–1,000,000,000,000 |
| `requiredResearch` | Up to 32 configured research IDs required before selection |
| `requiredMissions` | Up to 32 configured one-time mission IDs that must have been completed |
| `effects` | Harvest/fishing/mission-credit multipliers, crop/drop percentages, spawner reduction and generator tiers |
| `bonusLevels` | Temporary upgrade levels by uppercase track name; 1–1000 per configured entry; `EXPANSION` is unsupported |

Requirements gate selection. Losing island value afterward does not cancel a selected path. A hidden locked path is omitted from browsing; the currently selected path remains visible. Configured names and descriptions are literal text; system labels use the player's language.

## How bonuses combine

Purchased upgrades and research grants remain permanent. Bonus levels add only the room available below the upgrade track's configured maximum; they do not overwrite saved levels. Specializations cannot grant permanent border expansion. If switching reduces team or home capacity, existing teammates and homes remain, but new additions must fit the current allowance.

Specialization effects combine additively with the already resolved server/island events and wallet boosters. Multipliers add their bonus above 1: a 1.25× specialization plus a 1.50× event gives 1.75×. Shared caps are 4× harvest/fishing, 10× mission credits, 100% crop/drop bonuses, 75% spawner reduction and 100 temporary generator tiers. Upgrade bonuses remain subject to the normal gameplay caps and eligibility rules. Specializations do not add rare-fishing reward tables or bypass ordinary drop, island membership or flight controls.

Disabling the feature, disabling the selected path or removing its definition suppresses its benefits without deleting the selection or resetting its switching timestamp. Restoring the definition re-enables its benefits. Reloading benefits applies to subsequent gameplay; changing prices or relevant upgrade rules invalidates open confirmations. The separate events enable switch does not disable specializations.

## Persistence and recovery

Island schema 9 stores the specialization ID, selection time and revision in `storage/islands.json`. Reset and ownership transfer retain them; island deletion removes the selection with the island. A successful change creates a `specialization` progression activity entry, and paid changes add a specialization transaction to the credit ledger. The shared transaction journal coordinates island state and history. Back up metadata together with terrain as described in [Operations and recovery](/skyprime/04-operations-recovery).

PlaceholderAPI exposes `%skyprime_island.specialization.id%`, `.name`, `.active` and `.cooldown-seconds`, with matching `%skyprime_current.specialization.<key>%` forms for the island the player is standing on. See [Placeholders and API](/skyprime/90-placeholders-api).

