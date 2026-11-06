---
title: "Animus: Configuration"
description: "Every config.toml setting, its default and range, and how changes apply live"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "animus, configuration, config.toml, hotload"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

Plugin-wide settings live in `plugins/Animus/config.toml` (`config/animus/config.toml` on mod servers). Animus writes the file with every default on first start. A missing table or key uses its default, and comments you add are kept. Every value is checked against the ranges below; an out-of-range or mistyped value names its table and key.

NPC definitions and every other document use JSON. Per-NPC settings belong in the definition's `modules`, not here.

## Live apply

Saving any data file applies it within about a second, without `/animus reload`. This covers `config.toml`, NPC definitions and the module settings inside them, behaviors, packs, routes, skins, shops, chest GUIs, menus, holograms, text animations, rigs, animations and schematics. Each change goes through the same validators as commands and the web editor.

Online players with `animus.hotload.notify` hear a note block chime and see one line per changed key, at most 12 per file:

```none
[Animus]: Animus Hotloaded: [npcs/town/guard.json] [name] ["Guard" -> "Captain Guard"]
```

An invalid edit is refused with its field error, and the last valid version stays active. Each NPC file applies on its own, so one broken file does not block valid edits to others. `/animus reload` follows the same rules.

Every `config.toml` key applies live. Each service picks up a new value by its next tick (on Folia, each region by its next region tick), and `/animus status` shows the main budgets in effect. Lowering a cap never stops work already running: NPCs, viewers, routes, fights, builds, behavior runs and file operations above the new cap finish normally, and new work waits until usage drops under it. Turning `[npcs]`, `[combat]`, `[builds]`, `[behaviors]`, triggers, `[rigs]`, modules, the editor listener or the relay off and on restarts only that part.

These changes need a restart, and the hotload message ends in `[restart required]`:

- `npcs.enabled` on Folia.
- Adding, removing or replacing a Java module jar.
- Replacing the TLS certificate or key files at the same paths. Change the path instead.

Invalid TOML at startup stops Animus from starting. Animus's own writes are never reported, and `state/`, `backups/`, `logs/` and `imports/` are not watched.

## Top-level keys

