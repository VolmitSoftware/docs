---
title: "API - Traversal Cost & Events"
description: "Price or veto travel, settle receipts, and consume traversal events safely"
published: true
date: 2026-09-28T14:01:18.380Z
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

For cross-server travel, pricing settles when the source dispatches the transfer after destination admission. The traversed event reports that source settlement. Destination arrival receipts update transfer completion statistics separately. A later connection failure does not refund an already committed charge.

All provider and event calls run on the traveler's owning thread. Keep them fast and make reservations safe to commit or refund once.

## Native traversal providers

On Fabric, Forge, and NeoForge, obtain `MinecraftTravelCosts.forServer(MinecraftServer)` after server startup. Register a `MinecraftTraversalCostProvider` through `register(new MinecraftTravelCosts.Registration(provider, providerId, ownerName, priority, enabled))`; close the returned registration when the integration stops. Register and close cost, currency, and listener registrations on the logical server thread.

The provider receives `MinecraftTraversalContext` in `quote(context)` and `reserve(context, quote)`, and the shared `TraversalReceipt` in `commit(receipt)` and `refund(receipt, reason)`. The context carries the real `ServerPlayer`, traversal kind, source portal, source location, and optional destination. Quotes, reservations, receipts, and refund reasons use the same shared transaction contract as Bukkit providers. Avoid blocking callbacks; reserve only after a successful quote and make settlements idempotent.

`listen(MinecraftTravelCosts.Listener)` supports `before(context)`, which returns null to continue or a refusal message to deny, and `committed(completion)`. `currency(MinecraftRuleCostSubject.Currency)` installs one native currency provider for rule costs. Item costs use native inventories. [Getting Started](/wormholes/20-api-getting-started) covers portal, peer, and handoff lifecycle listeners.
