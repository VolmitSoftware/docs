---
title: SkyPrime - Operations and recovery
description: Persistence, interrupted jobs and diagnostics
published: true
date: 2026-10-21T00:00:00.000Z
tags: skyprime, operations, recovery
editor: markdown
dateCreated: 2026-09-05T04:30:00.000Z
---

SkyPrime persists island identity, membership and progression in one versioned aggregate. Creation, reset and deletion also carry durable world-job descriptors. Console failures include their stack traces and operational context.

## Event timer storage

`storage/events.json` stores manual server/island timers and their fixed expiry times. Back it up with the data folder. Atomic asynchronous writes complete before activation is confirmed; malformed current storage prevents startup, and a write failure suspends event bonuses and mutations. Timers expire while offline, and schedule windows come from current TOML without loading island worlds. See [Events and boosters](/skyprime/09-events-boosters#storage-and-limits).

## Runtime library cache

Required VolmLib classes remain bundled in the plugin jar, minimized and relocated. SlimJar loads Gson, TOML and Adventure before SkyPrime enables, downloading missing libraries into `plugins/SkyPrime/.libs/`. Startup stops with a console error when a required library cannot be downloaded.

Packed distributions also extract their embedded plugin runtime into `plugins/SkyPrime/cache/runtime/<sha256>.jar`. This directory is separate from downloaded libraries and island storage.

Preserve `.libs/` for offline restarts or server moves. Removing it requires downloading those libraries again, and a plugin version that needs a library missing from the cache downloads it on startup. Include the cache when preparing an offline installation. It contains runtime libraries; island recovery still requires matching metadata and terrain backups.

## Storage and backups

`storage/islands.json` is the authoritative island aggregate, using schema version 9. Writes replace the file atomically; `storage/islands.json.backup` retains the previous committed aggregate. Success replies for persisted player changes wait for the corresponding snapshot to become durable; invitations, ownership offers and temporary guest access remain in memory. Owner creation/reset history survives island deletion. Permanent guests, mission periods/completions, upgrade levels, purchased dimension unlocks, highest recorded levels, milestone claim IDs, research completion IDs with frozen exclusive groups and timestamps, and the bounded credit ledger are part of the aggregate. Mission progress stores named objective counters with their type and target signatures, the schedule identity, current window and lifetime completions.

Loading validates the current schema, numeric ranges, UUIDs, unique membership and island identities. Corrupt current data stops initialization instead of silently loading a backup. An I/O failure stops subsequent domain mutations and is visible in `/sky debug status`.

> Stop the server before restoring a backup, and restore the plugin data and the managed world terrain from the same point in time. Do not edit membership indexes by hand; they are rebuilt from the island store at startup.
{.is-warning}

Island time and weather preferences live in `storage/environment.json`, keyed by permanent island UUID. New islands use natural day and weather cycles until a teammate with `ENVIRONMENT` chooses a fixed mode. Preference writes use a serialized worker with coalescing and atomic replacement; command success waits for durable storage. Invalid current preference data stops startup, and a write failure suspends preference changes and further environment application; already applied world conditions remain in place. Include this file in backups; edit it only while the server is stopped. Configuration reload does not reload persisted preferences.

Island difficulty uses `storage/difficulty.json` with the same atomic, coalesced write and failure behavior. It stores selected modes by permanent island UUID; islands without an override follow the primary overworld's difficulty. Include both preference files in backups. Difficulty survives terrain reset, world unloading and restart. Automatic configuration reload retains the active persisted preferences.

## Flight recovery

Island flight writes a `skyprime:island_flight_owned` byte marker in the player's persistent data before granting flight access. Normal revocation removes it. On reconnect or hot enable, a stale marker causes SkyPrime to revoke its marked survival/adventure allowance and clear the marker; creative/spectator flight is preserved. The marker is provenance for cleanup, not a saved flight opt-in. Flight controllers share the server's Boolean allowance, so SkyPrime cannot detect a second plugin granting the same already-enabled flag. See [Island flight](/skyprime/03-islands-progression#island-flight) before combining flight systems.

## Booster wallet recovery

`storage/islands.json` version 9 saves token balances, purchase/redemption timers and cooldown deadlines with the island bank. A purchase debit and activation are one atomic island update; successful command feedback waits for the save. `storage/events.json` retains administrative timers separately. Back up both files together. Reset and ownership transfer retain the wallet; deleting an island ends its sponsored global and local timers. Stop commands do not refund credits/tokens or reset cooldowns. Resolve storage failures before restarting; do not retry a reported uncertain transaction without inspecting its saved bank, ledger and timer state.

## Mission reward recovery

`storage/rewards.json` version 2 stores personal mission and milestone reward receipts, including the source type/ID and each item specification. The pending-state journal coordinates this file with island claims and credits, so include it with the complete storage directory in backups. Receipt creation snapshots the item, XP and console-command bundle; subsequent definition edits do not change it. Collection persists `DELIVERING` before effects run, saves player data after successful effects, then removes the receipt. Startup converts an interrupted `DELIVERING` receipt to `REVIEW`.

Collection requires an online, living player outside starter preview with `skyprime.use`; no current island membership is required. Debug reports include `Active reward collections` to show in-flight delivery count.

Ordinary capacity or offline failures before effects return the receipt to `QUEUED`. Failures after effects begin require review and log the full failure with receipt/player IDs. Inventory changes, XP and third-party command effects cannot be committed atomically with plugin files: inspect player state, logs and any external provider records before choosing an outcome. `/sky admin rewardresolve <receipt UUID> delivered` removes an already-delivered receipt without applying effects. `retry` returns the whole bundle to the queue for the player to collect explicitly; it does not undo or skip partial effects, so reconcile any partial delivery first. Only `REVIEW` receipts can be resolved, and changed revisions reject stale resolutions. Keep the server stopped for manual file restoration.

## Island world storage

`island-worlds/<UUID>.json` retains the selected starter and records generated dimensions. Optional dimensions use that retained definition when first generated, so later catalog edits do not change an existing island's starter. Island world files use `<worlds.directory>/<UUID>/<normal|nether|end>` beneath Spigot's world container, or beneath Paper's `<level directory>/dimensions/minecraft/`. Back up the manifests and world files with the island aggregate. A manifest that records a generated dimension whose files are missing causes loading to fail instead of silently replacing that terrain.

Idle unloading saves world files and retains the island record and starter manifest. Travel and value scans acquire operation leases while loading or reading worlds. Worlds with players, active operations, pending loads, plugin chunk tickets or force-loaded chunks are not eligible for idle unloading.

Players who disconnect inside an island have their destination saved in `storage/island-returns.json`. Reconnecting loads that island and restores a safe, permitted destination without a command warmup. Logging out in another world clears that saved return; unrelated lobby logins remain in the lobby. Missing islands, lost access or unsafe destinations use the fallback world. The server also captures online destinations during shutdown. Invalid return storage disables reconnect restoration with a console error; include this file in backups.

## Interrupted world jobs

An island is `CREATING`, `ACTIVE` or `DELETING`. `world-jobs/<UUID>.json` records the operation and its starter before any block changes, and a custom starter's full content is copied in, so editing the template afterwards cannot change a job already running. Saved jobs retry on startup, and nobody can enter the island while it rebuilds.

Use `/sky admin inspect <UUID>` to inspect persisted state. `/sky admin resume <UUID> starter=normal` clears an interrupted creation reservation and rebuilds it with the explicitly selected starter, which defaults to `normal`. Unlike automatic startup recovery, this command does not select the starter from the saved job. If cleanup is required, `/sky admin delete <UUID> <UUID>` deletes that reservation after the repeated-UUID confirmation. An active world job cannot be superseded by a competing reset or deletion.

Generation applies blocks through scheduled chunk tasks. Reset and deletion evacuate players, unload the owned worlds and remove their files before regeneration or final deletion. At most two world jobs run concurrently; `runtime.blocksPerTick` applies to each job. One value reconciliation runs at a time. `/sky debug status` lists active job counts and failed job details.

Stopping the server waits up to 10 seconds for queued world work. A world job interrupted by shutdown logs one warning and keeps its reservation; its saved job retries on the next startup. Value scans and world loads cancelled by shutdown are not reported as failures.

## Diagnostics

Before downloading libraries, SkyPrime checks the server version and Java runtime and refuses to load outside Minecraft 26.1 through 26.3 or below Java 25, naming both values in the console. Library loading completes before services enable.

When startup finishes, the console prints the cyan and white splash with the version, server, supported Minecraft range, Java version and date, followed by one ready line with the startup time and island count. `presentation.splashScreen` turns the splash off, and `presentation.alternateSplashes = false` keeps the standard design. A failed startup always prints the standard splash, followed by the failure and its stack trace.

`/sky status` summarizes the configuration toggles, island and world counts, compatibility, PlaceholderAPI and Vault state, and storage health. It requires `skyprime.command`. `/sky debug version` shows the installed version, and `/sky version` is its hidden shortcut; both require `skyprime.command`. `/sky debug status` and `/sky debug dump` require `skyprime.debug`.

`/sky debug dump` creates a local shared-format report containing server and plugin diagnostics, SkyPrime's service states, island counts, persistence health, managed worlds, scheduling information and the effective configuration. Upload requires both `debug.uploadEnabled = true` and an explicit `upload=true` request. Local reporting works without upload access.

BileTools can hot-reload SkyPrime while no island world job is running; SkyPrime refuses the reload while a creation, reset or deletion is in progress.

## Custom role storage

`storage/roles.json` uses version 1 and stores island role definitions and member assignments. The island aggregate uses schema 9. Include roles with paired island backups. Changes that affect both roles and island metadata use the canonical `storage/island-state.pending.json` version 2 transaction journal containing island, role, transfer, reward and activity snapshots; retain it if present after interrupted writes. Startup replays a validated pending transaction before loading canonical state; an invalid journal fails closed. A supported audited change saves its history in the same transaction; independent changes that touch only one stored participant remain atomic single-file writes. Reset retains definitions and assignments. Ownership transfer clears the recipient’s custom assignment; leaving, removal, bans and core promotion clear the affected assignment with the membership change. Do not independently restore only one side of role assignments and membership.

## Biome storage

`storage/biomes.json` uses version 1 and maps island UUIDs to dimension names and namespaced biome keys. The island repository owns the store; the island aggregate uses schema 9. Include this file in paired island backups. Reset and ownership transfer retain selections; deletion removes them. Loaded chunks are repainted in bounded batches and unloaded chunks when next loaded. A saved selection is durable before painting completes. Reselect a biome to retry a failed application; original generated biomes are not retained for restoration.

## Visitor policy storage

`storage/visitor-policy.json` uses schema 1 and stores entry modes, capacity and UUID-to-display-name allowlists by island UUID. Missing settings use `DEFAULT`, unlimited capacity and an empty allowlist. The island repository owns this separate store; `storage/islands.json` uses schema 9. Include visitor policies with island backups. Reset and ownership transfer preserve the policy, while deletion removes it. Policy storage failure prevents protected access and mutations.

## Starter preview recovery

Preview worlds use `<worlds.directory>/previews/<session UUID>/<dimension>` under the current server world layout. They are separate from live island ownership indexes and retain owned-world journals under `plugins/SkyPrime/preview-worlds/`. Session cleanup unloads and removes preview terrain; chunk tickets remain until safe unloading so unsaved terrain cannot disappear during a session. Startup processes retained journals after an interruption.

A player persistent-data marker, `skyprime:starter_preview`, records the return location, game mode and flight state before entry. Inventory and experience remain with the player; recovery does not replay a copied inventory. Leaving, timeout, permission loss, quitting and shutdown attempt restoration. Reconnect recovery uses a saved marker when a previous session was interrupted. Returns to island locations recheck current access and island state; an unsafe island destination uses the configured safe fallback. Normal leave and reconnect recovery can load the saved island for safe return. Quit or shutdown may use the fallback when the original island world is unloaded. If safe restoration cannot complete, the marker remains and the player is disconnected with a recovery message so an administrator can investigate the logged failure.


## Bank transfer recovery

`storage/bank-transfers.json` stores unresolved transfers in canonical version 1. A durable preparation record precedes the provider call. The shared `storage/island-state.pending.json` transaction journal coordinates island, role, transfer, reward and activity snapshots. Successful completion updates the island bank and removes the transfer together. Definite rejection leaves the bank unchanged.

An exception or ambiguous provider outcome retains the reservation and blocks conflicting bank operations, terrain reset, deletion and ownership transfer. SkyPrime does not retry the provider call or issue an automatic refund. Restart retains unresolved transfers without replaying them.

Use `/sky admin bank pending` to identify the transfer, check the external provider's records, then run `/sky admin bank resolve <UUID> <applied|not_applied> <same UUID>`. Resolution records the verified outcome and never calls the provider. Back up transfer storage together with island metadata.

## Resource recounts

`/sky admin recountlimits <island UUID>` rebuilds the capped block/entity counts using bounded world work. The command requires `skyprime.admin` and enabled resource limits. Keep the island available while recounting and inspect the console if the operation reports failure. Recount after third-party block writes that do not emit the tracked gameplay events. Existing over-cap content is not deleted.

Recounts combine currently loaded chunks with saved region allocation headers. Terrain discovery covers allocated chunks intersecting the claim; entity-region discovery covers the owned world. Only generated, globally enabled island dimensions participate, protected by the existing accounting world lease. The recount does not generate empty claim chunks merely to count them. Native storage-layout checks select the dimension locations used by the current Spigot or Paper server.

At most 128 islands can wait for a count, and one island is counted at a time. A count has a 20-minute deadline, a total discovery bound of 1,000,000 chunks and a 100,000-entry bound per region directory. Counting waits while the island is being created, reset or deleted. Exceeding a bound or encountering a census failure blocks capped additions until a count succeeds. A failed count retries after 30 seconds, doubling the delay up to 15 minutes; `/sky admin recountlimits` retries immediately. The first failure logs its full stack trace and later attempts log one line each.

Debug output reports whether limits are enabled, the queue size, tracked islands, islands waiting to retry and active scanning state.

## Contract delivery recovery

Island schema 9 stores frozen boards, completed offer IDs and one pending input receipt per island. Input reservation and any `HELD` personal reward parcel save together through `island-state.pending.json`; retain all storage files in a paired backup. A held parcel cannot be collected or resolved through the ordinary reward-recovery command.

Before items are removed, SkyPrime durably reserves delivery. It then saves the player inventory before committing credits, completion and a queued reward. Player data and plugin storage are separate transactions, so interrupted or uncertain removal becomes `REVIEW`. Use `/is contract pending`, investigate the player inventory and records, then `/is contract resolve <UUID> consumed` only when the input was consumed, or `cancel` when it was not. Cancellation releases the reservation without restoring items. Neither choice consumes inventory again.

Pending receipts block bank changes, further deliveries and destructive/team lifecycle changes until resolved; board expiry does not discard them. Disabling contracts blocks new deliveries but leaves operator recovery available. See [Island contracts](/skyprime/10-contracts).

## Favorites and ratings storage

`storage/social.json` version 1 stores favorites, star ratings, withdrawn-rating cooldown records and per-player UTC daily counters. Include it in stopped-server backups. Social changes are saved atomically and become visible only after the save succeeds. Invalid current bytes prevent initialization; save failures are logged with their cause and suspend social reads and mutations. Correct the storage fault before restarting.

Reset and ownership transfer preserve records under the permanent island UUID. Deleted islands are hidden from social reads, and loading prunes missing-island references. Withdrawal preserves the original same-island cooldown and consumed daily budget. Current teammates' ratings are excluded from aggregates but remain saved, so they can contribute again after leaving. Continuous visitor qualification exists only in memory and starts over after restart. See [Favorites and ratings](/skyprime/11-favorites-ratings).

## Activity history storage

`storage/activity.json` version 1 stores ordered per-island activity records and the next sequence. Activity participates in the canonical version 2 `island-state.pending.json` journal alongside island, custom-role, transfer and reward snapshots. A record becomes readable only after its complete transaction succeeds. A failed transaction suspends domain writes and history reads; preserve its journal, correct the storage fault and restart to replay it. Invalid current activity bytes prevent initialization.

Back up activity and any pending transaction with the rest of the stopped-server island data. Reset and ownership transfer retain history; deleted-island history remains available through `/is admin history <UUID>` while retained. `config/activity.toml` defaults to 90 days, 1000 entries per island and 100,000 total entries. Oldest records are evicted at count or encoded-content limits. Disabling recording preserves reads and retention processing; retention deletions cannot be reversed by raising the limits. See [Activity history](/skyprime/12-activity-history) for the precise event scope.

## Specialization state

Island schema 9 includes `specialization` with `id`, `selectedAt` and `revision`. Selection and its credit/history changes share the island transaction; reset and ownership transfer retain the choice and cooldown. Disabling or removing a definition suppresses its benefits but retains saved identity and timestamps. See [Specializations](/skyprime/13-specializations).

## Gamerule persistence

`storage/gamerules.json` version 2 saves typed Boolean/integer choices by island UUID. Successful writes publish the durable selection before world application on the next refresh. Reset and transfer retain choices; island deletion removes them. Operator locks and narrower numeric ranges change effective behavior while preserving the saved override. See [Island gamerules](/skyprime/14-gamerules).
