---
title: Coffer local storage
description: Local vault records, write outcomes, retained generations, and recovery limits
published: true
date: 2026-10-19T00:00:00.000Z
tags: coffer, storage, development
editor: markdown
dateCreated: 2026-10-17T18:36:21.000Z
---

Coffer includes a local repository for immutable vault metadata and encoded item payloads. It initializes under `plugins/Coffer/storage` on a dedicated worker. The [item/session APIs](/coffer/07-items-sessions), [live transfer protocol](/coffer/08-live-transfers), and [player vault commands](/coffer/02-commands-permissions) use this repository.

## Data and limits

Each record contains a stable vault UUID, owner and founder UUIDs, the vault type definition, shared access grants, lock state, creation/update timestamps, revision, and sparse item slots. Item bytes carry an encoding identifier supplied by the caller. The repository treats those bytes as opaque data; it does not deserialize Bukkit items or verify that an encoding is usable by a particular Minecraft version.

| Boundary | Limit |
| --- | --- |
| Occupied slot indexes | 0 through 53, within the saved type's capacity |
| One encoded item | 256 KiB, nonempty |
| All item payloads in a vault | 4 MiB |
| Complete record | 5 MiB |
| Vault identities in the index | 100,000, including deletion markers and damaged records |
| Waiting storage operations | 16, in addition to the active operation |
| Retained prior generations | Three after successful pruning |

Records use an independent versioned binary format with a SHA-256 checksum. Decoding bounds lengths before allocating item buffers and rejects malformed fields, duplicate slots/grants, invalid domain values, trailing bytes, and filename/identity mismatches. Payload arrays are copied at the boundary; snapshots and their collections are immutable. Checksums detect damage; they do not authenticate files against an actor with filesystem access.

## Files and ownership

| Path inside `storage` | Purpose |
| --- | --- |
| `.lock` | Exclusive process lock held while the repository is open |
| `records/<vault UUID>.vault` | Canonical current record or redundant deletion tombstone |
| `history/<vault UUID>/<revision>.vault` | Prior complete generations |
| `deleted/<vault UUID>.vault` | Permanent authoritative deletion marker |
| `quarantine/<vault UUID>-<fingerprint>.vault` | Preserved copy of bounded damaged data |
| `transfers/<transaction UUID>.transfer` | Active live-transfer journal and persistent player/vault reservation |
| `receipts/<player UUID>.receipt` | Last completed live-transfer receipt |
| `transferred/<vault UUID>.fence` | Permanent prohibition on vault-only history rollback after transfer preparation |
| `resolution/<transaction UUID>.resolution` | Immutable reviewed recovery decision and original evidence retained for audit |

The repository indexes canonical UUID paths. Owner queries use an in-memory metadata index rebuilt during startup; item payloads are not retained in that index. Loads and mutation checks refresh the observed state, including rejected mutations, so discovered corruption or deletion removes a vault from the live owner listing and updates statistics. Unknown files are ignored. Storage expects real directories and regular record files, and rejects symbolic record files. The directory is private application data, not a supported live-edit interface or a multi-server store.

Only one process may open the storage root. A lock failure prevents storage initialization and schedules plugin disable. Initialization errors emit full stacktraces. The local debug report includes storage lifecycle state and queued operation count. `/coffer reload` continues to reload configuration/languages; it does not reopen storage or rewrite existing vault types.

## Writes and deletion

Creation assigns revision 1. Saving and deleting require the exact current revision; stale requests return a conflict. An ordinary save cannot change the owner or founder. A capacity reduction is rejected if persisted items occupy slots beyond the proposed capacity, even when the submitted snapshot omitted those items. Those contents must be safely moved and saved before shrinking. These checks support edit sessions but do not themselves coordinate player inventory changes.

Before replacing a live record, the repository archives its verified current bytes. It writes the new bytes to a temporary file beside the destination, forces the file data, and requires atomic replacement. There is no fallback to a partial in-place write. A successful publication updates the owner index and attempts to prune older history. Pruning failure is logged and may leave extra generations; it does not undo the published record.

Deletion publishes a new, checksummed permanent marker under `deleted` as its commit point. That marker takes precedence over an old live record, so a late save or repeated creation cannot resurrect the UUID. A redundant tombstone is also written under `records`. Failure to write that redundant copy is logged without treating the authoritative deletion as undone. Corrupt deletion markers remain write barriers. Deletion markers are not automatically purged.

Removing storage files externally is unsupported. In particular, deleting a live record while history remains is classified as corruption, not permission to create a new record with that identity.

## Durability outcomes

| Write result | Meaning |
| --- | --- |
| `APPLIED` | Atomic publication and the supported directory-force step completed. The returned revision is current. |
| `DURABILITY_UNCERTAIN` | Publication completed, but directory durability could not be confirmed. The returned revision is already current; this is not a failed write to retry blindly. |
| `CONFLICT` | The identity already exists, the expected revision is stale, or a recovery fingerprint no longer matches. |
| `ABSENT`, `DELETED`, `CORRUPT`, `UNSUPPORTED` | The current record cannot undergo the requested mutation. No replacement was accepted. |

Directory forcing is capability-dependent, including on Windows filesystems. When unavailable, Coffer logs the limitation at startup and published writes return `DURABILITY_UNCERTAIN`. File data is still forced and publication still requires atomic replacement. Statistics expose `directorySyncSupported`; callers must distinguish confirmed publication from guarantees about a host power failure.

