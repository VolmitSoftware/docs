---
title: "Cache: Delivery and recovery"
description: "Durable claims, fixed rewards, retries and reconciliation"
published: true
date: 2026-11-06T12:00:00.000Z
tags: "cache, delivery, recovery"
editor: markdown
dateCreated: 2026-10-15T12:00:00.000Z
---

<nav class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/cache">Cache</a><span aria-hidden="true">/</span><span aria-current="page">Delivery and recovery</span></nav>

Cache saves the claim identity, selected rewards, price and any reserved key use before applying effects. Each player can have one unresolved claim. A retry resumes that saved work rather than selecting new rewards.

## Claim states

| State | Meaning | Next action |
|---|---|---|
| `READY` | Rewards are reserved; delivery has not started or was safely deferred | Correct the refusal, then `/cache retry`; `/cache cancel` releases inactive pending work |
| `APPLYING` | The ledger records that delivery is entering its effects phase | Let the active operation finish; interrupted operations require review after recovery |
| `COMPLETE` | Successful completion is durable | Cooldown and prior-claim state are recorded |
| `REVIEW` | Effects may have happened, but their outcome is uncertain | Staff inspect items, economy and command effects before resolving |
| `CANCELLED` | The claim was cancelled or reconciled as cancelled | Reserved key use is released; no cooldown is recorded for that claim |
{.dense}

Inventory planning checks all selected item rewards together. A full inventory leaves READY work without partial item delivery or a charge. If a payment provider changes the inventory during withdrawal, Cache replans; when the new plan cannot fit, a successful refund returns the claim to READY. Uncertain charges, failed refunds or failures after effects begin require REVIEW.

External economy operations, arbitrary console commands and Minecraft inventory saving cannot share one durable transaction. Cache does not promise exactly-once external effects across crashes and does not blindly replay an uncertain operation.

## Retry or cancel

1. Run `/cache history` to find your pending state.
2. For READY work, make room, restore the required key to the main hand, or correct the reported access/integration problem.
3. Run `/cache retry`. The saved rewards and reserved key use stay the same.
4. If you no longer want an inactive READY delivery, run `/cache cancel`.

If a kit is edited or deleted while a claim is READY, Cache cancels that claim at its next delivery attempt, releases any reserved key use and records no cooldown. Ordinary and key claims tell the player to claim again. Staff grants and starter grants are requested again from the current revision; if the kit was deleted, the grant ends cancelled. READY work created by offline staff grants is attempted when the player joins. Starter grants run after join and use recorded prior completion to avoid repeated starter delivery.

Staff grants and keys bypass ordinary price, permission and cooldown checks, but successful completion still records the kit's cooldown group. Resetting a cooldown does not erase prior starter history.

## Reconcile uncertain effects

Use `/cache history player=<name-or-uuid>` with inspection permission. Preserve the claim UUID and inspect the relevant inventory, provider records and console-command effects.

```text
/cache resolve <player-uuid> <claim-uuid> complete
/cache resolve <player-uuid> <claim-uuid> cancel
```

Both operations require `cache.admin.resolve` and a REVIEW claim. `complete` records success and consumes the reserved key use. `cancel` releases the reserved use and records cancellation. Neither command delivers items, reverses effects or refunds money. Apply any needed compensation explicitly before recording the chosen outcome.

History keeps up to 16 outcomes per player from the last 30 days. Recorded rewards keep their type, material and amounts but omit captured item data, names and lore, so history is not an inventory backup. Snapshot compaction also drops expired cooldowns and removes players who have no pending claim, cooldown, prior completion or recent history. Back up the entire plugin data folder while the server is stopped when a consistent recovery copy is needed.

## Diagnostics

Use `/cache status` for runtime counts and `/cache debug dump upload=false` for a local report. Include the claim UUID, server version and the console stacktrace when investigating a failure. The dump command otherwise defaults to requesting upload, which requires `debug.uploadEnabled`.

An error loading a complete ledger entry is not silently discarded. A failed journal append stops further claim writes until restart and requires operator investigation. A failed snapshot compaction is logged and retried after 512 further writes while claims continue in the journal; if the journal reaches 64 MiB before compaction succeeds, new claim writes are refused. Do not delete claim records to clear a refusal: that also removes cooldown and key authority.

## Related pages

- [Commands *History, retry, cancel, reset and resolve*](/cache/02-commands-permissions)
- [Keys *Reserved uses and authoritative token modes*](/cache/04-keys-displays)
- [Developer API *Cancellation phases and completion notification limits*](/cache/08-api)
{.links-list}
