---
title: "Sigil: Languages and integrations"
description: "Language downloads, update notices and metrics"
published: true
date: 2026-11-02T00:00:00.000Z
tags: "sigil, languages, integrations, updates, metrics"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Sigil uses the shared Volmit language selector, GitHub update notifier and bStats reporter. Configure each service independently.

## Languages

Run `/sigil language` to choose a personal language. Administrators can edit messages through the Languages control in `/sigil config`; the main configuration's language field opens the server language picker.

English is generated locally from the built-in catalog into `languages/en_US.toml`. The server default is `general.language`, which accepts any installed locale id; personal choices are saved in `languages/language-preferences.properties`.

The other 17 catalogs live on the default branch of the `VolmitSoftware/Sigil` repository and install when first selected: `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN` and `zh_TW`. Startup and `/sigil language update` check that branch in the background, at most once every five minutes. When it has moved, Sigil downloads each installed repository locale and merges it into the local file: keys you edited stay as you wrote them, unedited keys take the repository's text, and new keys are added. If the repository cannot be reached, the check logs one failure and installed languages stay active.

| Path under `languages/` | Purpose |
|---|---|
| `<locale>.toml` | Editable messages for one locale |
| `.upstream/` | Sigil's record of the last download for each repository locale, the English reference, and `upstream.properties` (repository, branch, revision, last check). Do not edit it; hot reload ignores it. |
| `language-preferences.properties` | Saved player choices |

Any other `languages/<id>.toml` is a custom locale. Its id may use letters, digits, `_` and `-`, from 2 to 32 characters. It appears in the pickers and editor, and repository updates never change it. An optional `[meta]` table names it and chooses a base locale:

```toml
[meta]
name = "Pirate Speak"
base = "en_US"
```

`name` is the picker label. `base` names another installed locale that fills in missing keys before English.

Setting `general.language` to a repository locale that is not installed keeps the setting and switches once the download finishes; an unknown id creates a custom file. Deleting the server default's repository file installs it again, and deleting `en_US.toml` regenerates it.

Missing messages use built-in English. A malformed installed personal catalog retains its last valid messages. Deleting a personal catalog uses English without recreating it and keeps the saved player selection; restoring a valid file updates players who selected it. Keep placeholders such as `{plugin}` and `{section}` intact when editing messages.

`/sigil debug dump` reports show the language source, revision, last check and last error.

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
