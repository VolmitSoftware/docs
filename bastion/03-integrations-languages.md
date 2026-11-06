---
title: "Bastion: Integrations and languages"
description: Optional plugins, language updates, custom locales, and personal translations
published: true
date: 2026-11-06T00:00:00.000Z
tags: bastion, integrations, languages
editor: markdown
dateCreated: 2026-10-14T17:39:58.829Z
---

Bastion uses optional plugins for payments, external maps, placeholders, and claim-admission checks. Core protection works without them. Unsupported capabilities remain unavailable on the affected server platform.

## Optional plugins

| Plugin | Use | Limit |
| --- | --- | --- |
| Vault and an economy provider | Claim power, claim blocks, and child-plot market payments | Payments unavailable on region-threaded servers |
| PlaceholderAPI | Claim placeholders | Requires PlaceholderAPI |
| WorldGuard | Admission checks before claiming protected land | Does not replace Bastion protection |
| Dynmap | Claim map layer | Defaults off; unavailable on region-threaded servers |
| BlueMap | Claim map layer | Defaults off; separate from Dynmap |

Claim flight is also unavailable on region-threaded servers. These capability limits apply to Folia and compatible region-threaded platforms, including Canvas when using that scheduler.

An incompatible PlaceholderAPI build disables only Bastion's placeholders; claims stay protected and the failure is logged with its stack trace. If a web-map update fails, Bastion logs it once and retries every 30 seconds with a full marker rebuild until publishing recovers.

WorldGuard admission checks the selected columns across the full world height. For circles, regions that touch only an excluded corner of the bounding square do not count as overlaps. Global BUILD policy and ownership checks for intersecting regions still apply. An installed but unavailable WorldGuard blocks new claims until its data recovers.

## Languages

Use `/bastion language` for paginated chat controls to select a personal language or manage the server default with the required permissions. Resetting a personal choice follows the server default again. The configuration and language editors use inventory menus and are available through `/bastion config`.

The 18 supported catalogs are `en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`.

English comes from the built-in message catalog and is written to `languages/en_US.toml`, where new built-in messages merge in without replacing your edits. The server default is `general.defaultLocale`, which accepts any locale id. A repository locale that is not installed downloads in the background while English stays active; any other id creates a `languages/<id>.toml` starter file.

The other 17 catalogs live on the `main` branch of the `VolmitSoftware/Bastion` repository and install when first selected. Each one covers every built-in message with the same placeholders. Startup and `/bn language update` check that branch in the background, at most once every five minutes. When it has moved, Bastion downloads each installed repository locale and merges it into the local file: keys you edited stay as you wrote them, unedited keys take the repository's text, and new keys are added. If the repository cannot be reached, the check records one failure and installed languages stay active. The debug report shows the language source, revision, last check and last error.

| Path under `languages/` | Purpose |
| --- | --- |
| `<locale>.toml` | Editable messages for one locale |
| `.upstream/` | Bastion's record of the last download for each repository locale, the English reference, and `upstream.properties` (repository, branch, revision, last check). Do not edit it; hot reload ignores it. |
| `language-preferences.properties` | Saved player choices |

Any other `languages/<id>.toml` is a custom locale. Its id may use letters, digits, `_` and `-`, from 2 to 32 characters. It appears in the pickers and editor, and repository updates never change it. An optional `[meta]` table names it and chooses a base locale:

```toml
[meta]
name = "Pirate Speak"
base = "en_US"
```

`name` is the picker label. `base` names another installed locale that fills in missing keys before English.

Language files, `config.toml`, and `gui/config.toml` hot-reload after `general.hotReloadPollMillis`. Each applied or rejected change shows an action-bar notice to players with `bastion.config`; with `general.hotReload` off, file edits wait for a restart and no notice appears. Malformed language edits retain the last valid translation. Deleting an installed repository locale switches its users to English while preserving their selection; restoring the file applies the translation again, and a later explicit selection can download it again. Deleting a custom locale moves its users to English.

`/bastion status` shows whether PlaceholderAPI, WorldGuard and Vault are ready, absent or unavailable, and whether web maps are on.

Owner-written welcome text and directory descriptions remain literal and are not automatically translated. Keep message placeholders when editing translations; the language editor title requires both `{plugin}` and `{section}`.

## Updates and metrics

GitHub release notifications and bStats are disabled by default through `general.updateNotifications=false` and `general.metricsEnabled=false`. Their switches hot-reload. bStats also respects its global opt-out.

With `general.updateNotifications` on, Bastion compares its version with the latest release of `VolmitSoftware/Bastion` and tells players with `bastion.update`. bStats reports under plugin ID 34917 once `general.metricsEnabled` is turned on; turning it off stops reporting without a restart. The debug report shows both states.

[Installation](/bastion/01-installation) · [Commands](/bastion/02-commands) · [Bastion](/bastion)
