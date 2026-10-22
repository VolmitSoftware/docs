---
title: Coffer feature map
description: Implemented foundation, remaining features, and validation evidence
published: true
date: 2026-10-19T00:00:00.000Z
tags: coffer, development, testing
editor: markdown
dateCreated: 2026-10-17T00:00:00.000Z
---

Coffer 0.7.0 adds complete stopped-server snapshots, manifest verification, and restore into a fresh server directory. Economy, sharing commands, administrator browsing, and cross-server storage remain planned.

| ID | Feature | State | Acceptance |
| --- | --- | --- | --- |
| CF-01 | Build and lifecycle | Implemented | Java 25 build, packaged reflection checks, isolated Paper/Folia startup, restart, shutdown |
| CF-02 | Configuration | Implemented | Valid edits activate; invalid edits retain the previous snapshot; atomic writes and clean watcher shutdown |
| CF-03 | Languages and help | Implemented | 18 catalogs, key/placeholder validation, persistent selections, editor conflict checks, filtered help |
| CF-04 | Vault domain | Implemented | Immutable UUID identity and access grants, limits, lock handling, founder provenance without authority |
| CF-05 | Durable local vault repository | Implemented; failure tests passed | Bounded versioned records, atomic publication, explicit durability results, revision checks, corruption quarantine, retained generations, guarded history rollback, deletion fences, indexed owner queries |
| CF-06 | Items, sessions, and player inventory transactions | Implemented for personal owner vaults | Bounded native encoding, exclusive sessions, create/list/open commands, quota checks, menu gestures, journaled transfers, player checkpoints, interaction guards, completed receipts, restart reconciliation, and reviewed operator recovery with retained evidence |
| CF-07 | Shared vault access | Domain rules and live transfer authorization implemented; player sharing commands planned | Direction-specific grants and explicit administrator access are checked; sharing commands and revocation workflows remain pending |
| CF-08 | Configuration GUI | Planned | Shared validation/install path, durable changes, concurrent-edit protection |
| CF-09 | Economy | Planned | Explicit charge outcomes, retry/recovery, refunds, recurring fees without duplicate charges |
| CF-10 | Community vault | Planned | Explicit permissions and quotas, safe simultaneous access, audit history |
| CF-11 | MySQL and cluster ownership | Planned | Atomic revision writes, exclusive edit ownership, disconnect/recovery and conflict tests |
| CF-12 | Import and integrations | Planned | Offline import validation, independent schemas, optional providers and documented placeholders |
| CF-13 | Coordinated backup and restore | Implemented for stopped server directories | Native/storage lock exclusion, complete world/player/plugin tree, bounded checksummed manifest, exact file verification, confirmed restore into a fresh directory, and atomic publication after staging |

Owner and founder UUIDs are distinct. Founder identity carries no access rights. Shared grants require open access and can independently grant deposits and withdrawals; they cannot grant management. Locks block ordinary item access while owners can manage the vault. Administrators bypass restrictions only through an explicit authorization request. Internal session and transfer APIs enforce these rules; player-facing sharing commands remain pending.

The next slices are shared access commands and vault management. Operator recovery can explicitly restore a conflicting player inventory to a pending journal's recorded outcome while the vault and durable receipt remain valid. Coordinated backup restores the complete selected server snapshot into a new directory; it does not repair individual corrupted records. Corrupt-record repair, independently changed vault repair, receipt reset without a pending journal, and database/cluster storage remain unimplemented. Vault-only history rollback is blocked for vaults that have entered live transfer preparation.

The [PlayerVaultsX reference audit](/coffer/05-reference-audit) adds static evidence and acceptance cases. The [local storage reference](/coffer/06-local-storage) and [item/session reference](/coffer/07-items-sessions) describe the implemented APIs, limits, durability semantics, and recovery boundaries.

## Validation

### Coordinated backup and restore (0.7.0)

`build buildSwiftSwamp` passes with 1,037 successful automated tests, zero failures or errors, and one POSIX-permission test skipped on Windows. The reports contain 1,032 unit/integration cases and six packaged-distribution cases. The distribution is 870,977 bytes with SHA-256 `7ace5bb51c975bfdba098dfd207684b5ed279c88ef6f1d478f72dfe6b10e7bb3`.

