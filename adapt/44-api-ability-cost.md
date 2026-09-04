---
title: "API - Ability Cost"
description: "Quote, reserve, settle, and refund custom ability costs"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Register an `AbilityCostProvider` to replace, waive, or reject an adaptation's normal activation cost.

## Provider

```java
public final class ManaCostProvider implements AbilityCostProvider {
    @Override
    public String id() {
        return "example.mana";
    }

    @Override
    public AbilityQuote quote(AbilityCostContext context) {
        if (!context.adaptationId().equals("rift-blink")) {
            return AbilityQuote.pass();
        }

        return mana.has(context.playerId(), 10)
            ? AbilityQuote.charge(new ManaCharge(context.playerId(), 10))
            : AbilityQuote.refuse("You need 10 mana.");
    }
}
```

Register it through Bukkit's `ServicesManager` under `AbilityCostProvider`.

## Charge lifecycle

Your `AbilityCharge` reserves the value, commits it when the ability succeeds, and refunds it when Adapt reports failure. Keep reservation state thread-safe and idempotent because cleanup may be retried.

Use these outcomes:

| Quote | Meaning |
|---|---|
| `pass()` | Keep Adapt's normal cost |
| `waive()` | Make this activation free |
| `charge(...)` | Use your custom resource |
| `refuse(reason)` | Deny the activation |

Use `AdaptAbilityActivateEvent` to cancel an activation without charging anything. Use `AdaptAbilityActivatedEvent` to observe a completed activation.

Provider callbacks may run off the Bukkit thread. Do not access live Bukkit objects from them; schedule player-facing work onto the player's owner.
