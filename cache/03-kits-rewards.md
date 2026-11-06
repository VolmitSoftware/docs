---
title: "Cache: Kits and rewards"
description: "Kit definitions, editor behavior, reward chances and inventory destinations"
published: true
date: 2026-11-06T12:00:00.000Z
tags: "cache, kits, rewards, editor"
editor: markdown
dateCreated: 2026-10-15T12:00:00.000Z
---

<nav class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/cache">Cache</a><span aria-hidden="true">/</span><span aria-current="page">Kits and rewards</span></nav>

Each `kits/<id>.toml` file defines one kit. The ID must match the filename and use 1–48 lowercase letters, digits, underscores or hyphens, starting with a letter or digit. Categories use the same identifier format.

## Create and edit

Arrange storage, armor and offhand items, then run `/cache create <kit>`. Capture records metadata and destinations without taking the items. The command refuses an existing ID. To replace an existing kit's items, open `/cache edit <kit>` and use the inventory capture button, which keeps money, experience and command rewards.

The editor supports kit fields, held-item capture, reward fields and a destination picker. Saving checks the revision so an older open editor cannot overwrite a newer edit. The editor's Back button previews the unsaved draft without a claim button. Changing a reward's type away from `ITEM` resets its destination to automatic placement. Up to 32 previous revisions are retained under `storage/revisions/<id>/`; `/cache rollback` publishes the selected revision as a new revision.

## Kit fields

| Field | Default | Behavior |
|---|---|---|
| `id` | `starter` | Stable identity; must match the file |
| `name`, `icon` | `Starter`, `CHEST` | Display name with MiniMessage formatting and material icon |
| `category` | `general` | Browser category |
| `permission` | Empty | Additional permission for ordinary claims |
| `cooldownSeconds` | `86400` | Seconds after successful completion; `0` permits immediate reuse, `-1` makes ordinary claims once-only |
| `cooldownGroup` | Empty | Shared cooldown identity; empty uses the kit ID |
| `hidden` | `false` | Hide from players lacking the kit's permission; direct commands still apply their access checks |
| `enabled` | `true` | Enable delivery |
| `worlds` | Empty list | Allowed world names; empty permits any world |
| `autoEquip` | `false` | Place compatible armor in empty armor slots when a reward has no explicit destination |
| `price` | `0` | Vault charge for each ordinary claim |
| `purchaseUrl` | Empty | External purchase link; a nonempty link refuses ordinary claims |
| `title` | Empty | Title shown after completion |
| `revision` | `1` | Positive edit revision |
| `rewards` | Empty list | Up to 128 reward entries |
{.dense}

A purchase link does not grant ownership or recognize store purchases. Use staff grants or keys for external fulfillment.

Fresh installations create the `trail` kit with 16 bread, 32 torches and a 24-hour cooldown. `general.starterKit` is empty by default; set it to an existing ID to grant that kit after join. A completed prior claim prevents that kit's starter delivery from repeating, and players who already received it are not messaged on later joins.

## Reward entries

```toml
id = "supplies"
name = "Supplies"
category = "survival"
cooldownSeconds = 86400

[[rewards]]
type = "ITEM"
material = "BREAD"
amount = 16
slot = 0
chance = 100.0

[[rewards]]
type = "EXPERIENCE"
experience = 50
chance = 25.0
```

| Type | Fields | Behavior |
|---|---|---|
| `ITEM` | `material`, `amount`, `slot`, `itemData`, `name`, `lore` | Construct a material item or restore captured item data; amount is 1–2304 |
| `MONEY` | `money` | Deposit through the Vault provider |
| `EXPERIENCE` | `experience` | Give 0–1,000,000 experience points |
| `COMMAND` | `command` | Dispatch an allowed console command without a leading slash; `{player}` and `{uuid}` identify the recipient |
{.dense}

Each entry has `chance` from 0 to 100. Ordinary claims and `ROLL` keys test entries independently. If no entry is selected, one entry above zero is chosen with probability proportional to its chance, so a roll always yields at least one reward. `ALL` keys select every entry above zero. Zero-chance entries remain disabled in both modes, and a kit whose entries are all zero is refused before anything is reserved. Selected rewards are saved before delivery, so retries do not reroll.

Captured `itemData` preserves server-serialized metadata. Nonempty `name` and `lore` override the captured text, and `amount` sets the quantity. Player placeholders are not expanded in reward names/lore. Serialization may differ between versions or server platforms, including platforms running the same Minecraft release; verify captured custom items on the destination server.

Command roots must appear in `claims.allowedCommands`. Command rewards are unavailable on Folia. Money rewards and prices need Vault plus an economy provider; Folia additionally requires `claims.allowEconomyOnFolia`.

## Inventory destinations

| `slot` | Destination |
|---|---|
| `-1` | Automatic storage placement, with optional armor auto-equip |
| `0`–`8` | Hotbar |
| `9`–`35` | Main storage |
| `36`, `37`, `38`, `39` | Boots, leggings, chest/elytra, head |
| `40` | Offhand |
{.dense}

Explicit destinations are planned first. Compatible stacks merge within their limits; occupied or incompatible destinations and excess amounts fall back to storage. Existing equipment is never replaced. An explicit destination disables auto-equip for that reward. Non-item rewards must use `-1`.

Armor compatibility follows material names, including elytra, heads, skulls and carved pumpkins. Custom equippable components do not change that mapping. If the whole selected item set does not fit, no partial item plan is applied and the claim remains available for retry.

## Related pages

- [Configuration *Preview, paid confirmation and command controls*](/cache/05-configuration-languages)
- [Keys and crates *Guaranteed and randomized reward modes*](/cache/04-keys-displays)
- [Delivery recovery *Retry saved rewards or resolve uncertain effects*](/cache/06-delivery-recovery)
{.links-list}
