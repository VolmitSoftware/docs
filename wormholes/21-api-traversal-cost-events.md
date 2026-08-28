---
title: "API - Traversal Cost & Events"
description: "Price or veto travel, settle receipts, and consume traversal events safely"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

`art.arcane.wormholes.api.traversal` lets another plugin price, charge for, or
veto a portal traversal. It depends only on Bukkit types, `java.*`, and its own
types (no VolmLib, Adventure, or shaded types on the compile surface).
Descriptor and `apiJar` setup:
[20 - API - Getting Started](/wormholes/20-api-getting-started).

| Goal | Use |
|------|-----|
| Take value and reverse it if the trip fails | `TraversalCostProvider` (`ServicesManager`) |
| Watch or free-veto | `WormholesPortalTraverseEvent` / `WormholesPortalTraversedEvent` |

Events never move money. Only a registered `TraversalCostProvider` holds value.

## Dependency

Same as [20 - API - Getting Started](/wormholes/20-api-getting-started).
Soft-depend Wormholes. Paper needs `join-classpath: true`. Compile against
`Wormholes-*-api.jar` with `compileOnly`.

## Lifecycle

```
quote(context)          side-effect free → PASS | PAYABLE | INSUFFICIENT | DENIED
   |
   |  only if PAYABLE and no prior deny
   v
reserve(context, quote) take value now → receipt
   |
   +--> commit(receipt)                 trip succeeded; value kept (FINAL)
   +--> refund(receipt, reason)         trip did not happen; reverse
```

Guarantees:

- `quote` runs at most once per provider per traversal. It never runs after
  another provider denied.
- `reserve` runs only for `PAYABLE` quotes after every provider quoted without
  denying.
- **Rollback attempt:** any reserve failure requests refunds from every
  already-reserved provider in reverse order. A provider that throws during
  `refund` is logged and struck; Wormholes continues the rollback but cannot
  guarantee that faulty provider reversed its own charge.
- At most one of `commit` or `refund` runs per receipt. The first terminal
  intent wins, and normal lifecycle paths deliver it exactly once. The
  ownership-unavailable shutdown case described below deliberately calls
  neither.
- **`commit` is final.** Refund after commit is a no-op and never reaches you.
- An outcome-less receipt older than 30s receives a terminal `EXPIRED` refund
  request. A receipt that already has a commit or refund intent keeps that
  original outcome; TTL marks it expired and starts another owner-dispatch
  retry cycle instead of replacing the outcome. The sweep runs at the head of
  the next traversal evaluation, including when the API is disabled, at most
  once per second. Idle servers wait until the next attempt or shutdown.
- Player quit honors any stored terminal outcome. An outcome-less receipt
  refunds with `TRAVELER_LEFT` while the player entity is still owned.
- Shutdown stops traversal producers, waits up to 2s for active `quote` and
  `reserve` evaluations, gives callbacks 500ms to publish their outcome, then
  gives accepted owner settlements up to 2s to drain. Tickets still without an
  outcome request a `SERVER_SHUTDOWN` refund.
- One in-flight traversal per player. A second attempt is refused before any
  provider (`DENIED_IN_PROGRESS`).

## Threading

`quote`, `reserve`, and the pre-traversal event run inline on the source
traveler-owned traversal task. Inventory, XP, and the traveler's source
location are legal there.

For local portals, RTP, and Dimensional Doors, `commit` runs on the destination
traveler entity task after movement succeeds. Cross-server `commit` runs on the
source traveler entity task after the transfer send succeeds. Every terminal
provider call and traversal event, including `EXPIRED`, `TRAVELER_LEFT`, and
`SERVER_SHUTDOWN`, runs only while Wormholes owns the current traveler entity.

If entity dispatch is rejected or retired, Wormholes retains the exact terminal
intent and retries globally after 1, 2, 4, and 8 ticks. Expiry, player join,
player quit, and shutdown provide further recovery opportunities. Wormholes
never substitutes an off-owner provider call. If shutdown still cannot acquire
the entity owner, it leaves the provider receipt unresolved and writes a severe
console error naming the traversal ticket; the provider is not called.

Do not block any of the four methods. Slow providers get a throttled warning.
The decision is not changed.

## Worked example

Receipt is opaque: `TraversalReceipt` has no abstract instance methods.
Wormholes stores and returns the same instance and never calls into it.

