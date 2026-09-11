---
title: "Operations, Storage, and Recovery"
description: "Foundation diagnostics, persistence safety, reload behavior, and recovery"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "foundation, operations, storage, recovery"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Foundation treats configuration and player data as recoverable state. Operator-visible failures retain the previous valid runtime where possible and emit full contextual stack traces without flooding repeated hot-path failures.

## Files

| Path under `plugins/Foundation/` | Contents |
|---|---|
| `foundation.toml` | Canonical typed configuration |
| `foundation.toml.last-good` | Previous valid configuration bytes |
| `worth.toml` | Complete categorized item price catalog |
| `worth.toml.last-good` | Previous worth catalog bytes |
| `languages/<locale>.toml` | Direct editable locale catalog; English and custom files are generated when absent, while listed translations install on demand from Git |
| `languages/language-preferences.json` | Atomic UUID-to-locale personal preference map |
| `languages/language-preferences.json.last-good` | Previous valid personal preference map |
| `debug/foundation-v<version>-debugdump-YYYY-MM-DD-HH-mm-ss.txt` | Locally retained sanitized support report with a UTC timestamp |
| `data/locations.json` | Spawn, shared warps, and named jails |
| `data/locations.json.last-good` | Previous location store |
| `data/players/<uuid>.json` | Per-player profile |
| `data/players/<uuid>.json.last-good` | Previous per-player profile |
| `data/kits.yml` | Bukkit item snapshots and kit cooldown definitions |
| `data/kits.yml.last-good` | Previous kit store |

Writes use a temporary file in the destination directory, force bytes to storage where supported, and then replace the target atomically when the filesystem permits. Existing symbolic links and non-regular targets are rejected. Profile, location, and kit writers validate an existing primary before rotating it into `.last-good`, so a malformed primary recovered from backup cannot replace the remaining valid copy. Location loading also discards non-finite, out-of-range, or world-invalid spawn, warp, and jail records before they become active. Location, kit, and language-preference loaders recover a missing or invalid primary from a valid last-good copy and republish canonical primary data without replacing evidence when both copies are invalid.

Installed non-English locale files are never automatically rewritten or merged. The jar's generated manifest advertises 17 repository translations without bundling them; Foundation downloads and atomically installs only a requested missing locale. Missing known messages use built-in English only in memory, while invalid hot edits retain the last valid active snapshot. The version-1 preference store is bounded to 25,000 UUID entries and 2 MiB. If its primary and last-good files both fail validation, preference writes remain disabled until an operator supplies a valid copy and reloads the service.

Kit files are limited to 4 MiB. Load and hot-reload boundaries enforce the configured maximum kit count, maximum cooldown, and maximum non-empty stacks per kit; excess entries are discarded or capped in deterministic file order and the bounded form is saved canonically. The configurable item bound defaults to 41 and is hard-limited to 54.

## Player-data recovery

Profile reads cap files at 1 MiB. If the primary profile is invalid, Foundation attempts the last-good file and queues the recovered profile for a fresh save. That fresh save preserves the valid backup until the recovered primary has been written. If both files are invalid, the UUID enters read-only safety mode; commands may read the in-memory empty state, but mutations fail instead of overwriting the damaged evidence.

Economy persistence coalesces rapid changes by UUID and retries a pre-profile failure four times with bounded backoff. The latest unpersisted balance remains represented in diagnostics after exhaustion, and the affected account becomes mutation-blocked until shutdown makes a final persistence pass; failures after a profile was marked dirty remain covered by the repository's normal retry and final flush.

Pre-login loading, periodic flushes, and disk scans run asynchronously. On startup and BileTools hot-load, Foundation records sessions for all already-online UUIDs, loads those profiles behind an asynchronous readiness barrier, and activates modules only after a global-scheduler check confirms that every currently online player is resident. Players who join during the barrier load through the asynchronous pre-login event; an unloaded player who quits during it queues both the read and logout save asynchronously instead of touching JSON from the event thread. A connection whose asynchronous pre-login phase completed before a hot-load began is rejected once with the preparation message while its profile is warmed asynchronously, then can reconnect normally. Session-bound profile access never falls back to a disk read when the resident profile is not ready. The core repository records last-known names and first/last-seen timestamps independently of optional modules, updates its in-memory lookup index, and refuses the entire mutation in read-only recovery mode. Modules expose `PREPARING` until the barrier completes, and direct module commands report that player data is still being prepared.

Flushes occur every 600 ticks after the readiness barrier completes. Reconnect, quit, startup-generation, and shutdown guards prevent a stale completion from activating modules or replacing newer state. A failed save remains dirty for retry and is logged through a per-profile throttle.

