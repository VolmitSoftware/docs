---
title: Coffer commands and permissions
description: Vault, administration, diagnostic, and recovery commands with their permissions
published: true
date: 2026-10-24T00:00:00.000Z
tags: coffer, commands, permissions
editor: markdown
dateCreated: 2026-10-17T00:00:00.000Z
---

This page lists Coffer's commands and permissions. Players create, list, open, share, and delete their own vaults; administrators inspect, edit, and delete other players' vaults; operators resolve pending transfers. Deposits and withdrawals use the vault menu and the [transfer API](/coffer/08-live-transfers).

`/coffer` (alias `/cf`) shows the Director help menu, filtered to the commands the sender may use. An unknown subcommand shows the same help, and long help pages have page buttons in their footer.

## Player commands

| Command | What it does | Run from |
| --- | --- | --- |
| `/coffer create` | Create an empty vault using the current `[vault]` defaults, within `vault.maximumVaults` | player |
| `/coffer list` | List your vault numbers, UUIDs, and row counts | player |
| `/coffer open <number\|UUID>` | Open one of your vaults by number, or any vault you own or that is shared with you by UUID | player |
| `/coffer open <owner>:<number>` | Open another player's vault, by its number in that owner's list, when it is shared with you | player |
| `/coffer shared` | List vaults shared with you as `owner:number`, UUID, and access level | player |
| `/coffer share <number\|UUID> <player> [view\|deposit\|withdraw\|full]` | Let a player use one of your vaults; defaults to `full`. Sharing again replaces that player's access level | player |
| `/coffer unshare <number\|UUID> <player>` | Remove a player's access to one of your vaults | player |
| `/coffer shares <number\|UUID>` | List the players who can use one of your vaults and their access levels | player |
| `/coffer delete <number\|UUID>` | Delete one of your vaults; only empty vaults can be deleted | player |
| `/pv [number\|UUID\|owner:number]` | Without an argument, list your vaults; with one, open a vault like `/coffer open` | player |
{.dense}

While `general.enabled` is `false`, these commands answer `Coffer vaults are disabled on this server.` Join recovery, operator recovery, and administrator commands keep working.

## Administration and diagnostics

| Command | What it does | Run from |
| --- | --- | --- |
| `/coffer admin list <player>` | List another player's vaults with their numbers and UUIDs | player, console |
| `/coffer admin open <player> <number\|UUID>` | Open another player's vault; edit mode with `coffer.vault.admin.edit`, otherwise view-only | player |
| `/coffer admin delete <player> <number\|UUID>` | Delete another player's empty vault | player, console |
| `/coffer status` | Show version, compatibility, storage, vault counts, service states, and active transfers | player, console |
| `/coffer config` | Open the in-game configuration editor | player |
| `/coffer language` | Open the language menu; `self <locale\|reset>`, `server <locale>`, and `server edit [locale]` act directly | player, console |
| `/coffer debug version` | Print `Coffer v<version>`; `/coffer version` is a hidden shortcut | player, console |
| `/coffer debug dump [upload]` | Write a diagnostic report; also uploads it to mclo.gs unless `upload=false` or `debug.uploadEnabled` is `false` | player, console |
| `/volmit plugins [languages\|debug\|updates]` | Shared command registered by VolmLib; Coffer contributes its language, debug, and update entries | player, console |
{.dense}

There is no reload command. `config.toml` and language files reload from disk when they change; see [configuration and languages](/coffer/03-configuration-languages). The language menu, locale picker, and message editor are described on the shared [languages](/languages) page. Report contents are listed under diagnostics in [installation and compatibility](/coffer/01-installation-compatibility).

## Permissions

`Everyone` means the node defaults to `true`; `Operators` means it defaults to `op`.

