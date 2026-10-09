---
title: "API: Placeholders"
description: "Read Gloss state through PlaceholderAPI"
published: true
date: 2026-10-09T16:52:52.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss provides three PlaceholderAPI keys:

| Placeholder | Value |
|---|---|
| `%gloss_available%` | `true` while Gloss is available |
| `%gloss_menu.open%` | Whether the player has a Gloss menu open |
| `%gloss_menu.id%` | Open menu ID, or `---` |

Use dots inside the key. `%gloss_menu_open%` is not valid.

Gloss also resolves normal PlaceholderAPI placeholders inside holograms, scoreboards, tablists, MOTD text, menus, panels, bubbles, indicators, and drop labels when that surface has a player context.

To expose your own values, register a normal PlaceholderAPI expansion. Gloss will resolve it from configured text:

```none
<green>Mana: %myplugin_mana%
```

Do not parse `%gloss_menu.id%` from Java to inspect session state. Use `GlossAPI` and the menu handle APIs instead.


## Expression providers and entity ownership

Registered expression functions and variable namespaces may receive an `ExprVariableContext` with captured roles in `snapshots()`. Read a captured property with `context.roleValue("subject", "health")`; the value comes from the subject's owning region. A first request for a property can defer the current presentation until its sample is available. Let `RoleSnapshotPendingException` propagate so Gloss can retain the previous presentation.

For contexts without a captured role, read the corresponding live entity only from its owning region. Calling `viewer()`, `subject()`, or `source()` for a captured foreign-region entity throws an ownership error with the required replacement API. Providers that previously dereferenced those foreign entities must use `roleValue`; arbitrary live entity callbacks cannot be made safe by moving them to an asynchronous executor. Captures of different roles are independent and do not represent an atomic world transaction.

```java
ExprVariableContext context = scope.variableContext();
Object health = context.snapshots().containsKey("subject")
    ? context.roleValue("subject", "health")
    : context.subject() instanceof LivingEntity subject ? subject.getHealth() : null;
```

Use `snapshots().get("subject").variable("world.uuid")` for the captured subject's world identity. Built-in role functions such as `hasPermission`, `inGroup`, `inRegion`, and `papi` are sampled on the selected role's owning region, including dynamically computed arguments. Unknown custom providers remain viewer-specific and are not shared between viewers.

## Entity overlay sources

Register an `EntityOverlaySource` with `EntityOverlayService.registerSource(source)` to supply player or entity panes. `wants(EntityRelationshipSnapshot)` receives captured identity, player/NPC classification, invisibility, sneaking and spectator state. `prepare(Context)` runs for the viewer and provides `viewer()`, `relationship()`, the captured health/name values in `snapshot()`, and `scope()` for expressions. Read subject data through the supplied scope; there is no live foreign subject in this callback.

Return a `Pane` containing prepared text, display style, box and vertical offset, or return `null` to withhold the pane. `scanPolicy()` returns `ScanPolicy(range, subjects, intervalTicks)`; zero inherits the overlay host value, with nonzero limits of `64` blocks, `256` subjects, and `200` ticks. Override `includesSelf()` when the source can present a wearer's own pane.

`displayed(Player, EntityRelationshipSnapshot)` runs on the viewer's owning thread after replacement-display admission. Use it for state that must exist only while a pane is visible. `retired(UUID viewerId, UUID targetId)` releases that state when visibility or audience membership ends; retirement may run during teardown, so use the IDs without reading live entity state. Retirement can repeat and must be idempotent. Update integrations that previously implemented live-entity `wants` or `prepare` callbacks to this captured context contract.