```java
import art.arcane.wormholes.api.traversal.TraversalContext;
import art.arcane.wormholes.api.traversal.TraversalCostProvider;
import art.arcane.wormholes.api.traversal.TraversalQuote;
import art.arcane.wormholes.api.traversal.TraversalReceipt;
import art.arcane.wormholes.api.traversal.TraversalRefundReason;
import art.arcane.wormholes.api.traversal.TraversalReservation;
import org.bukkit.plugin.Plugin;
import org.bukkit.plugin.ServicePriority;

import java.util.Objects;
import java.util.UUID;

interface ManaPool {
    long balance(UUID playerId);
    boolean withdraw(UUID playerId, long amount);
    void deposit(UUID playerId, long amount);
    void recordSpend(UUID playerId, long amount);
}

record ManaReceipt(UUID playerId, long amount) implements TraversalReceipt {
}

public final class ManaTravelCost implements TraversalCostProvider {
    private final ManaPool pool;

    public ManaTravelCost(ManaPool pool) {
        this.pool = Objects.requireNonNull(pool, "pool");
    }

    public static void register(Plugin plugin, ManaPool pool) {
        plugin.getServer().getServicesManager().register(
            TraversalCostProvider.class,
            new ManaTravelCost(pool),
            plugin,
            ServicePriority.Normal
        );
    }

    @Override
    public String providerId() {
        return "example-mana";
    }

    @Override
    public TraversalQuote quote(TraversalContext context) {
        long price = priceOf(context);
        if (price <= 0L) {
            return TraversalQuote.pass();
        }
        if (pool.balance(context.travelerId()) < price) {
            return TraversalQuote.insufficient(price + " Mana").withPrice(price, "Mana");
        }
        return TraversalQuote.payable(price + " Mana").withPrice(price, "Mana");
    }

    @Override
    public TraversalReservation reserve(TraversalContext context, TraversalQuote quote) {
        long price = quote.amount().orElse(0L);
        if (!pool.withdraw(context.travelerId(), price)) {
            return TraversalReservation.failed("Your mana ran out");
        }
        return TraversalReservation.reserved(new ManaReceipt(context.travelerId(), price));
    }

    @Override
    public void commit(TraversalReceipt receipt) {
        if (receipt instanceof ManaReceipt mana) {
            pool.recordSpend(mana.playerId(), mana.amount());
        }
    }

    @Override
    public void refund(TraversalReceipt receipt, TraversalRefundReason reason) {
        if (receipt instanceof ManaReceipt mana) {
            pool.deposit(mana.playerId(), mana.amount());
        }
    }

    private long priceOf(TraversalContext context) {
        return switch (context.kind()) {
            case RANDOM_TELEPORT -> 10L;
            case CROSS_SERVER -> 5L;
            case LOCAL, DIMENSIONAL_DOOR -> 3L;
            default -> 3L;
        };
    }
}
```

Register in `onEnable`:

```java
ManaTravelCost.register(this, manaPool);
```

Providers run highest `ServicePriority` first, then plugin name, then
`providerId()`.

`reserve` receives the same `TraversalQuote` instance your `quote` returned
(`amount()` / `unit()` available if set via `withPrice`).

### Pure veto

`TraversalCostProvider` is a functional interface. Only `quote` is required:

```java
getServer().getServicesManager().register(TraversalCostProvider.class,
    context -> claims.isOwner(context.travelerId(), context.portalId())
        ? TraversalQuote.pass()
        : TraversalQuote.denied("This gate belongs to someone else"),
    this, ServicePriority.Normal);
```

If you charge, implement `providerId()`. Default is the class name (unstable for
lambdas). Wormholes logs a warning and still uses the generated name within a
run.

## TraversalContext

```java
public record TraversalContext(
    UUID traversalId, TraversalKind kind, Player traveler, UUID portalId,
    String portalName, Location origin, Optional<TraversalDestination> destination)
```

| Field | Meaning |
|-------|---------|
| `traversalId` | Unique per attempt |
| `kind` | `LOCAL`, `CROSS_SERVER`, `RANDOM_TELEPORT`, `DIMENSIONAL_DOOR` |
| `traveler` | Live `Player` |
| `portalId` / `portalName` | Entered portal (door for dimensional door). Name sanitized, empty if unnamed |
| `origin` | Entry location. Fresh clone every read |
| `destination` | Present when known. Empty for RTP at quote time |

`TraversalDestination.sameServer()` is false for cross-server. `serverName()`
names the peer. `location()` is empty when remote and returns a defensive clone
when present. `TraversalContext.origin()` also returns a defensive clone. Static
factories on context/destination exist for Wormholes and unit tests. Only
players are gated. Minecarts, mobs, and items never reach providers.

`TraversalDecision` is not passed to providers or events.
`TraversalReceipt.SimpleReceipt` is only for receipts you create via
`TraversalReceipt.of(label)`.

## Events

```java
@EventHandler(ignoreCancelled = true)
public void onTraverse(WormholesPortalTraverseEvent event) {
    if (regions.isProtected(event.getContext().origin())) {
        event.setCancelReason("This portal is inside a protected region");
        event.setCancelled(true);
    }
}

@EventHandler
public void onTraversed(WormholesPortalTraversedEvent event) {
    // post-commit; charged provider ids available
}
```

- `WormholesPortalTraverseEvent`: before any quote. Cancel is free. Source
  traveler-owned traversal task. No blocking.
- `WormholesPortalTraversedEvent`: after commit on the same traveler entity
  owner. Dispatch failures are logged. Not a ledger of record.
