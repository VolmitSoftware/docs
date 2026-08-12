---
title: "Overview"
description: "HoloUI documentation: Overview"
published: true
date: 2026-08-12T00:00:00.000Z
tags: "holoui"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
HoloUi is a holographic UI framework for Paper and Folia servers. It renders in-world menus and container previews as packet-only display entities visible to a single viewer, driven by JSON files that server owners author by hand or with the companion web editor, and it exposes a public Java API for other plugins. This file maps the feature surface and indexes the documentation set.

## Feature Map

- **JSON menus** — files in `plugins/holoui/menus/` define floating menus of buttons, decorations, and toggles that open per player. See [03 - Menu File Format](/holoui/03-menu-file-format).
- **Persistent world boards and in-game editing** — operator commands create, place, move, rotate, scale, follow, stage, save, and delete viewer-scoped world boards, and can atomically edit or copy their menu content without leaving the game. See [02 - Commands & Permissions](/holoui/02-commands-permissions) and [11 - Runtime Architecture](/holoui/11-runtime-architecture).
- **Components and hitboxes** — three component types with viewer-relative click planes and hover highlighting. See [04 - Components & Hitboxes](/holoui/04-components-hitboxes).
- **Icons** — text, item, block, custom-item, static-image, animated-image, and raw living-entity icons rendered entirely through per-viewer packets. See [05 - Icons](/holoui/05-icons).
- **Actions** — click-triggered player/console commands, sounds, sanitized MiniMessage, Folia-safe teleport, proxy connect, and native page-stack navigation. See [06 - Actions](/holoui/06-actions).
- **Expressions and placeholders** — PlaceholderAPI substitution in menu text and toggle conditions; a full expression language inside container preview documents. See [07 - Expressions & Placeholders](/holoui/07-expressions-placeholders).
- **Custom items** — icons can reference items from ten third-party item plugins (ItemsAdder, Oraxen, Nexo, MMOItems, MythicMobs, EcoItems, ExecutableItems, HeadDatabase, Slimefun, CraftEngine), with a catalog export for the web editor. See [08 - Custom Items & Item Providers](/holoui/08-custom-items-item-providers).
- **Container previews** — looking at a chest, furnace, or other container shows a holographic content card, driven by JSON preview documents with live state variables. See [09 - Container Previews](/holoui/09-container-previews).
- **Localization** — 17 bundled locales with per-key fallback and server-side overrides. See [10 - Localization](/holoui/10-localization).
- **Public API** — other plugins build, open, and update menus through `HoloUiService`, obtained from the Bukkit `ServicesManager`. See [13 - API - Getting Started](/holoui/13-api-getting-started).
- **Web editor and round-trip sync** — a browser-based multi-document menu builder with folders, flow boards, portable workspaces, constrained menu/board synchronization, and an explicit confirmation-first one-way fallback at `https://holoui.volmitsoftware.com`. See [12 - Web Editor & Schemas](/holoui/12-web-editor-schemas).

## Documentation Index

| File | Covers |
|------|--------|
| [00 - Overview](/holoui/00-overview) | This file: feature map, first steps, doc index, project layout, building |
| [01 - Installation & Configuration](/holoui/01-installation-configuration) | Install, plugin identity, data folder, every `settings.json` key, metrics |
| [02 - Commands & Permissions](/holoui/02-commands-permissions) | Every command and subcommand, argument syntax, permission nodes |
| [03 - Menu File Format](/holoui/03-menu-file-format) | Menu JSON top-level format, type discriminators, complete examples |
| [04 - Components & Hitboxes](/holoui/04-components-hitboxes) | Button, decoration, toggle; hitbox geometry and click routing |
| [05 - Icons](/holoui/05-icons) | All icon types, rendering, text formatting, failure modes |
| [06 - Actions](/holoui/06-actions) | All six action types, click triggers, native navigation, execution order and threading |
| [07 - Expressions & Placeholders](/holoui/07-expressions-placeholders) | Expression grammar, all functions and variables, PlaceholderAPI substitution points |
| [08 - Custom Items & Item Providers](/holoui/08-custom-items-item-providers) | The ten item providers, `auto` resolution, and catalog export |
| [09 - Container Previews](/holoui/09-container-previews) | Preview trigger and scale model, preview document format, state variables, access control |
| [10 - Localization](/holoui/10-localization) | Locale selection, fallback chain, overrides, validation gates |
| [11 - Runtime Architecture](/holoui/11-runtime-architecture) | Boot lifecycle, sessions, persistent boards, content writes, imports, editor-sync persistence, packet rendering, threading, Folia, VolmLib integration metrics |
| [12 - Web Editor & Schemas](/holoui/12-web-editor-schemas) | Editor workspaces, flow boards, round-trip and fallback handoffs, capability constraints, bundles, schemas, and cross-repo fixtures |
| [13 - API - Getting Started](/holoui/13-api-getting-started) | Dependency setup, service acquisition, public type table, compatibility facts |
| [14 - API - Menus](/holoui/14-api-menus) | Menu builder, handles, click handling, Bukkit events |
| [15 - API - Placeholders](/holoui/15-api-placeholders) | The `%holoui_%` PlaceholderAPI expansion |
| [16 - API - Previews](/holoui/16-api-previews) | `PreviewStateProvider` registration and the preview access event |

