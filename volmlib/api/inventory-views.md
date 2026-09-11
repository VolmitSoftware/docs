---
title: "Bukkit inventory views and editors"
description: "Inventory access, shared configuration menus, and menu shutdown"
published: true
date: 2026-09-10T21:10:39.163Z
tags: "volmlib, api, bukkit, inventory, compatibility"
editor: markdown
dateCreated: 2026-09-05T04:40:00.000Z
---

`art.arcane.volmlib.util.bukkit.BukkitInventoryViews` provides Java 17-compatible access to a view's top inventory and player. It resolves public Bukkit methods at runtime so consumers compiled against the older `InventoryView` class do not emit incompatible direct calls when the server provides it as an interface.

## Methods

| Method | Return type | Purpose |
|---|---|---|
| `BukkitInventoryViews.top(InventoryView view)` | `Inventory` | Returns the top inventory |
| `BukkitInventoryViews.player(InventoryView view)` | `HumanEntity` | Returns the associated human entity |

Pass an existing non-null view. Access must run on the thread that owns its player or entity; these methods do not schedule work.

```java
Inventory inventory = BukkitInventoryViews.top(event.getView());
HumanEntity viewer = BukkitInventoryViews.player(event.getView());
```

## Resolution and failures

The utility resolves `getTopInventory` and `getPlayer` once through the runtime `InventoryView` type and caches the reflective methods. A missing required method fails class initialization. Reflective access or invocation failures throw `IllegalStateException` with the cause retained.

This boundary covers these two operations only. It does not certify all Bukkit calls or server versions as compatible. Supplement compilation with runtime testing of the shaded consumer artifact.

Relocate `art.arcane.volmlib` into the consuming plugin's private namespace. See [VolmLib API](/volmlib/api) for dependency and threading conventions.

## Close menus before disabling a plugin

`art.arcane.volmlib.util.inventorygui.BukkitInventoryShutdown.drain(plugin, views)` accepts a collection of `BukkitInventoryShutdown.View(player, inventory)` records. It closes only a matching current top inventory on the player's owning thread, leaving any replacement inventory alone. Retired entities and failed scheduling complete their pending cleanup entry; runtime failures retain full console context.

Call it from the plugin's `PluginDisableEvent` handling while the owner is still enabled and before unregistering menu listeners. Prevent new menu openings and capture the tracked views first, then release any menu lock before draining. Calling it only from `onDisable` can be too late to schedule foreign-region cleanup.

During a live plugin disable, draining waits for submitted owner tasks so menu icons do not become accessible when listeners disappear. When the server exposes `isStopping()` and reports shutdown, waiting is capped at five seconds and a timeout is logged. The helper performs no off-owner inventory mutation and is intended for lifecycle shutdown, not gameplay event processing.

## TOML configuration documents

`art.arcane.volmlib.util.config.ConfigEditorDocument.fromToml(source)` captures the original TOML text and a parsed settings tree. `entries(path)` lists a table's children or a table array's records; path segments preserve literal key names and use numeric strings for array indices. `parseValue(path, input)` accepts text, booleans, integers, finite decimals, and primitive TOML lists according to the existing setting's type. `edit(path, value)` creates a typed edit carrying the original document and expected value.

`TomlDocumentEditor.set(source, path, value)` replaces one scalar or primitive-list value while retaining comments and formatting outside that value, other assignments, and table order. It supports nested tables, quoted keys, and array-of-table entries, and can insert a missing top-level setting before the first statement. It reparses the result and rejects an edit that would change unrelated values. It returns TOML text; the consuming plugin owns file validation, stale-source checks, atomic persistence, and runtime publication.

## Shared configuration inventory

`BukkitConfigEditor` provides a shared inventory frontend for existing configuration values. Its options accept a loader and writer, while its presentation supplies the permission, command theme, and text resolver. The loader returns a `ConfigEditorDocument`; the writer validates and persists an edit against its original source.

Players browse nested tables and individual table-array records. Booleans toggle on click; text, numbers, and primitive lists use private chat input that accepts `cancel` and expires after 60 seconds. Lists use complete TOML literals, allowing elements to be added or removed. Whole tables and table-array records remain structural file edits.

Consumers can call `configureLayout(EditorLayout)` before opening the editor to provide a product-specific configuration menu. Register `BukkitConfigMessages.configuredLayoutKeys()` alongside the standard editor keys when using this layout. `EditorLayout` holds a localized root title, a path-to-`EntryPresentation` function, and optional `RootShortcut` actions. Each entry presentation supplies localized name and description keys, an icon, ordering, an optional `NumericControl(step, minimum, maximum)`, an optional input-guidance key, and an optional player action. The input-guidance key replaces the generic type hint in both the setting's tooltip and chat prompt, allowing domain examples such as world names for a world list. Paths without metadata are omitted from a configured menu; consumers still own their configuration schema and validation.

Configured menus use a filled 54-slot frame, centered root pages of up to eight categories and shortcuts, bounded lore, current-value displays, and consistent Back/Close controls. Numeric left/right clicks add or subtract the configured step, Shift multiplies it by ten, and adjustments clamp to the supplied range. Controls with a fractional step accept decimal adjustments and exact input even when the file spells the current value as an integer, such as `volume = 1`. Whole-number controls retain integer input. Numeric edits may change between integer and decimal representation; the consuming writer still validates the setting's required range and type. Drop/Q opens exact chat input. `open(sender, returnAction)` supplies a root Back destination; nested Back navigation returns to the parent table. A custom action can delegate locale selection to `BukkitLanguageSwitcher`, while a root shortcut can open its translation editor with a return callback. Menus without a configured layout retain the generic document browser.

`ComponentText.markup(value).colorIfAbsent(hexColor)` applies a fallback color to parsed text while retaining explicit colors and gradients. This also supports inventory labels serialized through legacy color codes without exposing formatting tags after resets. Configured editor titles use a dark default color for Minecraft's light container header.

Consumers retain domain validation and reload behavior. HiddenOre validates its complete settings and checks the original file before an atomic save; its file watcher then publishes the new runtime configuration. See [HiddenOre configuration](/hiddenore/configuration) for the operator controls.
