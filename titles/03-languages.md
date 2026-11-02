---
title: Titles languages
description: Interface catalogs, personal preferences, and translated title text
published: true
date: 2026-11-02T00:00:00.000Z
tags: titles
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Titles provides English locally and maintains 17 translated source catalogs. Interface files use languages/<locale>.toml. Personal choices persist in languages/language-preferences.properties. Missing translated entries fall directly back to English.

## Available source locales

en_US, de_DE, es_ES, fi_FI, fr_FR, he_IL, it_IT, ja-JP, ko_KR, lt_LT, nl_NL, pl_PL, pt_PT, ru_RU, tr_TR, vi_VI, zh_CN, and zh_TW.

Use `/titles language self <locale>` for a personal selection, or `self reset` to follow the server default. Operators with titles.config use `/titles language server <locale>`, `/titles language server edit [locale]` and `/titles language update`. Installed edits are preserved.

## Translation delivery

English is generated locally from the built-in catalog into `languages/en_US.toml`. After a plugin update, new built-in keys merge into that file without changing keys you edited, and deleting the file regenerates it.

The other 17 catalogs live on the `master` branch of the `VolmitSoftware/Titles` repository and install when first selected. Startup and `/titles language update` check that branch in the background, at most once every five minutes. When it has moved, Titles downloads each installed repository locale and merges it into the local file: keys you edited stay as you wrote them, unedited keys take the repository's text, and new keys are added. If the repository cannot be reached, the check logs one failure and installed languages stay active.

Setting `language` in `config/settings.toml` to a repository locale that is not installed applies the other settings at once and switches language after the download. Deleting the active repository locale keeps its messages in memory and downloads it again. A malformed language file rejects the whole file change and keeps the last valid settings; at startup it stops Titles from enabling.

Dependency-library downloads and translation downloads are separate: English fallback cannot replace a missing library required to start the plugin.

## Language files

| Path under `languages/` | Purpose |
| --- | --- |
| `<locale>.toml` | Editable messages for one locale |
| `.upstream/` | Titles' record of the last download for each repository locale, the English reference, and `upstream.properties` (repository, branch, revision, last check). Do not edit it; hot reload ignores it. |
| `language-preferences.properties` | Saved player choices |

Any other `languages/<id>.toml` is a custom locale. Its id may use letters, digits, `_` and `-`, from 2 to 32 characters. It appears in the pickers and editor, and repository updates never change it. An optional `[meta]` table names it and chooses a base locale:

```toml
[meta]
name = "Pirate Speak"
base = "en_US"
```

`name` is the picker label. `base` names another installed locale that fills in missing keys before English. A custom locale applies to interface text; the title and category overlays below use locale directories in the language and region form, so the catalog editor lists only those locales.

## Catalog translations

Title display, description, acquisitionHint, and collectionDescription have independent optional overlays in titles-locales/<locale>/<id>.toml. Category labels use category-locales/<locale>/<id>.toml. Catalog directories use normalized locales such as en_US and ja_JP.

Resolution applies the canonical definition, then its English overlay, then the requested locale's supplied fields. Missing fields inherit independently; another server-default language is never inserted into that fallback chain. IDs, permissions, and grants remain unchanged by translation. Personal language affects title search, menu content, previews, and placeholder output. The catalog editor previews its selected editing locale.

## History messages

History headings, empty results, page validation, command help, and entry labels use the interface catalog with direct English fallback. Recorded actor, source, reason, title ID, action, operation UUID, expiry, and changed values remain unchanged. Titles treats those values as plain text when substituting them into messages, so stored markup does not become formatting.
