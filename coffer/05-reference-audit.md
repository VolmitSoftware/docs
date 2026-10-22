---
title: Coffer reference audit - PlayerVaultsX
description: Static findings and independent design requirements from PlayerVaultsX 4.4.14
published: true
date: 2026-10-19T00:00:00.000Z
tags: coffer, vaults, development
editor: markdown
dateCreated: 2026-10-17T17:51:10.000Z
---

PlayerVaultsX provides a second behavioral reference for Coffer alongside InsaneVaults. This audit records product ideas and failure conditions to consider when implementing Coffer independently. It adds design requirements, not implemented features; current functionality remains listed in the [feature map](/coffer/04-feature-map).

## Reference and scope

The supplied `PlayerVaultsX.jar` identifies itself as PlayerVaults 4.4.14, with main class `com.drtshock.playervaults.PlayerVaults` and Bukkit API version 1.21.11. The artifact is 1,457,727 bytes; its SHA-256 is `8fa82c8d6ffc94b266ab620eed503930ae8dedc9198d74f59d615c66e64499f0`.

Inspection covered decompiled plugin classes, its descriptor, configuration definitions, commands, listeners, persistence, economy, and converter entry points. Selected shutdown and resize findings were also checked against bytecode. Bundled dependencies were not exhaustively audited. The plugin was not installed or run, and its external endpoints were not contacted. Compatibility declarations and converter names do not establish runtime compatibility or successful imports.

No reference implementation, decompiled source, message text, file layout, or serialization format belongs in Coffer. The source artifact remains external to the project. A future importer would require separately scoped format analysis and read-only access to source data.

## Useful product ideas

| Observed behavior | Application to Coffer |
| --- | --- |
| Numbered personal vaults, per-vault access permissions, permission-based count and row limits | Consider short numeric aliases for convenient opening while retaining Coffer's stable vault UUIDs. Specify whether a count limit means a maximum number or a maximum numeric slot. |
| Administrator access to another player's vaults and a list of existing vault numbers | Provide separate inspect, edit, and delete permissions. Resolve account names to canonical UUIDs before accessing data. |
| A shared in-memory inventory for multiple viewers | Define session ownership before supporting simultaneous editors. An initial single-writer policy with explicit busy responses is simpler to validate on Folia. |
| Restrictions by material, enchantments, custom-model-data presence, item-model presence, and model patterns | Use typed predicates with explicit combination rules and clear denial reasons. Apply the same policy to every deposit path. |
| Creation/opening charges and deletion refunds through Vault | Keep fee policy separate from storage and inventory sessions. Record the charge outcome and its associated operation. |
| Backups, login-time preloading, and inactivity cleanup | Treat backups as recoverable generations; bound cache memory and work queues. Purging should be an explicit operator workflow with a preview and recovery window. |
| Optional signs opening the user's vault or a configured owner's vault | Consider signs later as another entry point to the same authorization and session services. A sign must not confer access by itself. |
| Multiple source-plugin converters and a permission-count placeholder | Add imports and placeholders only after their contracts are specified. Distinguish allowed capacity from the number of vaults actually stored. |

These are candidates, not commitments to reproduce the reference's entire feature set. Numbered access, reliable recovery, and complete item-movement handling are the most useful additions to the existing rewrite direction.

## Static findings and rewrite requirements

Method names below identify evidence in this exact artifact. Consequences describe risks inferred from the code paths; no live exploit, data-loss incident, or performance measurement is claimed.

