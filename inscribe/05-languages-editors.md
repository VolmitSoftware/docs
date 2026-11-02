---
title: "Inscribe: Languages and editors"
description: "Translation files, repository updates, custom languages, and message editing"
published: true
date: 2026-11-02T00:00:00.000Z
tags: "inscribe, languages, localization"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

English is built into Inscribe and written to `plugins/Inscribe/languages/en_US.toml` on first start. The 17 translations install from the Inscribe GitHub repository when first used and pick up later repository changes without losing local edits. Missing or invalid messages use English.

## Available translations

The repository locales are `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`. Only English ships inside the JAR.

Language files live directly in `plugins/Inscribe/languages/`. Personal choices are saved in `language-preferences.properties` and override `general.language`.

`en_US.toml` starts with a comment header that names the file, the edit command, the formatting codes, and every message variable. When a plugin update adds or changes English messages, they merge into `en_US.toml` at startup and edited messages are kept.

## Repository updates

Inscribe reads translations from the `src/main/resources/languages` folder of `VolmitSoftware/Inscribe` on the `master` branch.

- Selecting a repository locale that is not installed downloads it from the last checked commit and keeps the file for later use.
- On enable, Inscribe checks the branch once in the background. Startup does not wait for it.
- `/inscribe language update` runs the same check on request. It needs `inscribe.config` or `volmit.language.admin`.
- Checks run at most once every five minutes, including across restarts. A check inside that window is skipped and the command answers with the remaining wait.
- Each check merges every installed repository locale key by key. A message you edited is kept, an untouched message takes the new repository value, and new keys are added. Entries that are invalid for the installed build are ignored. Custom files are never changed.
- A failed check logs one warning, waits 30 seconds before another attempt, and leaves English and every installed file active. GitHub rate limits are honored before the next attempt.

The console reports each check, for example `Inscribe languages match VolmitSoftware/Inscribe@master (2a342ed).` or `Updated Inscribe language de_DE from VolmitSoftware/Inscribe@master (2a342ed): 1 added, 0 updated, 0 removed, 1 kept local.`

## The .upstream directory

`languages/.upstream/` belongs to Inscribe. It holds the unedited repository copy of each installed locale, the last generated English reference, and `upstream.properties` with the repository, branch, last revision, ETag, last check time, and a hash for each stored copy. The merge compares your file with these copies to tell your edits from repository changes. Hot reload ignores this directory. Deleting it makes the next check treat every differing message as a local edit.

## Custom languages

Any `languages/<id>.toml` whose ID uses 2 to 32 letters, digits, underscores, or hyphens is a language. It appears in `/inscribe language`, the editor, and `general.language`. Symbolic links are ignored, and a file over 3 MiB is rejected.

An optional `[meta]` table names the language and sets a fallback:

```toml
[meta]
name = "Pirate Speak"
base = "de_DE"

[transfer]
success = "Arr, yer enchantments be moved!"
```

- `name` is the label shown in the picker, up to 64 characters. Without it the picker shows the standard locale name or the ID.
- `base` names another installed language whose messages fill in what this file leaves out, before English. Bases can chain up to four levels. A loop or a missing base stops the chain.

Setting `general.language` to an ID that has no file creates it from the English reference, with `[meta] name` set to the ID and `base = "en_US"`.

## Edit settings and messages

Run `/inscribe config` to open a settings section, toggle booleans, open policy tables, or edit values through chat. The server-language entry under General opens selection. Setting names, nested policy labels, and navigation are translated. Material and enchantment IDs keep their canonical spelling.

To edit a message:

1. Run `/inscribe language server edit en_US`, or choose an installed translation.
2. Open a category or search for a key such as `command.version`.
3. Select the message and enter its replacement in chat. Enter `cancel` to leave it unchanged.
4. Keep required placeholders such as `{version}`.

Saving updates the selected file without changing anyone's language choice. Invalid placeholders and stale edits are rejected. Files and personal choices survive restart, and repository updates keep edited messages.

Templates accept legacy color codes and MiniMessage. Runtime values stay literal, including values that contain formatting or placeholder syntax.

## Related pages

- [Shared language guide *Supported locales and common controls*](/languages)
- [Commands and permissions *Language commands and access*](/inscribe/04-commands-permissions)
- [Configuration *Settings and hot reload*](/inscribe/03-configuration)
{.links-list}
