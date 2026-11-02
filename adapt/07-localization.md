---
title: "Localization"
description: "Select languages and edit message files"
published: true
date: 2026-11-01T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt's server default is the `language` key in `plugins/Adapt/adapt.toml`. Its own permission node
is `adapt.language.self`, and server selection accepts `adapt.configurator` or
`volmit.language.admin`.

See [Languages](/languages) for the picker, permissions, the full locale list, fallback rules, and how to edit or translate messages.

## Language files and updates

English is built in and written to `languages/en_US.toml`. After a plugin update, new English keys are added to that file and keys you edited stay as you wrote them. The 17 other locales install on demand from the `master` branch of the Adapt repository, where they live in `src/main/resources/`. Missing or invalid entries use English.

Installed translations merge repository changes at startup and whenever an operator runs `/adapt language update`. New and changed messages arrive, keys you edited by hand stay as you wrote them, and retired keys you never touched are removed. The pristine copies used for that comparison live in `languages/.upstream/`; leave that directory alone. Checks run at most once every five minutes; a restart or a repeated command inside that window skips the request and the command reports the remaining wait. A check that fails, including one blocked by the GitHub rate limit, leaves the installed files and the selected language as they were, and the console logs one line per updated locale with its counts.

`/adapt language update` needs `adapt.configurator` or `volmit.language.admin` and runs from a player or the console.

Any other `languages/<name>.toml` is a custom language. The name may use letters, digits, `_`, and `-`, from 2 to 32 characters. It appears in the language picker and the message editor, `language` in `adapt.toml` accepts it, and updates never change it. An optional `[meta]` table sets the display name and a locale to use before English for keys the file leaves out:

```toml
[meta]
name = "Pirate Speak"
base = "de_DE"
```

Without `[meta]`, the picker shows the file name and missing keys use English directly. A base chain stops after four locales, at English, or at a locale it has already visited.

## Colors and formatting

Messages without an explicit color keep Adapt's default styling. Add a color or reset to a message in `languages/<locale>.toml` to control its colors, including inserted amounts and skill names. Explicit colors take precedence over automatic gradients. Bold, italic, and other decorations alone retain the default color.

```toml
[snippets.experience_orb]
use = "&aRight-click to gain this experience"
contents = "&#80d8ffContains {experience} {skill} experience"

[gui.preferences]
reset = "&aReset personal settings"
reset_description = "Use the server defaults for this adaptation."
```

Legacy color codes, hex colors, and supported MiniMessage color markup work here. Use `&r` for an explicit reset. Keep placeholder names such as `{experience}` unchanged.

## Configuration menu text

Menu titles and actions use `config.gui.*` and the other `config.*` message groups. Personal adaptation controls use `gui.preferences.*`, plus the corresponding skill's preference messages. Configuration field labels and descriptions use `config.fields.<scope>.<field-path>.label` and `.description`; descriptions are arrays of lines.

In personal adaptation controls, limits refer to the capacity unlocked by the player's adaptation level; hunger reserves use food points, with two points per hunger icon.

```toml
[config.fields.core.language]
label = "Server language"
description = ["Choose the default language for Adapt messages.", "Players can select their own language."]
```

Keep the description's line count equal to the generated English reference. Omitted fields use English defaults and remain available in the language editor. These labels change what the menu displays. Config paths, stored values, and generated TOML comments retain their canonical form. All 17 translated locales include these labels and descriptions; adaptation IDs inside them, such as `blocking-mirror-block`, stay in their canonical form.