- Both extend `org.bukkit.event.Event` with their own `HandlerList`. Not async.
  Not dispatched with zero listeners. Disabling `traversal-api-enabled` skips
  events for new evaluations; an already-open ticket can still fire its
  completion event.

## Hostile-provider policy

| Misbehavior | Response |
|--------------|----------|
| `quote` throws or returns null | Fault is logged (stack if throw). `allow` continues without charging; `deny` rejects this attempt |
| `reserve` throws or null | Reverse-order refund is requested from every prior reserve; a provider refund fault is logged and may leave that provider's charge unresolved |
| Receipt `toString`/`equals`/`hashCode` throws | Irrelevant because Wormholes never calls them |
| `reserve` returns `failed(reason)` | Not a fault. Rollback then deny with your reason |
| `commit` throws | Logged. The trip is not undone |
| `refund` throws | Logged. Rollback continues |
| Repeated faults | Quarantine until re-register |
| Slow call | Throttled warning. Outcome unchanged |
| Blank/`providerId` throws | Registration ignored |
| Duplicate `providerId` | Higher priority kept |
| Same instance twice | Collapsed to higher priority |
| Nested traversal from inside pipeline | `DENIED_REENTRANT` |
| Your plugin disabled mid-flight | No further quotes. Still `refund` held receipts |

`amount()` / `unit()` on quotes are display-only. Third-party text
(descriptions, reasons, cancel reasons, receipt labels) is truncated to 128
chars. Control characters are flattened. Whitespace is stripped at
construction.

`withPrice` rejects negative amounts. `TraversalReservation.reserved` requires a
non-null receipt. The context and destination records normalize nullable
optionals to empty. The required traversal ID, kind, traveler, portal ID, and
origin reject null.

### Configuration (`wormholes.toml` `[main]`)

| Key | Default | Meaning |
|-----|---------|---------|
| `traversal-api-enabled` | `true` | Master switch. When false, new evaluations skip providers and the pre-event; existing tickets still settle or expire and may fire their completion event |
| `traversal-api-provider-failure-policy` | `allow` | `allow` = fault becomes a free pass. `deny` = reject only this traversal attempt |
| `traversal-api-provider-fault-limit` | `5` | Quarantine on Nth fault. `0` disables. Clamped 0–1000 |
| `traversal-api-slow-provider-millis` | `5` | Warn threshold. `0` disables. Clamped 0–60000 |

Default is fail-open on faults only. Deliberate `DENIED` / `INSUFFICIENT` always
deny. Quarantine is in-memory per registration. Unregister then re-register
clears it. Nothing persists across restart.

## Enums (always use `default` in switch expressions)

`TraversalKind`: `LOCAL`, `CROSS_SERVER`, `RANDOM_TELEPORT`, `DIMENSIONAL_DOOR`.

`TraversalQuoteStatus`: `PASS`, `PAYABLE`, `INSUFFICIENT`, `DENIED` (no `FREE`).

`TraversalReservationStatus`: `RESERVED`, `FAILED` (use factories. `RESERVED`
without receipt throws).

`TraversalRefundReason` (requested through `refund` once traveler ownership is
available; the documented shutdown-owner exception can leave a receipt
unresolved):

| Constant | Meaning |
|----------|---------|
| `TRAVERSAL_ABORTED` | Abandoned / fallback |
| `DESTINATION_REJECTED` | Far side refused |
| `DESTINATION_UNAVAILABLE` | Nowhere to arrive |
| `TELEPORT_FAILED` | Move failed |
| `TIMED_OUT` | Did not complete in time |
| `TRAVELER_RETREATED` | Stepped back before commit |
| `TRAVELER_LEFT` | Disconnected |
| `RATE_LIMITED` | Throttled |
| `CHARGE_ROLLBACK` | Another provider failed reserve |
| `EXPIRED` | Outcome-less after 30s |
| `SERVER_SHUTDOWN` | Outcome-less at unload |

`TraversalOutcome` (`allowed()` true for the four allow cases):

| Constant | allowed | Meaning |
|----------|---------|---------|
| `DISABLED` | true | API off. No provider ran |
| `ALLOWED_FREE` | true | Nobody charged |
| `ALLOWED_CHARGED` | true | At least one reserved |
| `ALLOWED_PROVIDER_FAILED` | true | Fault under `allow` policy |
| `DENIED_BY_LISTENER` | false | Event cancelled |
| `DENIED_BY_PROVIDER` | false | `DENIED` quote |
| `DENIED_INSUFFICIENT` | false | `INSUFFICIENT` or failed reserve |
| `DENIED_PROVIDER_FAILED` | false | Fault under `deny` policy |
| `DENIED_IN_PROGRESS` | false | Traveler already in flight |
| `DENIED_REENTRANT` | false | Nested pipeline attempt |

`WormholesPortalTraversedEvent.getOutcome()` is only `ALLOWED_FREE`,
`ALLOWED_CHARGED`, or `ALLOWED_PROVIDER_FAILED`. **No denial event.** Observe
denials from your `quote` and from `WormholesPortalTraverseEvent`.
