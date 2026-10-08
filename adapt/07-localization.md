---
title: "Localization"
description: "Select languages and edit message files"
published: true
date: 2026-10-08T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt's server default is the `language` key in `plugins/Adapt/adapt.toml`. Its own permission node
is `adapt.language.self`, and server selection accepts `adapt.configurator` or
`volmit.language.admin`.

See [Languages](/languages) for the picker, permissions, the full locale list, fallback rules, and how to edit or translate messages.

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

The existing legacy codes, hex colors, and supported MiniMessage color markup work here. Use `&r` for an explicit reset. Keep placeholder names such as `{experience}` unchanged.

## Configuration menu text

Menu titles and actions use `config.gui.*` and the other `config.*` message groups. Personal adaptation controls use `gui.preferences.*`, plus the corresponding skill's preference messages. Configuration field labels and descriptions use `config.fields.<scope>.<field-path>.label` and `.description`; descriptions are arrays of lines.

```toml
[config.fields.core.language]
label = "Server language"
description = ["Choose the default language for Adapt messages.", "Players can select their own language."]
```

Keep the description's line count equal to the generated English reference. Omitted fields use English defaults and remain available in the language editor. These labels change what the menu displays. Config paths, stored values, and generated TOML comments retain their canonical form.