| Backup coverage | Cases | Behavior |
| --- | --- | --- |
| Manifest codec | 40 | Checksums, version/bounds, malformed bytes, parent ordering, path portability, Unicode collisions |
| File identity | 5 | Missing Java file keys, real hard links, distinct equal-metadata files, bounded comparisons |
| Native/storage lease | 33 | Held locks, failure cleanup, required server layout, linked aliases, traversal bounds |
| Snapshot and restore | 40, including one skipped POSIX case | Exact tree/metadata, source preservation, changed payloads/manifests, existing destinations, staging and publication failures |
| Process interruption | 4 | Abrupt JVM halt before/after snapshot and restore publication; incomplete stages refused and completed results verified |
| CLI | 27 | Argument validation, output fields, exit codes, full operational exceptions, confirmation hashes |

Two packaged checks run the executable JAR without Bukkit or downloaded libraries, then create, verify, restore, and re-verify a complete synthetic server tree while preserving later changes in the original. The other four packaged checks retain configuration, storage, sessions, and transfer/recovery coverage.

The first test run exposed that Windows Java returns no file identity key, allowing hard-linked aliases through the initial checks. Detection now uses bounded filesystem same-file comparisons when keys are absent. Review also added bounds before layout traversal, Unicode case-collision checks, staged manifest/root revalidation, and retained restore manifests so an interrupted command's completed publication can be verified before launch.

| Runtime check on the 0.7.0 distribution | Paper 26.1.2 build 74 | Folia 26.1.2 build 8 |
| --- | --- | --- |
| Running-server backup refusal, stopped-server capture, and verification | Passed | Passed |
| Wrong confirmation, existing destination, and tampered snapshot refusal | Passed | Passed |
| Exact restored bytes and modification times; unchanged original server bytes | Passed | Passed |
| Two players, vault contents, native receipts, full inventory metadata, and world chests restored together | Passed | Passed |
| New transfers, configuration reload, reconnect, full restart, and graceful shutdown | Passed | Passed |

Ten Mineflayer scenarios passed all 32 steps, and 18 CLI checks passed. Each player's 20 diamonds began as 15 in inventory and five in the vault, while each chest held 17 emeralds. The original advanced to 17/3 and 23 emeralds. Restore recovered the earlier 15/5 and 17-emerald state, while the original retained its later state. New transfers on the restored server produced 16/4, with receipts and item metadata preserved through reload, reconnect, and restart.

The published restore was verified against its retained manifest before startup. Multiplexor's linked server JAR was materialized for capture. After exact restored bytes and timestamps were verified, four launcher files were retained from a fresh managed target: `server.jar`, `.server-source`, `multiplexor-restart.cmd`, and `.multiplexor-log4j2.xml`. All other restored file bytes were checked after the manager copy. This proves restoration through that documented server-manager setup; it does not make machine-specific launcher paths portable.

Mineflayer 4.38.0 used bot protocol 26.1 against both 26.1.2 servers, with the process-local nested-container schema correction described in the 0.4.0 evidence below. These checks establish the listed protocol-visible behavior, not stock-harness compatibility or real-client rendering. Windows directory flushing reports `DURABILITY_UNCERTAIN`; neither runtime validation nor the four child-JVM interruption tests establish host power-loss durability. POSIX permission restoration remains untested on this Windows host.

Build XML, artifact hashes, CLI results, published-tree comparisons, gameplay reports, native/item snapshots, and correlated logs are retained locally under ignored `qa/coordinated-backup/`; `runtime-summary.json` identifies the ten passing reports. Final runtime logs contain no unexpected exceptions or protocol failures. All four isolated instances were gracefully stopped, checked for zero owned processes, and deleted, together with the temporary backup output area. Viewer feeds and reconnect feeds at `http://127.0.0.1:3141/` and `http://127.0.0.1:3142/` are closed; their URLs match the reports and viewer state files.

### Operator recovery (0.6.0)

