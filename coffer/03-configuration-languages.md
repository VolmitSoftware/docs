---
title: Coffer configuration and languages
description: Typed TOML settings, safe reloads, and local language catalogs
published: true
date: 2026-10-19T00:00:00.000Z
tags: coffer, configuration, languages
editor: markdown
dateCreated: 2026-10-17T00:00:00.000Z
---

Coffer creates `plugins/Coffer/config.toml` on its first successful initialization. Settings load into immutable validated snapshots. A background watcher reloads configuration edits; `/coffer reload` also refreshes language data.

| Setting | Default | Constraint |
| --- | --- | --- |
| `schemaVersion` | `1` | Current format only |
| `language` | `en_US` | A supported locale |
| `vault.rows` | `3` | 1 through 6; nine slots per row |
| `vault.maximumVaults` | `3` | 1 through 100 personal vaults per owner |
| `vault.sharedUserLimit` | `8` | 0 through 128 |
| `vault.requiredPermission` | `coffer.vault.standard` | Empty for unrestricted type access, or a valid lowercase permission node |

The vault settings define the `standard` domain type used by `/coffer create` and integrations. Existing records retain their saved type and permission; changing these defaults does not resize or rewrite them. Lowering the owner limit prevents further creation at that limit without removing existing vaults. Invalid settings, malformed TOML, unsupported languages, and configuration files over 64 KiB are rejected. Failed edits retain the active state and log an exception. Deleting the configuration during operation does not recreate it; creation is limited to initial startup.

Catalogs install on demand into `languages/<locale>.toml`. Existing files are preserved. Player preferences live in `languages/language-preferences.properties`. The initial release bundles English and 17 translations: `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`.

Missing message keys fall back to the catalog's English definitions. The shared language editor checks for conflicting edits before writing. Player selections are persistent and independent of the server default. Catalog files must be regular files no larger than 2 MiB. Remote language downloads are not configured for this initial project.

Use the shared editor or `/coffer reload` after manual language edits. Configuration writes use an atomic file replacement; filesystems that cannot support the operation report an error rather than accepting an unsafe write.

`coffer.transfer.blocked` is the disconnect message for an unverified transfer or contradictory recovery state. It is included in all 18 bundled catalogs; existing local catalogs fall back to English until the key is added or edited. Transfer admission and checkpoint limits are fixed implementation bounds, not configuration settings.

Version 0.6.0 adds 17 operator-recovery keys across all 18 source catalogs, including the held-player notice, review/receipt/slot previews, audit output, and refusal messages. Existing installed catalogs retain English fallback for missing keys. Review tokens expire after five minutes; hold, archive, and transaction limits are fixed implementation bounds.

Player vault command responses and menu instructions use the `coffer.vault.*`, `coffer.menu.*`, and corresponding command keys. All 18 source catalogs include them. Existing installed catalogs remain intact and use English fallback for new keys until edited.
