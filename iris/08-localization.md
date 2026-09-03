---
title: "Localization"
description: "Iris documentation: Localization"
published: true
date: 2026-09-03T07:33:50.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Iris stores its command, Studio, runtime, HUD, and UI text in typed Java message catalogs. The shared VolmLib language service downloads translated overlays for seventeen languages on demand; server catalogs are excluded from every jar. An operator-editable override file exists per locale. You pick the server language with `general.language` in `iris.json`. You change individual strings by dropping a partial JSON file into `languages/overrides/`.

Client keybind labels are a separate surface. They live in the mod jar's Minecraft lang assets. See also [03 - Configuration](/iris/03-configuration), [04 - Commands & Permissions](/iris/04-commands-permissions), and [29 - Client HUD & Protocol](/iris/29-client-hud-protocol).

## Change one message

Say you want German, but you dislike the wording Iris uses when someone mistypes a subcommand. You need two things: the locale setting, and an override file that redefines exactly that one key.

Prerequisites: write access to the Iris data folder, a backup of `iris.json`, and an account that can run `/iris reload`.

1. Set `general.language` to `de_DE` in `iris.json` (`plugins/Iris/iris.json` on Bukkit-family, `<data folder>/iris.json` on a mod loader).
2. Create `<Iris data folder>/languages/overrides/de_DE.json`. Iris creates the `languages/overrides/` folder itself on the first locale load, so it should already exist.

   ```json
   {
     "locale": "de_DE",
     "messages": {
       "iris.command.unknown": "Kenn ich nicht. Probier /iris help"
     }
   }
   ```

3. Run `/iris reload`. A green `Hotloaded settings and locale de_DE.` means the settings and the locale both applied. A yellow `Settings were reloaded, but locale ... was rejected` means the overlay failed validation and the previous locale is still active. Read the errors in the console before going further.
4. Run `/iris` with a subcommand that does not exist, for example `/iris zzz`.

Your override text should appear unchanged. Everything else in the same session (help output, pregen status, and Studio messages) should be in German from the downloaded `de_DE` overlay. Any key that neither file defines falls back to the built-in English rather than printing a raw key id.

Edit the file again and save it. The shared settings and locale coordinator drains native filesystem events about every 500 ms and uses bounded exact-content reconciliation to catch silent, atomic, FTP, and same-metadata replacements. The stable latest save is queued and automatic locale loads occur no more than once every 3 seconds. Repeated unreadable UTF-8 and oversized capture failures are reported once until a readable or missing snapshot resets the diagnostic, while the last-good catalog stays active. A manual `/iris reload` acknowledges the exact override it applied so the queued automatic path does not replay it. No command or restart is required for ordinary valid saves. Delete the test override when you are done.

If you are authoring a whole new locale, translate one command group first and confirm it loads before you translate the rest. A single bad key rejects the entire file.

### Recovery

| Symptom | What actually happened | Fix |
|---|---|---|
| `Rejected locale setting '...'` in the log | The value does not match `[A-Za-z0-9_-]+`, so it never reached the loader | Correct the string in `iris.json`. The previously active locale keeps running in the meantime |
| `Rejected locale reload for <locale>` | The overlay failed validation. The console then lists up to 12 concrete errors and a count of any it omitted | Fix the listed keys and reload. Nothing partial is applied. The previous locale stays active in full |
| `Locale overlay key is not declared by the message catalog` | You invented a key name. Overrides can only redefine keys that already exist in code | Copy the exact key id from the downloaded locale file for your language |
| `Expected [x, y] but found [x]` | Your text dropped or renamed a `{name}` placeholder | Match the English template's placeholder set exactly. Order and surrounding words are free. The set of names is not |
| `Expected 5 lines but found 4` / `Expected plural forms [...]` | A lines key needs the same line count as English, and a plural key needs the same form names | Restore the missing entries |
| Override edits do nothing | Wrong data folder, or the filename does not match the active locale id | The file must be `<data>/languages/overrides/<active locale>.json`, spelled exactly as `general.language`. Run `/iris reload` to force it |
| Server text is translated but keybind labels are still English | Those labels come from the mod jar's client assets, not from the server locale | See "Client language assets" below |

## Where English comes from

Canonical English is owned by code in `core/.../localization`. `IrisMessages` assembles the catalog from every surface class plus the shared Director command keys from VolmLib. There is no English server translation file, and there does not need to be. English is the fallback layer under every locale.