I/O errors complete the operation exceptionally and include context in the console. An atomic-move error may leave an ambiguous outcome; load the current state before deciding what to do next. Hardware, filesystem, and operating-system behavior still bound durability. This repository does not claim an atomic transaction spanning a player's server inventory and a vault file.

## Corruption and history recovery

Loads distinguish `FOUND`, `ABSENT`, `DELETED`, `CORRUPT`, and `UNSUPPORTED`. Damaged data never becomes an editable empty vault. A bounded damaged record is copied to quarantine without removing the original. Oversized or nonregular files remain in place and blocked; Coffer does not read an unbounded file merely to copy it. Failure to preserve a quarantine copy is logged, and the original remains a write barrier.

The internal history recovery operation restores a selected verified history revision only when the current canonical record is still valid and has no live-transfer fence. It requires the SHA-256 fingerprint returned by the current load, preserves owner/founder identity and the active creation timestamp, and assigns a revision higher than the current and retained generations. It restores the selected historical snapshot, including its contents and access state. This is an explicit rollback operation; no background or startup path selects an older generation automatically.

An active transfer journal blocks ordinary loads and mutations for its vault until the transaction resolves. The dedicated transfer API commits only the exact before state or recognizes the exact already-committed next revision. A permanent fence also blocks historical rollback after the transaction finishes, because a vault-only rollback could recreate items already withdrawn into a player inventory. Damaged transfer evidence remains blocked. See [live transfers and recovery](/coffer/08-live-transfers) for player checkpoints, receipt history, and joint backup requirements.

Corrupt, missing, unsupported, and deleted canonical records cannot be restored through that operation. A damaged record's original revision cannot be trusted, so inventing a replacement revision could allow a stale writer to overwrite recovered data. These cases require reviewed offline repair; the operator transfer-recovery commands do not replace canonical vault records outside a valid journal's exact before/after pair. Preserve the entire stopped storage directory, including `deleted`, `history`, `quarantine`, and `resolution`, before undertaking such work.

Retained generations aid recovery but are not independent off-machine backups. The [offline backup tool](/coffer/09-backup-restore) snapshots the complete stopped server and restores a verified copy into a new directory. Automatic export, external-format import, and purge tasks remain unimplemented.

## Asynchronous access and shutdown

`CofferPlugin.storage()` exposes `VaultStorage` for internal integration. It supplies readiness/shutdown stages and asynchronous create, load, save, delete, owner listing, history listing, recovery, and statistics operations. Transfer operations prepare, commit, finish, inspect pending journals, and read per-player recovery/receipt state. `StorageUnavailableException` distinguishes a full queue, closure, and failed storage. Accepted operations execute in order on one worker; there is no join-time background cache capable of publishing an older item snapshot over a newer write.

`CofferPlugin.vaultPlayers()` exposes owner-scoped create, list, and open operations. Creation uses `createOwned(snapshot, maximumVaults)` to check the owner count and publish in a single repository operation. Reaching the configured limit returns a typed refusal without creating a record. The player service sorts owner listings by creation time then UUID and resolves a positive list number or full UUID without exposing another owner's record. Integrations using unrestricted repository creation remain responsible for their own quota policy.

The repository is a trusted persistence boundary, not player authorization. The Bukkit session API validates permissions, preserves immutable vault identity, captures item bytes on the owning player context, and marshals opening completion through the player's entity scheduler. Direct repository integrations must enforce the same requirements. Completion callbacks may execute on the storage worker: they must remain short and must not block waiting for another queued storage operation. Cancelling a derived future does not cancel an accepted write.

Shutdown stops admission, drains accepted work, and releases the filesystem lock after the worker finishes. Plugin disable waits up to 30 seconds for that completion. If the deadline expires, Coffer logs that pending writes are unconfirmed and keeps the lock until draining actually finishes; process termination can still interrupt that work. An unrecoverable worker error closes admission and fails subsequent queued operations instead of continuing writes against a closed repository. Resource-cleanup failure completes the shutdown stage exceptionally and leaves later API calls reporting `FAILED` with the original cause.

## Validation status

The storage failure validation established 134 storage tests and a packaged storage round trip, retained in the current suite. Storage coverage includes malformed and oversized records, checksums, immutable payloads, revision conflicts, ownership and capacity guards, corruption barriers, recovery, deletion protection, failed file/directory flushing, atomic-move failure, pruning/quarantine failure, queue saturation, cancellation, shutdown interruption, the 30-second shutdown deadline, and fatal-worker cleanup.

Six child-JVM tests terminate the process immediately before or after atomic create, save, and deletion-marker publication. Each reopens the repository twice and checks complete old/new state, history, and stale-write protection. The deletion case confirms that the permanent marker blocks the old live record even when the redundant tombstone was never written. These tests establish process-termination behavior; they do not simulate host power loss.

Failure regressions also cover metadata refresh after a rejected mutation discovers damaged, unsupported, or deleted data, and preservation of cleanup exceptions in later storage API responses. See the [feature map](/coffer/04-feature-map) for distribution identity and server evidence.

The 0.2.0 distribution passed storage readiness, administration/reload, restart, and shutdown checks on isolated Paper and Folia 26.1.2 servers. A Paper startup check with an unusable records directory logged the full exception and disabled Coffer; repairing that path allowed storage to initialize on the next server start. These checks exercise plugin lifecycle. The feature map records subsequent version-specific evidence, including the [live transfer layer](/coffer/08-live-transfers) introduced in 0.4.0.
