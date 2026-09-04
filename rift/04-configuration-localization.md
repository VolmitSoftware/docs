---
title: "Rift — Configuration & Localization"
description: "TOML settings, automatic hot reload, in-game editing, and language overrides"
published: true
date: 2026-09-03T00:00:00.000Z
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

Saving config, the active locale file, a managed-world profile, or a quarantine manifest always triggers automatic reload. Rift discovers safe custom locale filenames for the picker but loads and watches message content only from the selected file. The poll and cooldown values tune detection; automatic reload cannot be disabled and there is no manual reload command. If a stable file is invalid, Rift logs the failure and retains the previous valid runtime state.

Rift does not overwrite HUD or title feedback from Adapt, React, or other supported Volmit plugins.

## In-game editor

`/rift config` opens a 54-slot dashboard containing all 25 persisted settings. General & Safety, Feedback & Sounds, Presentation, Diagnostics, and Languages & Messages occupy one centered contiguous row instead of alternating slots. Each category's settings are also arranged as centered contiguous rows within the upper five rows, while Back and Close remain on the bottom row. Diagnostics contains file-watch poll and cooldown timing, verbose logging, public debug uploads, and bStats. There is no reload category, button, or informational control because valid file changes apply automatically. Click a boolean to toggle it. Left- or right-click a number to adjust it, shift-click for a larger change, or press Q to enter an exact value in chat. Evacuation world and sound keys use a private chat prompt with cancel and timeout handling. A successful save sends one compact localized `{prefix}` confirmation containing the setting, new value, and previous value; it does not clear chat or render a Director result page.

Changing `bstatsEnabled` takes effect immediately and still honors `plugins/bStats/config.yml`. Rift does not register custom charts.

Clicking the Language setting opens the shared server-default picker in chat. `/rift language` opens a control page for the viewer's personal language, the server default, resetting a personal choice, and editing message files. The corresponding typed paths are `/rift language self [locale|reset]`, `/rift language server [locale]`, and `/rift language server edit [locale]`. Locale links retain Rift's purple command-menu formatting, hover details, Back navigation, and tab completion. A personal choice changes command, chat, title, subtitle, and action-bar text only for that player; console and players without an override use the server default.

Languages & Messages opens VolmLib's shared 54-slot language editor, so Rift uses a full chest consistently across both configuration surfaces. It lists locales, then groups message IDs by their leading namespace, supports all-message search, and pages up to 45 messages at a time. Each message item shows a bounded formatted preview and its exact allowed placeholders; Back returns to the previous message group, locale list, or Rift configuration dashboard.

The private message prompt shows the current raw value and sorted placeholder list. Input is limited to 512 characters; use `\n` for a line break, `\\` for a literal backslash, `cancel` to return unchanged, or allow the 60-second prompt to expire. A valid save atomically updates the selected TOML entry, publishes the prepared snapshot to active readers, sends the same compact setting/new/previous confirmation, and returns to the same page. The editor reloads the value before saving and rejects a stale prompt if another edit changed that message in the meantime. Opening or editing a locale does not select it.

Enter `primary` or `none` for the evacuation world to clear the explicit destination. Locale changes apply immediately.

## Language overrides

Rift stores sectioned TOML catalogs under `plugins/Rift/languages/`, using the configured locale as the filename stem. The picker exposes `en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`. The jar carries only that supported-locale manifest. English is generated from Rift's typed catalog when missing; the 17 translations remain in the source repository and only the selected missing file is fetched from `main`.

Repository translations are fetched from `https://raw.githubusercontent.com/VolmitSoftware/Rift/main/src/main/resources/languages/<locale>.toml`. The download is bounded, requires strict UTF-8 plus at least one recognized valid message, and is atomically published only if the destination is still missing. Known translated values are validated; missing current keys use code-owned English in memory, while unknown future keys are retained in the file and ignored by the running version. Concurrent requests share one transfer and failed requests enter a retry cooldown. Rift materializes only a locale explicitly selected or opened for editing; its code-owned English fallback remains in memory and does not create `en_US.toml` while another locale is being prepared. Installed files work offline and are never refreshed or overwritten automatically. The console records the source URL and final path. Translation discussion and contributions can use [VolmitSoftware Discord](https://volmitsoftware.com/discord), but Rift does not connect to Discord or require a Discord token at runtime.

Every repository file begins with a comment block written in that locale. It explains automatic reload, formatting, and all supported message placeholders with their meanings. `runtime.prefix` defines the global prefix text. Operational messages that should display it contain the ordinary optional `{prefix}` placeholder; remove `{prefix}` from one message to hide the prefix only there, or set `runtime.prefix` to an empty string to hide it everywhere. Command help, GUI text, hovers, titles, and action bars omit `{prefix}` by default. Other placeholders remain message-specific and required.

Personal UUID selections are stored atomically in `plugins/Rift/languages/language-preferences.properties`. Add another safe TOML locale file to make it appear in the picker and Languages & Messages editor. Locale identifiers may contain letters, numbers, underscores, and dashes; paths, extensions, spaces, and traversal characters are rejected. You can use the in-game message editor or edit the selected file directly:

```toml
[runtime]
prefix = "&5&lRIFT&r &8›&r "

[rift.message]
created = "{prefix}&aCreated and managed &f{world}&a."
operation_failed = "&c{operation} failed for &f{world}&c: {reason}"
```

The example keeps the prefix on `created` and removes it from `operation_failed`. Rift validates TOML value types, message shape, formatting, and placeholders before applying an overlay. Locale selection prepares and validates the language before committing the configuration change, preventing the selected locale from diverging from the active messages. Untrusted values such as world, player, operation, and failure text have color and formatting codes stripped before insertion; trusted UI fragments are inserted explicitly.

Return to [Rift World Manager](/rift).