| Finding | Evidence | Requirement for Coffer |
| --- | --- | --- |
| Shutdown can save to the wrong owner | `PlayerVaults.onDisable` passes the viewing player's UUID to `VaultManager.saveVault` when one viewer remains. Normal close handling uses the owner recorded in `VaultViewInfo`. Bytecode confirms the differing target. An administrator viewing a foreign vault can therefore select the wrong save destination on this path. | Bind every session to an immutable vault ID, owner, and revision. Close, quit, death, and shutdown must all commit through the same owner-bound operation. |
| Shrinking capacity can discard overflow | `VaultManager.getInventory` attempts to fit larger saved contents into a smaller inventory with `addItem`, then ignores the returned leftovers. Bytecode confirms the return value is discarded. | Reject unsafe shrink operations or retain excess contents in explicit durable overflow storage. Preserve exact slot layout where no resize was requested. |
| Corruption can become an editable empty inventory | `CardboardBoxSerialization.fromStorage` returns null after whole-record decoding errors; `VaultManager.getInventory` returns an empty inventory for that result. Some individual item failures substitute AIR. A later save can replace the original damaged data with the degraded view. | Distinguish absent, empty, corrupt, and unsupported data. Preserve the original bytes and quarantine damaged records; prohibit ordinary writes until recovery succeeds. |
| Decoder allocation is driven by unchecked lengths | `CardboardBoxSerialization.fromStorage` allocates item arrays and byte buffers using lengths read from decoded data, without explicit size limits in that method. | Bound file size, decoded payload size, slot count, per-item bytes, and nested content before allocation. Treat imports and on-disk records as untrusted input. |
| Backup and save are not an atomic commit | `VaultManager.saveFileSync` attempts an unchecked rename to one backup name, then saves directly to the live file. It logs save errors but returns no success result. | Use staged writes, integrity checks, atomic publication, bounded retained generations, and explicit durability outcomes. Do not acknowledge a successful save before its durability contract is met. |
| Delete and save do not share a transaction boundary | `VaultManager.deleteVault` asynchronously reloads and rewrites the owner's file while close saves are synchronous. Its write exception is swallowed; deletion/cache changes do not carry a revision check. | Serialize changes per vault or owner record, reject stale revisions, invalidate sessions before deletion, and retain tombstones long enough to prevent a delayed save from resurrecting a deleted vault. |
| Preloading can publish stale cached data | `VaultPreloadListener` starts an asynchronous load on join and evicts on quit; `VaultManager.cachePlayerVaultFile` publishes without checking a session generation or record revision. | Reject obsolete load completions after a write, disconnect, or reconnect. A concurrent map alone does not establish cache consistency. |
| Close-time persistence blocks the gameplay context | `Listeners.saveVault` captures contents and calls `VaultManager.saveVault`, which serializes and writes synchronously. | Capture a detached snapshot on the owning context, then perform ordered bounded persistence off the gameplay thread. Define when the session may safely release ownership. |
| Item restrictions miss a movement source | `Listeners.onClick` checks the current slot item and hotbar/offhand items, but does not inspect the cursor stack. Click and drag handlers identify the view partly through its title. | Identify sessions by trusted holders and IDs. Validate source, destination, and moved amount for cursor placement, shift-click, hotbar/offhand swap, collection, drag, and creative actions. Do not use display text as authority. |
| Restriction settings do not combine consistently | In `Listeners.isBlocked`, a nonempty model list takes a separate return path, bypassing material/enchantment checks and the normal reason/event response path. | Define allow/deny precedence explicitly. A configured predicate must not silently disable another restriction; return a typed decision with a stable reason. |
| Money changes precede confirmed vault outcomes | `EconomyOperations.payToOpen` runs before loading/opening; deletion refunds precede asynchronous deletion. No durable operation identifier or compensation record joins those actions. | Define charge timing, failure compensation, and retry behavior. Do not promise exactly-once effects from providers that lack idempotent operations; ambiguous outcomes require reconciliation. |
| Inactivity purge is based on filesystem timestamps | `Cleanup.run` deletes old non-directory entries using last-modified time and ignores the deletion result. It is started asynchronously during enablement. | Use domain timestamps, explicit eligible records, an import/maintenance barrier, preview counts, and recoverable deletion. Avoid making an ordinary startup a destructive maintenance operation. |
| Entry points use inconsistent owner/permission representations | `SignCommand` checks `playervaults.signs.set`, while the descriptor gates the command with `playervaults.sign.set`. Fixed-owner signs retain names, while command paths normally resolve UUIDs. | Keep permission definitions centralized and account identity canonical across commands, signs, APIs, and storage. |
| Thread ownership and shutdown depend on classic Bukkit behavior | Lifecycle/listener code uses global mutable viewer maps and traditional Bukkit scheduling; the descriptor has no Folia support declaration. | Use VolmLib scheduling with explicit entity ownership and a separate persistence executor. Never share mutable Bukkit inventories across Folia regions without a proven ownership design. |

