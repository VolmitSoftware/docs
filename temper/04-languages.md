---
title: "Temper: Languages"
description: "Repository catalogs, custom locales, personal language choices, and message editing"
published: true
date: 2026-11-02T00:00:00.000Z
tags: "temper, languages"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Temper supports the suite's 18 languages plus any custom locale you add. English is generated locally from the built-in catalog. The server default is `general.language`; a player's saved choice overrides it.

## Select and edit

Use `/temper language` for personal selection and operator message editing. See the [shared language guide](/languages) for selection syntax and editor controls.

Messages use named placeholders such as `{cost}`, `{mode}`, `{amount}`, and `{item}`. The editor shows the variables permitted for the selected message. Keep those names unchanged. The language editor title uses `{plugin}` and `{section}`.

## Catalog sources

The other 17 catalogs live on the default branch of the `VolmitSoftware/Temper` repository and install when first selected. Temper checks that branch in the background after enable and on `/temper language update`, at most once every five minutes. When the branch has moved, Temper downloads each installed repository locale and merges it into the local file: keys you edited stay as you wrote them, unedited keys take the repository's text, and new keys are added. If the repository cannot be reached, the failure is logged and English and the installed files stay active.

| Path under `plugins/Temper/languages/` | Purpose |
|---|---|
| `<locale>.toml` | Editable messages for one locale |
| `.upstream/` | Temper's record of the last download for each repository locale, the English reference, and `upstream.properties` (repository, branch, revision, last check). Do not edit it; hot reload ignores it. |
| `players/preferences.properties` | Saved player choices |

## Custom locales

Any other `languages/<id>.toml` is a custom locale. Its id may use letters, digits, `_` and `-`, from 2 to 32 characters. It appears in the pickers and editor, and repository updates never change it. Setting `general.language` to a new custom id creates that file. An optional `[meta]` table names the locale and chooses a base:

```toml
[meta]
name = "Pirate Speak"
base = "en_US"
```

`name` is the picker label. `base` names another installed locale that fills in missing keys before English.

## Fallbacks and deleted files

Missing messages fall back to English, and so does any message whose placeholders do not match the English text. Invalid personal files retain their previous valid messages. Deleting an installed personal file leaves the saved selection intact and uses English until the file is restored; hot reload does not repeatedly download deleted files.

Deleting the file for the active server language keeps its current messages in memory while Temper downloads it again. A deleted `en_US.toml` is regenerated from the built-in catalog.

Station labels and station-editor controls use the player’s selected language.

## Related pages

- [Shared languages *Locales, picker, and editor*](/languages)
- [Configuration *Default locale and hot reload*](/temper/03-configuration)
- [Diagnostics *Catalog and update state*](/temper/08-diagnostics)
{.links-list}
