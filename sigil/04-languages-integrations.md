---
title: "Sigil: Languages and integrations"
description: "Language downloads, update notices and metrics"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "sigil, languages, integrations, updates, metrics"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Sigil uses the shared Volmit language selector, GitHub update notifier and bStats reporter. Configure each service independently.

## Languages

Run `/sigil language` to choose a personal language. Administrators can edit messages through the Languages control in `/sigil config`; the main configuration's language field opens the server language picker.

English (`en_US`) is built in. These 17 translation sources complete the supported catalog set: `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN` and `zh_TW`.

Selecting an uninstalled translation downloads its TOML file from the source specified in the build's language manifest. Files are cached under `languages/<locale>.toml`. Existing files and operator edits are preserved. Personal selections are stored in `languages/language-preferences.properties`.

Missing messages or unavailable downloads use built-in English. A malformed installed personal catalog retains its last valid messages. Deleting a catalog uses English without automatically recreating it; restoring a valid file updates players who selected it. Keep placeholders such as `{plugin}` and `{section}` intact when editing messages.

Translation downloads use the repository and revision recorded in the distribution's language manifest. The default source target is `VolmitSoftware/Sigil`, reference `main`. Downloads require an accessible source file; English and installed catalogs remain available without it.

## GitHub update notices

```toml
[integrations]
update-notifications = false
github-repository = "VolmitSoftware/Sigil"
bstats-enabled = true
bstats-id = 0
```

Update notices are disabled by default. Set `github-repository` to the release repository's `owner/repository` and enable `update-notifications` to check it.

Sigil registers with the shared `/volmit plugins updates` report. Operators and players with `sigil.update` or `volmit.update` can receive shared update notices. `sigil.admin` includes `sigil.update`. Disabling notices stops Sigil's checks; installing updates remains manual.

Configuration reloads apply notifier changes. See [shared GitHub release checks](/volmlib/api/github-releases) for check scheduling, caching and shared permission behavior.

## bStats

`bstats-enabled = true` permits reporting, but the placeholder `bstats-id = 0` starts no reporter. Use only Sigil's assigned positive bStats project ID when enabling reporting.

Set `bstats-enabled = false` to disable Sigil metrics. The shared `plugins/bStats/config.yml` opt-out also applies. Changes are applied on reload, and the reporter stops during shutdown. With ID zero, Sigil does not create the shared bStats configuration.

## Other integrations

Captured item rewards preserve item snapshots without a provider API. Configured commands can call installed plugins, subject to those plugins' permissions and scheduling requirements.

[Back to Sigil](/sigil)
