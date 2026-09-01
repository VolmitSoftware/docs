---
title: "Rift — Configuration & Localization"
description: "TOML settings, automatic hot reload, in-game editing, and language overrides"
published: true
date: 2026-09-01T00:00:00.000Z
tags: "rift, configuration, hot-reload, localization, gui"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Rift writes `config.toml` on first start and reloads valid external edits automatically. Invalid or incomplete saves leave the current settings active.

## Settings

| Setting | Default | Range or effect |
|---|---:|---|
| `language` | `en_US` | Safe locale identifier selecting `languages/<locale>.toml` |
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

Saving config, the active locale file, a managed-world profile, or a quarantine manifest always triggers automatic reload. Rift discovers safe custom locale filenames for the picker but loads and watches message content only from the selected file. The poll and cooldown values tune detection; automatic reload cannot be disabled and there is no manual reload command. If a stable file is invalid, Rift logs the failure and retains the previous valid runtime state.

Rift does not overwrite HUD or title feedback from Adapt, React, or other supported Volmit plugins.

## In-game editor

`/rift config` opens a 27-slot dashboard containing all 25 persisted settings. Its pages are General & Safety, Automatic Reload, Feedback & Sounds, Presentation, and Languages & Messages. Click a boolean to toggle it. Left- or right-click a number to adjust it, shift-click for a larger change, or press Q to enter an exact value in chat. Evacuation world and sound keys use a private chat prompt with cancel and timeout handling.

Changing `bstatsEnabled` takes effect immediately and still honors `plugins/bStats/config.yml`. Rift does not register custom charts.

Clicking Language closes the inventory and prints every repository or operator-provided locale in the same purple banner, row, hover, click, and footer style used by Rift's Director command help. Each entry shows the current selection and runs `/rift language <locale>` when clicked. English and safe custom locales are created locally when missing; a missing repository translation downloads first. The configuration changes and the locale activates only after the selected file passes validation, so a failed request leaves the previous language selected. The command remains available for typing and tab-completes the same locale list.

Languages & Messages is the catalog-editing surface. Its first paginated inventory lists available locales with their language names and active state; choosing an uninstalled repository locale downloads and validates that file for editing without changing the active language. The next inventory lists 18 message IDs per page. Each paper item shows a bounded formatted preview, the exact placeholders allowed for that message, and a left-click edit action.

The private message prompt shows the current rendered preview and sorted placeholder list. Input is limited to 512 characters; use `\n` for a line break, `\\` for a literal backslash, `cancel` to return unchanged, or allow the 60-second prompt to expire. A valid save atomically updates the selected TOML entry, reports the old and new formatted values, and returns to the same page. Editing the configured locale applies immediately; editing another locale changes only its file and never switches the server language. Delayed downloads are tied to the player's latest editor request, so an older completion cannot reopen a locale after the player navigates elsewhere.

Enter `primary` or `none` for the evacuation world to clear the explicit destination. Locale changes apply immediately.

## Language overrides

Rift stores sectioned TOML catalogs under `plugins/Rift/languages/`, using the configured locale as the filename stem. The picker exposes `en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`. The jar carries only that supported-locale manifest. English is generated from Rift's typed catalog when missing; the 17 translations remain in the source repository and only the selected missing file is fetched from `main`.

Repository translations are fetched from `https://raw.githubusercontent.com/VolmitSoftware/Rift/main/src/main/resources/languages/<locale>.toml`. The download is bounded, requires strict UTF-8 and a complete valid catalog, and is atomically published only if the destination is still missing. Concurrent requests share one transfer and failed requests enter a retry cooldown. Rift materializes only a locale explicitly selected or opened for editing; its code-owned English fallback remains in memory and does not create `en_US.toml` while another locale is being prepared. Installed files work offline and are never refreshed or overwritten automatically; missing entries in English or operator-created sparse catalogs fall back to code-owned English. The console records the source URL and final path. Translation discussion and contributions can use [VolmitSoftware Discord](https://volmitsoftware.com/discord), but Rift does not connect to Discord or require a Discord token at runtime.

Every repository file begins with a comment block written in that locale. It explains automatic reload, formatting, and all supported message placeholders with their meanings. `runtime.prefix` defines the global prefix text. Operational messages that should display it contain the ordinary optional `{prefix}` placeholder; remove `{prefix}` from one message to hide the prefix only there, or set `runtime.prefix` to an empty string to hide it everywhere. Command help, GUI text, hovers, titles, and action bars omit `{prefix}` by default. Other placeholders remain message-specific and required.

Add another safe TOML locale file to make it appear in the picker and Languages & Messages editor. Locale identifiers may contain letters, numbers, underscores, and dashes; paths, extensions, spaces, and traversal characters are rejected. You can use the in-game message editor or edit the selected file directly:

```toml
[runtime]
prefix = "&5&lRIFT&r &8›&r "

[rift.message]
created = "{prefix}&aCreated and managed &f{world}&a."
operation_failed = "&c{operation} failed for &f{world}&c: {reason}"
```

The example keeps the prefix on `created` and removes it from `operation_failed`. Rift validates TOML value types, message shape, formatting, and placeholders before applying an overlay. Locale selection prepares and validates the language before committing the configuration change, preventing the selected locale from diverging from the active messages. Untrusted values such as world, player, operation, and failure text have color and formatting codes stripped before insertion; trusted UI fragments are inserted explicitly.

Return to [Rift World Manager](/rift).
