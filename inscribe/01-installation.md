---
title: "Inscribe: Installation"
description: "Requirements, library downloads, and plugin files"
published: true
date: 2026-11-02T00:00:00.000Z
tags: "inscribe, installation"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

Inscribe runs on Spigot, Paper, and Folia. On Folia it schedules inventory work on each player's owning thread. The distribution is `Inscribe.jar`.

## Requirements

- Java 25 or newer.
- Minecraft 26.1 through 26.3.
- Vault and an economy provider, only for money prices.

## Install

Put `Inscribe.jar` in the server's `plugins/` directory and start the server. The first start downloads Gson, TOML, and Adventure from `https://repo.maven.apache.org`, and later starts reuse the library cache. Without outbound HTTPS access to that host, the first start fails and logs that requirement with the full error. Wait for the `Inscribe ready` console line before allowing transfers.

## Files

| Path | Purpose |
| --- | --- |
| `plugins/Inscribe/config.toml` | Validated plugin settings |
| `plugins/Inscribe/languages/<locale>.toml` | Editable language files: generated English, installed translations, and custom languages |
| `plugins/Inscribe/languages/.upstream/` | Unedited repository copies and `upstream.properties`, used to merge updates and managed by Inscribe |
| `plugins/Inscribe/languages/language-preferences.properties` | Personal language choices |
| `plugins/Inscribe/debug/` | Local diagnostic reports |

The root command is `/inscribe`, with the alias `/ins`. Open `/inscribe config` to edit settings, or `/inscribe language` for language controls.

English works offline. Translations download from the Inscribe GitHub repository when first selected, which needs HTTPS access to `api.github.com` and `raw.githubusercontent.com`. A background check at startup merges repository changes into installed files. See [language setup](/inscribe/05-languages-editors).

## Related pages

- [Commands and permissions *Player and operator access*](/inscribe/04-commands-permissions)
- [Configuration *Defaults, limits, and hot reload*](/inscribe/03-configuration)
{.links-list}
