---
title: Coffer live transfers and recovery
description: Journaled player-to-vault transfers, player checkpoints, and restart recovery
published: true
date: 2026-10-19T00:00:00.000Z
tags: coffer, transfers, recovery, development
editor: markdown
dateCreated: 2026-10-18T00:00:00.000Z
---

Coffer records both inventories before and after each live player/vault transfer, publishes a native player checkpoint, and commits the vault at its exact revision. Version 0.6.0 adds reviewed operator recovery to the [player vault commands and menu](/coffer/02-commands-permissions), alongside the transfer API introduced in 0.4.0.

## Transfer API

`CofferPlugin.transfers()` exposes `BukkitVaultTransfers`. Call `transfer(player, vaultId, request, administrator)` from the player's owning Paper/Folia thread. `ItemTransferPlan.Request` specifies `DEPOSIT` or `WITHDRAW`, a player storage slot from 0 through 35, a vault slot within its saved capacity, and a positive quantity. The returned completion stage reports `APPLIED` or `DURABILITY_UNCERTAIN` with the transaction UUID.

The source must contain enough items. An occupied destination must have matching item metadata and enough stack capacity; the source and destination's actual stack limits apply. The planner captures all 43 player inventory slots and preserves unselected storage, armor, offhand, body, and saddle slots. Only storage slots 0 through 35 can be selected for a move. There is no automatic slot selection, overflow drop, partial-success result, cursor transfer, or creative-mode operation.

The player must be online, alive, persistent, and in survival or adventure mode, with only the personal crafting view open. The cursor and personal crafting grid must be empty. The player and vault must have no conflicting edit session or transfer. At most 16 live transfers or join recoveries are admitted simultaneously.

`transferFromMenu(player, MenuRequest, administrator)` accepts the exact `TransferMenu` inventory bound to that player and vault, together with the displayed revision and explicit-slot request. It rejects a different holder, inventory, actor, or vault, and checks the expected revision after reserving the saved vault but before journal preparation. The normal `transfer` entry point still requires the personal crafting view. After menu admission, closing to an empty personal crafting view is allowed while the accepted transfer finishes; switching to another container is rejected. The player menu passes `administrator=false`.

Menu transfers also recheck `coffer.open` at their owner-thread boundaries. Revocation before preparation prevents a journal; revocation after preparation blocks further play and retains evidence for recovery. Join recovery can finish that accepted intent without the menu permission, so revoking access cannot strand only one side of a durable move.

Ordinary transfers require the saved type permission, open access, and the requested direction's deposit or withdrawal grant. A deposit does not require withdrawal authority. Administrator bypass requires both an explicit `administrator=true` request and `coffer.vault.admin.edit`. The stored owner and founder never become the acting administrator.

## Commit sequence

1. Reserve the player and vault, validate access, and calculate immutable before/after contents.
2. Persist the vault history fence and a checksummed transfer journal before changing player items.
3. On the player's owning thread, verify the before state, apply the after state, set `coffer:transfer` to the transaction UUID, and serialize native player data.
4. Suspend vanilla player saving while an I/O worker validates and atomically publishes that captured checkpoint to `players/data/<player UUID>.dat` under `Server.getLevelDirectory()`. The captured checkpoint retains normal persistence.
5. Restore normal saving on the owning thread and recheck the player's items, receipt, and transfer context.
6. Commit the vault only from the exact journaled base, or recognize the identical already-published next revision.
7. Recheck the live player, persist the completed receipt, remove the active journal, and release the reservation.

Native serialization runs on the player owner thread; checkpoint file operations run on a bounded worker. A checkpoint must contain the matching root player UUID and `BukkitValues/coffer:transfer` receipt. The parser validates the complete compressed NBT, including lengths, duplicate names, depth, tag count, gzip checksum, and trailing bytes. Limits are 16 MiB compressed and 32 MiB inflated per player checkpoint. A native checkpoint includes the player's other saved state, including the ender chest.

That checkpoint represents the capture time. If the player disconnects while publication is pending, vanilla saving remains suspended for the retired player entity and the captured checkpoint is retained. Passive changes outside the inventory guard, such as experience gained after capture, can be lost in that window. Normal saving resumes after publication for a connected player.

