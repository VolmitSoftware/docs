---
title: SkyPrime - Commands and permissions
description: Island commands, confirmation flows and operator permissions
published: true
date: 2026-09-19T00:00:00.000Z
tags: skyprime, commands, permissions
editor: markdown
dateCreated: 2026-09-05T04:30:00.000Z
---

The root command is `/skyprime`, with `/sky`, `/is` and `/island` aliases. Running it with no arguments opens the island menu. `/sky help`, `/sky admin` and `/sky debug` list their commands.

## Player commands

| Command | Behavior |
| --- | --- |
| `create [starter]` | Reserve an island, generate starter terrain and teleport after generation |
| `home [name]` | Teleport to a saved home; defaults to `main`; aliases `spawn`, `warp` |
| `sethome [name]` | Save an in-bounds home with solid ground and headroom; aliases `setspawn`, `setwarp` |
| `delhome <name>` | Remove a named home other than `main` |
| `visit <island>` | Visit an accessible island using an online owner, unique exact island name or island UUID |
| `dimension <normal|nether|end>` | Travel to an enabled dimension of your island |
| `invite <player>` | Invite an online player or player UUID |
| `accept <island UUID>` | Accept an unexpired invitation if membership and capacity still permit it |
| `deny` | Decline a pending team invitation |
| `team` | List member UUIDs and roles; alias `members` |
| `leave` | Leave a team; owners must transfer or delete first |
| `kick <player>` | Remove a lower-ranked teammate |
| `role <player> <MEMBER|MANAGER>` | Change a teammate's role |
| `ban <player>` / `unban <player>` | Control visits by player UUID or online name |
| `transfer <player>` | Offer ownership to an existing teammate |
| `accepttransfer <island UUID>` | Accept a current ownership offer |
| `name <name>` | Rename the island |
| `flag <flag> <true|false>` | Change access, PvP, pickup, visitor building, container use, block/entity interaction or mob damage |
| `info` | Show identity, membership, radius, value and credits |
| `value` | Request bounded material-value reconciliation; alias `level` |
| `top [limit]` | Show up to 20 ranked islands |
| `vote <island>` | Vote once for another public island |
| `bank` | Open the credit balance and paginated transaction history |
| `upgrade [expansion|team|homes|generator]` | Open upgrade choices, or buy the next level of a selected track |
| `missions` | Open one-time, daily and weekly progress; alias `challenges` |
| `claim <mission>` | Claim a completed mission after checking current progress and prerequisites |
| `trust <player> [access]` | Grant lasting guest access; defaults to visit only |
| `coop <player> [access]` | Grant temporary guest access; defaults to visit only |
| `untrust <player>` | Remove permanent and temporary access; alias `uncoop` |
| `guests` | View grants, expiry and authorized removal controls |
| `template list` | Browse available built-in and permitted custom starters |
| `chat [message|on|off]` | Toggle island chat without arguments, switch the channel on/off, or send a message of up to 256 characters |
| `delete` | Open a permanent deletion confirmation |
| `reset [starter]` | Open a terrain-reset confirmation |
| `confirm` / `cancel` | Resolve the pending deletion/reset request |
| `language ...` | Personal language selection and authorized server translation tools |

Destructive requests expire after 30 seconds and are bound to the requesting player and island UUID. Only the owner can reset or delete. Reset clears terrain, stored homes and value, while preserving the team, bank, upgrades, votes and already-claimed rewards.

Player-name arguments resolve online players; `untrust` also accepts a stored guest name. Otherwise, UUIDs support offline targets without blocking name lookup. Visit and vote accept exact island names containing spaces, for example `/sky visit Garden Market`; use the UUID when names are ambiguous. Director also supports named optional arguments such as `starter=big`, `home=visitor`, `limit=20`, `track=team` and `access=containers,pickup`. Built-in starters are `small`, `normal` and `big`; custom IDs are configured through [Starter Templates](/skyprime/06-starter-templates).

`/sky flag` takes `PUBLIC_ACCESS`, `PVP`, `PICKUP`, `BUILD`, `CONTAINERS`, `INTERACT`, `KILL_MOBS` or `ENTITY_INTERACT`. See [Protection](/skyprime/03-islands-progression#protection) for what each one covers.

`trust` and `coop` take `visit`, or a comma-separated list of `build`, `containers`, `pickup`, `interact`, `kill_mobs` and `entity_interact`. For example `/sky trust Gardener containers,pickup`, or `/sky coop Builder build` for temporary building. Reissuing `trust` replaces that guest's flags; revoke a permanent grant before making a temporary one. Temporary access also ends when the issuer disconnects, loses management authority, or the island is reset or deleted. Bans override every grant.

Island chat picks the island you are standing on, or your own team when you are elsewhere, and reaches teammates and visitors currently on it. With channel mode on, ordinary chat stays private until `/sky chat off`, another `/sky chat`, or disconnect. A configuration-editor chat prompt takes precedence over channel mode.

## Operator commands

| Command | Permission |
| --- | --- |
| `/sky config` | `skyprime.config` |
| `/sky reload` | `skyprime.config` |
| `/sky debug status` | `skyprime.debug` |
| `/sky debug dump [upload=false]` | `skyprime.debug` |
| `/sky admin inspect <island UUID>` | `skyprime.admin` |
| `/sky admin resume <island UUID> [starter=normal]` | `skyprime.admin` |
| `/sky admin delete <island UUID> <same UUID>` | `skyprime.admin`; repeat the UUID to confirm cleanup |
| `/sky admin reconcile <island UUID>` | `skyprime.admin` |
| `/sky admin credit <island UUID> <positive amount>` | `skyprime.admin` |
| `/sky template pos1`, `pos2`, `origin` | `skyprime.admin` |
| `/sky template capture <id> <normal|nether|end>` | `skyprime.admin` |

`skyprime.use` and `skyprime.create` default to all players. `skyprime.config`, `skyprime.debug`, `skyprime.admin` and `skyprime.bypass` default to operators. The bypass permission allows protected-world interaction; it does not grant island ownership for team mutations.

Personal language selection needs `skyprime.language.self`; changing the server default needs `skyprime.config` or `volmit.language.admin`. See [Languages](/languages).

Operator credit grants go into the island ledger and the console audit log. Diagnostic uploads are off by default and also need `general.debugUploadEnabled = true`.