`build buildSwiftSwamp` passes 887 automated tests with zero failures, errors, or skips: 883 unit/integration cases and four packaged-distribution checks. The packaged checks retain the recovery command annotation and exercise decision archival, completion, and audit reads after reopening storage. The distribution is 829,523 bytes with SHA-256 `7be5f313c6f50d548519e4063b610bd2d70e60f883d4a6f9ab530940e9cfa6f4`.

Recovery coverage includes archive bounds and checksums, exclusive publication, unsupported hard-link filesystems, stale evidence, immutable attribution, held-player lifecycle, expiring reviews, operator permission revocation, interrupted approvals, completed-receipt replay barriers, and command validation. Two additional child-JVM termination cases cover recovery archive publication, bringing transfer process-failure coverage to ten cases.

Review corrected three recovery boundaries: existing approvals cannot replay old inventory after a completed durable receipt; operator authorization is rechecked immediately before approval submission; and a retry can recognize a journal deletion that succeeded before reporting failure without allowing a new approval after the journal disappeared.

The first interrupted-decision runtime test exposed native serialization differences after restart. Receipts, all occupied slots, item counts, and decoded metadata matched the approval, but an enchanted sword and nested shulker had different serialized bytes. Recovery now uses the existing decoded count-and-metadata comparison for review and approved replay, retaining exact receipt and completed-receipt checks. Five regressions cover equivalent representations and refusal of real metadata changes. The original failing envelopes and native snapshots remain in the local diagnostic evidence.

| Runtime check on the 0.6.0 distribution | Paper 26.1.2 build 74 | Folia 26.1.2 build 8 |
| --- | --- | --- |
| Explicit recovery permissions, pending list/inspection, offline hold cancellation, and guarded join | Passed | Passed |
| Concrete slot/receipt review, invalid token refusal, and stale inventory refusal without stored changes | Passed | Passed |
| Explicit completion, exact player/vault result, native checkpoint receipt, and retained original audit evidence | Passed | Passed |
| Repeated completion refusal, reconnect, subsequent ordinary transfer, configuration reload, and full restart | Passed | Passed |
| Process interruption after decision archival, automatic replay with equivalent decoded items, and reconnect without duplicate completion | Passed | Passed |

Ten Mineflayer scenarios passed all 34 steps with zero report errors. Both interrupted-decision checks reproduced different native bytes for the nested shulker and enchanted sword while confirming identical decoded metadata, quantities, occupied slots, and receipts. The corrected replay completed on each platform. Original audit snapshot hashes remained unchanged across completion, reconnect, reload, and full restart; correlated final logs contain no unexpected exceptions or protocol parsing failures.

Each platform received one abrupt termination of its verified owned Java process after the fixture had archived an approval, saved the observed player state, and disconnected. These are prepared-boundary checks, not randomly timed interruptions during inventory mutation. Unit tests separately cover third-state automatic refusal; the gameplay harness deliberately fails on any kick.

Mineflayer 4.38.0 used bot protocol 26.1 against both 26.1.2 servers, with the process-local nested-container schema correction described in the 0.4.0 evidence below. This establishes the listed protocol-visible behavior, not stock-harness compatibility, real-client rendering, or interaction feel. Directory flushing remains unavailable on this Windows filesystem, so successful publications report explicit durability uncertainty; these tests do not establish host power-loss safety.

Build XML, artifact hashes, all final reports, correlated logs, original failure diagnostics, native/item snapshots, and process-exit evidence are retained locally under ignored `qa/operator-recovery/`. `runtime-summary.json` identifies the ten passing reports. Both isolated instances were gracefully stopped after validation, checked for zero owned processes, and deleted. All temporary viewer feeds and reconnect feeds at `http://127.0.0.1:3139/` and `http://127.0.0.1:3140/` are closed; their URLs match the saved reports and viewer state files.

### Player commands and vault menu (0.5.0)

`build buildSwiftSwamp` passes 775 automated tests with zero failures, errors, or skips: 771 unit/integration cases and four checks against the packaged distribution. The packaged command checks retain Director annotations and parameter names for create, list, and open. The distribution is 781,167 bytes with SHA-256 `c8f8bb2a647dbbea9ea9ed3eda2471caf733619fad5d74a83ab553277d2ad982`.

