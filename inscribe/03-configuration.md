---
title: "Inscribe: Configuration"
description: "Typed TOML settings, validation, hot reload, and in-game editing"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "inscribe, configuration"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

Configuration lives at `plugins/Inscribe/config.toml`. Open `/inscribe config` for the shared in-game editor, or edit the TOML file directly.

| Setting | Default | Behavior |
| --- | --- | --- |
| `general.enabled` | `true` | Enable extraction and application |
| `general.language` | `en_US` | Server language: `en_US`, a repository locale, or any custom language ID of 2 to 32 letters, digits, underscores, or hyphens |
| `general.updateNotifications` | `true` | Notify authorized operators about GitHub releases. Nothing is installed automatically |
| `metrics.enabled` | `true` | Enable anonymous bStats usage reporting, subject to the shared bStats opt-out |
| `presentation.splashScreen` | `true` | Startup banner |
| `hotReload.enabled` | `true` | Apply edited configuration and language files without a restart |
| `hotReload.pollIntervalMillis` | `1000` | Milliseconds between file checks, limited to 250 through 60000 |
| `hotReload.cooldownMillis` | `1500` | Milliseconds a changed file must stay unchanged before it applies, limited to 250 through 60000 |
| `hotReload.notifyOperators` | `true` | Show applied or rejected file changes in the action bar of players with `inscribe.config` |
| `debug.uploadEnabled` | `true` | Permit explicitly requested diagnostic uploads |
| `transfers.allowCreative` | `false` | Permit creative-mode transfers |
| `transfers.allowUnsafe` | `false` | Preserve levels above vanilla maximums. Compatibility and conflicts stay enforced |
| `transfers.mergeEqualLevels` | `true` | A book level equal to the item's level raises it by one, up to the vanilla maximum |
| `transfers.increaseRepairCost` | `true` | Applying a book raises the item's repair cost like an anvil |
| `transfers.extractionMaterials` | `[]` | Item materials that allow extraction. Empty allows every eligible item |
| `transfers.applicationMaterials` | `[]` | Item materials that accept books. Empty allows every compatible item |
| `transfers.bookName` | `""` | Extracted-book name with `&` color codes and `%player%`. Empty keeps the vanilla name |
| `transfers.bookLore` | `[]` | Extracted-book lore lines with `&` color codes and `%player%`. Empty adds no lore |
| `pricing.currency` | `EXPERIENCE` | Raw experience points, or `MONEY`, which requires Vault |
| `pricing.extractionCost` | `100` | Default cost per selected enchantment |
| `pricing.extractionCostPerLevel` | `false` | Multiply extraction cost by the enchantment level |
| `pricing.applicationCost` | `0` | Fixed fee per application |
| `pricing.applicationCostPerLevel` | `false` | Multiply the application fee by the sum of applied levels |
| `pricing.allowEconomyOnFolia` | `false` | Allow money prices on Folia with an economy provider that supports region threads |

## Enchantment policies

Rules in `enchantments` use namespaced enchantment IDs. Each rule has `enabled`, `cost`, `perLevel`, and `currency`. Enchantments without a rule use the `pricing` extraction defaults. The default rules disable `minecraft:binding_curse` and `minecraft:vanishing_curse`.

```toml
[enchantments."minecraft:sharpness"]
enabled = true
cost = 250.0
perLevel = true
currency = "EXPERIENCE"
```

## Limits

Costs must be between 0 and 1,000,000, and experience costs must be whole points. Multiplying a valid per-level cost by an unusually high enchantment level can produce a total above the supported experience balance. That transfer is unaffordable and charges nothing. Book names allow up to 512 characters, and lore allows up to 20 lines of 512 characters each. Material lists accept item material identifiers. Rejections name the setting, for example `pricing.extractionCost must be between 0 and 1000000`.

## Reload and editing

Inscribe has no reload command. With `hotReload.enabled` on, Inscribe checks `config.toml` and the language files at the configured interval, and a changed file applies once it has stayed unchanged for the cooldown. Edits made while hot reload is off are not applied when it is turned back on. They apply at the next restart or the next file change. Settings-editor changes always apply immediately.

Inscribe parses and validates a file before using it. An invalid file keeps the working settings and logs one SEVERE line with the file, the reason, and the stack trace. An invalid `config.toml` at server start stops Inscribe from enabling. Open transfer menus close only when the settings actually change, so language edits and unchanged saves leave them open. A save from the editor is rejected if another edit changed the value while the editor was open.

The editor's root page lists the eight sections, and each section shows its settings with translated names and descriptions. Open Enchantment policies to browse existing rules. Each rule shows an English name built from its namespaced ID, such as Binding Curse for `minecraft:binding_curse`, with the namespace in parentheses for enchantments outside `minecraft`. Material and lore lists use the shared chat input. The server-language entry under General opens the shared chat selector. Material IDs, enchantment IDs, and currency values keep their canonical spelling.

## Related pages

- [Languages and editors *Translations and message editing*](/inscribe/05-languages-editors)
- [Enchantment transfers *How prices and options apply*](/inscribe/02-enchantment-transfers)
{.links-list}