Docs `01`-`10` cover operator and menu-author workflows, docs `11`-`12` cover runtime and maintainer concerns, and docs `13`-`16` cover the public API.

## First steps (operators)

1. Install the jar and start once so `plugins/holoui/` is created ([01 - Installation & Configuration](/holoui/01-installation-configuration)).
2. Put a menu JSON under `plugins/holoui/menus/` ([03 - Menu File Format](/holoui/03-menu-file-format); complete examples are at the end of that file). Image assets go in `plugins/holoui/images/`.
3. Grant `holoui.command`, the subcommand node you need, and `holoui.open.<menuId>` for each menu id ([02 - Commands & Permissions](/holoui/02-commands-permissions)).
4. Open with `/holoui open <id>` or `/holoui open menu=<id>`. While it is open, `/holoui move` re-anchors that live session to your current position without changing its current direction. For a persistent placement, use `/holoui boards create <board> <menu>`; `/holoui menus` and the board row aliases persist content edits.
5. Optional: enable container previews with `previewEnabled` and `holoui.preview` ([09 - Container Previews](/holoui/09-container-previews)). `/holoui builder` opens the web editor; `/holoui edit` and `/holoui boards editweb` create live sync links when a relay credential is configured, otherwise they offer a one-way copy ([12 - Web Editor & Schemas](/holoui/12-web-editor-schemas)).

Plugin developers start at [13 - API - Getting Started](/holoui/13-api-getting-started).

## Project Layout

| Package (`art.arcane.holoui`) | Contents |
|-------------------------------|----------|
| root | `HoloUI` plugin main, operator command groups, bStats metrics |
| `api`, `api.internal` | Public API surface and its backend implementation |
| `board` | Persistent board definitions, atomic storage, spatial/follow indexes, and per-viewer runtime |
| `config` | Menu definition data model, `ConfigManager`, `HuiSettings` |
| `config.components` / `config.icon` / `config.action` | JSON data classes per component, icon, and action type |
| `config.menu` | Revisioned atomic menu-document persistence and row mutations |
| `editor`, `editor.sync` | One-way menu handoffs plus capability-scoped outbound relay synchronization |
| `persistence` | Shared menu/board writer coordination and durable multi-file editor-sync transactions |
| `enums` | JSON type discriminators |
| `expr` | Expression parser, evaluator, and function library (used by preview documents) |
| `importer` | Bounded, no-overwrite migration from supported legacy hologram stores |
| `integration` | Item providers, custom-item catalog, container protection |
| `localization` | Message catalog and locale loading |
| `menu` | Sessions, runtime components, icons, actions, display-entity management |
| `menu.special.inventories` | Container previews and the preview document pipeline |
| `service` | Command help, PlaceholderAPI expansion, telemetry, integration service |
| `util.common` | Display entity, packet, particle, text, item, and settings utilities |

`schema/` holds the hand-maintained JSON schemas used by editor tooling; `src/main/resources/previews/` holds the bundled preview documents; `src/test/resources/golden/` holds non-regenerable golden snapshots.

## Building

Java 25 with `-parameters`. Independent Gradle build: `./gradlew build` runs the full gate, `./gradlew test` runs the test suite, `./gradlew shadowJar` produces the shaded plugin artifact. The `AGENTS.md` in the repo root carries the documentation-maintenance policy: any behavior, contract, or workflow change must update the matching doc in the same workstream.
