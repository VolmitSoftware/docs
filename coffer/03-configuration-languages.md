---
title: Coffer configuration and languages
description: config.toml settings, the in-game editor, hot reload, and language files
published: true
date: 2026-10-25T00:00:00.000Z
tags: coffer, configuration, languages
editor: markdown
dateCreated: 2026-10-17T00:00:00.000Z
---

Coffer reads its settings from `plugins/Coffer/config.toml` and its messages from `plugins/Coffer/languages/`. Both reload from disk while the server runs, and `/coffer config` edits the same settings in game. There is no reload command.

## Settings

Coffer writes `config.toml` with defaults on first start. Every key carries a comment generated from the plugin, and the file is rewritten in canonical form whenever Coffer saves it, so hand-written comments do not survive a save. Keys below are written as `section.key`; each table is one TOML section, in file order.

### general

| Setting | Default | What it changes |
| --- | --- | --- |
| `general.enabled` | `true` | Master switch for player vault commands (`create`, `list`, `open`, `shared`, `share`, `unshare`, `shares`, `delete`, `/pv`). When `false`, players get `Coffer vaults are disabled on this server.`; join recovery, operator recovery, and administrator commands keep working. |
| `general.language` | `en_US` | Server default locale for players without a personal selection. The locale must be `en_US` or have its file installed under `languages/`; otherwise the change is rejected. |
| `general.updateNotifications` | `true` | Join notices about newer GitHub releases for operators and `coffer.update` holders. `false` stops the release checks and the notices. |

### metrics

| Setting | Default | What it changes |
| --- | --- | --- |
| `metrics.enabled` | `true` | Anonymous bStats statistics under plugin ID 34915. Applies without a restart; the global `plugins/bStats/config.yml` opt-out still wins. |

### presentation

| Setting | Default | What it changes |
| --- | --- | --- |
| `presentation.splashScreen` | `true` | Prints the Coffer splash on enable. Read once at enable; the splash always prints when enable fails. |
| `presentation.alternateSplashes` | `true` | Allows alternate splash art on about one start in ten. Read once at enable. |
| `presentation.commandSounds` | `true` | Plays the theme success or error sound to players after vault commands and configuration editor saves. Menus never play sounds. |

### hotReload

| Setting | Default | What it changes |
| --- | --- | --- |
| `hotReload.enabled` | `true` | Applies edits to `config.toml` and language files without a restart. Edits made while it is `false` are not replayed when it is turned back on. |
| `hotReload.pollIntervalMillis` | `1000` | Milliseconds between file checks. Clamped to 250 through 60000. |
| `hotReload.cooldownMillis` | `1500` | Milliseconds a changed file must stay unchanged before it is applied. Clamped to 250 through 60000. |
| `hotReload.notifyOperators` | `true` | Shows online `coffer.config` holders an action bar line when a file change is applied or rejected. The console always logs the outcome. |

### debug

| Setting | Default | What it changes |
| --- | --- | --- |
| `debug.uploadEnabled` | `true` | Lets `/coffer debug dump` upload the report to mclo.gs. The local report is always written, and a failed upload never removes it. |

### vault

| Setting | Default | What it changes |
| --- | --- | --- |
| `vault.rows` | `3` | Rows in each newly created vault, 1 through 6, nine slots per row. |
| `vault.maximumVaults` | `3` | Personal vaults per owner, 1 through 100. Lowering it stops further creation without removing existing vaults. |
| `vault.sharedUserLimit` | `8` | Players a newly created vault can be shared with, 0 through 128. `0` disables sharing. |
| `vault.requiredPermission` | `coffer.vault.standard` | Permission needed to open or use newly created vaults. Empty for unrestricted access, or a lowercase permission node of at most 128 characters. |

The `[vault]` settings define the `standard` vault type used by `/coffer create` and integrations. Rows, shared-user limit, and required permission are saved with each vault when it is created; changing them does not resize, rewrite, or unshare existing vaults.

