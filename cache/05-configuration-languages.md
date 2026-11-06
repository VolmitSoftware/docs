---
title: "Cache: Configuration and languages"
description: "TOML files, live settings, translations, update notices and metrics"
published: true
date: 2026-11-06T12:00:00.000Z
tags: "cache, configuration, languages, updates"
editor: markdown
dateCreated: 2026-10-15T12:00:00.000Z
---

<nav class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/cache">Cache</a><span aria-hidden="true">/</span><span aria-current="page">Configuration and languages</span></nav>

Use `/cache config` to edit settings and `/cache language` to choose or edit a language. Installed TOML files are watched for changes. Replacements are parsed and validated before installation; malformed edits retain the last valid runtime state and produce a console error.

## File layout

Paths are relative to `plugins/Cache/`.

| Path | Contents |
|---|---|
| `config.toml` | General, watcher, presentation, claim, debug and metrics settings |
| `kits/<id>.toml` | Kit definitions |
| `crates/<id>.toml` | Reusable crate definitions |
| `displays/*.toml` | Persistent block bindings |
| `languages/en_US.toml` | Editable English messages, generated from the built-in catalog |
| `languages/<locale>.toml` | Installed translations and custom locales |
| `languages/.upstream/` | Cache's record of the last download for each repository locale, the English reference, and `upstream.properties` (repository, branch, revision, last check). Do not edit it; hot reload ignores it. |
| `languages/players/language-preferences.properties` | Saved personal language choices |
| `storage/claims/snapshot.json`, `storage/claims/journal.jsonl` | Claim, cooldown and key ledger |
| `storage/revisions/<id>/<revision>.toml` | Retained kit revisions |
| `storage/initialized` | Initial example-content marker |
{.dense}

Keep the claim journal and snapshot together when backing up data. They are runtime records rather than configuration files. [Recovery](/cache/06-delivery-recovery) describes operator actions for pending claims.

## Settings

| Setting | Default | Behavior |
|---|---|---|
| `general.enabled` | `true` | Allow kit delivery |
| `general.language` | `en_US` | Server default locale id; letters, digits, `_` and `-`, 2 to 32 characters |
| `general.starterKit` | Empty | Existing kit ID to grant after join; empty disables starter delivery |
| `general.updateNotifications` | `true` | Enable shared release checks and permitted update notices |
| `general.updateRepository` | `VolmitSoftware/Cache` | GitHub repository in `owner/repository` form |
| `hotReload.enabled` | `true` | Apply edits to `config.toml` and the TOML files in `languages/`, `kits/`, `displays/` and `crates/` |
| `hotReload.pollIntervalMillis` | `1000` | Interval between file checks, clamped to 250–60,000 ms |
| `hotReload.cooldownMillis` | `1500` | Debounce interval before applying changed files, clamped to 250–60,000 ms |
| `hotReload.notifyOperators` | `true` | Send an action-bar notice to players with `cache.config` when a file reload applies or is rejected |
| `presentation.splashScreen` | `true` | Show the six-row copper/gold startup splash |
| `presentation.animateClaims` | `false` | Show a cosmetic reel and receipt after successful delivery |
| `presentation.reelTicks` | `30` | Reel duration, clamped to 10–80 ticks |
| `claims.previewBeforeClaim` | `true` | Preview ordinary claims before delivery |
| `claims.confirmPaidClaims` | `true` | Require confirmation of priced ordinary claims |
| `claims.allowEconomyOnFolia` | `false` | Allow economy calls on Folia with a compatible provider |
| `claims.allowedCommands` | Empty list | Allowed console-command roots, without slash or arguments |
| `debug.uploadEnabled` | `false` | Permit explicitly requested debug uploads |
| `metrics.enabled` | `true` | Send anonymous bStats usage metrics |
{.dense}

Saves made by Cache itself, including editor saves and language updates, do not trigger a file reload. A new language file is picked up without a restart. While `hotReload.enabled` is `false`, edited files are not applied, including an edit to that setting in `config.toml`, and they are not applied later when it is turned back on. Use `/cache config` or a restart to turn it back on.

The reel displays rewards already delivered and durably completed. Closing it does not reroll, cancel or repeat the claim. Keeping animation disabled provides the immediate completion path.

Settings and language editors share validation with file loading. A successful settings-editor save activates the validated settings, including update and metrics configuration, even if a separate kit, crate, display or language file fails validation. The rejected file changes keep their previous active snapshot. Keep MiniMessage syntax and message placeholders intact. The language-editor title uses `{plugin}` and `{section}`; both identify the current editor context.

## Languages

Cache supports these locale choices:

`en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, `zh_TW`.

English is generated locally from the built-in catalog into `languages/en_US.toml`, and new built-in messages merge into that file while edits stay. No locale TOML catalogs are packaged in the distribution. The other 17 catalogs live on the default branch of the `VolmitSoftware/Cache` repository and install when first selected. Missing messages use built-in English.

Startup and `/cache language update` check that branch in the background, at most once every five minutes. When it has moved, Cache downloads each installed repository locale and merges it into the local file: keys you edited stay as you wrote them, unedited keys take the repository's text, and new keys are added. If the repository cannot be reached, the check logs the failure and installed languages stay active.

`general.language` accepts any locale id. A repository locale that is not installed downloads in the background after enable and after a file reload, and English stays active until it finishes or if it fails.

Any other `languages/<id>.toml` is a custom locale. Its id may use letters, digits, `_` and `-`, up to 32 characters. It appears in the pickers and editor, and repository updates never change it. An optional `[meta]` table names it and chooses a base locale:

```toml
[meta]
name = "Pirate Speak"
base = "en_US"
```

`name` is the picker label. `base` names another installed locale that fills in missing keys before English.

Malformed personal-language edits retain the last valid translation. Deleting a personal locale file switches its users to English fallback while preserving their saved choice; restoring the file restores its text. Explicitly selecting a missing locale downloads it again when the repository has it. Deleting `en_US.toml` regenerates it, and deleting the file of the repository locale named in `general.language` downloads it again.

## Updates and metrics

Release checks use the shared GitHub update service. Permitted users with `cache.update` or `volmit.update` receive notices when an update is available. The service reports releases; installation remains manual. Changing the enabled flag or repository reconfigures checking.

`VolmitSoftware/Cache` is the default release repository. Set `general.updateNotifications = false` to disable checks and notices.

Cache reports anonymous usage through bStats when `metrics.enabled` is true, using the official bStats library as a downloaded runtime dependency. It respects the global bStats opt-out in `plugins/bStats/config.yml`.

## Related pages

- [Installation *Dependency downloads and compatibility checks*](/cache/01-installation-compatibility)
- [Commands *Settings, languages, status and diagnostics*](/cache/02-commands-permissions)
- [Feature reference *Capabilities and where to use them*](/cache/07-feature-map)
{.links-list}
