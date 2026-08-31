---
title: "Commands and Permissions"
description: "Foundation command syntax, aliases, modules, and complete permission-node inventory"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "foundation, commands, permissions"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Foundation registers 119 canonical commands through one catalog on Paper and Spigot. Runtime modules attach and remove handlers without changing that catalog, so a command owned by a disabled or failed module remains discoverable and reports that its module is unavailable.

## Control center

| Command | Permission | Behavior |
|---|---|---|
| `/foundation` (`fdn`, `found`, `foundations`) | `foundation.user` or `foundation.admin` | Opens the player control center; subcommands work from console |
| `/foundation menu` (`gui`, `open`) | `foundation.user` or `foundation.admin` | Opens the control center |
| `/foundation status` (`about`, `version`) | None | Shows version, Java, and module totals |
| `/foundation reload` | `foundation.admin.reload` | Parses, validates, and applies `foundation.toml` |
| `/foundation modules` (`features`) | `foundation.admin.modules` | Lists every module and lifecycle state |
| `/foundation config` (`editor`, `settings`) | `foundation.admin.config` | Opens the transactional configuration editor |
| `/foundation doctor` (`diagnostics`) | `foundation.admin.diagnostics` | Reports failed and blocked modules |
| `/foundation language <locale>` (`locale`, `lang`) | `foundation.admin.config` | Selects an installed `languages/<locale>.toml` file through transactional config mutation |
| `/foundation debug` (`report`) | `foundation.admin.debug` | Saves a sanitized diagnostic report and uploads it to mclo.gs only when enabled |
| `/foundation help [page]` (`?`) | None | Opens the clickable command atlas containing every canonical command and every Foundation administrative subcommand |

The command atlas displays eight explained entries per page, includes aliases, suggests a selected command into player chat instead of executing it, and provides clickable previous and next controls. Console senders receive the same complete paged inventory; `/foundation` without arguments opens the control center for a player and page one of the atlas for the console.

## Arrival and saved locations

| Command | Permission | Behavior |
|---|---|---|
| `/spawn [player]` | `foundation.spawn.use`; another player also requires `foundation.spawn.others` | Uses Foundation spawn through the teleport service |
| `/setspawn` | `foundation.spawn.set` | Stores the current location as Foundation and vanilla spawn |
| `/home [name]` | `foundation.home.use` | Teleports to a named home or the configured default |
| `/homes` | `foundation.home.use` | Lists personal homes |
| `/sethome [name]` | `foundation.home.set` | Stores a home subject to name and count limits |
| `/delhome [name]` | `foundation.home.delete` | Deletes a home |
| `/renamehome <old> <new>` | `foundation.home.rename` | Renames a home without changing its location |
| `/warp <name>` | `foundation.warp.use` | Teleports to a shared warp |
| `/warps` | `foundation.warp.use` | Lists shared warps |
| `/setwarp <name>` | `foundation.warp.manage` | Stores a shared warp |
| `/delwarp <name>` | `foundation.warp.manage` | Deletes a shared warp |

`foundation.home.limit.unlimited` bypasses the count. Numeric nodes from `foundation.home.limit.1` through `.1000` may grant a higher limit; the highest granted value wins over `homes.defaultLimit`.

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

Teleport bypass nodes are `foundation.teleport.instant`, `foundation.teleport.cooldown.bypass`, `foundation.teleport.safety.bypass`, and `foundation.teleport.toggle.bypass`.

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
| `/mail read [page]` | `foundation.mail` | Reads and marks a mailbox page |
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
| `/clearwarnings <player> [id\|all]` | `foundation.moderation.warnings.clear` | Removes one matching warning or all warnings |
| `/freeze <player> [on\|off]` | `foundation.moderation.freeze` | Persists movement and command blocking |
| `/setjail <name>` | `foundation.moderation.jail.manage` | Stores a named jail |
| `/deljail <name>` | `foundation.moderation.jail.manage` | Deletes a named jail |
| `/jails` | `foundation.moderation.jail.list` | Lists named jails |
| `/jail <player> <jail> [duration] [reason]` | `foundation.moderation.jail` | Persists jail state and remembers a return point |
| `/unjail <player>` | `foundation.moderation.jail` | Releases a profile and returns an online player when possible |

Durations accept compound `s`, `m`, `h`, `d`, `w`, `mo`, and `y` units, such as `1h30m`, plus `permanent`. Exemption nodes are `foundation.moderation.kick.exempt`, `.mute.exempt`, and `.jail.exempt`.