| Permission | Default | Allows |
| --- | --- | --- |
| `coffer.command` | Everyone | Help, `status`, `version`, and `debug version` |
| `coffer.config` | Operators | `/coffer config`, server-scope language changes, and hot reload notices |
| `coffer.language.self` | Everyone | Choosing a personal language |
| `coffer.debug` | Operators | `/coffer debug dump` |
| `coffer.update` | Operators | Coffer's entry in the join update notice and `/volmit plugins updates` |
| `coffer.create` | Everyone | `/coffer create` |
| `coffer.list` | Everyone | `/coffer list` and `/pv` without an argument |
| `coffer.open` | Everyone | `/coffer open`, `/coffer shared`, and `/pv <vault>` |
| `coffer.share` | Everyone | `/coffer share`, `unshare`, and `shares` |
| `coffer.delete` | Everyone | `/coffer delete` |
| `coffer.vault.standard` | Everyone | Opening and using vaults saved with the default `vault.requiredPermission` |
| `coffer.vault.admin.view` | Operators | `/coffer admin list` and view-only `admin open` |
| `coffer.vault.admin.edit` | Operators | `/coffer admin list` and `admin open` in edit mode |
| `coffer.vault.admin.delete` | Operators | `/coffer admin delete` |
| `coffer.recovery.inspect` | Operators | `/coffer recovery list`, `inspect`, and `audit` |
| `coffer.recovery.resolve` | Operators | `/coffer recovery hold`, `review`, `complete`, and `cancel` |
| `coffer.*` | Operators | Every node above |

Personal language changes also need the shared `volmit.language.self` node, which defaults to everyone. The shared `volmit.language.admin` node also allows server-scope language changes.

`coffer.vault.admin.edit` opens other players' vaults in edit mode and also authorizes explicitly requested administrator mode in the internal Bukkit session API; it does not enable bypass for ordinary session calls. The saved vault type permission is enforced by the Bukkit session API; it does not grant access to administration commands. See [items and edit sessions](/coffer/07-items-sessions) for access and thread requirements.

## Vault selection

Player vault commands require a player and act only on the caller's own vaults or vaults shared with them, even for operators; use `/coffer admin` for other players' vaults. Renaming vaults is not included.

`/pv` is registered as its own command. If another plugin also registers `/pv`, the server chooses one; use `/coffer:pv` or `/coffer open` to reach Coffer's.

Player arguments accept a player who is online or has joined this server before; Coffer looks names up in the server's user cache and never queries an external service. A UUID typed where a player name is expected is not accepted.

Vault numbers are positive positions in the owner's list, sorted by creation time and then UUID. Use the full UUID for a stable identity. A missing or invalid selector never creates a vault. Creation checks the owner count and publishes the new record in one storage operation, so simultaneous requests cannot exceed the limit. Closing a command response or disconnecting does not undo a creation already accepted by storage.

## Sharing

Sharing grants another player access to one vault. The access levels are `view` (open only), `deposit` (open and deposit), `withdraw` (open and withdraw), and `full` (open, deposit, and withdraw). Shared players cannot share, unshare, or delete the vault, and the owner cannot share a vault with themselves. Each vault type limits how many players a vault can be shared with: `vault.sharedUserLimit` in the [configuration](/coffer/03-configuration-languages), saved with each vault when it is created. Sharing again with the same player replaces their access level without counting against the limit.

Shared players use the same vault menu and transaction-backed transfers as the owner. A click in a direction their access level does not allow is refused with a message and moves nothing. The vault type permission saved with the vault applies to shared players as well.

Sharing, unsharing, and deletion reserve the vault while they run. If the vault is in use by a transfer or another reservation at that moment, the command reports that the vault is busy and changes nothing; try again. After a change, Coffer reloads every open menu showing that vault: a player who lost access, or whose vault was deleted, sees their menu close with a message. A completed transfer also reloads other open menus of the same vault, so the owner and shared players see each other's moves.

## Administration

`/coffer admin open` with `coffer.vault.admin.edit` opens another player's vault in edit mode: transfers run as explicit administrator transfers and ignore that vault's share grants, lock, and type permission. With only `coffer.vault.admin.view`, the menu is view-only and every click is refused with a message. `/coffer admin delete` follows the same rule as `/coffer delete`: the vault must be empty.

## Vault menu

