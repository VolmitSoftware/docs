---
title: "Commands and Permissions"
description: "Every Foundation command, its permission, and what it does"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "foundation, commands, permissions"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

## Control center

| Command | Permission | Behavior |
|---|---|---|
| `/foundation` (`fdn`, `found`, `foundations`) | Any Foundation root or routed-command permission | Opens the player control center for players with `foundation.user` or `foundation.admin`; otherwise displays the command atlas |
| `/foundation menu` (`gui`, `open`) | `foundation.user` or `foundation.admin` | Opens the control center |
| `/foundation status` (`about`, `version`) | `foundation.user` or `foundation.admin` | Shows version, Java, and module totals, plus an explicit preparation notice while the online-profile barrier is active |
| `/foundation reload` | `foundation.admin.reload` | Parses, validates, and applies `foundation.toml` |
| `/foundation modules` (`features`) | `foundation.admin.modules` | Lists every module and lifecycle state |
| `/foundation config` (`editor`, `settings`) | `foundation.admin.config` | Opens the transactional configuration editor |
| `/foundation doctor` (`diagnostics`) | `foundation.admin.diagnostics` | Reports failed or blocked modules and live ownership for every active direct-command label and alias |
| `/foundation language` (`locale`, `lang`) | Personal tools require both `foundation.language.self` and `volmit.language.self`; server tools require `foundation.admin.config` or `volmit.language.admin` | Opens the language tools available to the sender |
| `/foundation language <locale>` | Player: both personal nodes; console: either server-administration node | Selects a player's personal locale, or the server locale when issued by console |
| `/foundation language self [locale\|reset]` | Both `foundation.language.self` and `volmit.language.self` | Opens the personal picker, selects a locale, or returns to the server default |
| `/foundation language server [locale]` | `foundation.admin.config` or `volmit.language.admin` | Opens the server picker or transactionally changes the default locale |
| `/foundation language server edit [locale]` | `foundation.admin.config` or `volmit.language.admin`; player only | Opens the grouped, searchable editor, preparing an uninstalled repository or valid custom locale when needed |
| `/foundations debug` (`/foundation debug`, `report`) | `foundation.debug` | Opens the Director debug submenu; `foundation.admin.debug` grants this node |
| `/foundations debug dump [upload=true]` | `foundation.debug` | Always saves a sanitized local diagnostic report, then uploads it to mclo.gs when requested and enabled; pass `false` for local-only output |
| `/foundation help [page\|command-or-alias]` (`?`) | Any Foundation root or routed-command permission | Opens the complete clickable, paged command atlas or one command's detail card |

Each administration surface enforces the permission in its row. A granular node grants that surface and root help on its own, without the `foundation.user` or `foundation.admin` parent.

Every command and alias also works as `/foundation <command> ...`, through the `fdn`, `found`, and `foundations` roots as well, with the same permission, module, and `commands.disabled` checks. `/foundation help` opens the full clickable command list; `/foundation help <command-or-alias>` shows one command's description, aliases, module, permission, and syntax.

`commands.disabled` accepts canonical direct names only and matches case-insensitively. Disabling a name also disables its aliases, completion, root fallback, and help entry, without stopping the rest of its module.

## Arrival and saved locations

| Command | Permission | Behavior |
|---|---|---|
| `/spawn [player]` | `foundation.spawn.use`; another player also requires `foundation.spawn.others` | Uses Foundation spawn through the teleport service and reports it unset instead of falling back to a vanilla world spawn |
| `/setspawn` | `foundation.spawn.set` | Stores the current location as Foundation and vanilla spawn after restricted-world admission |
| `/home [name]` | `foundation.home.use` | Teleports to a named home or the configured default |
| `/homes` | `foundation.home.use` | Lists personal homes |
| `/sethome [name]` | `foundation.home.set` | Stores a home subject to name and count limits |
| `/delhome [name]` | `foundation.home.delete` | Deletes a home |
| `/renamehome <old> <new>` | `foundation.home.rename` | Renames a home without changing its location |
| `/warp <name>` | `foundation.warp.use`; optionally `foundation.warp.<name>` or `foundation.warp.*` | Teleports to an authorized shared warp |
| `/warps` | `foundation.warp.use` | Lists only shared warps available to the sender |
| `/setwarp <name>` | `foundation.warp.manage` | Stores a shared warp after restricted-world admission |
| `/delwarp <name>` | `foundation.warp.manage` | Deletes a shared warp |