| Catalog | Covers |
|---|---|
| `DirectorMessages` (VolmLib) | Shared command framework text: parameter errors, including a missing closing `]` in bracketed values, argument prompts, help chrome |
| `IrisMessages` | Permission denials, unknown command, player-only, "not an Iris world", reload results, modded help chrome |
| `BukkitCommandMessages`, `BukkitCommandMessagesExtended` | Feedback from the Bukkit `/iris` command tree |
| `DirectorCommandMessages` | Per-command and per-parameter descriptions shown in `/iris help` |
| `ModdedCommandMessages`, `ModdedHelpMessages` | The Fabric/Forge/NeoForge command tree and its help pages |
| `RuntimeUiMessages`, `RuntimeProgressMessages`, `BukkitRuntimeMessages` | Foreground progress titles and action-bar labels, persistent pregen boss bar titles, chunk job summaries, runtime status lines |
| `PackDownloadMessages` | Pack download progress and results |
| `ClientUiMessages` | Client mod strings: Vision map, What overlay, pregen HUD stats, toasts, create-world gates |
| `BukkitUiMessages`, `DesktopUiMessages` | Bukkit inventory UI and desktop pregen window strings |

Code resolves text through `IrisLanguage.text(...)` when color codes should survive, or `IrisLanguage.plain(...)` when they should be stripped. Argument-free `plain` calls are memoized per locale snapshot because HUD code calls them several times per frame. A locale reload publishes a new snapshot and throws the whole memo away.

On Bukkit-family servers, Iris delivers the resulting text through the shared VolmLib component pipeline for command chat, action bars, rich components, and post-bootstrap plugin logging. Its informational and diagnostic logging use the same severity-aware component entrypoint as the other plugins, with the styled `[Iris]` discriminator composed exactly once; the name follows Iris's stable green, warning gold, or unstable red safeguard mode. Player colors, RGB, decorations, and authored click or hover events survive. Console, RCON, and plain-server fallbacks receive plain text instead of raw `§` markers. Bootstrap and last-resort failure output remains platform-native, and Iris's modded adapters retain their native component and dedicated-server delivery paths.

## In-game language picker

The Bukkit picker uses Iris's Director menu theme, header, clickable controls, and pagination. Tab completion includes the `self` and `server` scopes, available locales, and personal reset according to the sender's permissions.

On Bukkit-family servers, `/iris language` opens a clickable picker. Personal language selection requires both `iris.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`. `/iris language self <locale|reset>` and `/iris language server <locale>` accept the same selections. `/iris language self de_DE` saves a personal choice; `self reset` follows the server default. `/iris language server de_DE` changes `general.language` and requires `iris.all` or `volmit.language.admin`.

On Bukkit-family servers, `/volmit plugins languages` opens the picker for every enabled provider's server default; `/volmit plugins languages de_DE` changes those defaults to German. It preserves all personal overrides and offers only locales common to every provider. Access requires `volmit.language.admin` (default `op`) or each enabled plugin's server-language administration permission. If any required permission is denied, no defaults change.

On every platform, if a requested language selection fails to download, is incomplete, or fails catalog preparation, the selected personal or server scope uses validated built-in English. The selected personal preference or server default is saved as `en_US`. The unavailable locale is never activated or saved, and the command reports that the language is unavailable and English is being used. Invalid command syntax and unlisted locales are rejected without changing the selection.

On Fabric, Forge, and NeoForge, `/iris language` opens the native clickable chat picker with Iris's existing native command banner, colors, back control, and footer. `/iris language self <locale|reset>` sets a personal preference, and `/iris language server <locale>` requires gamemaster permission. Preferences persist in `languages/players.properties`. The server default controls console output and shared world progress labels; player-aware command and menu rendering uses the personal preference when available.

## Selecting a locale

| Setting | Default | Location |
|---|---|---|
| `general.language` | `en_US` | `plugins/Iris/iris.json` (plugin) or `<data folder>/iris.json` (mod) |

The value must match `[A-Za-z0-9_-]+`. Anything else is rejected outright and the previously active locale keeps running. Both `/iris reload` and the automatic settings hotload re-read the setting and reload the locale. The command reports the requested and the active id so you can tell a successful switch from a silent no-op.

On a successful load Iris logs `Loaded locale <id> with N fallback entries.` That count is the number of catalog keys each overlay did not define, summed across overlays. A one-key override file therefore produces a very large number. It is informational, not an error.

## In-game message editor

On Bukkit-family servers, run `/iris language server edit` to choose a locale, or `/iris language server edit de_DE` to edit German directly. The server language picker also offers an Edit link for each locale. The inventory editor requires `iris.all` or `volmit.language.admin` and is available only to players.

Saving writes that locale's message to `plugins/Iris/languages/overrides/<locale>.json`, including `en_US`, after validating the message shape, placeholders, and complete candidate catalog. Invalid edits or messages changed since opening are rejected without replacing the file. The edited locale refreshes for players already using it and for the server when it is the active default; editing never changes server or personal language choices. Existing incomplete catalogs can be opened for repair without selecting them. Fabric, Forge, and NeoForge use the same override format through file editing and do not expose this inventory editor.

## Downloaded server locales

Complete server translations are kept outside the jar. Selecting a locale downloads `core/src/main/resources/languages/<locale>.json` from the configured Iris source reference and caches it at `languages/downloaded/<source-reference>/<locale>.json`. English remains available without network access.