| Added coverage | Cases | Behavior |
| --- | --- | --- |
| Player vault service | 37 | Owner isolation, stable ordering, numeric/UUID selectors, creation outcomes, quotas, and storage failures |
| Atomic owner creation | 7 | Limit validation, refusals, and concurrent requests sharing the repository mutation boundary |
| Configuration | 8 | Default limit, serialized camelCase key, valid bounds, and rejected reload retention |
| Player command controller | 8 | Console/permission refusal, recovery guards, duplicate pending commands, disconnect, shutdown, and scheduler rejection |
| Menu planner | 20 | Deposit/withdraw routing, metadata matching, per-item stack limits, single-destination capacity, and equipment exclusion |
| Menu lifecycle/events | 26 | Copy separation, cancelled/unsupported gestures, busy clicks, stale view/source, deferred closes, refresh, retirement, and owner-thread requirements |
| Menu transfer coordination | 22 | Exact inventory identity, expected revision, close timing, permission revocation, and recovery independent of menu access |
| Transfer menu holder | 15 | Supported sizes, required options, and bound identity |

Review corrected two stale-view races: an event from an old inventory cannot act on a replacement view, and a deferred denial cannot close a different menu. Menu transfers now recheck `coffer.open` at owner-thread boundaries. Configuration tests and documentation use the serializer's canonical camelCase keys, including `vault.maximumVaults`; existing installed language catalogs retain English fallback for new messages.

| Runtime check on the 0.5.0 distribution | Paper 26.1.2 build 74 | Folia 26.1.2 build 8 |
| --- | --- | --- |
| Ordinary-player create/list/open, owner isolation, individual permissions, and creation quota | Passed | Passed |
| Stack/single-item deposits and withdrawals, nested metadata, all 43 player slots, and native checkpoint receipts | Passed | Passed |
| Shift/double/number/offhand/drop/outside/drag refusals, occupied cursor, and rapid-click serialization | Passed | Passed |
| Full and fragmented destination capacity, stale-revision refresh, and permission revocation | Passed | Passed |
| Escape before admission cancels; Escape during an accepted transfer completes once without reopening | Passed | Passed |
| Reload, reconnect, full server restart, subsequent transfer, and final graceful shutdown | Passed | Passed |

Four Mineflayer scenarios passed all 54 steps, with 24 live checks and three restart checks per platform. The close observer recorded no active transfer for early Escape and an active transfer for the accepted-close case; native assertions then verified exact item counts and revisions. Both final restart checks reached vault revision 17 with the expected contents and completed receipt. Each live run produced exactly one expected stale-revision refusal; the correlated logs contained no unexpected exceptions or protocol parsing failures.

Mineflayer 4.38.0 connected with bot protocol 26.1 to both 26.1.2 servers. These runs use the process-local nested-container schema correction described in the 0.4.0 evidence below. Shared protocol dependencies and the plugin are unchanged by that correction. This proves the listed protocol-visible behavior, not real-client rendering, sound, or interaction feel.

Build reports, artifact hashes, runtime reports, correlated logs, viewer states, and process-exit evidence are retained locally under ignored `qa/player-menu/`; `runtime-summary.json` identifies the four passing reports. Both isolated instances were gracefully stopped, checked for zero remaining owned processes, and deleted. The temporary viewer feeds at `http://127.0.0.1:3137/` and `http://127.0.0.1:3138/` are closed, including their reconnect sessions.

### Live transfers and recovery (0.4.0)

`build buildSwiftSwamp` passes 632 automated tests with zero failures, errors, or skips. This includes the previous foundation, storage, item, and session coverage, 270 transfer-related cases, and four packaged-distribution checks. The packaged transfer check loads the distribution, commits a journal, reopens storage, and verifies the retained completed receipt and exact vault revision.