## Kits and item utilities

| Command | Permission | Behavior |
|---|---|---|
| `/kit [name] [player]` | `foundation.kit.use` plus `foundation.kit.<name>` or `.all`; another player also requires `.others` | Grants a kit after cooldown and inventory checks |
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
| `/anvil`, `/grindstone`, `/smithingtable`, `/loom`, `/stonecutter`, `/cartographytable` (`carttable`) | Matching `foundation.item.menu.<type>` | Opens the named portable vanilla workstation |
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
| `/speed <1..maximum> [walk\|fly]` | `foundation.utility.speed` | Sets walk or flight speed |
| `/hat` | `foundation.utility.hat` | Swaps held item and helmet |
| `/workbench` (`craft`) | `foundation.utility.workbench` | Opens a crafting view |
| `/enderchest` (`ec`) | `foundation.utility.enderchest` | Opens the sender's ender chest |
| `/invsee <player>` | `foundation.utility.invsee` | Opens a read-only scheduler-safe inventory snapshot |
| `/afk` | `foundation.state.afk` | Toggles AFK |
| `/vanish [player]` (`v`) | `foundation.state.vanish` | Toggles Foundation-owned vanish |
| `/cosmetics` (`flair`) | `foundation.cosmetics.menu` | Opens the VolmLib arrival-flair picker and persists a personal teleport particle |
| `/celebrate [player]` | `foundation.cosmetics.celebrate`; another player also requires `.celebrate.others` | Plays a bounded selected-particle burst subject to cooldown |

Remote utility use also requires `foundation.utility.others`. Remote vanish requires `foundation.state.vanish.others`; `foundation.state.vanish.see` keeps Foundation-vanished players visible.

## Economy and information

| Command | Permission | Behavior |
|---|---|---|
| `/balance [player]` (`bal`, `money`) | `foundation.economy.balance`; another player also requires `.balance.others` | Shows a balance |
| `/balancetop [page]` (`baltop`) | `foundation.economy.balancetop` | Asynchronously scans up to the configured profile cap and shows ten accounts per page |
| `/pay <player> <amount>` | `foundation.economy.pay` | Atomically transfers a positive amount |
| `/economy <give\|take\|set\|reset> <player> [amount]` (`eco`) | `foundation.economy.admin` | Administers online balances |
| `/worth` | `foundation.economy.worth` | Opens the localized, paged eleven-category worth browser |
| `/worth <material>` | `foundation.economy.worth` | Shows the unit sell value from `worth.toml` |
| `/setworth <material> <price>` | `foundation.economy.setworth` | Atomically edits `worth.toml`; zero disables selling while retaining the item |
| `/sell [hand\|all]` | `foundation.economy.sell` | Sells priced items; whole-inventory sales require `/sell all confirm` |
| `/ping [player]` | `foundation.info.ping`; another player also requires `.ping.others` | Shows latency |
| `/near [radius]` (`nearby`) | `foundation.info.near` | Lists visible nearby players within the configured bound |
| `/list` (`online`) | `foundation.info.list` | Lists visible online players |
| `/seen <player>` | `foundation.info.seen` | Reads persisted seen state asynchronously |
| `/whois <player>` | `foundation.info.whois` | Shows detailed live player state, including address |
| `/playtime [player]` | `foundation.info.playtime`; another player also requires `.playtime.others` | Shows live playtime |
| `/rules` | `foundation.info.rules` | Shows configured MiniMessage rule lines |

## Gameplay and guarded administration

| Command | Permission | Behavior |
|---|---|---|
| `/gamemode <mode> [player]` (`gm`) | `foundation.gameplay.gamemode`; another player also requires `.gamemode.others` | Sets a vanilla game mode |
| `/gms [player]`, `/gmc [player]`, `/gma [player]`, `/gmsp [player]` | `foundation.gameplay.gamemode` | Fixed-mode forms |
| `/time <day\|noon\|night\|midnight\|ticks> [world]` | `foundation.gameplay.time` | Sets a loaded world's time |
| `/weather <clear\|rain\|thunder> [seconds] [world]` | `foundation.gameplay.weather` | Sets bounded loaded-world weather |
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

## Complete permission-node inventory

The descriptors define the following 145 static nodes. Dynamic home-limit nodes and `foundation.kit.<name>` are evaluated at runtime and therefore are not enumerated in a descriptor.