`foundation.home.limit.unlimited` bypasses the count. Numeric nodes from `foundation.home.limit.1` through `.1000` may grant a higher limit; the highest granted value wins over `homes.defaultLimit`.

Per-warp access is off by default. Set `warps.requirePerWarpPermissions` to `true` and each warp then needs `foundation.warp.<name>` or `foundation.warp.*`, which `foundation.admin` inherits. Warp names are lowercased and must match `[a-z0-9_-]{1,32}`; `use` and `manage` are reserved. A hand-edited name outside that grammar gets no permission node of its own and is reachable only through the wildcard.

## Consent and administrative travel

| Command | Permission | Behavior |
|---|---|---|
| `/tpa <player>` | `foundation.teleport.request` | Requests travel to a visible accepting player |
| `/tpahere <player>` | `foundation.teleport.request` | Requests that a visible accepting player travel to the sender |
| `/tpaccept [player]` | `foundation.teleport.request` | Accepts a matching pending request |
| `/tpdeny [player]` | `foundation.teleport.request` | Denies a matching pending request |
| `/tpcancel` | `foundation.teleport.request` | Cancels outgoing requests and warmups |
| `/tpaall` | `foundation.teleport.request.all` | Invites every visible accepting online player, subject to the mass cap |
| `/tpauto` | `foundation.teleport.auto` | Toggles automatic request acceptance |
| `/tptoggle` | `foundation.teleport.toggle` | Toggles all incoming teleport requests |
| `/back` | `foundation.teleport.back` | Uses the latest valid back-history entry |
| `/tp <player> [destination]` (`tele`, `teleport`) | `foundation.teleport.admin`; moving another player requires `.admin.others` | Direct player teleport |
| `/tphere <player>` | `foundation.teleport.admin` | Moves an online player to the sender |
| `/tppos <x> <y> <z> [yaw] [pitch] [world]` | `foundation.teleport.admin` | Supports absolute and `~` relative coordinates |
| `/tpall [destination]` | `foundation.teleport.mass` | Queues all online players to one destination under the configured cap |
| `/jump` (`j`) | `foundation.teleport.jump` | Travels to a safe block in the sender's sightline |
| `/bottom` | `foundation.teleport.bottom` | Finds the lowest safe landing below the sender |
| `/world <loaded-world> [player]` | `foundation.teleport.world`; another player also requires `.admin.others` | Uses the loaded world's spawn without managing world lifecycle |
| `/tpoffline <player>` (`offlinetp`) | `foundation.teleport.offline` | Resolves a stored logout location asynchronously |

Disabling the `teleport` module removes consent requests, `/tpauto`, `/tptoggle`, `/back`, and back-history capture. Spawn, homes, warps, administration travel, and jail movement keep working.

| Bypass node | Skips |
|---|---|
| `foundation.teleport.instant` | The warmup on player commands |
| `foundation.teleport.cooldown.bypass` | The cooldown on player commands |
| `foundation.teleport.safety.bypass` | The safe-landing check |
| `foundation.teleport.restricted.bypass` | The restricted-world check |
| `foundation.teleport.toggle.bypass` | The target's `/tptoggle` preference |

Administration teleports, jail moves, and first-join placement always skip warmup and cooldown, but still pass the restricted-world, border, destination, and safe-landing checks.

`foundation.teleport.restricted.bypass` defaults to false and neither parent grants it. Granting it also allows `/setspawn`, `/setwarp`, and configured respawn placement inside a reserved world.

Bypasses are checked against the player being moved, not the sender. `foundation.teleport.toggle.bypass` is the exception: it applies to whoever runs `/tpa` or `/tpahere`. `/tpaall` always honors each recipient's preference.

## Social, options, and mail

