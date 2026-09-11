---
title: "VolmLib API"
description: "VolmLib documentation: API overview for plugin developers"
published: true
<<<<<<< Updated upstream
date: 2026-09-08T20:34:51.000Z
=======
date: 2026-09-05T18:00:00.000Z
>>>>>>> Stashed changes
tags: "volmlib, api"
editor: markdown
dateCreated: 2026-08-12T00:00:00.000Z
---

VolmLib is a Java library used by Volmit plugins. Add only the modules your plugin uses and bundle VolmLib with your plugin.

For the shared build script, concurrency controls, and tests-only runs, see [Workspace builds](/volmlib/api/building).

## Common packages

| Package | Use |
|---|---|
| `util.scheduling` | Paper/Folia-safe global, region, and entity tasks |
| `util.bukkit` | Inventory-view access and entity initialization; native spawn-protection checks require the optional `native-bukkit` module |
| `util.bukkit.papi` | PlaceholderAPI expansions and snapshot stores |
| `util.director` | Commands, help, and completion |
| `util.localization` | Message catalogs, on-demand translations, and player language preferences |
| `util.diagnostics` | Shared Bukkit diagnostic reports, plugin snapshots, and uploads |
| `util.plugin` | Rich text, messages, titles, and logging |
| `util.board` | Scoreboard sidebars |
| `util.inventorygui` | Inventory menus |
| `util.config` | Typed TOML configuration |
| `util.io` | File and directory change detection |
| `util.nbt` / `util.nbt.mca` | NBT and region files |
| `util.noise` / `util.stream` | Procedural generation |
| `integration` | Vault economy availability, charging, and settlement |

## Dependency

```groovy
repositories {
    maven { url = uri('https://jitpack.io') }
}

dependencies {
    implementation('com.github.VolmitSoftware:VolmLib:<version>')
}
```

Relocate `art.arcane.volmlib` to a package owned by your plugin when shading. Do not expose VolmLib types in a public API shared with another plugin; each plugin normally has its own relocated copy.

## Text

Use `ComponentText.markup(...)` for trusted MiniMessage templates and `ComponentText.literal(...)` for player or external text. Send it with `ComponentMessenger`. `clickOpenUrl(...)` accepts HTTP and HTTPS URLs.

`ComponentMessenger` uses native rich messages where available. Its Spigot player delivery preserves RGB gradients, nested click actions, and hover text through Bukkit's Bungee component API. Director help and language menus use this delivery path for Bukkit senders; generic non-Bukkit sinks keep their existing text fallback.

Plugins that disable VolmLib's transitive dependencies must include `net.kyori:adventure-text-serializer-gson:4.26.1` and its runtime dependencies when shading rich Spigot menus. Relocate `net.kyori` with the plugin's other Adventure classes. If the JSON serializer is absent, Spigot delivery retains legacy colored text, with click and hover actions unavailable; Paper's native rich-message path does not require that serializer.

`LegacyLoreLayout.wrap(legacyText, columns)` wraps item lore while preserving legacy colors and formatting across lines. It keeps surrogate pairs and combining marks together and conservatively counts wide Unicode characters as two columns. Plugins choose the column budget for their inventory layout.

## Commands

Director accepts keyed values such as `player=Alex`. Use brackets for spaces:

```text
/example announce text=[Server restarts in five minutes]
```

Aliases remain executable, while help and completion show canonical command names.

## Block support

The optional `native-bukkit` module provides `BukkitSpawnProtection.create(server)` to bind the native spawn-protection decision once. `check(player, block)` reports `ALLOWED`, `PROTECTED`, or `UNSUPPORTED`; consumers retain region-ownership and third-party protection checks. See [Native spawn protection](/volmlib/api/spawn-protection) for dependency setup, bypasses, capability handling, and failure behavior.

`BSupport.isUpdatable(...)` recognizes exposed pointed-dripstone and sulfur-spike tips through the server’s speleothem API; body and merged-tip segments are excluded. On the supported Bukkit 26.1.2 boundary, pointed-dripstone detection uses that version’s API.

## Item snapshots

`art.arcane.volmlib.util.bukkit.ItemStackCodec.encode(item)` captures a non-air stack of 1 to 99 items into a versioned string. It normalizes Bukkit material, amount and serializable item metadata, restores a copy on the running server, and rejects a differing amount or `isSimilar` result. `decode(encoded)` returns a fresh `ItemStack` and rejects data captured on a newer Minecraft data version. Call both methods on the owning thread when working with a live inventory; they perform no scheduling or file I/O.

`validate(encoded)` checks the envelope, typed values, item structure and resource limits without accessing Bukkit runtime state, so configuration readers can call it off-thread. Runtime restoration is still required before using a validated snapshot. Unsupported, malformed, lossy or oversized data throws `IllegalArgumentException`; `encode(null)` throws `NullPointerException`.

