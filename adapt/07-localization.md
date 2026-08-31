---
title: "Localization"
description: "Adapt documentation: Localization"
published: true
date: 2026-08-25T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Set `language` in `plugins/Adapt/adapt.toml`. English is built in. Adapt downloads the selected non-English locale and keeps a verified cache for offline starts.

## Select a language

```toml
language = "de_DE"
```

Save the file. No restart is required. If the locale is unavailable or cannot be downloaded, Adapt keeps English active.

Available downloads:

`de_DE` `es_ES` `fi_FI` `fr_FR` `he_IL` `it_IT` `ja-JP` `ko_KR` `lt_LT` `nl_NL` `pl_PL` `pt_PT` `ru_RU` `tr_TR` `vi_VI` `zh_CN` `zh_TW`

## Override text

Use `languages/en_US.toml` to find keys. Do not edit that generated reference. Put local changes in `plugins/Adapt/languages/overrides/<locale>.toml`.

```toml
[gui.skills]
title = "&5Stufe {level} &7({used}/{maximum} Leistung)"
```

Copy only the keys you want to change and keep every required `{placeholder}`. Overrides reload automatically. Invalid changes leave the previous messages active.

Resolution order:

```text
local override > downloaded locale > English
```

Values may be a string, a string list, or a plural table. Match the shape shown in `languages/en_US.toml`.