| Command | Permission | Behavior |
|---|---|---|
| `/msg <player> <message>` (`tell`, `whisper`, `w`) | `foundation.social.message` | Sends a bounded private message subject to ignores and acceptance |
| `/reply <message>` (`r`) | `foundation.social.message` | Replies to the last saved conversation partner |
| `/ignore <player>` | `foundation.social.ignore` | Toggles an ignore entry |
| `/socialspy` | `foundation.social.spy` | Toggles opt-in staff observation of private messages |
| `/msgtoggle` | `foundation.social.toggle` | Toggles incoming private messages |
| `/paytoggle` | `foundation.economy.pay.toggle` | Toggles incoming economy payments |
| `/options [msg\|tp\|pay]` | `foundation.options` | Shows or changes all three acceptance preferences |
| `/helpop <message>` | `foundation.social.helpop` | Sends a bounded functional message to online `foundation.social.helpop.receive` staff |
| `/mail read [page]` | `foundation.mail` | Displays the selected page and marks only those displayed messages read |
| `/mail send <player> <message>` | `foundation.mail` | Delivers to an online or offline Foundation profile |
| `/mail clear` | `foundation.mail` | Clears the sender's mailbox |
| `/mail sendall <message>` | `foundation.mail.sendall` | Delivers to all currently online profiles |

`foundation.social.toggle.bypass` and `foundation.economy.pay.bypass` bypass recipient acceptance for their respective actions.

## Moderation and jails

| Command | Permission | Behavior |
|---|---|---|
| `/kick <player> [reason]` | `foundation.moderation.kick` | Kicks a non-exempt online player |
| `/kickall [reason]` | `foundation.moderation.kickall` | Kicks every non-exempt online player except the issuing player |
| `/mute <player> [duration] [reason]` | `foundation.moderation.mute` | Persists an online or offline mute |
| `/unmute <player>` | `foundation.moderation.mute` | Clears a persisted mute |
| `/warn <player> <reason>` | `foundation.moderation.warn` | Adds a bounded persistent warning |
| `/warnings <player>` | `foundation.moderation.warnings` | Lists warning IDs, timestamps, actors, and reasons |
| `/clearwarnings <player> [id\|all]` | `foundation.moderation.warnings.clear` | Removes an exact warning ID, a unique displayed eight-character-or-longer prefix, or all warnings |
| `/freeze <player> [on\|off]` | `foundation.moderation.freeze` | Persists movement and command blocking |
| `/setjail <name>` | `foundation.moderation.jail.manage` | Stores a named jail |
| `/deljail <name>` | `foundation.moderation.jail.manage` | Deletes a named jail only after a bounded profile scan proves it has no active sentences |
| `/jails` | `foundation.moderation.jail.list` | Lists named jails |
| `/jail <player> <jail> [duration] [reason]` | `foundation.moderation.jail` | Persists jail state and remembers a return point |
| `/unjail <player>` | `foundation.moderation.jail` | Releases a profile and returns an online player when possible |

Durations accept compound `s`, `m`, `h`, `d`, `w`, `mo`, and `y` units, such as `1h30m`, plus `permanent`. Exemption nodes are `foundation.moderation.kick.exempt`, `.mute.exempt`, and `.jail.exempt`.

## Kits and item utilities