| Transfer suite | Cases | Coverage |
| --- | --- | --- |
| Journal and receipts | 41 | Journal encoding, restart reservations, exact revisions, idempotent retries, malformed evidence, completed receipts, history fences, and publication failures |
| Process termination | 8 | Abrupt child-JVM termination around journal, vault, receipt, and journal-removal boundaries, followed by reopening |
| Transfer planner | 58 | Exact quantities, selected slots, metadata compatibility, stack limits, defensive copies, invalid requests, and item conservation |
| Native player checkpoint | 76 | Full bounded gzip/NBT parsing, UUID and receipt checks, persistence flag, atomic publication, file/directory failures, concurrent replacement, and original-file preservation |
| Live coordinator | 66 | Owner-thread scheduling, permission checks, commit order, before/after recovery, divergent state, stale completed receipts, cancellation, disconnect, persistence suspension, and failure guards |
| Interaction guard | 21 | Guarded player events, separate event handler lists, projectile owners, and unrelated-entity isolation |

The staged `Coffer.jar` is 739,415 bytes. Its SHA-256 is `c4c84face3ff9ec1fd8c3629c6a5c08aa2a3d15513c27b5e2094a4ea6bfe25f7`.

Runtime setup exposed an outdated 41-slot assumption. Transfers now use the target platform's full 43-slot inventory, including body and saddle equipment. Regression tests preserve occupied equipment slots through live moves, journal restart, and pending recovery, and reject equipment divergence or occupied codec padding.

The first live deposit also exposed a dimension-directory assumption. Checkpoint publication now resolves the current native `players/data` location from `Server.getLevelDirectory()`. Failed publication stopped before the vault commit and disconnected the player; the runtime fixture checks the actual canonical checkpoint receipt after each successful live transfer.

The installed Mineflayer protocol data also had a nested-container decoding mismatch: minecraft-data 3.116.0 described ordinary slots where Paper 26.1.2 sends optional item templates. Its parser silently discarded the shulker update and full-inventory packets. A process-local QA preload corrects only that container schema; shared dependencies and Coffer remain unchanged. Verification consumes both captured packets completely, re-encodes identical bytes, and preserves nested item metadata, empty entries, and removed components. Protocol observations using this correction are distinct from stock-harness compatibility.

| Runtime check on the 0.4.0 distribution | Paper 26.1.2 build 74 | Folia 26.1.2 build 8 |
| --- | --- | --- |
| Startup, storage readiness, and configuration reload | Passed | Passed |
| Live deposit and withdrawal with exact quantities | Passed | Passed |
| Nested shulker contents, item metadata, and all 43 player slots preserved | Passed | Passed |
| Canonical native checkpoint receipt verified after each of four live moves | Passed | Passed |
| Foreign vault, read-only grant, and type-permission refusals | Passed | Passed |
| Join recovery from prepared before-player, after-player, and committed-vault boundaries | Passed | Passed |
| Repeated recovery inspection preserves the same completed receipt and vault revision | Passed | Passed |
| Final graceful shutdown and owned-process exit | Passed | Passed |

Mineflayer 4.38.0 connected using bot protocol 26.1 to both servers with the container-schema correction described above. Fourteen scenarios passed all 58 scenario steps with no protocol parse failures. Server-side assertions verified native metadata, checkpoint receipts, cleared completed journals, and player/vault item conservation; the bot verified command results and observable inventory counts.

Each server received three abrupt process terminations after the fixture had prepared and verified a recovery boundary and disconnected its bot. All six restarts recovered automatically on join, leaving the expected player count of 12, vault count of 5, and vault revision 2. These are prepared-boundary restart checks, not randomly timed interruptions during a live inventory mutation. The eight child-JVM cases separately interrupt journal publication stages.

Build XML, artifact hashes, protocol-correction checks, runtime reports, process identities, and correlated logs are retained locally under ignored `qa/live-transfers/`; `runtime-summary.json` lists the final run. Both owned instances were gracefully stopped, checked for remaining processes, and deleted. The temporary viewer feeds at `http://127.0.0.1:3127/` and `http://127.0.0.1:3128/` are closed; their URLs and closed status match the saved reports and viewer state files. No real-client rendering, sound, or interaction-feel validation is claimed.

The [live transfer reference](/coffer/08-live-transfers) describes checkpoint publication, restart reconciliation, and supported operating conditions. These tests establish the listed process-failure and coordination behavior; they do not establish host power-loss safety or protection against arbitrary external plugin writes.

