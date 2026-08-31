---
title: "API - PlaceholderAPI"
description: "Consume Wormholes placeholders safely from another plugin"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes placeholders require PlaceholderAPI but no Wormholes Java dependency.

Check availability before showing portal details:

```java
String available = PlaceholderAPI.setPlaceholders(player, "%wormholes_portal.available%");
if (!Boolean.parseBoolean(available)) {
    return;
}

String name = PlaceholderAPI.setPlaceholders(player, "%wormholes_portal.name%");
String state = PlaceholderAPI.setPlaceholders(player, "%wormholes_portal.state%");
String distance = PlaceholderAPI.setPlaceholders(player, "%wormholes_portal.distance%");
```

See [PlaceholderAPI](/wormholes/12-placeholderapi) for the complete key list and portal-selection rules.

`---` means a known value is unavailable. A literal placeholder means Wormholes is absent or the key is unknown.
