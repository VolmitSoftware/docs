---
title: Coffer commands and permissions
description: Player vault commands, transaction-backed menus, and administration permissions
published: true
date: 2026-10-19T00:00:00.000Z
tags: coffer, commands, permissions
editor: markdown
dateCreated: 2026-10-17T00:00:00.000Z
---

Use `/coffer` for permission-filtered Director help. Personal vault commands create, list, and open player vaults; version 0.6.0 adds operator recovery commands. Deposits and withdrawals use the vault menu and the [transfer API](/coffer/08-live-transfers).

| Command | Behavior | Permission |
| --- | --- | --- |
| `/coffer create` | Create an empty personal vault using current defaults, within the configured owner limit | `coffer.create` and the default type permission |
| `/coffer list` | List your vault numbers, UUIDs, and row counts | `coffer.list` |
| `/coffer open <number or UUID>` | Open one of your own vaults | `coffer.open` and its saved type permission |
| `/coffer version` | Show installed version | Everyone |
| `/coffer status` | Show version, configured type count, and server locale | `coffer.status` |
| `/coffer config` | Display the active default vault settings | `coffer.config` |
| `/coffer reload` | Reload and validate settings and the selected language; retain active state on failure | `coffer.reload` |
| `/coffer language self <locale>` | Persist a player's language selection | `coffer.language.self` and `volmit.language.self` |
| `/coffer language self reset` | Return to the server language | Same self permissions |
| `/coffer language server <locale>` | Persist the default locale | `coffer.language.server` or `volmit.language.admin` |
| `/coffer language server edit` | Open the shared language editor for a player | Same server permission |
| `/coffer debug` | Save a local diagnostic report, including storage lifecycle, queued operations, sessions, and guarded transfers/recoveries; no upload | `coffer.debug` |

`coffer.admin` defaults to operators and grants the status, config, reload, debug, server language, `coffer.vault.admin.edit`, `coffer.recovery.inspect`, and `coffer.recovery.resolve` permissions. Individual administration permissions also default to operators. The edit permission authorizes explicitly requested administrator mode in the internal Bukkit session API; it adds no command and does not automatically enable bypass for ordinary session calls. Self-language permissions default to true. The shared language system additionally exposes suite language commands under `/volmit` and enforces its own scope permissions.

The configuration command currently displays values. A dedicated configuration GUI is planned. The saved vault type permission is enforced by the Bukkit session API; it does not grant access to administration commands. See [items and edit sessions](/coffer/07-items-sessions) for access and thread requirements.

`coffer.create`, `coffer.list`, `coffer.open`, and the default `coffer.vault.standard` permission default to true. The three vault commands require a player; the console can use the administration commands. These player commands operate only on the caller's own vaults, even for operators. Shared-vault commands, administrator browsing, renaming, and deletion are not included.

Vault numbers are positive positions in the owner's list, sorted by creation time and then UUID. Use the full UUID for a stable identity. A missing or invalid selector never creates a vault. Creation checks the owner count and publishes the new record in one storage operation, so simultaneous requests cannot exceed the limit. Closing a command response or disconnecting does not undo a creation already accepted by storage.

## Vault menu

The menu displays the saved vault items in its configured rows. Their names, lore, metadata, and quantities are preserved. Instructions appear in chat when it opens; the title includes the first eight characters of the vault UUID.

| Gesture | Effect |
| --- | --- |
| Left-click an item in your storage/hotbar | Deposit its whole stack |
| Right-click an item in your storage/hotbar | Deposit one item |
| Left-click a vault item | Withdraw its whole stack |
| Right-click a vault item | Withdraw one item |
| Escape | Close the menu |

Transfers prefer a matching destination stack with sufficient space, then an empty slot. The full requested quantity must fit one destination slot; a stack is not split across several destinations. Armor, offhand, body, and saddle slots are preserved but cannot be selected. Shift-click, drag, double-click, number keys, offhand swaps, item dropping, and outside clicks do not move menu items.

Open the menu while alive and persistent in survival or adventure mode, with an empty cursor and personal crafting grid and no other container open. Every click cancels vanilla item movement and submits a journaled move on the player's next owning tick. Keep the cursor empty. While a move or refresh is pending, further clicks are ignored and normal item-changing gameplay is guarded.

