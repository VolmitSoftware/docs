---
title: "Rift: Feature Audit and Roadmap"
description: "Implemented features and remaining work in recommended order"
published: true
date: 2026-10-16T00:00:00.000Z
tags: "rift, features, roadmap, audit"
editor: markdown
dateCreated: 2026-10-13T00:00:00.000Z
---

This checklist separates implemented features from proposed work. Reference-plugin gaps come first; each new feature needs its own Rift implementation, translated messages, permissions, relevant editor controls, tests, and documentation.

## Implemented

- [x] Minecraft 26.1 through 26.3 release lines and Java 25 only.
- [x] Create, import, load, unload, unmanage, quarantine, and restore.
- [x] Separate `rift` dimension namespace, duplicate-create handling, protection, operation locks, and missing-profile retirement.
- [x] Vanilla, void, and external Bukkit generators.
- [x] Teleport yourself or an online player to a loaded world's spawn.
- [x] List, info, status, per-world checks, and tag-filtered/grouped check-all.
- [x] Difficulty, PvP, game rules, spawn, border, entry permissions, respawn, and tags.
- [x] Game mode, flight, fixed weather, and natural animal/monster spawning policies with choice editors.
- [x] Player limits, cross-world entry/exit restrictions, and first-join/login destinations with numeric and world-selection editors.
- [x] Optional cached PlaceholderAPI world counts, per-world state, generators, and active operations.
- [x] 54-slot config, policy, and language editors with appropriate toggle, choice, and numeric controls.
- [x] Hot-loaded settings, profiles, and languages; personal locale preferences; English plus 17 translations.
- [x] Translation downloads pinned to a published Git revision and installed on demand.
- [x] Director help, hidden version alias, nested debug commands, and shared Volmit diagnostic menus.
- [x] Configurable HUD-coordinated feedback and sounds.
- [x] GitHub update notifications, bStats opt-outs, and optional debug uploads.
- [x] Current-behavior wiki pages and a concise README.

## Reference-plugin gaps and prerequisites

1. [ ] Publish the current translated catalogs, then advance the release's pinned revision. New update-notification and policy labels use English fallback until their translations are published.
2. [ ] Add a VolmLib integration provider with capability reporting, heartbeat, and cached world/operation metrics for React.
3. [ ] Make world lookup and discovery namespace-safe before exposing them through an API. Equal leaf names such as `rift:example` and `minecraft:example` must remain distinct. Add explicit adoption by exact key without loading or creating a world.
4. [ ] Publish a supported Rift API and lifecycle events. Define ownership, asynchronous completion, failure results, cancellation, and shutdown behavior around the exact world identity above.

The existing shared command, language, config, debug, update, feedback, and metrics services do not need replacement.

## Release prerequisites

5. [ ] Extend failure-path tests: protected/concurrent unmanage, readiness conditions, quarantine/restore rollback, restart/hot-load, and an external generator. Recheck player-protocol support on every supported release line and verify Folia's permitted features separately.
6. [ ] Verify inspection labels and hover explanations against the exact data they show. Dimension-directory writability must not be labelled as world-container writability.

## Administration and lifecycle work

7. [ ] Add a searchable operator audit history with actor, exact world identity, action, result, changed values, and bounded retention. Write it asynchronously.
8. [ ] Add reusable creation and policy templates with preview, validation, and editing. Templates contain settings; cloning copies chunks.
9. [ ] Add tag-selected bulk load, unload, auto-load, and protection operations with a preview and per-world outcomes. Keep every individual safety check.
10. [ ] Add a backup coordination contract. Required backups must finish successfully before the protected operation starts.
11. [ ] Add safe cloning of an unloaded source with staged copying, distinct identity, collision checks, and policy/game-rule/border retention choices.
12. [ ] Add unloaded-world renaming with consistent storage, identity, and reference updates plus rollback.
13. [ ] Add optional idle unloading, default off. Exclude primary, protected, evacuation, occupied, and busy worlds; recheck immediately before unloading.

## Optional features

14. [ ] Add named locations and coordinate/player/personal-respawn destinations with destination-specific permissions and safe arrival checks.
15. [ ] Extend policies with visibility and finer entity-spawn controls where needed.
16. [ ] Add optional Chunky integration for pregeneration progress, cancellation, and preventing unload while generation runs.
17. [ ] Consider confirmed regeneration with recoverable original storage after cloning, backups, and rollback have been verified.

Inventory separation, economy ownership, cross-server transfers, automatic permanent deletion, and a built-in pregenerator are outside the default scope. Rift must not take over another plugin's dimensions without an explicit ownership contract.

## Reference sources

These sources informed the feature candidates; they do not establish compatibility or tested integrations:

- [Multiverse commands](https://mvplugins.org/core/fundamentals/commands-usage/)
- [Multiverse world properties](https://mvplugins.org/core/fundamentals/world-properties/)
- [MyWorlds](https://wiki.traincarts.net/p/MyWorlds)
- [Chunky developer API](https://github.com/pop4959/Chunky/wiki/Developer-API)
- [Folia project](https://github.com/PaperMC/Folia)

See [Installation and compatibility](/rift/01-installation-compatibility) for the supported range and verification scope.
