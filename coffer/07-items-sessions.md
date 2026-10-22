---
title: Coffer items and edit sessions
description: Paper item encoding, exclusive detached sessions, and save failure handling
published: true
date: 2026-10-19T00:00:00.000Z
tags: coffer, items, sessions, development
editor: markdown
dateCreated: 2026-10-18T00:00:00.000Z
---

Coffer encodes Paper items and maintains exclusive detached edit sessions through internal Java APIs. A detached session edits immutable vault contents and returns separate item copies; it does not open a Minecraft inventory or move items out of a player's inventory. The separate [live transfer and recovery API](/coffer/08-live-transfers) powers the [player vault menu](/coffer/02-commands-permissions) introduced in 0.5.0.

## Item format and limits

`BukkitItemCodec.capture(ItemStack[])` captures sparse slots, omitting null and air entries. `restore(VaultContents, capacity)` returns a new array for a capacity of 9 through 54, in multiples of nine. Non-air items must have a positive amount and an item material. Native Paper serialization preserves item components, metadata, persistent data, and nested contents supported by the running server.

The encoding identifier is `paper-item-v1`. Each payload contains a 16-byte Coffer envelope with format version, Minecraft data version, and native payload length. Native data uses Paper's `serializeAsBytes` and `deserializeBytes` APIs. Older data is passed to Paper only after validation; future data versions, unknown encodings, malformed envelopes, and invalid native data are rejected. There is no empty-vault fallback.

| Boundary | Limit |
| --- | --- |
| Encoded item, including envelope | 256 KiB |
| Encoded contents per vault | 4 MiB |
| Inflated NBT per item | 2 MiB |
| Inflated NBT across a restored vault | 8 MiB |
| NBT nesting depth | 64 |
| NBT tags per item | 131,072 |

All occupied slots pass bounded streaming NBT validation before any native item decoding begins. Validation checks compound structure, duplicate names, tag types and lengths, data version, and trailing bytes. This bounds native decoder input; it does not promise that every possible third-party item component has been tested. Invalid stored items leave the canonical record unchanged and prevent a successful session opening.

## Session ownership and state

`CofferPlugin.sessions()` exposes the Bukkit-independent `VaultSessions` engine. `CofferPlugin.playerSessions()` exposes `BukkitVaultSessions`, which performs player-context checks and item encoding. Both are trusted internal integration APIs. Direct storage access is not player authorization.

Opening reserves both a vault UUID and a viewer UUID before loading. One viewer may hold one session, and one vault may have one session. Pending, open, and blocked reservations together are limited to 128. Handles contain a random token, vault UUID, and viewer UUID; stale handles cannot mutate a replacement session. The viewer never replaces the persisted owner or founder, including in administrator mode.

| State | Meaning |
| --- | --- |
| `LOADING` | Reservation exists; the record is being loaded. |
| `OPEN` | A valid record and detached draft are available. |
| `SAVING` | An immutable submitted draft is being saved or reconciled; replacement is blocked. |
| `BLOCKED` | A save failed or conflicted; the draft and reservation remain available for inspection and explicit resolution. |

`replace` changes only item contents and requires open, deposit, and withdrawal authority. It cannot change ownership, type, grants, or lock state. The Bukkit bridge requires the array size to match the saved vault capacity. Replacing a full draft is therefore unsuitable for a deposit-only or withdrawal-only interaction; directional live transfers need their own transaction rules.

## Player and thread checks

Call the Bukkit bridge's `open`, `read`, `replace`, `save`, and session `close` methods from the player's owning Paper/Folia thread. They reject offline players, mismatched viewers, and use during shutdown. Loading occurs asynchronously; opening returns through the player's entity scheduler, where online state, saved type permission, and explicit administrator permission are checked again before decoding items and exposing the handle.

Administrator mode must be explicitly requested and requires `coffer.vault.admin.edit`, which defaults to operators and is included in `coffer.admin`. Ordinary calls do not gain administrator bypass merely because the player is an operator. The saved type's permission and current domain access rules govern ordinary edits. External metadata changes cause revision conflicts rather than being overwritten by a stale session.

Returned item arrays and stacks are defensive copies. Editing an array does not change the session until `replace` accepts it. Session and storage completion callbacks may run on a storage worker; callbacks that access player state must schedule back onto the owning context. Do not block that worker while waiting for another storage operation.

## Saving and failures

`save` commits a dirty draft at its exact base revision. `close` releases a clean session immediately or releases a dirty session after its save succeeds. Closing during a save waits for that operation. Results distinguish `CLEAN`, `APPLIED`, and `DURABILITY_UNCERTAIN`; the last result confirms publication with the filesystem durability limitation described in [local storage](/coffer/06-local-storage).

A failed or conflicting save retains the draft and reservation in `BLOCKED`. An explicit retry first reloads the record. If the original base is unchanged, it retries the original revision. If the exact submitted snapshot is already present at the next revision with matching creation metadata, it adopts that publication as durability-uncertain without writing twice. Any other state remains a conflict; drafts are never automatically rebased over another writer, corruption, or deletion.

`inspect` exposes reserved sessions and `statistics` reports pending, open, dirty, and blocked counts. Explicit `discard` releases a detached draft but is prohibited during a save. `releaseUnchanged` atomically releases only an unmodified, non-saving, non-blocked reservation; failed opening cleanup uses it so a concurrent edit cannot be discarded accidentally. No operator command for resolving blocked sessions is provided yet.

Cancelling a caller's derived future does not cancel an accepted storage operation or release its reservation. The integration must still close or disconnect the session. Failed loading or clean opening validation releases its reservation; scheduler retirement and player disconnect also terminate pending opens. Full failure traces are logged for item decoding and persistence failures.

## Quit, shutdown, and recovery boundary

Player quit flushes the already accepted immutable draft. It does not capture a live inventory during the quit event. Plugin shutdown stops admission, fails pending opens immediately, drains active sessions serially, and then closes storage. It waits up to 30 seconds for session draining; unresolved drafts and timeouts are logged as unconfirmed. Storage has its own 30-second drain deadline.

Dirty and blocked detached drafts exist in process memory until successfully committed. A process crash or termination can lose those uncommitted edits. An unresolved shutdown report does not make a draft durable. Use `BukkitVaultTransfers` for real player item movement; do not emulate a live transfer with detached `replace` followed by an independent player inventory change.

See the [feature map](/coffer/04-feature-map) for automated tests, tested item metadata, Paper/Folia acceptance, and remaining gameplay work.
