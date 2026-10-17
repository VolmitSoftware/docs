---
title: "Bukkit inventory views and editors"
description: "Inventory access, shared configuration menus, and menu shutdown"
published: true
date: 2026-10-14T00:00:00.000Z
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

Relocate `art.arcane.volmlib` into the consuming plugin's private namespace. See [VolmLib API](/volmlib/api) for dependency and threading conventions.

## Update an open menu control

`UIElement.setBaseItemStack(item)` preserves the item's component name and lore, including custom fonts, when the element has no text overrides. `setName(value)` replaces the name, and `setName(null)` removes it. Nonempty element lore replaces the base item's lore; an empty element lore list preserves it.

`Window.updateElement(position, row, element)` replaces a control in an open `UIWindow` and computes only its visible slot. It updates the item only when its contents change, without reopening the inventory or rendering other controls. Coordinates use the window's centered horizontal positions and absolute layout rows. Pass `null` to restore the background decorator at that position.

Calls from another thread are queued onto the viewing player's entity scheduler. A closed or replaced window discards the update, including when a replacement window reused the same inventory. Offscreen controls update the window model without sending an item. Use `setElement` to populate a window before opening it, and `updateElement` for toggles or mode controls after it is open.

## Close menus before disabling a plugin

Create `new BukkitInventoryShutdown(plugin, views)` from a captured collection of `BukkitInventoryShutdown.View(player, inventory)` records. Each task closes only its matching current top inventory on the player's owning thread, leaving any replacement inventory alone.

Call `closeAsync()` during a managed shutdown while the plugin remains enabled. It returns immediately with a future for all owner tasks; retain the operation and await its future through a continuation before disabling the plugin. `completion()` returns another observer of the same work. Cancelling an observer does not cancel accepted cleanup. Retired entities complete without inventory access; rejected scheduling and inventory failures complete exceptionally.

Use `closeOwned()` when an external plugin disable has already begun. It closes inventories actually owned by the current thread and completes pending foreign-owner tasks exceptionally. Their late callbacks become no-ops. A task already executing on its owner is allowed to finish, and the completion future still tracks it. No shutdown path waits for another region or treats `isStopping()` as ownership.

The existing static `BukkitInventoryShutdown.drain(plugin, views)` entry point now uses this immediate, ownership-checked shutdown path and logs failures. It performs no scheduling or blocking wait. An external live disable cannot guarantee closure of inventories in other regions: plugin schedulers may discard both actions and retirement callbacks once the plugin becomes disabled. Use managed closure before disabling when every inventory must be closed.

`BukkitConfigEditor.closeAsync()` and `BukkitLanguageSwitcher.closeAsync()` freeze their editors and return futures that cover both captured inventory closures and menu openings already in progress. An opening that crosses the close boundary must finish its owner-side cleanup before the future can succeed. Cancelling a returned observer does not cancel that cleanup.

While the plugin remains enabled, editor `close()` starts the same asynchronous owner cleanup and logs failures; it does not wait for every menu to close. A failed attempt retains tracked inventories and their click/drag protection while the plugin is enabled. Call `closeAsync()` again to retry remaining views. A player's normal close or quit releases its tracked view; the editor unregisters its protection listener when no tracked views or openings remain.

The editor's plugin-disable event and `close()` after the plugin becomes disabled use immediate owner-only cleanup and fail pending foreign-owner work. Bukkit can remove plugin listeners and discard scheduler work during disable, so these paths cannot guarantee protected or closed foreign-region menus after a forced unload. `BukkitLanguageSwitcher` releases its command and provider registrations when closure starts; its editor retains its separate protection listener until cleanup allows release.

Consumers must await a successful `closeAsync()` result through a continuation before disabling the plugin, cancelling its tasks, unregistering its listeners, or replacing its services. A void `close()` call or an already-completed unload future does not establish that every editor inventory has closed. Never block an entity or global scheduler waiting on these futures. Plugin-specific unload integration and direct static `BukkitInventoryShutdown.drain()` callers still need this lifecycle ordering; the editor behavior does not change the static method's owner-only contract.