| Locale id | Language |
|---|---|
| `de_DE` | German |
| `es_ES` | Spanish |
| `fi_FI` | Finnish |
| `fr_FR` | French |
| `he_IL` | Hebrew |
| `it_IT` | Italian |
| `ja-JP` | Japanese (hyphen, not underscore — this one id is irregular) |
| `ko_KR` | Korean |
| `lt_LT` | Lithuanian |
| `nl_NL` | Dutch |
| `pl_PL` | Polish |
| `pt_PT` | Portuguese |
| `ru_RU` | Russian |
| `tr_TR` | Turkish |
| `vi_VI` | Vietnamese |
| `zh_CN` | Simplified Chinese |
| `zh_TW` | Traditional Chinese |

Downloads are capped at 2 MiB and validated against the typed catalog before atomic publication. Missing or failed downloads leave English available, while an existing valid cache supports offline starts. Interactive language selections activate the requested catalog only after preparation succeeds; unavailable downloads use validated built-in English for the requested scope. A custom locale can be supplied through an override file and `general.language`.

## Override files

Path: `<Iris data folder>/languages/overrides/<locale>.json`, created as a folder on locale load.

Overrides are partial by design. Define only the keys you want to change. The rest resolve from the downloaded overlay, then from English.

```json
{
  "locale": "de_DE",
  "messages": {
    "iris.command.unknown": "Unbekannter Iris-Befehl"
  }
}
```

| Rule | Behavior |
|---|---|
| Root keys | Only `locale` and `messages`. Any other root key throws and the reload is rejected |
| `locale` | Optional. If present it must equal the filename's locale id after trimming, otherwise the file is rejected |
| Key existence | Every key must already exist in the catalog. An unknown key is an ERROR that rejects the whole file — you cannot mint new messages from an override |
| Value shapes | A string for text keys, a string array for lines keys, an object of plural forms for plural keys. Using the wrong shape rejects the file |
| Nesting | Nested objects flatten into dotted keys, so `{"iris": {"command": {"unknown": "..."}}}` is the same as `"iris.command.unknown"`. The exception is a plural key, where an object is read as the plural forms |
| Placeholders | The set of `{name}` tokens must match the English template exactly. A lines key must also match the English line count, and each line's placeholder set |
| Size | Max 2 MiB |
| Hotload | Native filesystem events drain about every 500 ms without idle file reads. Bounded exact-content reconciliation begins about every 2.5 seconds to recover missed and same-metadata saves. Stable automatic changes use a latest-state 3-second queue; manual `/iris reload` is immediate |

Validation is all-or-nothing. A rejected reload leaves the previous locale fully intact and logs the first 12 errors plus a count of the remainder.

## Resolution order

For a non-`en_US` locale a key resolves as: operator override → downloaded locale cache → English catalog default. For `en_US` the downloaded layer is skipped entirely, so it is: operator override → English catalog default.

Templates use `{name}` tokens. Arguments are classified as trusted or untrusted at the call site. Trusted arguments may carry color codes. Untrusted arguments are player names, world names, pack-authored strings, and exception text. Legacy section codes are stripped. `&`, `<`, and `>` are rewritten to lookalike characters so they cannot inject formatting.

`&` codes in the template itself are translated to section-sign codes before send, for `0-9`, `a-f`, `k-o`, `r`, and `x`.

## Client language assets

The Minecraft client reads its own lang files from `assets/irisworldgen/lang/<mc_code>.json` inside the mod jar. These are not the server catalogs and are not affected by `general.language`. They currently define only the keybind category and the three key names:

| Key | English |
|---|---|
| `key.categories.irisworldgen.iris` | Iris |
| `key.irisworldgen.toggle_pregen_hud` | Toggle Pregen HUD |
| `key.irisworldgen.open_vision_map` | Open Iris Vision Map |
| `key.irisworldgen.toggle_what_overlay` | Toggle Iris What Overlay |

`en_us.json` is required. Every bundled locale has a translated file. The Minecraft code is the server locale id with `-` replaced by `_` and lowercased, so `ja-JP` becomes `ja_jp`.

Everything else the client draws resolves through `IrisLanguage` and `ClientUiMessages` on whichever process renders it. That includes HUD stats, Vision map labels, What overlay rows, and toasts. It does not use these four keys. That is why a translated boss bar and an English keybind label can coexist.

## Platforms

Localization works the same on Bukkit-family and on Fabric/Forge/NeoForge, from the same catalogs and the same override file. Only the surfaces differ. The modded command tree uses `ModdedCommandMessages`/`ModdedHelpMessages`. The Bukkit tree uses the Bukkit catalogs. Each ignores the other's keys. Keybind lang assets apply only where the client mod is installed. See [30 - Platform Differences](/iris/30-platform-differences).