A click checks the displayed vault revision before preparing a journal. If another operation changed it, no items move and the menu reloads current contents. Permission checks run again before admission and inside the transfer service. Escape before next-tick admission cancels the queued gesture without moving items. An already accepted move can finish after Escape or disconnect; a late callback never reopens a closed menu. Reopen the vault to inspect the completed state before trying again after an uncertain outcome.

`/coffer reload` does not reopen storage, interrupt transfers, or apply the current default type to persisted records. Ordinary live transfers require open access and the requested direction's deposit or withdrawal grant; explicit administrator mode remains available only through the internal API and requires `coffer.vault.admin.edit`.

## Operator recovery

Recovery commands work from the console or a permitted player. UUID arguments must be complete. Inspection permission grants no authority to hold a player or accept a recovery decision.

| Command | Behavior | Permission |
| --- | --- | --- |
| `/coffer recovery list [page]` | List pending transaction, player, and vault UUIDs, ten entries per page | `coffer.recovery.inspect` |
| `/coffer recovery inspect <transaction UUID>` | Show the journal revision, current vault/receipt classification, eligibility, and evidence fingerprint | `coffer.recovery.inspect` |
| `/coffer recovery audit <transaction UUID>` | Read the retained decision's actor, reason, time, and approved evidence fingerprint, including after completion | `coffer.recovery.inspect` |
| `/coffer recovery hold <player UUID>` | Arm a pending transfer's offline player for a guarded join | `coffer.recovery.resolve` |
| `/coffer recovery review <player UUID>` | Review the held player's slot changes and receipt replacement; issue a five-minute confirmation token | `coffer.recovery.resolve` |
| `/coffer recovery complete <player UUID> <token> <reason>` | Archive the reviewed original state, then complete the journal's recorded outcome | `coffer.recovery.resolve` |
| `/coffer recovery cancel <player UUID>` | Remove an unused hold or disconnect a held player; retain transaction evidence and accepted decisions | `coffer.recovery.resolve` |

1. Inspect the pending transaction and establish why the player state conflicts. Stop conflicting integrations before proceeding.
2. While the affected player is offline, arm their recovery hold. Have them join; Coffer pauses their gameplay. Use the console or a different permitted player for subsequent commands.
3. Review the held player. Each changed slot shows its material, count, and item-data hash; the receipt change is shown separately. The token belongs to that player connection and expires after five minutes. A new review replaces the previous token.
4. Complete only when the journal's recorded result is the intended outcome. Supply a non-empty reason of at most 512 characters; spaces are allowed. The decision replaces all 43 player inventory slots with the journal's after-image and sets its receipt. This can remove or recreate items relative to the conflicting current inventory, so it is an explicit restoration choice, not proof that an external change conserved items.
5. Check the completion response and audit record. The ordinary transfer protocol publishes the player checkpoint, commits or recognizes the exact vault revision, writes the completed receipt, and removes the active journal before releasing gameplay.

The player must be alive, persistent, in survival or adventure mode, with an empty cursor and personal crafting grid. Review and completion use the player's owning Paper/Folia thread. Current item counts and metadata, receipt, connection, and stored evidence are rechecked; changed evidence invalidates confirmation. Equivalent item serialization order does not count as an inventory change. The acting operator's permission and connection are checked again before approval is submitted. Only one operation can act on a hold at a time. An in-progress operation cannot be cancelled through the hold command.

Completion requires a readable pending journal, a vault matching its exact before or after state, a valid permanent transfer fence, and the expected previous or current durable receipt. Independently changed, missing, deleted, corrupt, or unsupported vaults remain blocked. Malformed player receipts, mismatches with no pending journal, and corrupt journals are not repaired by these commands. They require a consistent backup or a separate reviewed offline repair.

An accepted decision is immutable. It retains the original journal, vault/receipt/fence evidence, observed player items and receipt, native player snapshot, operator identity, reason, and approval time under `storage/resolution`. Disconnecting or cancelling does not revoke it. A retry uses that original decision and attribution; it cannot substitute a new reason or silently accept another conflicting inventory. See [restart behavior and archive limits](/coffer/08-live-transfers).

## Offline backup commands

Version 0.7.0 includes `java -jar Coffer.jar backup create`, `verify`, and `restore` in the operating-system terminal. These are offline filesystem operations, with access controlled by the operating-system account; they are not Bukkit commands and have no player permission nodes. The [backup guide](/coffer/09-backup-restore) gives the required paths, manifest confirmation, stopped-server constraints, and fresh-directory restore workflow.