The menu displays the saved vault items in its configured rows; shared and administrator menus use the same layout. Their names, lore, metadata, and quantities are preserved. Instructions appear in chat when it opens; the title includes the first eight characters of the vault UUID.

| Gesture | Effect |
| --- | --- |
| Left-click an item in your storage/hotbar | Deposit its whole stack |
| Right-click an item in your storage/hotbar | Deposit one item |
| Left-click a vault item | Withdraw its whole stack |
| Right-click a vault item | Withdraw one item |
| Escape | Close the menu |

Transfers prefer a matching destination stack with sufficient space, then an empty slot. The full requested quantity must fit one destination slot; a stack is not split across several destinations. Armor, offhand, body, and saddle slots are preserved but cannot be selected. Shift-click, drag, double-click, number keys, offhand swaps, item dropping, and outside clicks do not move menu items.

Open the menu while alive and persistent in survival or adventure mode, with an empty cursor and personal crafting grid and no other container open. Every click cancels vanilla item movement and submits a journaled move on the player's next owning tick. Keep the cursor empty. While a move or refresh is pending, further clicks are ignored and normal item-changing gameplay is guarded.

Vaults cannot be opened or used while the player is falling or for 5 seconds after they take damage. Damage that another plugin has not cancelled closes an open vault menu. During a pending move the transfer guard cancels the damage itself, but the hit still closes the menu and starts the cooldown, and the accepted move finishes. Clicks made while falling or during that cooldown are ignored.

A click checks the displayed vault revision before preparing a journal. If another operation changed it, no items move and the menu reloads current contents. Permission checks run again before admission and inside the transfer service. Escape before next-tick admission cancels the queued gesture without moving items. An already accepted move can finish after Escape or disconnect; a late callback never reopens a closed menu. Reopen the vault to inspect the completed state before trying again after an uncertain outcome.

A configuration change does not reopen storage, interrupt transfers, or apply the current default type to persisted records. Ordinary live transfers require open access and the requested direction's deposit or withdrawal grant; explicit administrator mode, used by `/coffer admin open` in edit mode and available through the internal API, requires `coffer.vault.admin.edit`.

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

The player must be alive, persistent, in survival or adventure mode, with an empty cursor and personal crafting grid. Review and completion run on the player's owning thread. Current item counts and metadata, receipt, connection, and stored evidence are rechecked; changed evidence invalidates confirmation. Equivalent item serialization order does not count as an inventory change. The acting operator's permission and connection are checked again before approval is submitted. Only one operation can act on a hold at a time. An in-progress operation cannot be cancelled through the hold command.

Completion requires a readable pending journal, a vault matching its exact before or after state, a valid permanent transfer fence, and the expected previous or current durable receipt. Independently changed, missing, deleted, corrupt, or unsupported vaults remain blocked. Malformed player receipts, mismatches with no pending journal, and corrupt journals are not repaired by these commands. They require a consistent backup or a separate reviewed offline repair.

An accepted decision is immutable. It retains the original journal, vault/receipt/fence evidence, observed player items and receipt, native player snapshot, operator identity, reason, and approval time under `storage/resolution`. Disconnecting or cancelling does not revoke it. A retry uses that original decision and attribution; it cannot substitute a new reason or silently accept another conflicting inventory. See [restart behavior and archive limits](/coffer/08-live-transfers).

## Offline backup commands

The plugin jar includes `java -jar Coffer.jar backup create`, `verify`, and `restore` in the operating-system terminal. These are offline filesystem operations, with access controlled by the operating-system account; they are not Bukkit commands and have no player permission nodes. The [backup guide](/coffer/09-backup-restore) gives the required paths, manifest confirmation, stopped-server constraints, and fresh-directory restore workflow.

## Related pages

- [Installation and compatibility](/coffer/01-installation-compatibility)
- [Configuration and languages](/coffer/03-configuration-languages)
- [Live transfers and recovery](/coffer/08-live-transfers)
- [Coordinated backup and restore](/coffer/09-backup-restore)
- [Languages](/languages)
{.links-list}
