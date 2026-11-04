---
title: "Impulse languages"
description: "Select a language and edit translations"
published: true
date: 2026-11-02T00:00:00.000Z
tags: "impulse"
editor: markdown
dateCreated: 2026-10-22T00:00:00.000Z
---

English is generated locally from the built-in catalog. The other 17 catalogs install from the Impulse repository when first selected, and any `languages/<id>.toml` file works as a custom language. Player preferences are separate from the server default and persist across restarts.

## Select or edit

Run `/impulse language` for selection commands. The configuration editor also has a language shortcut. Administrators can edit messages with:

```none
/impulse language server edit de_DE
```

The server default is `general.language` in `config.toml`, which accepts any installed locale id.

## Files

| Path under `plugins/Impulse/languages/` | Purpose |
| --- | --- |
| `<locale>.toml` | Editable messages for one locale |
| `.upstream/` | Impulse's record of the last download for each repository locale, the English reference, and `upstream.properties` (repository, branch, revision, last check). Do not edit it; hot reload ignores it. |
| `language-preferences.properties` | Saved player choices |

## Catalogs

`en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`.

## Updates

Translations live on the default branch of the `VolmitSoftware/Impulse` repository. Startup and `/impulse language update` check that branch in the background, at most once every five minutes. When it has moved, Impulse downloads each installed repository locale and merges it into the local file: keys you edited stay as you wrote them, unedited keys take the repository's text, and new keys are added. If the repository cannot be reached, the check logs one failure and installed languages stay active.

A configured repository locale that is not installed downloads in the background, and the current messages stay active until it arrives. `en_US.toml` gains new messages the same way after an Impulse update, keeps your edits, and regenerates if deleted.

## Custom languages

Any other `languages/<id>.toml` is a custom locale. Its id may use letters, digits, `_` and `-`, up to 32 characters. It appears in the pickers and editor, and repository updates never change it. An optional `[meta]` table names it and chooses a base locale:

```toml
[meta]
name = "Pirate Speak"
base = "en_US"
```

`name` is the picker label. `base` names another installed locale that fills in missing keys before English.

## Message edits

Keep each message's named placeholders, such as `{level}` and `{cost}`. Invalid translations retain the last valid messages where available. Missing entries use English without changing a player's saved choice.

Formatting accepts MiniMessage and the color formats listed in the catalog header. Hot reload applies valid file changes when enabled. Deleting the configured language's file keeps its last messages and downloads it again. Deleting a language file only players selected makes those players use built-in English without recreating the file, keeps their saved choice, and restoring the file refreshes it.
