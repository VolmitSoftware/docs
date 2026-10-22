---
title: SkyPrime - Commands and permissions
description: Island commands, confirmation flows and operator permissions
published: true
date: 2026-10-21T00:00:00.000Z
tags: skyprime, commands, permissions
editor: markdown
dateCreated: 2026-09-05T04:30:00.000Z
---

The root command is `/skyprime`, with `/sky`, `/is` and `/island` aliases. The root without arguments shows command help; `/sky menu` opens the island menu. `/sky help`, `/sky admin` and `/sky debug` show Director command help. Descriptions follow the selected language, with built-in English as fallback.

Every subcommand needs `skyprime.command`. `help`, `version`, `status`, `debug`, `language` and `config` need nothing more to start, although `debug` and `config` check their own permissions. Every other subcommand also needs `skyprime.use`, and tab completion offers only what the sender can run.

Island-management inventory actions belong to the viewer's current team; if membership changes while a menu is open, the next queued management action opens the current island menu without applying the old action. Rankings and personal reward receipts remain accessible across membership changes.

Island action permissions are separate from Bukkit permission nodes. Owners and managers retain their built-in actions. Custom roles replace a member’s action set; only the owner may create, edit, delete or assign roles. See [Team roles](/skyprime/03-islands-progression#team-roles).

Event viewing uses `skyprime.events` (default everyone). Manual activation/stopping and token grants use `skyprime.events.admin` (default operators). Buying and redeeming require `UPGRADES` plus `skyprime.events.buy` or `skyprime.events.redeem` (default everyone). Buying or redeeming a server-wide booster additionally requires `skyprime.events.server` (default operators); `/sky event start <id> server` needs only `skyprime.events.admin`. See [Events and boosters](/skyprime/09-events-boosters) for timing and scope rules.

Contract viewing and delivery permissions default to everyone; contract administration defaults to operators. `CONTRACTS` is included in the default member action set. Inputs must be ordinary storage-inventory items, and a confirmation consumes the whole order. See [Island contracts](/skyprime/10-contracts).

## Player commands

Prefix each command below with `/sky`. Angle brackets mark required arguments, square brackets mark optional arguments, and `|` separates alternatives.

| Command | Behavior |
| --- | --- |
| `menu` | Open the island menu |
| `history [category=all] [actor=all] [search=*] [page=1]` | Browse retained changes on your current team island; requires `skyprime.history` and the island `HISTORY` action |
| `favorites` | Browse personal favorites; requires `skyprime.social.favorites` |
| `favorite <island>` / `unfavorite <island>` | Save or remove an island UUID or unique exact name; requires `skyprime.social.favorites` |
| `rate <1-5> <island>` | Rate the island after a qualified continuous visit; requires `skyprime.social.rate` |
| `unrate <island>` | Withdraw your rating while retaining its cooldown; requires `skyprime.social.rate` |
| `contracts` | Browse the current island contract board; requires `skyprime.contracts` |
| `contract deliver <id>` | Review a complete order, its consumed inputs and rewards; requires `CONTRACTS` and `skyprime.contracts.deliver` |
| `contract confirm` / `contract cancel` | Resolve the pending 30-second delivery quote; closing the inventory retains it, quitting clears it |
| `contract pending` | List interrupted deliveries awaiting review; requires `skyprime.contracts.admin` |
| `contract resolve <UUID> <consumed\|cancel>` | Resolve an interrupted input receipt after investigation; requires `skyprime.contracts.admin` |
| `events` | Browse active server/island bonuses and the event catalog; console receives the server report; requires `skyprime.events` |
| `event start <id> <server\|island>` | Start a persisted manual event for the server or an active island UUID/unique exact name; requires `skyprime.events.admin` |
| `event stop <id> <server\|island>` | Stop manual, purchased and token timers without a refund; scheduled windows are controlled in TOML; requires `skyprime.events.admin` |
| `event buy <id> <island\|server>` | Review activating a booster using island-bank credits; purchases must be enabled for the definition |
| `event redeem <id> <island\|server>` | Review consuming one matching token from the shared island wallet |
| `event confirm` / `event cancel` | Resolve the pending 30-second booster offer; closing its menu retains the offer, quitting clears it |
| `event grant <id> <island\|server> <amount> <target>` | Administrator grants scoped tokens to an island UUID or unique exact name, including spaces |
| `environmentmenu` | Open time, weather and difficulty choices for your island; teammates can inspect, teammates with `ENVIRONMENT` can save |
| `biomes` | Inspect biome selections and update status for available island dimensions |
| `biome <dimension> <biome>` | Teammates with `ENVIRONMENT` directly apply a registered namespaced biome for `normal`, `nether` or `end` |
| `gamerules` | Open the island game-rule menu; teammates can inspect, teammates with `ENVIRONMENT` can save |
| `gamerule <rule> <value>` | Save one of 34 [island gamerules](/skyprime/14-gamerules); Boolean `server`/`enabled`/`disabled` or bounded integer/`server`; requires `ENVIRONMENT` |
| `create [starter]` | Reserve an island, generate starter terrain and teleport after generation |
| `preview start <starter> [dimension=normal]` | Inspect an available built-in or custom starter in an isolated spectator world; dimensions `normal`, `nether`, `end` |
| `preview leave` | Leave a starter preview and restore the previous state; permitted even after preview access is revoked |
| `home [name]` | Teleport to a saved home; defaults to `main`; aliases `spawn`, `warp` |
| `sethome [name]` | Save an in-bounds home with solid ground and headroom; aliases `setspawn`, `setwarp` |
| `delhome <name>` | Remove a named home other than `main` |
| `visit <island>` | Visit an accessible island using an online owner, unique exact island name or island UUID |
| `visitors` / `visitors menu` | Browse visitor entry rules, shared capacity and the visit-only allowlist; teammates without `VISITORS` have read-only controls |
| `visitors mode <default\|allowlist\|closed>` | Teammates with `VISITORS` set the entry policy |
| `visitors limit <0-1000>` | Teammates with `VISITORS` set the shared nonteam visitor limit; zero means unlimited |
| `visitors allow <player>` | Teammates with `VISITORS` grant visit-only access to an online player or UUID |
| `visitors remove <player>` | Teammates with `VISITORS` remove visit-only allowlist access |
| `directory [search=*] [sort=name] [filter=public]` | Search island names and browse visitable islands; sorts `name`, `value`, `votes`, `newest`, `popular`; filters `public`, `accessible`, `online`, `favorites` |
| `dimension <normal\|nether\|end>` | Travel to an available island dimension; optional dimensions require global enablement and any required unlock |
| `dimensions` | Browse Overworld, Nether and End availability, requirements and travel actions for your island |
| `milestones` | Browse level rewards, highest recorded level and claim states; refresh recalculates island value |
| `milestone <id>` | Teammates with `MILESTONES` review and confirm a once-per-island level reward within 30 seconds |
| `unlock <nether\|end>` | Teammates with `DIMENSIONS` preview an island-wide dimension unlock and confirm within 30 seconds |
| `invite <player>` | Invite an online player or player UUID |
| `accept <island UUID>` | Accept an unexpired invitation if membership and capacity still permit it |
| `deny` | Decline a pending team invitation |
| `team` | List member UUIDs and roles; alias `members` |
| `leave` | Leave a team; owners must transfer or delete first |
| `kick <player>` | Remove a lower-ranked teammate |
| `role <player> <member\|manager\|custom-key>` | Owner assigns a built-in or custom role; custom roles require an existing core member |
| `roles` / `roles menu` | Browse roles, action permissions and teammate assignments |
| `roles create <role>` | Owner creates an empty custom role |
| `roles delete <role>` | Owner deletes an unassigned custom role |
| `roles permission <role> <action> <allowed>` | Owner directly allows or denies an `IslandAction` using `true` or `false` |
| `ban <player>` / `unban <player>` | Control visits by player UUID or online name |
| `transfer <player>` | Offer ownership to an existing teammate |
| `accepttransfer <island UUID>` | Accept a current ownership offer |
| `name <name>` | Rename the island |
| `flag <flag> <true\|false>` | Change access, PvP, pickup, visitor building, container use, block/entity interaction or mob damage |
| `time <world\|day\|noon\|night\|midnight>` | Teammates with `ENVIRONMENT` set the island world's time |
| `weather <world\|clear\|rain>` | Teammates with `ENVIRONMENT` set the island world's weather |
| `difficulty <server\|peaceful\|easy\|normal\|hard>` | Teammates with `ENVIRONMENT` set difficulty across their island's dimensions |
| `environment` | Teammates read the island's current time, weather and difficulty preferences |
| `info` | Show identity, membership, radius, value and credits |
| `value` | Request a fresh bounded material-value scan; alias `level` |
| `valuebreakdown` | Browse your active island's cached material counts, unit values and contributions; Refresh requests a new scan |
| `top [type=value] [limit=10]` | Show `value`, `bank` or `votes` rankings; limit is clamped to 1–20; also available to console |
| `rankings [type=value]` | Open paginated `value`, `bank` or `votes` rankings; island membership is not required |
| `vote <island>` | Vote once for another public island |
| `bank` / `bank menu` | Open the credit balance and paginated transaction history |
| `research [node]` | Browse research branches or inspect a node; teammates with `UPGRADES` review and confirm research within 30 seconds |
| `upgrade [expansion\|team\|homes\|generator\|speed\|jump\|crop\|fly\|drops\|spawner]` | Open upgrade choices, or preview the next purchase for a selected track; teammates with `UPGRADES` confirm in the menu within 30 seconds |
| `fly` | Toggle purchased flight while inside your team's active island claim in survival/adventure; requires `skyprime.use` and `skyprime.fly` |
| `missions` | Open categorized one-time, daily, weekly and custom-interval progress; alias `challenges` |
| `claim <mission>` | Claim a completed mission after checking current progress and prerequisites |
| `rewards` | Open your personal reward inbox, including rewards from previous islands |
| `rewardcollect <receipt UUID>` | Collect one queued personal reward; all items must fit and uncertain receipts require administrator review |
| `trust <player> [access]` | Grant lasting guest access; defaults to visit only |
| `coop <player> [access]` | Grant temporary guest access; defaults to visit only |
| `untrust <player>` | Remove permanent and temporary access; alias `uncoop` |
| `guests` | View grants, expiry and authorized removal controls |
| `template list` | Browse available built-in and permitted custom starters |
| `chat [message\|on\|off]` | Toggle island chat without arguments, switch the channel on/off, or send a message of up to 256 characters |
| `delete` | Open a permanent deletion confirmation |
| `reset [starter]` | Open a terrain-reset confirmation |
| `confirm` / `cancel` | Resolve the pending deletion/reset request |
| `language ...` | Personal language selection and authorized server translation tools |

Destructive requests expire after 30 seconds and are bound to the requesting player and island UUID. Only the owner can reset or delete. Reset clears terrain, stored homes and value, while preserving the team, bank, upgrades, votes and already-claimed rewards.

Player-name arguments resolve online players; `untrust` also accepts a stored guest name. Otherwise, UUIDs support offline targets without blocking name lookup. Visit and vote accept exact island names containing spaces, for example `/sky visit Garden Market`; use the UUID when names are ambiguous. Director also supports named optional arguments such as `starter=big`, `home=visitor`, `limit=20`, `track=team` and `access=containers,pickup`. Built-in starters are `small`, `normal` and `big`; custom IDs are configured through [Starter Templates](/skyprime/06-starter-templates).

`/sky flag` takes `PUBLIC_ACCESS`, `PVP`, `PICKUP`, `BUILD`, `CONTAINERS`, `INTERACT`, `KILL_MOBS` or `ENTITY_INTERACT`. See [Protection](/skyprime/03-islands-progression#protection) for what each one covers.

`trust` and `coop` take `visit`, or a comma-separated list of `build`, `containers`, `pickup`, `interact`, `kill_mobs` and `entity_interact`. For example `/sky trust Gardener containers,pickup`, or `/sky coop Builder build` for temporary building. Reissuing `trust` replaces that guest's flags; revoke a permanent grant before making a temporary one. Temporary access also ends when the issuer disconnects, loses management authority, or the island is reset or deleted. Bans override every grant.

Use `/sky top bank 20` for the highest bank balances or `/sky rankings votes` to browse votes. The main menu's Top islands button opens the same ranking browser with material value selected. Each menu page holds up to 45 islands, with category selectors, page controls and your own island's rank when ranked. Private islands remain listed, but an entry only offers a visit when you currently have access. Selecting an entry checks access again before travel. See [Island rankings](/skyprime/03-islands-progression#island-rankings) for score ordering.

Island chat picks the island you are standing on, or your own team when you are elsewhere, and reaches teammates and visitors currently on it. With channel mode on, ordinary chat stays private until `/sky chat off`, another `/sky chat`, or disconnect. A configuration-editor chat prompt takes precedence over channel mode.

Time, weather and difficulty commands target the player's own island, including when the player is elsewhere. They change the actual conditions of that island's loaded worlds. Other islands keep their own settings. Time and weather default to `world`, which enables their natural cycles. Difficulty defaults to `server`, which follows the primary overworld's difficulty. See [Island environment](/skyprime/03-islands-progression#island-environment) for persistence and mode behavior.

## Operator commands

| Command | Permission |
| --- | --- |
| `/sky status` | `skyprime.command`; configuration, island and world counts, Java and Minecraft support, PlaceholderAPI and Vault state, and storage health |
| `/sky config` | `skyprime.config`; opens the configuration editor |
| `/sky debug status` | `skyprime.debug` |
| `/sky debug version` | `skyprime.command`; installed version |
| `/sky version` | `skyprime.command`; hidden shortcut for `debug version` |
| `/sky debug dump [upload=false]` | `skyprime.debug` |
| `/sky admin history <island UUID> [category=all] [actor=all] [search=*] [page=1]` | `skyprime.history.admin`; includes retained records for deleted islands and supports console |
| `/sky admin inspect <island UUID>` | `skyprime.admin` |
| `/sky admin resume <island UUID> [starter=normal]` | `skyprime.admin` |
| `/sky admin delete <island UUID> <same UUID>` | `skyprime.admin`; repeat the UUID to confirm cleanup |
| `/sky admin reconcile <island UUID>` | `skyprime.admin` |
| `/sky admin credit <island UUID> <positive amount>` | `skyprime.admin` |
| `/sky template pos1`, `pos2`, `origin` | `skyprime.admin` |
| `/sky template capture <id> <normal\|nether\|end>` | `skyprime.admin` |
| `/sky template reload` | `skyprime.config` |

`skyprime.command`, `skyprime.use`, `skyprime.create`, `skyprime.preview` and `skyprime.fly` default to all players. Preview entry also checks the selected custom starter permission. The flight permission does not replace the island's purchased Fly unlock or membership requirement. Research browsing uses `skyprime.use`; completing a research node also requires the `UPGRADES` island action. Other upgrade benefits have no additional permission node; purchase access uses `skyprime.use` and the `UPGRADES` island action; teammates can inspect the menu. `skyprime.config`, `skyprime.debug`, `skyprime.admin`, `skyprime.update` and `skyprime.bypass` default to operators. `skyprime.update` permits GitHub release notifications. The bypass permission allows protected-world interaction; it does not grant island ownership for team mutations.

Personal language selection needs both `skyprime.language.self` and `volmit.language.self`, which default to everyone; changing the server default needs `skyprime.config` or `volmit.language.admin`. See [Languages](/languages).

Operator credit grants go into the island ledger and the console audit log. Diagnostic dumps stay local unless the request includes `upload=true` and `debug.uploadEnabled` is `true`.

## Resource cap commands

| Command | Access and behavior |
| --- | --- |
| `/sky limits` | Island members with `skyprime.use` inspect combined block/entity counts and configured caps; reports disabled or preparing state when applicable |
| `/sky admin recountlimits <island UUID>` | `skyprime.admin`; starts a bounded recount and reports completion or failure |
| `/sky admin rewardresolve <receipt UUID> <delivered\|retry>` | `skyprime.admin`; resolve an uncertain reward after checking delivery records; `delivered` removes the receipt and `retry` queues the entire bundle again |

## Schematic import and bank transfers

| Command | Access and behavior |
| --- | --- |
| `/sky template import <id> <dimension> <file.schem> <originX> <originY> <originZ>` | `skyprime.admin`; imports a supported Sponge v2/v3 starter using local schematic coordinates |
| `/sky bank deposit <amount>` | Team members preview a whole-credit deposit from their own external account |
| `/sky bank withdraw <amount>` | Island owner previews a withdrawal to their own external account, when enabled |
| `/sky bank status` | Inspect provider availability and unresolved transfer status |
| `/sky admin bank pending [page=1]` | `skyprime.admin`; list unresolved transfers |
| `/sky admin bank resolve <transfer UUID> <applied\|not_applied> <same UUID>` | `skyprime.admin`; record an externally verified outcome without calling the provider |

Bank transfer previews expire after 60 seconds. Confirmation rechecks membership, policy, funds and the captured provider. Cancellation does not move funds. Verify provider records before resolving an uncertain transfer; see [Bank transfer recovery](/skyprime/04-operations-recovery#bank-transfer-recovery).

## Favorites and ratings

`skyprime.social.favorites` and `skyprime.social.rate` default to true and also require `skyprime.use`. These commands work for players without their own island. Island names may contain spaces and occupy the remainder of the command. UUID-based removal and withdrawal remain available after access is lost. The directory accepts `sort=popular` and `filter=favorites`; favorites filtering requires the favorites permission. See [Favorites and ratings](/skyprime/11-favorites-ratings) for visit qualification and cooldowns.

## Island activity history

`skyprime.history` defaults to everyone, while `skyprime.history.admin` defaults to operators. Both require `skyprime.use`. Own-island browsing additionally requires `HISTORY`, held by owners/managers and explicitly authorized custom roles; ordinary members do not receive it by default. Categories are `membership`, `permissions`, `progression`, `settings`, `administration` and `lifecycle`. Actor filtering uses a player UUID; `all` clears category/actor filters and `search=*` clears search. Each page contains up to 45 records. See [Activity history](/skyprime/12-activity-history) for examples and recorded operations.

## Island specializations

`/is specialization [path]` opens the catalog or a path detail screen; selection requires an expiring confirmation. Browsing requires `skyprime.use` and `skyprime.specialization`; changes also require `skyprime.specialization.change` and the island `SPECIALIZATION` action. Both specialization plugin permissions default to everyone. Owners/managers receive the action; custom roles can delegate it. See [Specializations](/skyprime/13-specializations).