`MAX_ENCODED_LENGTH` is 131,072 characters. The codec also bounds nesting, collection sizes, node counts and compressed metadata expansion, accepts only supported Bukkit serialization aliases, and refuses plugin-supplied alias replacements. It does not use Java object deserialization. Nested item templates are normalized recursively. Capture verifies fidelity on the current runtime; transferring snapshots between forks or upgrading Minecraft still requires consumer validation of the restored result.

## Registry lookup

`RegistryUtil.findByEnum(type, keys)` resolves public static constants by their lowercase Minecraft keys. Field-name normalization uses `Locale.ROOT`, so the JVM's default locale cannot make constants containing `I`, including sound names, unavailable.

## Threading

`BukkitInventoryViews.top(view)` and `BukkitInventoryViews.player(view)` provide reusable access to a view's top inventory and human entity across the `InventoryView` class-to-interface change. They require an existing view on its owning thread. See [Inventory-view access](/volmlib/api/inventory-views) for method contracts and failure behavior.

`UIWindow.inventoryViewTopInventory(view)` returns the top inventory through the shared reflective Bukkit boundary. Plugins compiled against 1.20.1 can use it across the later `InventoryView` class-to-interface change without emitting an incompatible direct invocation. A null view returns null; callers must still access a player's view on the owning thread.

Use `FoliaScheduler` for Bukkit work. Entity and player state belongs on the entity scheduler; world and block state belongs on the owning region; global tasks use the global scheduler. Keep file and network I/O off those threads. Inventory-window clicks and close continuations stay on the viewing player's entity scheduler; when that owner retires or rejects a continuation, VolmLib discards the callback and runs only its retirement cleanup instead of retrying player work on the global scheduler.

## Economy

`VaultEconomy` requires enabled Vault and an enabled plugin owning the economy registration. On region-threaded servers, that registration owner must also declare Folia support in its plugin metadata. Missing or unsupported providers report `PROVIDER_UNAVAILABLE` without invoking their economy methods; ordinary Bukkit servers do not require the Folia declaration.

Call economy operations from the correct gameplay thread. A successful withdrawal returns a charge that can be committed or refunded once; refunds use the original provider. A failed refund can be retried, and provider exceptions retain their console stack traces. These settlement objects are in memory, so consuming plugins remain responsible for durable transaction records and recovery.

## Entity initialization

`BukkitEntitySpawns.spawn(region, location, entityType, initializer)` calls the server's public spawn method with an initializer that runs before the entity enters the world. It resolves the Bukkit callback on 1.20.1 and the Java callback on newer APIs without linking callers to the removed callback type. This permits private displays to set visibility and persistence before being added. Call it on the region's owning thread; it does not schedule work or prevent chunk loading on behalf of the caller.

`FoliaScheduler.isStopping(Server)` reports terminal shutdown when the server exposes that capability; it returns false for an unavailable capability or a null server. On Folia, shutdown can report entity ownership after the region world-data context is gone. Consumers can use this check to skip removal of nonpersistent visual entities during terminal shutdown while retaining normal reload and plugin-disable cleanup.

## Mantle storage

`Mantle.saveAll()` and `close()` propagate region write failures after reporting the original exception. Failed writes retain their live region and chunk data for retry. A failed close keeps the mantle open and preserves its region locks; only a successful flush and region-IO close complete shutdown. An IO-close failure can be retried without rewriting regions already saved. Consumers must drain generation before closing storage and retain the mantle when close fails.

## File watching

`FileWatcher` and `FolderWatcher` combine filesystem snapshots with native watch events. A full scan reports each create or delete transition once, including on Windows where the native delete notification may arrive after the scan has already observed the missing path. Native modification events still detect writes whose size, timestamp, and file identity remain unchanged.

<<<<<<< Updated upstream
`ReactiveFolder` debounces changes and checks file stability before invoking its callback. A detected save can be delivered while an unrelated content-reconciliation scan is still running. Silent content changes remain batched until their scan finishes, and a failed callback retains pending changes for retry.
=======
## TOML configuration

`TomlCodec.toToml(...)` writes collections and arrays of objects as TOML arrays of tables (`[[rewards]]`), including nested tables and quoted keys. Both the typed-object and JSON-tree overloads support this structure; primitive lists remain inline arrays. A table array must contain only objects, and `fromToml(...)` reconstructs the typed list or array.
>>>>>>> Stashed changes

For PlaceholderAPI, see [Placeholders](/volmlib/api/placeholders).

For downloads, jar packaging, server defaults, player preferences, and the per-language inventory editor, see [Shared localization](/volmlib/api/localization).

For the `debugdump` command, report contents, permissions, and plugin contributors, see [Shared diagnostic reports](/volmlib/api/diagnostics).