## Editor input cancellation

`BukkitConfigEditor` and the translation editor in `BukkitLanguageSwitcher` silently invalidate pending or queued chat input when the player issues a command, including a command cancelled by another plugin. An ordinary open menu with no pending input stays active. Cancellation never opens or closes an inventory or invokes the abandoned edit, and a late owner callback cannot replace a newer editor session.

## TOML configuration documents

`art.arcane.volmlib.util.config.ConfigEditorDocument.fromToml(source)` captures the original TOML text and a parsed settings tree. `entries(path)` lists a table's children or a table array's records; path segments preserve literal key names and use numeric strings for array indices. `parseValue(path, input)` accepts text, booleans, integers, finite decimals, and primitive TOML lists according to the existing setting's type. `edit(path, value)` creates a typed edit carrying the original document and expected value.

`TomlDocumentEditor.set(source, path, value)` replaces one scalar or primitive-list value while retaining comments and formatting outside that value, other assignments, and table order. It supports nested tables, quoted keys, and array-of-table entries, and can insert a missing top-level setting before the first statement. It reparses the result and rejects an edit that would change unrelated values. It returns TOML text; the consuming plugin owns file validation, stale-source checks, atomic persistence, and runtime publication.

## Shared configuration inventory

`BukkitConfigEditor` provides a shared inventory frontend for existing configuration values. Its options accept a loader and writer, while its presentation supplies the permission, command theme, and text resolver. The loader returns a `ConfigEditorDocument`; the writer validates and persists an edit against its original source.

Players browse nested tables and individual table-array records. Booleans toggle on click; text, numbers, and primitive lists use private chat input that accepts `cancel` and expires after 60 seconds. Lists use complete TOML literals, allowing elements to be added or removed. Whole tables and table-array records remain structural file edits.

Consumers can call `configureLayout(EditorLayout)` before opening the editor to provide a product-specific configuration menu. Register `BukkitConfigMessages.configuredLayoutKeys()` alongside the standard editor keys when using this layout. `EditorLayout` holds a localized root title, a path-to-`EntryPresentation` function, and optional `RootShortcut` actions. Each entry presentation supplies localized name and description keys, an icon, ordering, an optional `NumericControl(step, minimum, maximum)`, an optional input-guidance key, and an optional player action. The input-guidance key replaces the generic type hint in both the setting's tooltip and chat prompt, allowing domain examples such as world names for a world list.

Paths without metadata are omitted unless their direct parent is registered through `configureDynamicSections(Set<List<String>>)`. Configure those exact non-root parent paths before opening a session. Unlabelled children use their literal document names, while children with presentation metadata keep their translated labels and ordering. This supports policy maps and table-array rows without exposing unrelated settings. Primitive lists continue to use chat input. Consumers still own schema validation and persistence.

Configured menus use a filled 54-slot frame, centered root pages of up to eight categories and shortcuts, bounded lore, current-value displays, and consistent Back/Close controls. Numeric left/right clicks add or subtract the configured step, Shift multiplies it by ten, and adjustments clamp to the supplied range. Controls with a fractional step accept decimal adjustments and exact input even when the file spells the current value as an integer, such as `volume = 1`. Whole-number controls retain integer input. Numeric edits may change between integer and decimal representation; the consuming writer still validates the setting's required range and type. Drop/Q opens exact chat input. `open(sender, returnAction)` supplies a root Back destination; nested Back navigation returns to the parent table. A custom action can delegate locale selection to `BukkitLanguageSwitcher`, while a root shortcut can open its translation editor with a return callback. Menus without a configured layout retain the generic document browser.

`ComponentText.markup(value).colorIfAbsent(hexColor)` applies a fallback color to parsed text while retaining explicit colors and gradients. This also supports inventory labels serialized through legacy color codes without exposing formatting tags after resets. Configured editor titles use a dark default color for Minecraft's light container header.

Consumers retain domain validation and reload behavior. HiddenOre validates its complete settings and checks the original file before an atomic save; its file watcher then publishes the new runtime configuration. See [HiddenOre configuration](/hiddenore/configuration) for the operator controls.