## Import and operational boundaries

`ConvertCommand` registers twelve converter implementations, including Backpack, Cosmic variants, EnderVaults, AxVaults variants, UniVaults, XVaults, FairyVaults, Malts, PlayerVaultZ, and DarumbaVaults. Registration is evidence of intended import paths only. Their complete correctness and compatibility were outside this review.

Its background conversion sets a global lock after a delay and clears it after the converter loop, without a `finally` release in that entry point. Coffer should use a single import job with explicit state, guaranteed cleanup, stopped or drained editing sessions, and an immutable source snapshot. Require a dry run, collision policy, item/slot counts, per-record failures, repeat-run behavior, and a completion manifest. Preserve source files unchanged and avoid importing during ordinary startup.

The separate automatic migration in `Conversion.convert` creates its destination directory before conversion and uses that directory's existence to skip later migration attempts. Directory creation therefore does not prove a completed migration. A Coffer importer should publish completion only after validating and committing its manifest.

The reference has diagnostics that can upload configuration, environment/plugin information, and collected exceptions to a paste service. Its main class also contains update-check HTTP requests and metrics. Coffer's existing local diagnostic report is the appropriate starting point. Any future upload should make its destination and contents reviewable, redact sensitive fields, and require an explicit upload action. Networking needs timeouts and lifecycle cancellation; it must not control vault durability.

## Next implementation slices

1. **Durable local repository:** versioned records, validated lengths, atomic writes, recovery generations, explicit load/save results, revision checks, deletion tombstones, and bounded queues.
2. **Inventory sessions:** owner-bound session identity, one writer initially, immutable persistence snapshots captured on the owning context, complete movement-policy coverage, and lossless resize behavior. Define the joint recovery contract for player inventory and vault state before claiming crash-safe transfers.
3. **Usability and administration:** numbered aliases, clear busy/recovery messages, owner lookup, separate inspection/edit rights, and configuration tools. Add signs only after these access paths are consistent.
4. **Optional services:** economy, imports, purging, placeholders, and cluster ownership each need their own failure and recovery specification.

The foundation supplies typed configuration, immutable access rules, localization, and shared scheduling infrastructure. The audit requirements inform the [local repository](/coffer/06-local-storage), [item encoding and detached sessions](/coffer/07-items-sessions), and [live transfer/recovery APIs](/coffer/08-live-transfers). Version 0.7.0 includes owner vault commands, a transaction-backed menu, reviewed operator recovery, and [coordinated stopped-server backup and restore](/coffer/09-backup-restore); current validation is recorded in the [feature map](/coffer/04-feature-map).

## Acceptance cases to carry forward

- Save and shut down while an administrator views another owner's vault; the owner and vault ID must remain unchanged.
- Open two sessions, then close, disconnect, revoke access, or delete in different orders; stale state must never overwrite a newer revision or resurrect a deletion.
- Reduce capacity with occupied excess slots; every original item must remain recoverable.
- Load truncated, oversized, malformed, and unsupported records; preserve originals and prohibit an empty save over corruption.
- Interrupt writes before and after publication; recover a complete committed generation and report uncertain outcomes accurately.
- Exercise every inventory movement route, with metadata-rich items and nested containers; blocked contents must not enter through an alternate gesture.
- Cancel opening after preparation, fail an economy operation, and retry a deletion; no untracked charge/refund may be presented as a completed transaction.
- Restart during import and cleanup; retain source data, release maintenance state safely, and make completed versus pending records observable.

These are future checks. None was run against PlayerVaultsX in this static audit.