Configuration files over 64 KiB, malformed TOML, out-of-range `[vault]` values, and unknown locales are rejected. Writes go to a temporary file that is forced to disk and then atomically replaces `config.toml`; a filesystem that cannot do this reports an error instead of accepting an unsafe write. Transfer admission and checkpoint limits are fixed implementation bounds, not settings.

## In-game editor

`/coffer config` opens the configuration editor for players with `coffer.config`. Its root screen has one category per section (General, Metrics, Presentation, Hot reload, Diagnostics, Vaults) and a Languages item that opens the language message editor; Back in that editor returns to the configuration root.

| Setting kind | Click behavior |
| --- | --- |
| On/off | Any click toggles the value |
| Number | Left click adds one step, right click subtracts one, shift multiplies the step by ten; any other click, such as Q, opens a chat prompt for an exact value |
| Text (`vault.requiredPermission`) | Any click opens a chat prompt |
| Server language (`general.language`) | Any click closes the editor and opens the `/coffer language` menu |

Number steps are 250 for `hotReload.pollIntervalMillis` and `hotReload.cooldownMillis`, and 1 for the `[vault]` numbers; clicks stay inside each key's range. A chat prompt closes the inventory, takes one chat line, accepts `cancel`, and expires after 60 seconds; the editor then reopens on the same screen. A typed value that fails validation is reported with its reason and nothing changes.

Each save goes through the same parse, validate, and install path as a file edit and reports `<setting> changed from <old> to <new>.` in chat. If `config.toml` changed on disk after the editor opened, the save is refused with `config.toml changed on disk; reopen the editor before saving`.

## Hot reload

Coffer watches `config.toml` and every file under `languages/`.

- A change is applied after `hotReload.cooldownMillis` of quiet. Coffer's own writes, including editor saves, do not trigger a second reload.
- A malformed file is rejected as a whole, and the last known good settings or messages stay active. The console logs a SEVERE entry naming the file and the reason, followed by a rejection warning. While the malformed content stays on disk, Coffer retries it after every cooldown and logs the rejection, and sends the operator notice, each time.
- Files must be plain UTF-8 without a byte-order mark. A file saved with one is rejected as malformed TOML; some Windows editors and Windows PowerShell 5.1's `Set-Content -Encoding utf8` add the mark.
- Deleting `config.toml` regenerates the defaults and installs them.
- A change to another locale's file refreshes that locale for the players using it.
- After a successful install, Coffer reconfigures bStats, update notices, and the watcher timing, so those settings apply without a restart.
- `hotReload.notifyOperators` sends `Applied configuration and language file changes.` or `Rejected file changes; the last known good settings remain active.` to the action bar of online `coffer.config` holders.

Only `presentation.splashScreen` and `presentation.alternateSplashes` wait for the next start. Every other setting applies on the next successful reload or editor save.

## Languages

English is built into Coffer and is written to `languages/en_US.toml` on first start. The file starts with a comment header in four sections (file editing, prefix, formatting, variables); the variables section lists every placeholder Coffer uses. Messages accept `&` color codes, `&#RRGGBB`, and MiniMessage, and `{prefix}` inserts the styled Coffer name from `runtime.prefix`.

Translated catalogs are not bundled in the jar, and language downloads are not published yet. English and any locale file an operator places under `languages/` work; selecting another locale reports that translation downloads are unavailable. On start the console logs `Translation source is unpublished. English and installed language files remain available.`

Missing or invalid entries in a locale file use built-in English. Locale files must be regular files of at most 2 MiB. Message keys are grouped as `runtime.*`, `command.feedback.*`, `command.description.*`, `command.parameter.*`, `gui.setting.*`, `gui.description.*`, `vault.*`, `transfer.*`, and `recovery.*`.

Players choose a personal language with `/coffer language self <locale>`; selections persist in `languages/language-preferences.properties` and are independent of `general.language`. `/coffer language server edit` opens the shared message editor, which refuses to save over a file that changed since it opened. The picker, editor, and locale list are described on the shared [languages](/languages) page.

## Related pages

- [Commands and permissions](/coffer/02-commands-permissions)
- [Installation and compatibility](/coffer/01-installation-compatibility)
- [Languages](/languages)
{.links-list}
