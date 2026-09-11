---
title: Static - Compatibility and operations
description: Platform boundaries, diagnostics, persistence, and build verification
published: true
date: 2026-09-10T00:00:00.000Z
tags: static, folia, diagnostics
editor: markdown
dateCreated: 2026-09-10T00:00:00.000Z
---

Static compiles against Spigot 1.20.1 and targets Java 17 bytecode. It uses Bukkit events and VolmLib scheduling to support Spigot, Paper, Purpur, Leaf, Folia, and Canvas where they expose the corresponding Bukkit behavior. Newer Minecraft servers may require Java 21 or Java 25 even though the plugin itself targets Java 17.

Player inventories, sounds, and other player-bound operations run through entity scheduling. Regionized runtimes are detected by capability checks. Background workers process file I/O, ranking calculations, and language downloads; event handlers update UUID-based data without database or network calls.

`/static status` reports the selected scheduling mode and profile count. `/static debug dump upload=false` writes a local diagnostic report. `upload=true` additionally requests publication to mclo.gs when allowed by config. Reports include server diagnostics, effective configuration, locale source state, integration availability, and persistence health. Review a report before sharing it.

Statistics use atomic replacement of `data/players.json`, with forced file contents before publication. Autosave includes live session time, and shutdown finishes a final save. Failed reads or writes emit full console stack traces. An invalid existing statistics file prevents enablement rather than overwriting player history.

The plugin supports installed PlaceholderAPI and Votifier as optional integrations. If either is absent, the remaining plugin features continue. Vote usernames must match a recorded profile; unrecognized users are not resolved through blocking Mojang requests. Static stores server-local profiles and does not synchronize several servers.

Build with a Java 25 JDK using `gradlew.bat build` on Windows. The build runs unit tests, recompiles against current Spigot and Paper APIs, checks all shaded classes for Java 17-compatible bytecode, verifies the language source manifest, and stages `Static.jar` under the workspace `BUILDS` directory. The Gradle wrapper uses a nearby `VolmLib/shared` composite build by default.

Gameplay acceptance uses `tools/gameplay/static-acceptance.mjs` and the separate test helper built by `gradlew.bat gameplayFixtureJar`. The helper jar is written to `build/qa/fixture/StaticFixture.jar` and provides controlled event cancellation and persistence inspection. Install it alongside Static only in a purpose-named isolated Multiplexor test instance. Start with a flat world and no preinstalled translation files, prepare the stopped instance with Multiplexor's `gameplay prepare` command, and set `STATIC_QA_PLUGIN_DIR` to that instance's `plugins/Static` directory.

Run the scenario from the Multiplexor directory, substituting the created instance name:

```powershell
.\start.ps1 --consumer plugin gameplay run 'C:\VolmitSoftware\Static\tools\gameplay\static-acceptance.mjs' static-acceptance --start --stop-after --username StaticQA --timeout 180 --startup-timeout 180 --json
```

The default mode checks commands, menus, language editing, English fallback, hot reload, accepted and cancelled actions, and durable storage. After that run stops, set `STATIC_QA_MODE` to `persistence` and repeat with the same player to verify restart and session accounting. Set it to `permissions`, change the username to `StaticPlayer`, and add `--no-op` to verify administrative denials and the recorded offline profile. Remove `STATIC_QA_MODE` before another default run. Each report records its loopback viewer URL and closure; preserve reports and logs, verify the owned server process has exited, and delete the disposable instance after testing.

The `projectiles` mode uses the operator account and requires `STATIC_QA_MINEFLAYER_PACKAGE` to point to the installed harness's `package.json`. It connects a second player and dispatches controlled piercing-arrow events beside the shooter to check global, shooter, and victim filter transitions. Its report explicitly identifies synthetic event dispatch; it does not establish physical arrow collisions or cross-region projectile traversal.

Protocol tests can prove commands, inventories, event counters, persistence, and scheduler behavior. The actual appearance of gradient text, sounds, resource packs, and client interaction still requires a real Minecraft client.

[Installation and configuration](/static/01-installation-configuration) · [API and placeholders](/static/90-api-placeholders)