Publication requires a forced temporary file and atomic replacement in the playerdata directory. The checkpoint must be a regular file, and its directory path must contain no symbolic links. Coffer does not use `Player.saveData()` as proof of persistence: that method can suppress failures. Existing `.dat_old` files are not selected as checkpoints or rewritten by Coffer's publisher. Directory forcing remains platform-dependent; an unconfirmed directory flush produces an explicit durability-uncertain result rather than a claim about host power-loss safety.

## Interaction guard

While a transfer or join recovery is active, Coffer blocks ordinary inventory clicks, drags, opening containers, drops, pickups, swaps, consumption, equipment changes, item damage, interaction, block placement/breaking, bucket use, shooting, commands, movement, teleportation, game-mode changes, damage, and death for that player. Entity-specific handlers leave unrelated entities unaffected.

These event guards coordinate normal server gameplay. Other plugins must not mutate a guarded player's inventory or persistent data, call `saveData()` explicitly, change persistence, or replace player files during the transaction. Direct plugin writes bypass ordinary event cancellation. Coffer rechecks state and blocks detected divergence; it cannot provide an exclusive filesystem or inventory lease against arbitrary external code.

Cancelling the caller's derived future does not cancel an accepted transfer. Once its journal is prepared, the intent can finish during recovery even if the original caller received an error or disconnected. Integrations must inspect the durable state rather than blindly issuing the same move again.

## Files and restart recovery

| Path | Purpose |
| --- | --- |
| `plugins/Coffer/storage/transfers/<transaction UUID>.transfer` | Active immutable before/after journal, bounded to 18 MiB |
| `plugins/Coffer/storage/receipts/<player UUID>.receipt` | Last completed transfer receipt for that player |
| `plugins/Coffer/storage/transferred/<vault UUID>.fence` | Permanent barrier against vault-only historical rollback |
| `plugins/Coffer/storage/resolution/<transaction UUID>.resolution` | Immutable operator decision and preserved original evidence, retained after completion |
| Main save root `players/data/<player UUID>.dat` | Native player checkpoint containing the transfer receipt |

Pending journals reserve both identities across restarts. Storage admits at most 128 pending journals and loads them into memory for recovery; large unresolved journals can consume substantial memory. Ordinary vault loads and mutations cannot bypass a pending transfer. Malformed or conflicting canonical journals fail storage initialization; Coffer never drops them to make a vault accessible.

Join recovery checks the player's journal and completed receipt before releasing the gameplay guard. With an active journal, the player must match either its before inventory and previous receipt, or its after inventory and new receipt. The first state rolls forward to the accepted after state; the second verifies and resumes the same transfer. An identical vault commit is recognized without creating another revision. Divergent player contents, receipts, or vault revisions remain blocked.

A completed receipt also applies when no journal remains. If vanilla loads an older `.dat_old` backup with a stale receipt, Coffer disconnects that player instead of allowing silent reuse of the old inventory. An already-completed receipt paired with an older player state is not automatically rolled forward. Receipt reset without a pending journal is not supported. The operator workflow below handles a readable pending transaction with valid vault and receipt evidence.

Failed or ambiguous transfers retain their evidence and disconnect the affected player when possible. The localized `coffer.transfer.blocked` message directs them to an administrator. Console failures retain full exception context and transaction/player identifiers. `/coffer debug` includes the number of guarded transfers and recoveries.

## Reviewed operator recovery