| Key | Default | Meaning |
|---|---|---|
| `statusMessage` | `"Hello from Animus"` | Text added to the end of the `/animus status` line. Must not be blank |
| `packetProofEnabled` | `false` | Enables the [packet preview tools](/animus/02-commands-permissions#packet-preview-tools) `/animus proof` and `/animus foliaproof`. Ignored on mod servers |

## [npcs]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | | Run the NPC runtime |
| `viewDistance` | `48` | 8-256 blocks | How close a player must be to see an NPC |
| `maximumVisible` | `64` | 1-128 | NPCs shown to one player at once |
| `maximumViewers` | `256` | 1-1024 | Players that receive NPCs |
| `updatesPerTick` | `16` | 1-64 | Players whose NPC view is updated per tick |
| `packetsPerTick` | `32` | 1-1024 | NPC packets per tick, shared by the players updated (per region on Folia) |
| `pendingSpawnsPerViewer` | `8` | 1-64 | Spawns one player may have unanswered |
| `lookUpdatesPerTick` | `32` | 1-1024 | Look-close NPCs that may turn per tick (per region on Folia) |
| `simulationPerTick` | `512` | 16-65536 | NPC upkeep per tick: one idle fall step or one rig animation step each (per region on Folia) |
| `queuePerViewer` | `24` | 4-32 | Packet operations one player may have waiting to send. Cosmetic updates stop at three quarters of it |
| `degradedIntervalTicks` | `4` | 1-40 | While a budget runs short, cosmetic updates and moves of distant NPCs happen on one update in this many. `1` turns the spreading off |

When a tick has less packet budget than work, despawns go first, then moves, equipment, mounts and new spawns, then cosmetic updates such as look-close turns, rig bones, recording poses, arm swings and timed hologram text. Each update sends the NPC's latest state, so several changes in one tick go out as one. After a tick where despawns or moves had to wait, cosmetic updates pause for 20 ticks. `/animus status` then shows `presentation=strained`.

When a player's queue is full, cosmetic updates are held back first, then moves and spawns wait for the queue to drain. A full queue never drops the player's view.

When `simulationPerTick`, the `[navigation]` route budget or the `[behaviors.triggers]` start budget runs short, cosmetic updates and moves of NPCs farther than half of `viewDistance` slow to one update in `degradedIntervalTicks` for 20 ticks. Nearby moves, spawns and despawns keep their full rate. `/animus status` then shows `presentation=degraded`.

## [navigation]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `routesPerTick` | `128` | 1-4096 | Awake routes that plan or take a step per tick |
| `motionCellsPerTick` | `16384` | 512-1048576 | Collision cells those steps check per tick |
| `planningStartsPerTick` | `16` | 1-1024 | New path plans started per tick |
| `wakeChecksPerTick` | `64` | 1-4096 | Sleeping routes that look for a nearby player per tick. Not used on Folia |
| `planningJobs` | `32` | 1-256 | Path plans in progress at once |
| `captureReadsPerTick` | `2048` | 256-65536 | Terrain reads those plans make per tick (per region on Folia) |

There is no limit on how many NPCs follow routes. Routes take turns within these budgets, so more walking NPCs than the budget all move, only more slowly. A patrol with no player within `npcs.viewDistance` sleeps until one comes near. See [movement](/animus/05-movement-mounts-riding).

## [recordings]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | | `false` refuses `/animus record`, previews and `animus:play-recording` as unavailable, and removes ghosts |
| `sampleTicks` | `2` | 1-20 | Ticks between two captured frames |
| `maximumTicks` | `12000` | 200-72000 | The longest a recording session captures before it saves |
| `maximumFileBytes` | `1048576` | 65536-4194304 | The largest recording file read or saved |
| `maximumSessions` | `4` | 1-16 | Players recording at once |
| `ghostEnabled` | `true` | | Show the recorder's ghost |
| `ghostIntervalTicks` | `100` | 40-1200 | Ticks between two ghost replays while recording |
| `ghostStretchTicks` | `100` | 20-600 | How far behind the recorder a ghost replay starts |
| `ghostGlow` | `true` | | Make the ghost glow |
| `ghostColor` | `aqua` | One of the sixteen chat colours | The ghost's glow colour |
| `maximumPreviews` | `8` | 1-32 | `/animus record preview` ghosts at once |

Lowering a cap lets recordings and previews already running finish. See [performance recordings](/animus/19-performance-recordings).

## [files]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `maximumOperations` | `32` | 1-128 | Admitted file operations at once: commands, imports, reads, editor and API operations. Past this, new work is answered as busy |
| `deliveryBudgetMillis` | `250` | 1-60000 | Time after which a slow result callback is reported. It is not interrupted |
| `backupsKept` | `200` | 1-100000 | Rollback receipts always kept, newest first. See [storage and recovery](/animus/12-storage-recovery) |
| `backupDays` | `14` | 0-3650 | Rollback receipts younger than this are kept too. Older ones beyond `backupsKept` are removed at startup |

## [modules]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | | Send work to Java modules. Built-in `animus:` capabilities work either way |
| `maximumInvocations` | `64` | 1-256 | Module calls in progress at once |
| `invocationTimeoutMillis` | `1000` | 1-60000 | Deadline for one call. A call that misses it is cancelled and its module suspended |
| `deliveryBudgetMillis` | `250` | 1-60000 | Time after which a slow result callback is reported |

## [behaviors]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | | Run behaviors. When false, new runs and trigger events are refused and running executions finish |
| `maximumOperations` | `64` | 1-256 | Behavior operations admitted at once |
| `operationsPerTick` | `8` | 1-64, at most `maximumOperations` | Operations started per behavior tick |
| `tickMillis` | `50` | 50-1000 | Length of a behavior-owner tick. Waits, timers and cooldowns count these ticks |
| `deliveryBudgetMillis` | `250` | 1-60000 | Time after which a slow result callback is reported |

### [behaviors.engine]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `executions` | `64` | 1-128 | Executions running at once |
| `fibers` | `128` | 1-512 | Parallel branches across all executions |
| `inFlight` | `16` | 1-64 | Actions and conditions awaiting a result at once |
| `workPerTick` | `256` | 1-4096 | Steps run per tick |
| `totalSteps` | `4096` | 1-1000000 | Steps one execution may run |
| `lifetimeTicks` | `20000` | 1-72000 | Ticks one execution may live |
| `callDepth` | `8` | 1-32 | Nested routine calls |
| `traceEntries` | `64` | 1-256 | Recent steps kept per execution for `trace` and `inspect` |
| `historyEntries` | `64` | 1-256 | Finished executions kept for `inspect` |

A running execution keeps the step, lifetime, call depth and trace budgets it started with.

### [behaviors.catalog]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `maximumDocuments` | `1024` | 1-4096 | Behavior documents loaded |
| `maximumEntries` | `4096` | 1-32768 | Files and folders scanned under `behaviors/` and `packs/` |
| `maximumDepth` | `8` | 2-16 | Folder depth scanned |
| `maximumDocumentBytes` | `262144` | 1-262144 | Size of one behavior document |
| `maximumAggregateBytes` | `16777216` | 1-67108864 | Size of all behavior documents together |
| `maximumCapabilityChecks` | `8192` | 1-16384 | Capability references checked per catalog load |

Changing a catalog limit reloads the catalog.

### [behaviors.triggers]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | | Run triggers. When false, queued starts are dropped and running ones finish |
| `eventQueue` | `256` | 1-4096 | Events waiting to be matched. A full queue drops new events |
| `eventsPerTick` | `32` | 1-1024 | Events matched per tick |
| `startsPerTick` | `8` | 1-64 | Executions started by triggers per tick |
| `maximumQueued` | `128` | 1-4096 | Starts waiting in total |
| `queuePerNpc` | `4` | 1-64 | Starts waiting per NPC |
| `queuePerTrigger` | `2` | 1-64 | Starts waiting per trigger |
| `queueLifetimeTicks` | `100` | 1-72000 | How long a start may wait before it is dropped |
| `concurrentTotal` | `32` | 1-128 | Trigger-started executions at once. Keep it below `engine.executions` to leave room for manual runs |
| `concurrentPerNpc` | `2` | 1-16 | Trigger-started executions per NPC |
| `concurrentPerTrigger` | `1` | 1-16 | Executions per trigger |
| `defaultCooldownTicks` | `20` | 0-72000 | Cooldown of a trigger that sets none |
| `npcCooldownTicks` | `0` | 0-72000 | Cooldown shared by all triggers on one NPC |
| `maximumBindings` | `4096` | 1-65536 | Trigger bindings across all active NPCs |
| `maximumTimers` | `1024` | 1-16384 | Timer triggers across all active NPCs |
| `minimumTimerTicks` | `20` | 1-72000 | Shortest timer interval accepted |
| `maximumProximityRadius` | `32` | 1-64 | Largest proximity radius accepted |
| `proximityIntervalTicks` | `5` | 1-200 | Ticks between proximity passes |
| `proximityViewersPerTick` | `16` | 1-256 | Players checked per proximity pass |
| `proximityCandidates` | `32` | 1-1024 | NPCs checked around one player |
| `proximityTrackedPerViewer` | `64` | 1-1024 | NPCs one player can be inside the radius of at once |

Timers, radii and bindings past these limits stay unbound and are listed by `/animus behaviors triggers`.

### [behaviors.server]

These limits apply to [server behaviors](07-behaviors.md#server-behaviors) and need a restart.

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | | Run server behaviors |
| `eventQueue` | `512` | 1-4096 | Server events and starts waiting. A full queue drops new events |
| `eventsPerTick` | `64` | 1-1024 | Events matched per tick |
| `startsPerTick` | `16` | 1-64 | Server behavior runs started per tick |
| `queuePerTrigger` | `64` | 1-256 | Starts waiting per trigger |
| `concurrentPerTrigger` | `8` | 1-64 | Runs per trigger at once |
| `concurrentTotal` | `32` | 1-128 | Server behavior runs at once |
| `defaultCooldownTicks` | `0` | 0-72000 | Cooldown of a trigger that sets none, per player for player events |
| `minimumTimerTicks` | `20` | 20-72000 | Shortest timer interval accepted |
| `maximumCommands` | `64` | 0-64 | Commands registered for `command` triggers |

### [behaviors.state]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `maximumKeys` | `65536` | 1-1048576 | Stored variables holding a value |
| `maximumTransientKeys` | `65536` | 1-1048576 | Transient variables holding a value |
| `maximumValueBytes` | `4096` | 1-4096 | Size of one string value |
| `maximumBytes` | `16777216` | 1-268435456 | Size of each lifetime's names and values |
| `flushMillis` | `5000` | 100-300000 | Longest a changed value waits in memory before it is written |

Lowering a budget below existing data keeps the data; only growth is refused.

### [behaviors.actions]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `actionsPerTick` | `32` | 1-256 | Built-in world and player actions run per tick |
| `actionsPerNpcPerTick` | `4` | 1-64, at most `actionsPerTick` | Built-in actions per NPC per tick |
| `queuedActions` | `256` | 1-1024 | Actions waiting. A full queue fails the action as busy |
| `pendingChoices` | `256` | 1-4096 | Open dialogue prompts |
| `choiceLifetimeSeconds` | `60` | 1-600 | How long a dialogue prompt can be answered |
| `commandBehaviors` | `[]` | At most 256 | Behavior, shop and GUI ids allowed to run commands, such as `"town:gate/open"` |
| `commandNamespaces` | `[]` | At most 256 | Namespaces whose behaviors, shops and GUIs may run commands |
| `navigationWaits` | `8` | 1-64 | Actions waiting for an NPC to finish walking |

Commands are denied unless the behavior, shop or GUI is on one of the allow-lists. Anyone who can edit an allowed document can run console commands, so keep the lists narrow.

## [combat]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | | Run the combat module |
| `maximumNpcs` | `256` | 1-4096 | Combat NPCs that fight or scan at once. Others wait in line. Not used on Folia |
| `brainsPerTick` | `48` | 1-128 | Combat NPCs woken per tick |
| `targetScansPerTick` | `8` | 1-64 | Target scans per tick |
| `scanCandidates` | `32` | 1-256 | Entities one scan looks at |
| `scanCells` | `32` | 1-1024 | Chunks of the NPC index one scan visits |
| `squadAlertsPerTick` | `8` | 1-64 | Squad alerts sent per tick |
| `pathRequestsPerTick` | `2` | 1-16 | Pursuit path requests per tick |
| `maximumHelpers` | `64` | 1-1024 | Helper projectiles in flight |
| `helpersPerNpc` | `4` | 1-64 | Helper projectiles per NPC |
| `helperUpdatesPerTick` | `32` | 1-256 | Helper projectile updates per tick |
| `helperLifetimeTicks` | `100` | 1-1200 | How long a helper projectile lives |
| `idleSleepTicks` | `40` | 1-1200 | Longest wait between scans for an NPC that finds nothing |
| `eventsPerTick` | `8` | 1-64 | Fight and chat events examined per tick |
| `maximumScanRange` | `100` | 16-256 | Cap on every NPC's `targeting.scanRange` |
| `maximumSpeed` | `8` | 1-10 | Cap on every NPC's `pursuit.speed`, in blocks per second |

On Folia the per-tick limits apply to each region tick. See [combat](/animus/08-combat).

## [builds]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | | Run builds. Turning it off stops every crew where it stands and saves progress |
| `maximumBuilds` | `16` | 1-256 | Builds running at once |
| `maximumTeam` | `8` | 1-32 | NPCs on one build |
| `placementsPerTick` | `32` | 1-1024 | Blocks placed per tick across every build |
| `checksPerTick` | `512` | 1-16384 | Blocks compared per tick across every build |
| `undoPerTick` | `32` | 1-1024 | Blocks restored per tick across every build |
| `maximumVolume` | `1000000` | 1-16000000 | Cells in one schematic box |
| `maximumPalette` | `4096` | 1-16384 | Block states in one schematic |
| `maximumSide` | `1024` | 1-4096 | Blocks on each side of the box |
| `maximumFileBytes` | `33554432` | 1024-268435456 | Size of one schematic file |
| `maximumUndoEntries` | `250000` | 0-5000000 | Blocks remembered for undo per build |
| `saveSeconds` | `5` | 1-300 | Seconds between progress saves |

See [building](/animus/09-building).

## [shops]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | | Run shops |
| `economy` | `"auto"` | `auto` or `none` | `auto` uses the server's economy when there is one; `none` turns money prices off |
| `priceFormat` | `"#,##0.##"` | Java decimal pattern | How prices are written |
| `flushMillis` | `2000` | 100-60000 | How long limit and stock counter changes wait before they are written |

### [shops.messages]

Each key replaces one player-facing shop text of at most 512 characters. `&` colour codes and the placeholders shown work. An unknown key is refused.

| Key | Default |
|---|---|
| `bought` | `&aBought {item} for {price}.` |
| `boughtFree` | `&aReceived {item}.` |
| `sold` | `&aSold {item} for {price}.` |
| `traded` | `&aTraded for {item}.` |
| `purchased` | `&aPurchased {item} for {price}.` |
| `notTradable` | `&7That item is not for sale.` |
| `noPermission` | `&cYou do not have permission for that.` |
| `limitReached` | `&cYou have reached the limit for {item}.` |
| `outOfStock` | `&c{item} is out of stock.` |
| `economyUnavailable` | `&cMoney trades are unavailable: {reason}` |
| `insufficientFunds` | `&cYou need {price} for that.` |
| `inventoryFull` | `&cYour inventory has no room for {item}.` |
| `notEnoughItems` | `&cYou do not have the items for that.` |
| `nothingToSell` | `&cYou have no {item} to sell.` |
| `paymentFailed` | `&cThe payment failed; your items were returned.` |
| `failed` | `&cThat trade failed and was undone: {reason}` |
| `containerFull` | `&cThe shop's chest has no room for your items.` |
| `containerUnavailable` | `&cThe shop's chest cannot be used: {reason}` |
| `shopMissing` | `&cThe shop {shop} is not available.` |
| `shopPermission` | `&cYou cannot use this shop.` |
| `noPages` | `&cThis shop has nothing you can use.` |
| `priceLine` | `&7Price: &f{price}` |
| `payLine` | `&7Pays: &f{price}` |
| `freeLine` | `&7Free` |
| `needsLine` | `&7Needs:` |
| `givesLine` | `&7Gives:` |
| `goodsLine` | `&8- &f{item}` |
| `limitLine` | `&7Limit: &f{used}/{limit}` |
| `resetLine` | `&7Resets every {period}` |
| `stockLine` | `&7Stock: &f{left}` |
| `lockedLine` | `&cNeeds permission` |
| `stackLine` | `&8Shift-click for a stack` |
| `previous` | `&aPrevious page` |
| `next` | `&aNext page` |
| `close` | `&cClose` |
| `mode` | `&eShowing: {mode}` |
| `modeHint` | `&7Click to switch` |
| `modeBuy` | `Buy` |
| `modeSell` | `Sell` |
| `modeTrade` | `Trade` |
| `confirmTitle` | `&8Confirm purchase` |
| `confirm` | `&aConfirm` |
| `cancel` | `&cCancel` |

## [rigs]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | | Show rigs on NPC bodies |
| `maximumBones` | `512` | 1-4096 | Bones shown to one player |
| `updatesPerTick` | `64` | 1-512 | Bone transform packets per player per tick |
| `sampleTicks` | `2` | 1-20 | Shortest animation segment, in ticks |
| `plansPerTick` | `64` | 1-1024 | NPCs that plan a segment per tick (per region on Folia) |

See [rigs and animations](/animus/06-rigs-animations).

## [editor]

These keys control how the [web editor](/animus/14-web-editor) reaches the server. A change to `listenerEnabled`, `listenAddress`, `port`, `tlsCertificate`, `tlsPrivateKey` or `openConnections` restarts only the listener, and a change to a relay key restarts only the relay connection. Paired browsers stay paired through both.

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | | Serve the editor API |
| `editorUrl` | `"https://animus-editor.web.app"` | `http` or `https` URL | Address used in pairing links |
| `listenerEnabled` | `true` | | Run the direct listener |
| `listenAddress` | `"127.0.0.1"` | Host or address | Where the listener binds. A non-loopback address needs `tlsCertificate` and `tlsPrivateKey` |
| `port` | `9797` | 0-65535 | Listener port. `0` binds any free port; the listener status and pairing links show the one it bound |
| `advertisedUrl` | `""` | `http` or `https` URL | Public `https://` address of a TLS proxy in front of the listener, put into pairing links |
| `tlsCertificate` | `""` | File path | PEM certificate. Set together with `tlsPrivateKey` |
| `tlsPrivateKey` | `""` | File path | PEM private key |
| `allowedOrigins` | `["https://animus-editor.web.app", "https://animus-editor.firebaseapp.com", "http://127.0.0.1:8098", "http://localhost:8098"]` | At most 32 | Browser origins accepted, as `scheme://host[:port]`. `http://` only on loopback |
| `tokenDays` | `7` | 1-365 | Default lifetime of a pairing |
| `auditDays` | `30` | 1-3650 | Days of editor audit log kept |
| `requestBodyBytes` | `4194304` | 1024-67108864 | Size of one request |
| `importBodyBytes` | `16777216` | 1024-268435456 | Size of one uploaded import |
| `changeSetDocuments` | `512` | 1-512 | Documents in one change set |
| `concurrentRequestsPerToken` | `8` | 1-64 | Requests one paired browser may have running |
| `requestsPerSecond` | `20` | 1-1000 | Requests per second per paired browser |
| `pairAttemptsPerMinute` | `10` | 1-600 | Pairing attempts accepted per minute |
| `openConnections` | `64` | 1-1024 | Open listener connections |
| `eventFramesPerSecond` | `20` | 1-100 | Event messages per second per connection |
| `previewsPerServer` | `4` | 0-64 | Previews at once. `0` turns previews off |
| `npcsPerPreview` | `64` | 1-64 | NPCs in one preview |
| `previewMinutes` | `15` | 1-120 | How long a preview lasts |
| `idempotencyHours` | `24` | 1-168 | How long the result of an applied change set is remembered for safe retries |
| `relayEnabled` | `true` | | Connect out to the relay |
| `relayUrl` | The Volmit relay | `wss://` URL | Relay address. `ws://` only on `127.0.0.1` or `localhost` |
| `relayReconnectMinSeconds` | `1` | 1-3600 | Shortest wait before reconnecting to the relay |
| `relayReconnectMaxSeconds` | `60` | `relayReconnectMinSeconds`-3600 | Longest wait before reconnecting |
| `relayFrameBytes` | `1048576` | 65536-16777216 | Largest relay message |
| `relayConcurrentRequests` | `64` | 1-1024 | Relayed requests handled at once |

An unknown key in `[editor]` is refused.

## [hotload]

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | | Watch the data files. When false only `config.toml` is watched |
| `sound` | `true` | | Play the chime before each message |
| `maximumFiles` | `20000` | 1-1000000 | Files watched |
| `readsPerPoll` | `256` | 1-65536 | Changed files read per 500 ms poll |
| `maximumFileBytes` | `4194304` | 1024-16777216 | Larger files are refused |

## Example

```toml
statusMessage = "Hello from Animus"
packetProofEnabled = false

[npcs]
enabled = true
viewDistance = 48
maximumVisible = 64

[behaviors.actions]
commandBehaviors = ["town:gate/open"]
commandNamespaces = []

[shops]
economy = "auto"

[shops.messages]
bought = "&aYou bought {item} for {price}."

[editor]
listenerEnabled = false
relayEnabled = true
```
