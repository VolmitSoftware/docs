---
title: "API - Traversal Cost & Events"
description: "Price or veto travel, settle receipts, and consume traversal events safely"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Register a `TraversalCostProvider` to charge, waive, or deny portal travel.

```java
public final class ManaTravelCost implements TraversalCostProvider {
    @Override
    public TraversalQuote quote(TraversalContext context) {
        long price = context.kind() == TraversalKind.CROSS_SERVER ? 20 : 5;
        return mana.has(context.travelerId(), price)
            ? TraversalQuote.payable(price + " mana").withPrice(price, "mana")
            : TraversalQuote.insufficient("You need " + price + " mana");
    }

    @Override
    public TraversalReservation reserve(TraversalContext context, TraversalQuote quote) {
        return mana.take(context.travelerId(), quote.price())
            ? TraversalReservation.reserved(TraversalReceipt.of("mana"))
            : TraversalReservation.failed("Your mana changed.");
    }

    @Override
    public void refund(TraversalReceipt receipt, TraversalRefundReason reason) {
        mana.refund(receipt);
    }
}
```

Register it through Bukkit's `ServicesManager` under `TraversalCostProvider`.

| Quote | Meaning |
|---|---|
| `pass()` | Use normal Wormholes behavior |
| `payable(...)` | Reserve and commit your resource |
| `insufficient(...)` | Deny for lack of funds |
| `denied(...)` | Deny for another reason |

`TraversalContext` includes the traveler, portal, origin, destination when known, and kind: `LOCAL`, `CROSS_SERVER`, `RANDOM_TELEPORT`, or `DIMENSIONAL_DOOR`.

Use `WormholesPortalTraverseEvent` to cancel before pricing. Use `WormholesPortalTraversedEvent` to observe a completed traversal. Events do not charge or refund anything.

All provider and event calls run on the traveler's owning thread. Keep them fast and make reservations safe to commit or refund once.
