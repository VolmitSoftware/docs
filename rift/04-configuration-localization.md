---
title: "Rift — Configuration & Localization"
description: "TOML settings, automatic hot reload, in-game editing, and language overrides"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "rift, configuration, hot-reload, localization, gui"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Rift generates a documented `config.toml` and keeps a validated in-memory snapshot. External edits are debounced and parsed from stable captured content so a partial write cannot silently replace working settings.

## Settings

| Setting | Default | Range or effect |
|---|---:|---|
| `language` | `en_US` | Locale identifier used by `language.yml` |
| `hotReload` | `true` | Watch config, language, and managed profiles |
| `hotReloadPollMillis` | `1000` | Clamped to 250–10,000 ms |
| `hotReloadCooldownMillis` | `1500` | Clamped to 250–30,000 ms |
| `autoLoadManagedWorlds` | `true` | Load profiles whose `autoLoad` field is true during startup |
| `evacuationWorld` | empty | Named loaded destination; empty selects the primary world |
| `allowWorldDeletion` | `true` | Permit confirmed quarantine operations |
| `deleteConfirmationSeconds` | `30` | Clamped to 10–300 seconds |
| `verbose` | `false` | Log successful lifecycle and hot-reload details |

Saving the file triggers automatic reload while hot reload is enabled. `/rift reload` performs the same config, language, profile, and trash-manifest refresh explicitly. If one file is invalid, the command reports failure and valid runtime state remains active.

## In-game editor

`/rift config` opens an inventory menu for common operator settings. Left and right clicks toggle values or adjust numbers; shift-click changes numeric values by larger steps. Saving runs asynchronously, atomically replaces the TOML file, updates the hot-reload self-write snapshot, and reopens the menu with the current values.

The evacuation-world control uses the player's current world on left click and clears the explicit destination on right click. The menu also provides reload and close actions.

## Language overrides

English defaults are code-owned and complete. `plugins/Rift/language.yml` overrides only the keys placed beneath `messages:`:

```yaml
messages:
  rift:
    message:
      created: "&5[Rift]&8: &aCreated &f{world}&a."
      operation_failed: "&5[Rift]&8: &c{operation} failed for &f{world}&c: {reason}"
```

Rift validates message shape and placeholders before applying an overlay. Untrusted values such as world, player, operation, and failure text have color and formatting codes stripped before insertion; trusted UI fragments are inserted explicitly.

Return to [Rift World Manager](/rift).
