---
title: "Husk - Developing a project"
description: "Customize project identity, add shared behavior, and extend Minecraft targets"
published: true
date: 2026-10-15T20:56:52.181Z
tags: "husk, development"
editor: markdown
dateCreated: 2026-10-15T03:00:00.000Z
---

Copy the template or create a repository from it, then edit `gradle.properties` to identify your project. Keep shared behavior in the core and connect it to each platform through the supplied entrypoints.

## Project identity

| Property | Purpose |
|---|---|
| `projectId` | Lowercase command name and mod identifier, 2–64 letters, digits, or underscores; starts with a letter |
| `projectName` | Display and artifact name; letters, digits, underscores, and hyphens, starting with a letter |
| `projectGroup` | Dotted Java package used for the Maven group, packaged project classes, and private dependencies |
| `projectVersion` | Semantic project version used in metadata, splash, and filenames |
| `minecraftVersion` | Default individual mod build target |
| `volmLibVersion` | Dependency revision used when a local VolmLib checkout is unavailable or disabled |

For example:

```properties
projectId=example
projectName=Example
projectGroup=com.example.project
projectVersion=1.0.0
minecraftVersion=26.3
```

These values generate `art.arcane.husk.core.BuildIdentity` and expand plugin/mod metadata. The example command becomes `/example`, while the Fabric/Forge/NeoForge configuration directory becomes `config/example/`. The Bukkit data directory follows `projectName`.

The source packages remain `art.arcane.husk`; distribution builds relocate those classes into `projectGroup` and generate matching entrypoint metadata. Use a unique `projectId` and `projectGroup` for each derived project so multiple mods can coexist in one loader. Do not edit generated files under `build/`.

Replace the logo and product description in `HuskSplash` when adding your project's branding. The version, release train, platform, Minecraft support, Java version, and date are supplied at runtime.

## Add shared behavior

Place game-independent services in `core/src/main/java`. The core has no Bukkit or Minecraft dependency and targets Java 17. Build with JDK 25; use Java 17 APIs in shared services so they run on every supported release. Pass required runtime values explicitly through typed records or service constructors, and release owned resources when the runtime closes.

Use `bukkit/src/main/java` for Spigot/Paper/Folia integration. Use `adapters/mod-common/src/main/java` for Minecraft code shared by Fabric, Forge, and NeoForge. Loader-specific registration belongs in the respective adapter's `src/main/java` directory. Mod-common sources are compiled against each target's Minecraft classes.

The supplied status command reads cached configuration. When adding world or entity operations, execute them on the owning scheduler: entity/region schedulers on Folia and the logical server thread on mod loaders. Add VolmLib's Bukkit scheduling dependency only to the Bukkit adapter; keep Bukkit-bound classes out of mod distributions.

## Add or change a Minecraft target

Add a target entry in `gradle/targets.json` with matching Fabric API modules, Fabric Loader, Forge, Forge loader range, NeoForge, and `javaVersion` values. Every target must declare Forge support and `forgeRuntimeMappings`: `srg` for 1.20.1, or `official` for 1.21.1 and 26.x. Set `obfuscated` to `true` when the upstream Minecraft target needs development mappings. Minecraft 1.20.1 uses `neoforgeUsesForge: true` instead of a separate NeoForge dependency. The target key is the exact Minecraft version. It drives the generated supported-version list, Gradle task matrix, mod metadata, and output directories.

Keep common source in `src/main`. When a target needs a different implementation, put the replacement at the same relative path under `src/versions/<minecraft>/java` or `src/versions/<minecraft>/resources`. Shared mod overrides belong under `adapters/mod-common`; loader overrides belong under that loader. Targets with a common API can set `sourceFamily` and share replacements under `src/families/<family>/java` or `src/families/<family>/resources`. Exact-version overrides take precedence over family overrides; within each level, loader overrides take precedence over shared overrides. All overrides replace the corresponding main source/resource.

Update the Bukkit API baseline, supported artifact range, and plugin API version when changing the Bukkit target range. Add any required version-specific Bukkit implementations before declaring support. Running `./gradlew build` compiles the Bukkit sources against each declared Spigot API and produces each mod target with its own dependencies.

The supplied 1.20.1 and 1.21.1 targets use official Minecraft mappings for development. Fabric distributions are remapped to intermediary names. Forge 1.20.1 distributions use SRG names; Forge 1.21.1 distributions retain Mojang names. Minecraft 26.x targets use unobfuscated toolchains. Keep Minecraft API differences in the supplied family or version overrides; shared game-independent behavior stays in the core.
