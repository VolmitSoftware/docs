---
title: "API: Previews"
description: "Container preview variables, access checks, and temporary item displays"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Use `PreviewStateProvider` to add variables to container-preview expressions.

```java
public final class ChargeProvider implements PreviewStateProvider {
    private final Map<UUID, Double> charges = new ConcurrentHashMap<>();

    public void setCharge(UUID player, double level) {
        charges.put(player, level);
    }

    public void forget(UUID player) {
        charges.remove(player);
    }

    @Override
    public String namespace() {
        return "charge";
    }

    @Override
    public Map<String, Object> snapshot(Block block, Entity entity, Player player) {
        return Map.of("level", player == null ? 0D : charges.getOrDefault(player.getUniqueId(), 0D));
    }
}
```

Register it on enable and remove it on disable:

```java
PreviewStateProviders.register(provider);
PreviewStateProviders.unregister(provider);
```

The example exposes `charge.level` to preview conditions and text expressions. Publish changes through `setCharge` and call `forget` when a player leaves. The snapshot reads the published values without reading another entity's live state.

`snapshot` runs on the thread that owns the preview target. Keep it fast and return a new immutable map. `block`, `entity`, or `player` may be `null` when that context does not exist. Namespace and key names must not collide with Gloss built-ins.

## Deny a preview

Listen for `GlossContainerPreviewAccessEvent`:

```java
@EventHandler
public void onPreview(GlossContainerPreviewAccessEvent event) {
    if (!canView(event.getPlayer(), event.getBlock(), event.getEntity())) {
        event.setCancelled(true);
    }
}
```

The event runs on the target's owning thread immediately before Gloss builds the preview.

See [Container Previews](/gloss/15-container-previews) and [Expressions & Placeholders](/gloss/13-expressions-placeholders).

## Temporary item displays

Use `GlossAPI.get().createTemporaryItem(owner, viewer, spec)` to show a cosmetic item to one player. The display uses packets; it does not create a collectible world entity or change an inventory.

```java
TemporaryItemSpec spec = new TemporaryItemSpec(location, item, 5000L, 16.0, 0.7F);
TemporaryItem display = GlossAPI.get().createTemporaryItem(plugin, player, spec);
```

Read player inventory state and construct the preview on the player's owning scheduler. `TemporaryItemSpec` copies the item and location and normalizes the displayed stack to one item. Its location must have a world and finite coordinates; the item must not be air.

| Parameter | Allowed values |
|---|---|
| `durationMs` | 100–30000 milliseconds |
| `range` | 1–64 blocks |
| `scale` | 0.1–2.0 |

Call `display.destroy()` to remove the display early; `display.isClosed()` reports whether it has closed. Displays also close when they expire, the viewer disconnects, dies, changes world, or leaves range, the owning plugin disables, or Gloss stops. Creation requires an enabled owning plugin and available display capacity. Gloss accepts at most 256 active temporary item displays and applies its hologram visibility budget.