### Item encoding and detached sessions (0.3.0)

`build buildSwiftSwamp` passes 361 automated tests with zero failures or skips: 64 foundation tests, 134 storage tests, 69 item/NBT tests, 91 session/bridge tests, and three packaged-distribution tests. Packaged checks load the actual distribution and exercise configuration reflection, storage persistence, and session commit/reopen.

| Suite | Cases | Coverage |
| --- | --- | --- |
| Item codec | 39 | Sparse slots, copies, format/data versions, invalid items, native failures, item/vault size limits, and validation before decoding |
| NBT preflight | 30 | Truncation, malformed tags, duplicate fields, lengths, depth, tag count, inflated sizes, data version, and trailing data |
| Session engine | 66 | Reservations, permissions, owner preservation, immutable drafts, conflicts/deletion, ambiguous outcomes, retry reconciliation, cancellation, disconnect, and serial shutdown |
| Bukkit bridge | 25 | Owning-thread checks, entity scheduling, permission rechecks, clean failed-open release, modified-draft retention, defensive copies, quit flush, and pending-open shutdown |

Testing and review corrected two races: shutdown now cancels pending loads before waiting for active saves, and failed-open cleanup atomically releases only an unchanged draft. Uncommitted detached drafts remain process memory; these tests do not establish crash recovery for live player transfers.

The staged `Coffer.jar` is 694,395 bytes. Its SHA-256 is `e5b99bffaf10574962c677f5adc76d2117ecd42deb5e30b500b835d6326569bf`.

| Runtime check on that distribution | Paper 26.1.2 build 74 | Folia 26.1.2 build 8 |
| --- | --- | --- |
| Startup, dependency bootstrap, and storage readiness | Passed | Passed |
| Sword metadata, enchantments, damage, PDC, nested shulker items, written book, and bundle round trips | Passed | Passed |
| Sparse slots, independent returned copies, administrator edits preserving stored ownership | Passed | Passed |
| Duplicate reservation and off-thread item access rejected | Passed | Passed |
| Malformed, future-version, and unknown-encoding items refused without changing stored bytes/revision | Passed | Passed |
| Dirty session saved on quit, verified by reconnect without restarting | Passed | Passed |
| Dirty session saved during graceful shutdown, verified after restart | Passed | Passed |
| Configuration reload, version command, and final clean shutdown | Passed | Passed |

Mineflayer 4.38.0 connected using bot protocol 26.1 to both 26.1.2 servers. Ten scenarios passed all 16 scenario steps, with additional server-side assertions in a local test fixture. The fixture checked metadata equality and owner-thread callbacks; the bot checked command results and unchanged player inventory. The shutdown fixture used a separate viewer identity so ordinary bot quit could not save its draft before shutdown. Intentional invalid-item fixtures logged full decode exceptions and left canonical records unchanged.

Build XML, artifact metadata, runtime reports, and correlated logs are retained locally under ignored `qa/item-sessions/`. The first Folia attempt was interrupted by a concurrent test-instance cleanup during the harness's directory scan; a complete fresh Folia run passed. Both owned instances were stopped, checked for remaining processes, and deleted. Temporary viewer feeds at `http://127.0.0.1:3117/` and `http://127.0.0.1:3118/` are closed. These checks establish detached item/session behavior and lifecycle, not live player transfers, process-crash recovery of uncommitted drafts, or real-client rendering.

### Local storage failure validation (0.2.0)

`build buildSwiftSwamp` passes all 200 automated tests with zero failures or skips: 64 foundation tests, 134 storage tests, and two packaged-distribution tests. The packaged checks exercise configuration reflection and storage create/reopen using classes loaded from the actual distribution.

| Storage suite | Cases | Coverage |
| --- | --- | --- |
| Record codec | 53 | Bounds, checksums, invalid fields, duplicate entries, UTF-8, truncation, maximum payloads, deterministic encoding, and 1,000 seeded malformed records |
| Immutable models | 21 | Defensive copies, immutable maps, slot/payload limits, identifiers, revisions, and timestamps |
| Repository | 44 | Restart/indexing, conflicts, ownership/shrink protection, history/recovery, corruption/deletion barriers, publication/flush failures, pruning/quarantine failure, and lock cleanup |
| Process failure | 6 | Abrupt JVM halt before/after atomic create, save, and deletion-marker publication; two reopens per case |
| Async lifecycle | 10 | Queue saturation, cancellation, ordered draining, fatal errors, cleanup failure, interrupted close, and the actual 30-second shutdown deadline |