| Command | Permission | Behavior |
|---|---|---|
| `/kit [name] [player]` | `foundation.kit.use` plus `foundation.kit.<name>` or `.all`; another player also requires `.others` | Grants a kit after cooldown and inventory checks; completion exposes only permitted kits |
| `/kits` | `foundation.kit.use` | Lists only kits visible through kit-specific permissions |
| `/createkit <name> [cooldown]` | `foundation.kit.manage` | Snapshots every non-air item in the sender's inventory |
| `/delkit <name>` | `foundation.kit.manage` | Deletes an atomic kit record |
| `/showkit <name>` | `foundation.kit.preview` | Opens a read-only preview |
| `/kitreset <name> [player]` | `foundation.kit.reset` | Clears a persisted kit cooldown |
| `/give <player> <material> [amount]` | `foundation.item.give` | Grants a bounded vanilla item after full-capacity preflight |
| `/item <material> [amount]` (`i`) | `foundation.item.spawn` | Self-targeted item grant |
| `/repair [hand\|all] [player]` (`fix`) | `foundation.item.repair`; another player also requires `.repair.others` | Resets damageable item metadata |
| `/enchant <enchantment> [level]` | `foundation.item.enchant` | Applies a registered compatible enchantment; level zero removes it |
| `/exp <show\|give\|set\|reset> [player] [amount]` (`xp`) | `foundation.item.exp`; another player also requires `.exp.others` | Inspects or changes bounded total experience |
| `/disposal` (`trash`) | `foundation.item.disposal` | Opens a configurable discard inventory |
| `/anvil`, `/grindstone`, `/smithingtable`, `/loom`, `/stonecutter`, `/cartographytable` (`carttable`) | `foundation.item.menu.anvil`, `.grindstone`, `.smithing`, `.loom`, `.stonecutter`, `.cartography` | Opens the named portable vanilla workstation |
| `/ext [player]` (`extinguish`) | `foundation.item.extinguish`; another player also requires `.extinguish.others` | Clears fire and freeze ticks |
| `/burn <player> <seconds>` | `foundation.item.burn` | Applies a bounded fire duration |
| `/rest [player]` | `foundation.item.rest`; another player also requires `.rest.others` | Resets time-since-rest, exhaustion, and saturation |
| `/kill <player>` | `foundation.item.kill` | Kills a non-exempt online player |
| `/compass` (`direction`) | `foundation.item.compass` | Shows bearing and degrees |
| `/depth` | `foundation.item.depth` | Shows height relative to sea level |
| `/itemdb <search>` | `foundation.item.lookup` | Lists up to 20 matching vanilla item keys |

Unsafe enchantment levels require both `items.unsafeEnchantments=true` and `foundation.item.enchant.unsafe`. Kit cooldown bypass is `foundation.kit.cooldown.bypass`; kill exemption is `foundation.item.kill.exempt`.

## Player utilities and state

| Command | Permission | Behavior |
|---|---|---|
| `/heal [player]` | `foundation.utility.heal` | Restores health and clears fire |
| `/feed [player]` | `foundation.utility.feed` | Restores food and saturation |
| `/fly [player]` | `foundation.utility.fly` | Toggles Foundation-owned flight state |
| `/god [player]` | `foundation.utility.god` | Toggles Foundation-owned damage cancellation |
| `/speed <1..maximum> [walk\|fly]` | `foundation.utility.speed` | Player-only; sets walk or flight speed and rejects unknown movement-mode tokens |
| `/hat` | `foundation.utility.hat` | Swaps held item and helmet |
| `/workbench` (`craft`) | `foundation.utility.workbench` | Opens a crafting view |
| `/enderchest` (`ec`) | `foundation.utility.enderchest` | Opens the sender's ender chest |
| `/invsee <player>` | `foundation.utility.invsee` | Opens a read-only scheduler-safe inventory snapshot |
| `/afk` | `foundation.state.afk` | Toggles AFK |
| `/vanish [player]` (`v`) | `foundation.state.vanish` | Toggles Foundation-owned vanish |
| `/cosmetics` (`flair`) | `foundation.cosmetics.menu` | Opens the VolmLib arrival-flair picker and persists a personal teleport particle |
| `/celebrate [player]` | `foundation.cosmetics.celebrate`; another player also requires `.celebrate.others` | Plays a bounded selected-particle burst subject to cooldown |

Remote utility use also requires `foundation.utility.others`. Remote vanish requires `foundation.state.vanish.others`; `foundation.state.vanish.see` keeps Foundation-vanished players visible. `foundation.cosmetics.cooldown.bypass` skips the `/celebrate` cooldown.

## Economy and information

