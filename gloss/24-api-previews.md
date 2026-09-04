---
title: "API: Previews"
description: "Add custom variables and access checks to container previews"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Use `PreviewStateProvider` to add variables to container-preview expressions.

```java
public final class ChargeProvider implements PreviewStateProvider {
    @Override
    public String namespace() {
        return "charge";
    }

    @Override
    public Map<String, Object> snapshot(Block block, Entity entity, Player player) {
        return Map.of("level", chargeLevel(player));
    }
}
```

Register it on enable and remove it on disable:

```java
PreviewStateProviders.register(provider);
PreviewStateProviders.unregister(provider);
```

The example exposes `charge.level` to preview conditions and text expressions.

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
