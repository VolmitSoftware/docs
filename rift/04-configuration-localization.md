---
title: "Rift — Configuration & Localization"
description: "TOML settings, automatic hot reload, in-game editing, and language overrides"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "rift, configuration, hot-reload, localization, gui"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Rift writes `config.toml` on first start and reloads valid external edits automatically. Invalid or incomplete saves leave the current settings active.

## Settings

| Setting | Default | Range or effect |
|---|---:|---|
| `language` | `en_US` | Safe locale identifier selecting `languages/<locale>.yml` |
| `hotReloadPollMillis` | `1000` | Clamped to 250–10,000 ms |
| `hotReloadCooldownMillis` | `1500` | Clamped to 250–30,000 ms |
| `autoLoadManagedWorlds` | `true` | Load profiles whose `autoLoad` field is true during startup |
| `evacuationWorld` | empty | Named loaded destination; empty selects the primary world |
| `allowWorldDeletion` | `true` | Permit confirmed quarantine operations |
| `deleteConfirmationSeconds` | `30` | Clamped to 10–300 seconds |
| `splashScreen` | `true` | Print the Rift startup banner |
| `titlePopups` | `true` | Show title/subtitle feedback for enabled event groups |
| `actionBarPopups` | `true` | Publish feedback through VolmLib's shared HUD arbitration |
| `sounds` | `true` | Play the configured feedback sounds |
| `worldLifecycleFeedback` | `true` | Feedback for create, import, load, unload, quarantine, and restore |
| `teleportFeedback` | `true` | Feedback after a successful teleport |
| `failureFeedback` | `true` | Feedback after a failed operation |
| `worldLifecycleSound` | `block.beacon.activate` | Namespaced sound key for lifecycle success |
| `teleportSound` | `entity.enderman.teleport` | Namespaced sound key for teleport success |
| `failureSound` | `block.note_block.bass` | Namespaced sound key for failure |
| `soundVolume` | `0.8` | Clamped to 0–4 |
| `soundPitch` | `1.0` | Clamped to 0.5–2 |
| `titleFadeInTicks` | `10` | Clamped to 0–200 ticks |
| `titleStayTicks` | `40` | Clamped to 1–1,200 ticks |
| `titleFadeOutTicks` | `10` | Clamped to 0–200 ticks |
| `verbose` | `false` | Log successful lifecycle and hot-reload details |
| `debugUploadEnabled` | `true` | Upload each `/rift debug` report to the public mclo.gs service after its local copy is saved; disable for local-only reports |
| `bstatsEnabled` | `true` | Submit standard anonymous usage metrics for bStats plugin id `33701`; the global bStats opt-out also applies |

Saving config, the active locale file, a managed-world profile, or a quarantine manifest always triggers automatic reload. The language directory is also scanned for newly added locale files. The poll and cooldown values tune detection; automatic reload cannot be disabled and there is no manual reload command. If a stable file is invalid, Rift logs the failure and retains the previous valid runtime state.

Action-bar feedback uses VolmLib's shared HUD segment arbitration. Title feedback acquires a shared title claim before display. These systems prevent Rift from replacing output from HUD producers such as Adapt and React. Sounds run on the affected player's owning scheduler.

## In-game editor

`/rift config` opens a 27-slot dashboard containing all 25 persisted settings. Its pages are General & Safety, Automatic Reload, Feedback & Sounds, and Presentation. Click a boolean to toggle it. Left- or right-click a number to adjust it, shift-click for a larger change, or press Q to enter an exact value in chat. Evacuation world and sound keys use a private chat prompt with cancel and timeout handling.

Changing `bstatsEnabled` is hot-applied through the same committed configuration path used by file reload and the editor. Setting it to `false` shuts down the Rift-owned bStats runtime; setting it to `true` starts the official runtime and still honors `plugins/bStats/config.yml`. Rift does not alter the official Metrics source beyond its permitted package declaration and does not register custom charts.

Clicking Language closes the inventory and lists each bundled or operator-provided locale using Rift's command-help layout. Each entry marks the current selection. Clicking another locale runs `/rift language <locale>`, creates its file when needed, validates it, and activates it. The command also accepts typed input and tab-completes the same locale list.

Editor writes run on a dedicated configuration thread, atomically replace the TOML file, and return to the player's owning scheduler before reopening the category. Enter `primary` or `none` for the evacuation world to clear the explicit destination. Locale changes immediately rebuild the active language overlay instead of waiting for another file event.

A coverage test compares the editor registry with every non-static `RiftConfig` field. Adding a future persisted option without an in-game editor control fails the test suite.

## Language overrides

Rift stores language catalogs under `plugins/Rift/languages/`, using the configured locale as the filename stem. It bundles `en_US` plus `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`, but it creates only the selected catalog instead of pre-populating all 18 files. Existing operator files and previously selected catalogs are preserved. When a locale becomes active, Rift appends newly introduced defaults and refreshes a bundled locale's reference header while preserving customized message values, so every selected catalog remains complete and editable after an upgrade.

Every bundled file begins with a comment block written in that locale. The block explains automatic reload, the top-level `prefix` setting, and all supported message placeholders with their meanings. Rift automatically prepends `prefix` to operational chat while leaving command help, GUI text, hovers, titles, and action bars in their own formatting; set it to an empty string to disable it. Prefixes cannot contain placeholders. Keep message placeholders exactly as written and only in messages that originally declare them; placeholder validation rejects a locale edit that removes, adds, or renames a message's required values.

Add another safe locale file to make it appear in the in-game picker. Locale identifiers may contain letters, numbers, underscores, and dashes; paths, extensions, spaces, and traversal characters are rejected. You can edit a single entry or the complete file:

```yaml
prefix: '&5&lRIFT &8» &r'
messages:
  rift:
    message:
      created: "&aCreated &f{world}&a."
      operation_failed: "&c{operation} failed for &f{world}&c: {reason}"
```

Rift validates message shape and placeholders before applying an overlay. Locale selection prepares and validates the language before committing the configuration change, preventing the selected locale from diverging from the active messages. Missing entries fall back to the complete typed English catalog. Untrusted values such as world, player, operation, and failure text have color and formatting codes stripped before insertion; trusted UI fragments are inserted explicitly.

Return to [Rift World Manager](/rift).
