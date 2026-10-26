---
title: Titles languages
description: Interface catalogs, personal preferences, and translated title text
published: true
date: 2026-10-24T00:00:00.000Z
tags: titles
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Titles provides English locally and maintains 17 translated source catalogs. Interface files use languages/<locale>.toml. Personal choices persist in languages/language-preferences.properties. Missing translated entries fall directly back to English.

## Available source locales

en_US, de_DE, es_ES, fi_FI, fr_FR, he_IL, it_IT, ja-JP, ko_KR, lt_LT, nl_NL, pl_PL, pt_PT, ru_RU, tr_TR, vi_VI, zh_CN, and zh_TW.

Use /titles language to choose a language. Operators with titles.config can edit interface text through the shared language editor. Installed edits are preserved.

## Translation delivery

The distribution includes English and a source manifest. Non-English interface catalogs are installed from the Titles repository using an immutable revision supplied at build time with -PlanguageSourceRef=<40-character-commit-SHA>. The default unpublished revision makes no remote requests. Builds with the unpublished revision use English and any catalogs installed locally.

A remote failure retains usable English behavior. Dependency-library downloads and translation downloads are separate: English fallback cannot replace a missing library required to start the plugin.

## Catalog translations

Title display, description, acquisitionHint, and collectionDescription have independent optional overlays in titles-locales/<locale>/<id>.toml. Category labels use category-locales/<locale>/<id>.toml. Catalog directories use normalized locales such as en_US and ja_JP.

Resolution applies the canonical definition, then its English overlay, then the requested locale's supplied fields. Missing fields inherit independently; another server-default language is never inserted into that fallback chain. IDs, permissions, and grants remain unchanged by translation. Personal language affects title search, menu content, previews, and placeholder output. The catalog editor previews its selected editing locale.

## History messages

History headings, empty results, page validation, command help, and entry labels use the interface catalog with direct English fallback. Recorded actor, source, reason, title ID, action, operation UUID, expiry, and changed values remain unchanged. Titles treats those values as plain text when substituting them into messages, so stored markup does not become formatting.
