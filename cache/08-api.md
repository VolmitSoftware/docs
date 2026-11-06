---
title: "Cache: Developer API"
description: "Claim cancellation phases, completion receipts and availability queries"
published: true
date: 2026-11-06T12:00:00.000Z
tags: "cache, api, events, folia"
editor: markdown
dateCreated: 2026-10-15T12:00:00.000Z
---

<nav class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/cache">Cache</a><span aria-hidden="true">/</span><span aria-current="page">Developer API</span></nav>

Cache publishes Bukkit events for online claim approval and successful completion. Integrations compile against Cache's unpacked runtime artifact without bundling its classes, then register ordinary Bukkit listeners. Events execute on the affected player's owning scheduler, including Folia.

## Dependency and registration

Build Cache and add `build/libs/cache-1.0.0-26.1-26.3-runtime.jar` as a `compileOnly` dependency alongside your supported server API. This unpacked runtime artifact exposes the public classes to the compiler. Deploy the packed distribution `cache-1.0.0-26.1-26.3.jar`; its nested classes are not a direct compile dependency.

Declare `depend: [Cache]` in your plugin descriptor when Cache is required. Use `softdepend: [Cache]` for optional integration and load Cache-dependent classes only when Cache is enabled.

Register the listener through `getServer().getPluginManager().registerEvents(listener, yourPlugin)`. On Folia, a listener may access its own event player; work involving another player or region must be scheduled onto that owner. Do not block event callbacks with disk or network IO.

## Before a claim

`com.volmit.cache.api.CachePreClaimEvent` is cancellable. Its `getContext()` record contains `kitId`, `revision`, `cause`, `mode`, `price` and `phase`.

| Phase | Timing | Cancellation outcome |
|---|---|---|
| `RESERVE` | After initial eligibility checks, before a fresh durable reservation or resuming READY work | No fresh reservation is created; an existing READY claim remains available |
| `DELIVER` | After APPLYING is durable, before payment and reward effects | Delivery is deferred to READY with the same selected rewards and key reservation |
{.dense}

A retry can trigger both phases again. Check mutable conditions at both phases when they must remain valid until delivery. Event approval does not bypass Cache's subsequent inventory, revision, payment and eligibility checks.

`ClaimCause` is `PLAYER`, `KEY`, `ADMIN` or `STARTER`. All online paths use these events. Offline UUID grants reserve work without an online event; their delivery attempt on join goes through the online phases.

Call `setCancelled(true)` to refuse the operation. `setCancellationReason(String)` supplies optional plain text of at most 256 characters; it rejects control characters and section-sign formatting. Setting the reason alone does not cancel. An empty reason uses Cache's normal cancellation feedback.

## Completed claims

`com.volmit.cache.api.CacheClaimCompleteEvent` is non-cancellable. It fires after COMPLETE is durable and the held key has been refreshed, before ordinary success presentation. `getReceipt()` supplies `claimId`, `kitId`, `revision`, `cause`, `mode`, `price` and defensive copies of the selected `rewards`.

The receipt does not expose the redemption token. Changing returned reward definitions does not mutate Cache's stored claim. For `ALL` keys, selected reward chances are recorded as 100; zero-chance entries are absent.

Completion events are best-effort online notifications. Disconnect, shutdown or callback failure can prevent observation after durable completion. They are not replayed on restart or manual reconciliation and are not a durable accounting feed. Use the claim UUID to identify observed receipts; do not treat notification delivery as an exactly-once guarantee.

## Example listener

This example refuses ordinary claims while a separate permission marks the player as blocked. The same rule applies at RESERVE and DELIVER. Completion logging uses the receipt's stable claim ID.

```java
import com.volmit.cache.api.CacheClaimCompleteEvent;
import com.volmit.cache.api.CachePreClaimEvent;
import com.volmit.cache.api.ClaimCause;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;

import java.util.logging.Logger;

public final class KitPolicy implements Listener {
    private final Logger logger;

    public KitPolicy(Logger logger) {
        this.logger = logger;
    }

    @EventHandler(priority = EventPriority.HIGH, ignoreCancelled = true)
    public void beforeClaim(CachePreClaimEvent event) {
        CachePreClaimEvent.Context context = event.getContext();
        if (context.cause() != ClaimCause.PLAYER) {
            return;
        }
        if (!event.getPlayer().hasPermission("example.kits.blocked")) {
            return;
        }
        event.setCancelled(true);
        event.setCancellationReason(context.phase() == CachePreClaimEvent.Phase.RESERVE
                ? "Kits are unavailable while this restriction is active."
                : "Delivery is paused. Retry after this restriction ends.");
    }

    @EventHandler(priority = EventPriority.MONITOR)
    public void afterClaim(CacheClaimCompleteEvent event) {
        CacheClaimCompleteEvent.Receipt receipt = event.getReceipt();
        logger.info("Completed kit " + receipt.kitId() + " with claim " + receipt.claimId());
    }
}
```

## Availability queries

On the player's owning scheduler, use an enabled `CachePlugin` instance:

```java
KitAvailability result = cachePlugin.claims().availability(player, kitId);
boolean ready = result.canClaim();
String messageKey = result.messageKey();
Map<String, String> arguments = result.arguments();
```

The result type is `com.volmit.cache.runtime.KitAvailability`. Status values are `READY`, `DISABLED`, `PERMISSION`, `WORLD`, `PURCHASE`, `COOLDOWN`, `ALREADY_CLAIMED`, `PENDING`, `REVIEW`, `BUSY`, `INTEGRATION` and `MISSING`. Timed cooldown messages include remaining hours, minutes and seconds; once-only state is separate.

Availability describes an ordinary player claim and respects cooldown bypass permission. It does not test balance, inventory fit, selected rewards or event approval. It is a snapshot, not a reservation; recheck before an action and let the claim service enforce delivery rules.

## Related pages

- [Delivery and recovery *Durable state transitions and staff resolution*](/cache/06-delivery-recovery)
- [Kits and rewards *Reward types, chances and slots*](/cache/03-kits-rewards)
- [Feature reference *Capabilities and where to use them*](/cache/07-feature-map)
{.links-list}
