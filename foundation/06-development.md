---
title: "Development and Command Architecture"
description: "Foundation build outputs, local publication, command classes, modules, and extension workflow"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "foundation, development, commands, gradle"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Foundation is a Java 25 Gradle project with a local-first VolmLib composite build. `./gradlew build` is the release gate and stages `C:/VolmitSoftware/BUILDS/Foundation.jar` after compilation, tests, Spigot compatibility, and artifact inspection succeed. `./gradlew publishToMavenLocal` publishes the same shaded runtime as `art.arcane:foundation:1.0.0-26.2-SNAPSHOT`.

## Command structure

Every non-root canonical command has one concrete class in `art.arcane.foundation.command.route`. A route class owns immutable module, command-label, and permission metadata and receives its executor and completer through the constructor. `FoundationCommand` validates that metadata and `CommandRouter.register(FoundationCommand)` installs it as one atomic route. Command calls, handlers, completers, route records, and catalog specs are independent source types rather than nested router implementation types.

Runtime modules compose command objects during `enable`. A module owns shared domain state, listeners, persistence coordination, and related operations; its command entry points are individual classes. Disabling or failing a module unregisters every route with that module ID without affecting another module.

The `/foundation` administrative tree remains a dedicated Director root for contextual execution. Its separate command-atlas service combines those administrative subcommands with the canonical catalog, renders eight explained entries per page, and supplies safe command suggestions and pagination. Every other canonical label has a corresponding `*Command.class` entry. Tests load every class named by the canonical catalog, verify its metadata, check descriptor aliases and permissions, reject collisions, verify the Director root, prove that atlas pagination covers every entry, and recursively confirm that every persisted configuration leaf has an in-game editor control. Artifact verification also requires all 118 routed command classes in the release jar.

## Adding a command

1. Add the canonical label, description, and aliases to `FoundationCommandCatalog`.
2. Add its Spigot descriptor entry and permission node to both descriptors.
3. Create the matching concrete command class under `command.route`.
4. Register the command object from exactly one runtime module.
5. Document its syntax and permission in the command atlas.
6. Run `./gradlew build`; catalog, class, alias, descriptor, compatibility, and artifact checks must all pass.

Shared behavior belongs in the module or a focused service instead of being copied among command entry points. Bukkit entity and region access must continue through VolmLib scheduling abstractions.

Localization, worth, HUD, profile persistence, and GUI chat input are separate services with explicit close paths. Tests cover generated-language round trips, override preservation, category classification, immutable price snapshots, typed config validation, all command artifacts, and the Paper/Spigot shared-source compile gate. Player-owned state stays in bounded atomic JSON profiles; `worth.toml` and language TOML are operator configuration rather than player data.
