---
title: "Temper: Languages"
description: "Installed catalogs, personal language choices, and message editing"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "temper, languages"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Temper supports the suite's 18 languages. English is available without a download. The server default is `general.language`; a player's saved choice overrides it.

## Select and edit

Use `/temper language` for personal selection and operator message editing. Catalogs live in `plugins/Temper/languages/`, and player choices live in its `players/preferences.properties` file. See the [shared language guide](/languages) for selection syntax and editor controls.

Messages use named placeholders such as `{cost}`, `{mode}`, `{amount}`, and `{item}`. The editor shows the variables permitted for the selected message. Keep those names unchanged. The language editor title uses `{plugin}` and `{section}`.

## Catalog sources

Missing catalogs install from bundled translations when the build has no remote source. Builds with a remote source use an immutable GitHub revision and per-file hashes. Selection installs a missing catalog; it does not overwrite an operator's existing file.

Missing messages fall back to English. Invalid personal files retain their previous valid messages. Deleting an installed personal file leaves the saved selection intact and uses English until the file is restored; hot reload does not repeatedly download deleted files.

Station labels and station-editor controls use the player’s selected language.

## Related pages

- [Shared languages *Locales, picker, and editor*](/languages)
- [Configuration *Default locale and hot reload*](/temper/03-configuration)
- [Diagnostics *Catalog and update state*](/temper/08-diagnostics)
{.links-list}