Profile name lookups and economy initialization have independent disk-scan limits. `playerData.maximumNameIndexProfiles` bounds the asynchronous offline-name index from 100 through 1,000,000 JSON profiles. The index moves through `NOT_STARTED`, `BUILDING`, `READY`, `INCOMPLETE`, `FAILED`, and `CLOSED`; only exhaustive `READY` makes an absent name conclusively unknown. Resident and already-indexed names remain resolvable during a build, while an absent name during preparation, after a cap is reached, or after an unreadable profile produces distinct localized unavailable feedback instead of a false “unknown player” result. If multiple UUID profiles claim the same normalized name, the index records that ambiguity and every offline name operation refuses to select either profile. Valid last-good profiles participate in a complete index, rebuilds are generation-guarded across configuration changes and shutdown, and no lookup call starts or waits for a scan.

`economy.maximumIndexedAccounts` separately bounds the UUID balance index from 100 through 1,000,000 accounts; exceeding the selected limit or encountering an unreadable primary and last-good profile prevents a partial economy index from becoming Vault-visible. Duplicate historical economy names are tracked as ambiguous, so `/balance`, `/economy`, and Vault string-name calls cannot select an arbitrary UUID; direct UUID ledger access remains available. Economy leaderboards read an immutable in-memory snapshot bounded by `economy.maximumLeaderboardProfiles`, so they include unsaved ledger changes without synchronous disk or player-name resolution. Offline mail, warnings, mutes, seen checks, and logout-location lookups run away from the server tick thread, while all resulting player or world access returns through the owning entity or global scheduler.

## Diagnostics

- `/foundation status` shows the plugin version, Java version, and active module count.
- `/foundation modules` shows every module state and failure reason.
- `/foundation doctor` lists blocked or failed modules, reports non-exhaustive and ambiguous profile/economy name-index state with its cap, progress, and unreadable count, and dynamically inspects every canonical label and alias belonging to an active route. Bare registrations are compared with Foundation and installed-plugin namespace mappings so the report names the current owner and the canonical `/foundation <command>` fallback instead of relying on a fixed collision list.
- `/foundations debug` opens a Director submenu, and `/foundations debug dump [upload=true]` captures Foundation state, platform and scheduler details, loaded plugins, loaded worlds, TPS/MSPT when available, JVM/JIT/class data, memory pools, CPU and operating-system load, file descriptors, garbage collectors, buffers, storage, artifact hash, module and route state, profile and worth health, player-name index lifecycle, cap, progress, ambiguity, recovery and failure counts, economy-name ambiguity, installed and available language state, the remote catalog reference or failure, suite presence, and active command ownership into a new local report. Reports created during the same second receive bounded numeric suffixes and never replace an existing file or symbolic link. The singular `/foundation` root remains an equivalent alias path.
- `debug.uploadToMclogs` is enabled by default. When both the setting and command argument permit upload, Foundation uses VolmLib's bounded fixed-HTTPS client and returns the validated `https://mclo.gs/<id>` link; `upload=false` forces local-only output, and local report creation never depends on upload success.
- Debug reports include metadata, sizes, timestamps, and hashes for known files rather than file contents. They omit player names, UUIDs, network addresses, environment variables, JVM arguments, raw configuration, credentials, and the mclo.gs deletion token.
- `runtime.verboseDiagnostics` enables additional non-hot-path lifecycle detail.
- When `branding.splashScreen` is enabled and configuration has loaded, the console splash reports `READY` only when the core and every enabled module started without an isolated failure; otherwise it reports `DEGRADED` with the active/available total for all 17 modules.
- Invalid or temporarily unavailable cosmetic registry values are throttled, logged, and replaced by safe defaults; feedback failures do not propagate into the command or GUI action that requested them. Unexpected root-help, direct-route preflight, route execution, completion, menu-construction, and active-menu callback failures are contained at their Foundation boundary, close the affected Foundation window where applicable, send the safe-failure response when possible, return no failed suggestions, and retain the complete contextual stack trace in the console.

## Shutdown and code reload

Foundation implements VolmLib's `ReloadAware` contract for BileTools. Pre-unload and normal disable share one atomic drain: configuration, debug, GUI, PlaceholderAPI, suite integration, and module services stop; public services unregister; the economy stops accepting transactions and drains its coalesced balance writes; teleport, HUD, worth, language, profile, location, and kit state drain; listeners unregister; and remaining scheduler work is cancelled. Debug shutdown also cancels queued report stages, interrupts an active mclo.gs upload, completes aggregate callers, and suppresses delayed player feedback.