The [operator commands](/coffer/02-commands-permissions#operator-recovery) can arm an offline player's next join for a recovery hold. The same gameplay guard stays active while a different operator reviews and completes the pending transaction. Holds are process-local; disconnect clears the connection's review, and restart clears unused arms. Up to 16 unused arms can exist, separately from the limit of 16 active transfers/recoveries.

`VaultStorage.inspectTransfer(transactionId)` returns a coherent `TransferInspection` from the storage worker: journal, evidence fingerprint, vault state, receipt state, and completion eligibility. `prepareRecovery(decision)` requires the exact reviewed evidence and publishes an immutable `RecoveryDecision` before player replacement. `recoveryDecision(transactionId)` reads that decision explicitly, including after completion. Ordinary storage operations remain unable to mutate a reserved vault.

`BukkitVaultTransfers.armRecovery(playerId)`, `reviewRecovery(playerId)`, and `cancelRecovery(playerId)` manage the hold. `completeRecovery(playerId, CompletionRequest, authorize)` accepts the token, actor, and reason, plus an asynchronous authorization callback. The command controller runs this callback on the operator's owning thread or the global console context immediately before approval, then the coordinator rechecks the held target on its owning thread. Revocation, disconnect, expiry, changed connection, changed player contents/receipt, or changed stored evidence prevents a new approval. Integrations must implement the authorization callback for their actual caller.

Reviews show changed slot numbers, material/count, item-data hash prefixes, and receipt replacement. Approval chooses the journal's existing after-image and transaction receipt; it does not calculate a new transfer or invent another vault revision. The archive preserves the operator, reason, timestamp, observed player contents/receipt, a full native player snapshot, and the original journal, vault, receipt, and fence bytes. A conflicting current inventory can differ in quantity from the chosen result, so this explicit restoration cannot establish what happened to items outside Coffer.

Archives use a checksummed, bounded format with a 48 MiB total limit and a 16 MiB native snapshot limit. Publication forces a temporary file and atomically creates the canonical archive with a same-directory hard link, without replacing an existing decision. Filesystems lacking that operation refuse approval. Directory-flush limitations remain explicit durability uncertainty. The snapshot is evidence; replay changes the recorded player inventory and receipt, then captures a new native checkpoint, rather than restoring unrelated world position or other historical player state from the archived blob.

An accepted archive survives disconnect, cancellation, and restart. With a pending journal and the previous durable receipt, automatic replay accepts only the exact approved player observation or the exact after-image with transaction receipt. Once the durable receipt is CURRENT, replay of an existing decision requires the exact after-image and transaction receipt; an old approval cannot override a completed-player rollback. A third state remains blocked. An explicit fresh decision may select the recorded result only after a new held review when no prior decision exists. Repeated completion recognizes the existing vault revision and cannot apply another quantity delta.

Player item equality compares every slot's decoded count and metadata. Equivalent native serialization order does not invalidate a review or approved replay after restart. Archives retain the original bytes, and stored evidence fingerprints still detect changes to the journal, vault, durable receipt, or fence.

Reusing a decision retains its original actor and reason. Active archive corruption blocks recovery/startup; completed archives are not scanned during admission, but explicit audit reads still validate their bounds, checksum, and transaction identity. Archives are not pruned automatically and must be included in consistent backups. No command deletes them or restores their original conflicting items.

## Recovery and operating limits

Vault-only history rollback is prohibited once the permanent transfer fence exists, because restoring an older vault generation could recreate withdrawn items. The fence is published before the active journal; it may remain after journal preparation fails without moving any items. Unfenced vaults retain the existing guarded history rollback API. Deletion fences and ordinary revision checks remain in effect.

Use the [coordinated backup tool](/coffer/09-backup-restore) to keep the complete stopped server together, including player data, world containers, and Coffer storage. Restoring only player/vault files while retaining newer world containers can recreate items outside Coffer; restoring only one transfer side can also produce blocked or divergent receipts. Do not delete journals, receipts, decisions, or fences to clear an error, and do not edit current files while the server is running. Operator completion refuses independently changed, deleted, missing, corrupt, or unsupported vaults, damaged journals, and invalid receipt/fence evidence; it does not replace a consistent backup or repair arbitrary contradictory files.

Use normal server shutdown and restart. Coffer refuses to initialize while players are already online, so transfer recovery always begins through the normal join flow. Hot unloading/reloading the plugin while players are online is unsupported; disabling listeners during an unfinished transfer removes its gameplay guard. `/coffer reload` only reloads configuration/languages and leaves transaction services running. Checkpoint publication drains for up to 30 seconds during shutdown, and unconfirmed operations retain their journals. Process termination tests do not establish atomic recovery from host power loss, filesystem corruption, or unrelated plugins' writes.

The [feature map](/coffer/04-feature-map) records automated failure cases and the exact Paper/Folia runtime evidence.