```text
foundation.*
foundation.admin
foundation.user
foundation.admin.reload
foundation.admin.config
foundation.admin.modules
foundation.admin.diagnostics
foundation.admin.debug
foundation.spawn.use
foundation.spawn.set
foundation.spawn.others
foundation.home.use
foundation.home.set
foundation.home.delete
foundation.home.rename
foundation.home.limit.unlimited
foundation.warp.use
foundation.warp.manage
foundation.teleport.request
foundation.teleport.request.all
foundation.teleport.back
foundation.teleport.instant
foundation.teleport.cooldown.bypass
foundation.teleport.safety.bypass
foundation.teleport.admin
foundation.teleport.admin.others
foundation.teleport.mass
foundation.teleport.jump
foundation.teleport.world
foundation.teleport.bottom
foundation.teleport.offline
foundation.teleport.auto
foundation.teleport.toggle
foundation.teleport.toggle.bypass
foundation.social.message
foundation.social.ignore
foundation.social.spy
foundation.social.toggle
foundation.social.toggle.bypass
foundation.social.helpop
foundation.social.helpop.receive
foundation.utility.heal
foundation.utility.feed
foundation.utility.fly
foundation.utility.god
foundation.utility.speed
foundation.utility.hat
foundation.utility.workbench
foundation.utility.enderchest
foundation.utility.invsee
foundation.utility.others
foundation.economy.balance
foundation.economy.balance.others
foundation.economy.balancetop
foundation.economy.pay
foundation.economy.pay.toggle
foundation.economy.pay.bypass
foundation.economy.admin
foundation.state.afk
foundation.state.vanish
foundation.state.vanish.others
foundation.state.vanish.see
foundation.info.ping
foundation.info.ping.others
foundation.info.near
foundation.info.list
foundation.info.seen
foundation.info.whois
foundation.info.playtime
foundation.info.playtime.others
foundation.info.rules
foundation.gameplay.gamemode
foundation.gameplay.gamemode.others
foundation.gameplay.time
foundation.gameplay.weather
foundation.gameplay.position
foundation.gameplay.position.others
foundation.gameplay.top
foundation.gameplay.suicide
foundation.gameplay.clearinventory
foundation.gameplay.clearinventory.others
foundation.gameplay.more
foundation.gameplay.ptime
foundation.gameplay.ptime.others
foundation.gameplay.pweather
foundation.gameplay.pweather.others
foundation.gameplay.lightning
foundation.gameplay.lightning.others
foundation.moderation.kick
foundation.moderation.kick.exempt
foundation.moderation.kickall
foundation.moderation.mute
foundation.moderation.mute.exempt
foundation.moderation.warn
foundation.moderation.warnings
foundation.moderation.warnings.clear
foundation.moderation.freeze
foundation.moderation.jail
foundation.moderation.jail.manage
foundation.moderation.jail.list
foundation.moderation.jail.exempt
foundation.mail
foundation.mail.sendall
foundation.options
foundation.item.give
foundation.item.spawn
foundation.item.repair
foundation.item.repair.others
foundation.item.enchant
foundation.item.enchant.unsafe
foundation.item.exp
foundation.item.exp.others
foundation.item.disposal
foundation.item.menu.anvil
foundation.item.menu.grindstone
foundation.item.menu.smithing
foundation.item.menu.loom
foundation.item.menu.stonecutter
foundation.item.menu.cartography
foundation.item.extinguish
foundation.item.extinguish.others
foundation.item.burn
foundation.item.rest
foundation.item.rest.others
foundation.item.kill
foundation.item.kill.exempt
foundation.item.compass
foundation.item.depth
foundation.item.lookup
foundation.kit.use
foundation.kit.others
foundation.kit.manage
foundation.kit.preview
foundation.kit.reset
foundation.kit.all
foundation.kit.cooldown.bypass
foundation.administration.sudo
foundation.administration.sudo.exempt
foundation.cosmetics.menu
foundation.cosmetics.celebrate
foundation.cosmetics.celebrate.others
foundation.cosmetics.cooldown.bypass
foundation.economy.worth
foundation.economy.setworth
foundation.economy.sell
```

`foundation.user` grants the default player surface. `foundation.admin` grants the current operator actions. `foundation.*` grants both parents. Exemption nodes default false; operator and user parents do not grant exemptions.