| Command | Permission | Behavior |
|---|---|---|
| `/balance [player]` (`bal`, `money`) | `foundation.economy.balance`; another player also requires `.balance.others` | Shows an online or uniquely indexed offline account balance without a blocking profile lookup |
| `/balancetop [page]` (`baltop`) | `foundation.economy.balancetop` | Asynchronously sorts a bounded snapshot of the live balance index and shows ten accounts per page |
| `/pay <player> <amount>` | `foundation.economy.pay` | Atomically transfers a positive amount |
| `/economy <give\|take\|set\|reset> <player> [amount]` (`eco`) | `foundation.economy.admin` | Administers online or uniquely indexed offline balances; only online targets receive immediate notification |
| `/worth` | `foundation.economy.worth` | Opens the localized, paged eleven-category worth browser |
| `/worth <material>` | `foundation.economy.worth` | Shows the unit sell value from `worth.toml` |
| `/setworth <material> <price>` | `foundation.economy.setworth` | Atomically edits `worth.toml`; zero disables selling while retaining the item |
| `/sell [hand\|all]` | `foundation.economy.sell` | Sells priced items; whole-inventory sales require `/sell all confirm` |
| `/ping [player]` | `foundation.info.ping`; another player also requires `.ping.others` | Shows latency |
| `/near [radius]` (`nearby`) | `foundation.info.near` | Lists visible players within the configured three-dimensional radius |
| `/list` (`online`) | `foundation.info.list` | Lists visible online players |
| `/seen <player>` | `foundation.info.seen` | Reads persisted seen state asynchronously |
| `/whois <player>` | `foundation.info.whois`; network address also requires `.whois.address` | Shows detailed live player state and redacts the address without the sensitive-data permission |
| `/playtime [player]` | `foundation.info.playtime`; another player also requires `.playtime.others` | Shows live playtime |
| `/rules` | `foundation.info.rules` | Shows configured MiniMessage rule lines |

## Gameplay and guarded administration

| Command | Permission | Behavior |
|---|---|---|
| `/gamemode <mode> [player]` (`gm`) | `foundation.gameplay.gamemode`; another player also requires `.gamemode.others` | Sets a vanilla game mode |
| `/gms [player]`, `/gmc [player]`, `/gma [player]`, `/gmsp [player]` | `foundation.gameplay.gamemode`; another player also requires `.gamemode.others` | Fixed-mode forms |
| `/time <day\|noon\|night\|midnight\|ticks> [world]` | `foundation.gameplay.time` | Sets a loaded world's time |
| `/weather <clear\|rain\|thunder> [seconds] [world]` | `foundation.gameplay.weather` | Sets bounded loaded-world weather; omitted duration defaults to 600 seconds and malformed explicit durations are rejected |
| `/ptime <reset\|time> [player]` | `foundation.gameplay.ptime`; another player also requires `.ptime.others` | Changes personal client time |
| `/pweather <reset\|clear\|rain> [player]` | `foundation.gameplay.pweather`; another player also requires `.pweather.others` | Changes personal client weather |
| `/lightning [player]` (`smite`) | `foundation.gameplay.lightning`; another player also requires `.lightning.others` | Strikes lightning at the target |
| `/getpos [player]` (`position`, `coords`) | `foundation.gameplay.position`; another player also requires `.position.others` | Shows block coordinates and world |
| `/top` | `foundation.gameplay.top` | Uses the teleport service to reach the surface |
| `/suicide confirm` | `foundation.gameplay.suicide` | Requires a same-sender timed confirmation |
| `/clearinventory [player] confirm` (`ci`) | `foundation.gameplay.clearinventory`; another player also requires `.clearinventory.others` | Requires a same-sender, same-target confirmation |
| `/more` | `foundation.gameplay.more` | Fills the held stack to its normal maximum |
| `/sudo <player> <command>` | `foundation.administration.sudo` | Rejects exempt targets, blocked roots, line breaks, and oversized input before dispatch |

`foundation.administration.sudo.exempt` prevents a target from being controlled through `/sudo`.

## Permission parents and dynamic nodes

`foundation.user` grants the player surface, `foundation.admin` the operator actions (including `foundation.admin.debug`, which grants `foundation.debug`), and `foundation.*` both. Exemption nodes default to false and neither parent grants them.

Some nodes are created at runtime rather than declared: `foundation.home.limit.1` through `foundation.home.limit.1000`, `foundation.warp.<name>`, and `foundation.kit.<name>`. The language service registers `foundation.language.self` and `volmit.language.self` (both default `true`) and `volmit.language.admin` (operator).

See [Languages](/languages) for the language commands and their permissions.