Failure testing corrected two defects: rejected mutations now refresh owner listings/statistics and suppress repeated corruption logs; cleanup failures remain `FAILED` in later API responses with the original cause. Process-crash tests do not establish host power-loss durability. This Windows filesystem reports directory forcing unavailable, so published writes retain the explicit `DURABILITY_UNCERTAIN` outcome.

The staged `Coffer.jar` is 657,116 bytes. Its SHA-256 is `91ebb7c37dd4428f08670ebe5ac9f5ad000bc226d8f1e1b2b15885454e24b98b`.

| Runtime check on that distribution | Paper 26.1.2 build 74 | Folia 26.1.2 build 8 |
| --- | --- | --- |
| First startup, dependency bootstrap, storage ready | Passed | Passed |
| Version/status commands and configuration reload | Passed | Passed |
| Restart and storage reopening | Passed | Passed |
| Plugin disable and graceful server shutdown | Passed | Passed |
| Invalid storage path logs a full exception and disables Coffer | Passed | Not repeated |
| Repair invalid storage path, then restart successfully | Passed | Not repeated |

Mineflayer 4.38.0 connected with bot protocol 26.1 to both servers. Four scenarios passed four steps each, including log-based storage readiness and a healthy connection after reload. The Paper failure fixture replaced the empty records directory with a regular file; the expected initialization exception disabled Coffer, and restoring the directory allowed the next process to start normally. Same-process constructor lock cleanup has separate automated coverage.

Build XML reports and artifact metadata are retained locally under ignored `qa/storage-failure/`; runtime JSON reports and server logs are under `qa/storage-runtime/`. The temporary viewer feeds at `http://127.0.0.1:3107/` and `http://127.0.0.1:3108/` closed after the scenarios. Both test instances were stopped, checked for remaining processes, and deleted. These 0.2.0 checks establish plugin lifecycle and administration behavior; item encoding and player inventory transactions were unimplemented in that version.

### Foundation baseline (0.1.0)

The Java 25 build and selected workspace aggregate build passed on October 17, 2026. All 65 automated tests passed, including configuration concurrency, vault authorization, language validation, command permission routing, and reflection against the packaged distribution. The language manifest covers all 18 bundled catalogs with content hashes.

The previously validated 0.1.0 distribution was 606,547 bytes, with SHA-256 `587e7781729e043bed8d077b1ab8d0cd789e0b67fb9d900f07e0739ea0f8df31`.

| Runtime check | Paper 26.1.2 build 74 | Folia 26.1.2 build 8 |
| --- | --- | --- |
| First startup and dependency bootstrap | Passed | Passed |
| Restart using cached dependencies | Passed | Passed |
| Version, status, configuration, root help | Passed | Passed |
| Server language switch to German and back to English | Passed | Passed |
| Reject invalid rows while retaining active settings | Passed | Passed |
| Apply valid rows and restore original settings | Passed | Passed |
| Ordinary-player denial, including abbreviated commands | Passed | Passed |
| Plugin disable and server shutdown | Passed | Passed |

Mineflayer 4.38.0 connected with Minecraft protocol 26.1 to both 26.1.2 servers. The four successful scenarios used the exact distribution hash above. Reports and correlated server logs are retained locally under the project's ignored `qa/` directory. Both temporary loopback viewer feeds closed after their scenarios.

The invalid-row scenarios intentionally logged validation exceptions. Both servers subsequently accepted valid settings. Folia's watcher also rejected the invalid edit before the manual reload, retaining the active snapshot.

These checks establish the listed command and lifecycle behavior. The shared language editor's conflict handling and saved personal selections have automated test coverage; its in-game editing interface and the diagnostic-report command have not received gameplay acceptance in this pass. No inventory, item-loss, economy, cluster, or real-client rendering validation is claimed.
