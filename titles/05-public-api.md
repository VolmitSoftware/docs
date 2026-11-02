---
title: Titles public API
description: Service discovery, immutable views, durable mutations, and operation history
published: true
date: 2026-10-28T00:00:00.000Z
tags: titles, api
editor: markdown
dateCreated: 2026-10-24T00:00:00.000Z
---

`com.volmit.titles.api.TitlesApi` exposes saved profiles, title definitions, durable operations, and change subscriptions. The API uses JDK types and immutable records. Integrations obtain the active provider through Bukkit ServicesManager.

## Dependency and discovery

The build produces `Titles-2.0.0-26.2-api.jar` and `Titles-2.0.0-26.2-api-sources.jar` under `build/libs`. Add the API JAR as a compile-only dependency, keep its classes out of your plugin JAR, and declare `depend: [Titles]` in your plugin descriptor. Titles supplies the runtime API classes.

```java
TitlesApi titles = getServer().getServicesManager().load(TitlesApi.class);
if (titles == null) {
    throw new IllegalStateException("Titles API is unavailable");
}
```

Titles unregisters the provider during disable. Release subscriptions and provider references when your plugin stops. Mutations submitted to a stopped provider return `UNAVAILABLE`; asynchronous profile/history reads fail exceptionally, and new subscriptions are rejected.

## Reading data

| Method | Result |
| --- | --- |
| `definitions()` | Immutable canonical title definitions, including hidden and disabled definitions |
| `cachedProfile(UUID)` | Optional immutable saved profile already in memory |
| `loadProfile(UUID)` | Asynchronous saved profile snapshot, including uncached offline players |
| `history(UUID, offset, limit)` | Asynchronous retained receipts, newest first; nonnegative offset and limit from 1 to 100 |

`ProfileView` contains the saved selection, colors, favorites, grants, denials, acquisition metadata, and selection-initialization flag. These fields do not establish current permission-based access or effective fallback output. `definitions()` is a trusted integration catalog: filter it appropriately before exposing hidden title metadata to players. Definition text is canonical rather than personalized locale output; display integrations can use [PlaceholderAPI](/titles/04-compatibility-integrations).

## Mutations

Submit a `MutationRequest(playerId, titleId, action, expiresAt, context)` through `mutate`. `OperationContext(operationId, actor, source, reason)` identifies the operation and its origin. Generate an operation UUID once for a logical operation and retain it for retries.

| Action | Contract |
| --- | --- |
| `GRANT` | Grant access to an online or offline UUID; expiry is an absolute epoch-millisecond deadline, or zero for permanent access |
| `REVOKE` | Remove the grant, add an explicit denial, and clear a matching selection; expiry must be zero |
| `SELECT` | Select an accessible title for an online player, or clear with an empty title ID; expiry must be zero |

Selection runs on the player's owning scheduler and checks readiness, enabled state, access, and cooldown. Completion follows selection-token cleanup and cooldown bookkeeping, so integrations can chain subsequent operations. Grant and revoke trust the calling plugin; enforce your own administrative permissions before accepting user requests. Actor and source are supplied metadata, not authenticated identities. Both require 1 to 128 characters and cannot be blank; reason permits up to 512 characters and may be empty. All three reject control characters.

```java
OperationContext context = new OperationContext(
        UUID.randomUUID(), playerId.toString(), "example-plugin", "event_reward");
MutationRequest request = new MutationRequest(
        playerId, "pathfinder", MutationAction.GRANT, 0, context);
CompletableFuture<MutationResult> completion = titles.mutate(request);
```

Use asynchronous completion handling. A successful durable result contains an immutable profile and receipt. Expected refusal results have null profile and entry fields. Invalid request arguments fail validation; storage and unexpected runtime failures complete the future exceptionally. Cancelling the returned future does not undo or cancel an accepted disk operation.

| Status | Meaning |
| --- | --- |
| `APPLIED` | The operation changed saved state and its receipt was committed |
| `UNCHANGED` | Saved state already matched; a receipt was committed |
| `REPLAYED` | An identical retained operation was found; the result contains the current profile and original receipt |
| `CONFLICT` | The operation ID matches a retained receipt with different request data |
| `EXPIRED` | The requested grant deadline has elapsed before the write |
| `UNKNOWN_TITLE` | The title does not exist |
| `DISABLED` | The required title or selection feature is disabled |
| `LOCKED` | The player cannot select the title |
| `COOLDOWN` | Selection is still on cooldown |
| `OFFLINE` | Selection requires an online player |
| `NOT_READY` | Player data is not ready |
| `CHANGED` | Relevant catalog or player state changed before completion |
| `UNAVAILABLE` | The provider is stopping or unavailable |

## Receipts and retries

A profile retains its latest 256 accepted operation receipts. Operation IDs are scoped to that player's retained history. Profile changes and the receipt are written atomically. Repeating the exact request with the same operation ID replays the original receipt without applying it again, even if the saved profile has changed since that operation. Reusing that ID with different request data returns `CONFLICT`. Once a receipt is pruned, its operation ID no longer prevents duplicate application.

Explicit player selections, clears, grants, and revocations share this history. Default selection initialization, colors, and favorites do not create operation receipts. See [Command history](/titles/02-commands-permissions) for the operator view.

## Change subscriptions

`subscribe(Consumer<TitleChange>)` returns an `AutoCloseable` subscription. `TitleChange` contains the committed profile and receipt. Close the subscription when your integration stops.

Notifications run in commit order on the storage worker after the durable write and before the operation future completes. Accepted unchanged operations also notify; replays and rejected operations do not. Keep callbacks brief: do not block, join Titles futures, or access live Bukkit player/world state. Schedule game work onto the appropriate entity or region scheduler.

Notifications are best-effort and process-local. They are not replayed automatically after restart and do not provide a durable event bus. Use retained history when your integration needs to inspect saved receipts.
