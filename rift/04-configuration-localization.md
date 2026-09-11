---
title: "Rift: Configuration and Localization"
description: "TOML settings, automatic hot reload, in-game editing, and language files"
published: true
date: 2026-09-11T16:13:57.000Z
tags: "rift, configuration, hot-reload, localization, gui"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Rift writes `config.toml` on first start and reloads valid external edits automatically. Invalid or incomplete saves leave the current settings active.

## Settings

| Setting | Default | Range or effect |
|---|---:|---|
| `language` | `en_US` | Safe locale identifier selecting the server-default `languages/<locale>.toml` |
| `hotReloadPollMillis` | `1000` | Clamped to 250–10,000 ms |
| `hotReloadCooldownMillis` | `1500` | Clamped to 250–30,000 ms |
| `autoLoadManagedWorlds` | `true` | Load profiles whose `autoLoad` field is true during startup; missing-profile reconciliation still runs when disabled |
| `evacuationWorld` | empty | Named loaded destination; empty selects the primary world |
| `allowWorldDeletion` | `true` | Permit confirmed quarantine operations |
| `deleteConfirmationSeconds` | `30` | Clamped to 10–300 seconds |
| `splashScreen` | `true` | Print the two-tone Rift startup banner; the separate ready-duration line always prints after successful startup |
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
| `debugUploadEnabled` | `true` | Permit `/rift debug dump` and shared debug requests to upload after saving locally; a command may still pass `upload=false` |
| `bstatsEnabled` | `true` | Submit standard anonymous usage metrics for bStats plugin id `33701`; the global bStats opt-out also applies |

Saving config, the active locale, a world profile, or a quarantine manifest triggers automatic reload. Automatic reload cannot be disabled. Invalid files leave the previous runtime state active.

Rift does not overwrite HUD or title feedback from Adapt, React, or other supported Volmit plugins.

## In-game editor

`/rift config` opens the settings dashboard. Click booleans to toggle them, use left or right click for numbers, shift-click for larger changes, or press Q to enter an exact value. Text settings use a private chat prompt. Valid changes save and apply immediately.

Changing `bstatsEnabled` takes effect immediately and still honors `plugins/bStats/config.yml`. Rift does not register custom charts.

The Language setting opens the server-default picker. `/rift language` manages a player's language, the server default, and message files. Personal choices affect that player only; console and players without a choice use the server default.

Languages and Messages opens the shared editor. It groups message IDs, supports search, and shows the allowed placeholders for each message.

Message input is limited to 512 characters. Use `\n` for a line break, `\\` for a backslash, or `cancel` to stop. Saves are atomic, stale edits are rejected, and opening a locale does not select it.

Enter `primary` or `none` for the evacuation world to clear the explicit destination. Locale changes apply immediately.

## Language overrides

Rift stores TOML catalogs under `plugins/Rift/languages/`. The picker exposes `en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`. `languages/en_US.toml` is generated locally at startup even when another language is selected; selected missing translations download from the source repository.

Non-English translations download from `https://raw.githubusercontent.com/VolmitSoftware/Rift/main/src/main/resources/languages/<locale>.toml`. English is built in, so there is no `en_US.toml` at that path. Rift validates UTF-8, message structure, and placeholders before saving. Missing or invalid entries use built-in English while valid translations remain active; incomplete downloads are accepted. Unreadable files use English and remain untouched on disk. Installed files work offline and are not replaced automatically.

`runtime.prefix` sets the displayed plugin name and its formatting for that locale. Ordinary chat messages use a bold violet-to-pink name matching Rift's help gradient (`#6f2dbd` to `#d16ba5`), a gray `›` separator, and gray body text, with colors reserved for results, warnings, failures, and highlighted values. Localized plugin-name references in messages, help, and menus use `{prefix}` so one edit changes their displayed name together. Version output uses the name's text in a single regular-weight help gradient across `Rift v<version>`.

The separator belongs to each message template, outside `runtime.prefix`. Remove `{prefix}` and its separator from a message to hide its leading label. An empty `runtime.prefix` hides the name wherever it is referenced; any separator or surrounding text remains in its template. Other placeholders are message-specific and required. Prefix formatting is isolated from the surrounding message.

Language files use grouped TOML sections: `[command.feedback]` with `saved = "..."` represents `command.feedback.saved`. Generated English and downloaded catalogs share four localized header sections: file editing, prefix behavior, formatting, and individual variable definitions. Editor saves keep the existing leading comments and group message keys; other valid local files are not rewritten just to change their layout.

Personal choices are stored in `plugins/Rift/languages/language-preferences.properties`. Add a valid TOML locale file to show it in the picker. Locale IDs may contain letters, numbers, underscores, and dashes. Edit messages in game or directly in the selected file:

```toml
[runtime]
prefix = "<bold><gradient:#6f2dbd:#d16ba5>Rift</gradient></bold>"

[rift.message]
created = "{prefix}&r &7› &7Created and managed &f{world}&7."
operation_failed = "{prefix}&r &7› &c{operation} failed &7for &f{world}&7: {reason}"
```

Each file begins with a localized prefix and placeholder reference. Rift validates each message separately for type, formatting, and placeholders, using English when that entry is invalid. In-game edits still reject invalid replacements before saving. Values such as world, player, operation, and failure text remain literal when inserted; section-sign color codes are stripped, and other color-like text cannot alter message formatting.

Return to [Rift World Manager](/rift).
