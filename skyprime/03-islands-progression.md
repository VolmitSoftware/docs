---
title: SkyPrime - Islands and progression
description: Starter terrain, teams, protection, material value and internal credits
published: true
date: 2026-10-10T11:10:38.282Z
tags: skyprime, islands, protection, progression
editor: markdown
dateCreated: 2026-09-05T04:30:00.000Z
---

Each island owns separate worlds and keeps the same UUID through ownership transfers and terrain resets. Players can belong to one island team at a time. Claims are square, centered at block coordinates `0, 0` and extend through the world's build height.

## Timed events and boosters

Server-wide and per-island events can improve mature harvests, ordinary fish catches, crop growth, generators, ordinary mob resources, spawner delay and mission-credit claims. `/is events` shows applicable timers and effective bonuses. Operators activate manual timers or UTC schedules; authorized teammates can also confirm configured island-credit purchases or shared wallet token redemptions. Scoped announcements and weighted rare-fishing rewards are configurable. Strongest overlap is the default, with capped additive stacking available. See [Events and boosters](/skyprime/09-events-boosters) for eligibility and limits.

## Create and settle

Use `/sky create small`, `/sky create normal`, `/sky create big` or a custom starter ID from `/sky template list`. Operators can [capture starter bundles](/skyprime/06-starter-templates) with per-dimension terrain and supplies. SkyPrime reserves the island identity and persists the creation operation before generating its Normal world. Each world uses the configured starter height for its fixed spawn. Generation applies a bounded number of blocks on the owning region thread and provides starter supplies. Creation finishes after the terrain is generated and the active state is persisted.

Starter terrain varies deterministically with island identity, size and dimension. Normal islands have irregular ground and undersides, limited ore resources, and varied trees, while retaining a clear home and starter chest. Retrying the same operation reproduces its terrain.

Each loaded island world uses its native world border, centered at `0.5, 0.5` with a diameter of `2 × radius + 1`. The border follows automatic growth and radius upgrades on the next refresh, even when the world has no players. It remains part of the world when players leave or the plugin stops.

`/sky home` uses the `main` home. Teammates with `HOMES` can save more named homes and a `visitor` home. A home remembers its dimension, and home names are shared across the island's dimensions. Falling into the void sends you to the fallback world's spawn.

Reset rebuilds the island's terrain and homes but preserves membership, upgrades, bank credits, votes, trusted guests and mission progress/completions. Temporary guest access ends. The default reset policy allows ten replacements per owner, with a 24-hour wait after creation or the last reset. First creation is free; recreating an island after deletion consumes the same persistent replacement allowance and has its own 24-hour cooldown. Deleting an island does not erase owner history. The reset menu displays the remaining allowance and next availability time in UTC; the final admission checks the policy again. Players are evacuated before reset or deletion removes world files. Deletion removes the owned worlds, island record and retained starter manifest. A later creation receives a new island UUID.

## Island environment

Open `/sky environmentmenu`, or select Environment from the island Settings menu, to view time, weather and difficulty together. Each row shows its current localized value. Cyan choices are selected; white choices are alternatives. Teammates can inspect the menu, while teammates with `ENVIRONMENT` can select a different value with a left click. Back returns to the main island menu.

Selecting a value closes the menu and reports success after persistence completes. Reopen it to review the saved choice or change another setting. Every click rechecks the current island, active state, permission and role; queued duplicate clicks cannot save a second change. The menu uses the same world settings and persistence as the commands below.

Teammates with `ENVIRONMENT` can set `/sky time day`, `noon`, `night` or `midnight` to lock their island worlds at 1,000, 6,000, 13,000 or 18,000 ticks. `/sky weather clear` or `rain` locks the weather, with thunder disabled. `/sky environment` shows the preferences to any teammate.

These controls change actual world time and weather, so gameplay that depends on daylight or rain uses the selected conditions. Each island's loaded dimensions receive its preferences. Other island worlds and the fallback world keep their own conditions. Refresh runs every 40 server ticks; at 20 TPS, changes apply within two seconds after the preference is saved. Newly loaded dimensions receive the persisted settings.

Paper 26.1.1 build 29 has a fixed-time limitation: a restart test retained `NIGHT` but the native day timeline returned 13,086 instead of 13,000 ticks. Paper subsequently [fixed per-world clocks](https://github.com/PaperMC/Paper/pull/13814). On Paper 26.2 build 123 with default clock configuration, a Normal island world's native and Bukkit clocks both remained at exactly 13,000 before and after restart, and World mode resumed natural progression. That probe did not cover optional Nether/End clocks. Use a Paper build containing that upstream fix. The menu shows the saved preference, not a live clock measurement.

Both preferences default to `world`. `/sky time world` enables the natural day cycle from the world's current time. `/sky weather world` enables natural weather changes and releases the previous lock durations. SkyPrime preserves an initially natural world's current time and weather. Leaving, disconnecting or shutting down does not reset the world settings. Preferences persist in `storage/environment.json`, independently of island terrain.

`/sky difficulty peaceful`, `easy`, `normal` or `hard` sets native difficulty across the island's loaded Normal, Nether and End dimensions. Teammates with `ENVIRONMENT` can change it; any teammate can read the selected mode through `/sky environment`. The default, `/sky difficulty server`, follows the current difficulty of the primary `minecraft:overworld`, including later changes to that world. A custom fallback lobby does not determine this default. These are normal Minecraft difficulty settings and affect gameplay, including hostile mobs and hunger.

Difficulty refreshes with the other environment settings and persists separately in `storage/difficulty.json`. Terrain reset, ownership transfer, idle unloading and server restart preserve the preference because it belongs to the permanent island UUID. Optional dimensions receive it when generated or loaded. A newly created island uses `server`.

### Island game rules

`/is gamerules` opens 34 configurable Boolean and integer rules, with saved/effective values, drafts and explicit saves. Operators can lock rules, set defaults and bound numeric choices. Settings persist per island and apply to its loaded dimensions. See [Island gamerules](/skyprime/14-gamerules) for the catalog, commands and configuration.

### Island biomes

`/sky biomes` opens separate Overworld, Nether and End controls. Teammates can inspect selections; teammates with `ENVIRONMENT` can choose a registered biome for an enabled, unlocked dimension. The list uses exact namespaced registry keys, excludes `minecraft:custom` and is sorted by key. The menu opens a confirmation and rechecks island identity, authority, dimension availability and the displayed selection before saving. `/sky biome normal minecraft:plains` applies the explicitly named choice directly, without a confirmation screen or an expected previous selection; current authority and dimension availability still apply.

A selection applies across the entire dimension at every height, without replacing terrain or blocks. Loaded chunks update gradually; other chunks receive the selection when loaded. This does not generate or load additional chunks. Selecting the same biome again reapplies it and retries failed work. The menu shows queued loaded chunks and any recorded failure; its queue count excludes overflow waiting for rediscovery.

The shared worker processes at most 2,048 biome cells and completes at most one chunk per tick. Its queue holds at most 4,096 chunks, with overflow rediscovered every 40 ticks. Completed chunks refresh clients currently viewing them, retrying at most 20 times at one attempt per tick without repainting. Unviewed chunks skip this refresh and deliver the selected biome data when later sent to a client. Client presentation can vary. Selection persistence completes before all chunk updates, so a saved selection does not imply painting has finished.

Selections survive restart, island reset and ownership transfer. Deleting an island removes its selections. There is no menu option to restore the original generated biomes, and no original-biome snapshot is retained.

## Team roles

| Role | Responsibilities |
| --- | --- |
| Owner | All island actions; exclusive role management, ownership offers, reset and deletion |
| Manager | All 19 island actions; cannot edit or assign roles, reset, delete or transfer ownership |
| Member | Default actions: building, containers, block/entity interactions, pickup, mob kills, mission claims and contract deliveries; a custom role replaces these actions |
| Visitor | Enter public islands within the configured access restrictions |
| Trusted/temporary guest | Enter the granting island, including private islands, with only the selected extra actions |

Invitations and ownership offers expire. Acceptance checks current membership, bans, capacity and the original authority again. The owner counts toward the team size limit. Ownership transfer preserves island identity and requires acceptance from an existing teammate. The recipient inherits the stricter used replacement allowance and cooldown from the source and recipient histories, preventing transfers from replenishing resets.

Pending invitations and ownership offers are not persisted across restarts. Reset, deletion and ownership transfer also clear pending offers for that island.

### Custom roles and actions

`/sky roles` opens the role list, action matrix and teammate assignments. Everyone on the team can inspect them; only the owner can create, edit, delete or assign roles. Role creation accepts a lowercase key matching `[a-z0-9][a-z0-9_-]{0,31}`; `owner`, `manager` and `member` are reserved. Each island may define up to 32 custom roles. The menu’s creation prompt expires after 60 seconds and accepts `cancel`.

A new role allows no actions. Its exact allowlist replaces the default member actions rather than adding to them. Owners and managers retain their built-in permissions. Custom roles can only be assigned to teammates whose core role is `MEMBER`; demote managers first. `/sky role <player> member` clears a custom assignment and restores member defaults. Deleting a role with assigned teammates is rejected. Reset retains definitions and assignments. Transfer clears the new owner’s custom assignment; leaving, removal, bans and promotion clear the affected member assignment.

| Action | Controls |
| --- | --- |
| `BUILD`, `CONTAINERS`, `INTERACT`, `PICKUP`, `KILL_MOBS`, `ENTITY_INTERACT` | The corresponding protected-world interaction |
| `INVITE`, `KICK`, `BAN` | Invitations, removal of eligible members, and bans |
| `GUESTS`, `VISITORS` | Guest action grants, or visitor entry policy/capacity/allowlist |
| `FLAGS`, `RENAME`, `HOMES` | Protection flags, island name, and saved homes |
| `ENVIRONMENT` | Time, weather, difficulty, game rules and biomes |
| `HISTORY` | Read the island activity history; owners/managers have access, ordinary members require an explicit custom-role grant |
| `UPGRADES`, `DIMENSIONS`, `MILESTONES`, `MISSIONS`, `CONTRACTS` | Upgrade purchases, dimension unlocks, milestone claims, mission claims and contract deliveries |

The GUI confirms permission edits, assignments and deletion and rechecks its displayed island, roles and membership. Explicit role commands apply directly. For example, `/sky roles create builder`, `/sky roles permission builder BUILD true`, then `/sky role <player> builder` grants building without the other default member actions.

Bans, active-island state, storage health and ordinary target restrictions still apply. `FLAGS` cannot enable a public gameplay action the actor lacks, and `GUESTS` cannot grant actions beyond the actor’s own permissions. Invitations and temporary co-op grants lose authority when their issuer loses the required permissions. Permanent trusted grants retain their existing permanent semantics. Entry remains governed by visitor policy; a custom team role does not turn a teammate into a visitor.

## Island directory

`/sky directory` and the main menu's Island directory button open a 45-entry paginated browser. Search matches part of an island name without case sensitivity, up to 48 characters. For example, `/sky directory search=[stone garden] sort=value filter=public` combines a search, sort and filter. Command searches with spaces use square brackets; the GUI chat prompt accepts ordinary text without brackets. Sort by name, island value, votes, newest creation or popularity; name is the default. Exact `*` means all names, for example `/sky directory search=* sort=value`. Other asterisks are literal search text, not wildcard matching.

The default Public filter lists visitable public islands. Accessible includes private islands you can visit through team membership or a current access grant. Online shows public islands with at least one online teammate. Favorites shows saved islands you can currently visit. Entries show level, votes, team size, online teammates and public/private access state. A directory listing never grants access: entry clicks and travel recheck the destination's current availability and visit permission.

Search opens a private chat prompt that expires after 60 seconds; type `cancel` to cancel or `*` to show all names. Control characters and searches longer than 48 characters are rejected. Clear removes the search. Refresh keeps the current selections, while changing the search returns to the first page. Directory choices are temporary and do not change island storage.

## Visitor entry policy and capacity

`/sky visitors` or `/sky visitors menu` opens entry controls from the island settings. Teammates can inspect them; only teammates with `VISITORS` can save changes. The menu rechecks the island identity and displayed policy before saving, so an outdated screen cannot overwrite newer settings.

| Mode | Who can enter |
| --- | --- |
| `DEFAULT` | Team members, visitors admitted by public/private access and current trust/co-op grants, plus visit-only allowlisted players |
| `ALLOWLIST` | Team members and players with current trust, co-op or visit-only allowlist access |
| `CLOSED` | Team members only |

Bans override guest and allowlist access. Existing administrative bypass remains available. The allowlist grants entry only; it does not add building, container or other action permissions. Removing someone from the allowlist removes that source of access, but another valid grant or public access may still admit them. Banning a listed player retains the list entry while denying access, so unbanning can restore it. At most 256 players can be listed.

The visitor limit accepts 0–1000, with zero meaning unlimited. It counts nonteam visitors, including trusted and co-op guests, across all three island dimensions together. Moving between dimensions does not create a second visitor. Lowering the limit prevents new arrivals without evicting current visitors solely because the island is over capacity. Revoking entry access removes affected current visitors. Directory results and travel still recheck current access.

Policy and allowlist settings persist through restart, island reset and ownership transfer; deleting the island removes its policy. These settings do not change the island aggregate format. See [Operations and recovery](/skyprime/04-operations-recovery) for their separate storage file.

## Protection

New islands are private, PvP is disabled, and visitors cannot pick up items. Teammates with `FLAGS` can change `PUBLIC_ACCESS`, `PVP` and `PICKUP`, plus separate visitor controls for `BUILD`, `CONTAINERS`, `INTERACT`, `KILL_MOBS` and `ENTITY_INTERACT`. Visitor action flags default to false and require public access. Named trusted and temporary grants can permit particular actions on private islands. Guests do not earn missions, gain homes, spend credits or manage settings; those operations still require team roles. Bans override grants, and expired or revoked grants cannot authorize a later queued action. Building remains restricted to active claims, and storage failure suspends protected mutations.

Protection covers block placement and breaking, buckets, interactive blocks, container access, item pickup, entities, hanging objects, vehicles and combat. Region boundaries also constrain pistons, fluids, hoppers, projectiles and block spread. Explosions do not destroy blocks in managed worlds. Environmental protections remain active regardless of visitor permissions.

Only enabled island dimensions participate in island travel. A private island is not opened by using a different dimension or entering through a portal. Operator bypass grants access to protected gameplay surfaces; team and ownership changes still require their domain roles.

## Value, levels and generators

The `[materials]` table in `config/values.toml` assigns unit values to placed blocks and directly stored container items inside the claim. Item stack quantities contribute the same material value as placed units. Each half of a double chest counts once, including chests crossing chunk boundaries. Player inventories, ender chests, entity inventories and contents nested inside items such as carried shulker boxes do not contribute. A placed shulker box's direct inventory does contribute. Unlisted materials contribute zero; item names, enchantments and other metadata do not change the configured material value.

`/sky value` recounts your island. One scan runs at a time. Level is the island's value divided by `runtime.levelDivisor`. Supported block and inventory changes queue bounded reconciliation work, batched every 40 ticks. Container contents are copied on the server thread and counted with chunk snapshots. Movement during capture discards that publication and queues a retry, so continuously moving contents can delay an updated total. Direct changes by other plugins may require an explicit recount.

`/sky valuebreakdown`, or Material values in the main island menu, opens the most recent completed scan for your active island. Each material entry shows its combined placed-block and stored-item count, unit value and contribution to the total. Entries use canonical material names and are ordered by contribution, highest first, then material name. Pages hold up to 45 materials; the summary shows the cached total and scan time in UTC.

Opening the breakdown and changing pages read the cache without loading worlds or starting a scan. Refresh requests a fresh scan and updates the menu when it completes, provided the same menu is still open and the player still has access to that island. Repeated clicks cannot start duplicate refreshes from that menu. Teammates can view and refresh their own island's breakdown.

The breakdown is held in memory. After a restart, the menu reports that no completed scan is cached until a scan succeeds, even though the island's last saved value remains available. A completed scan with no valued materials has a separate empty result. Changes to configured material values invalidate cached breakdowns; Refresh or `/sky value` obtains current results.

Automatic border growth uses the reconciled value or level to earn permanent radius increases. The default adds `floor(sqrt(value / 100))` blocks to the initial radius, with expansion upgrades and research adding their normal increases. Radius never decreases when items leave storage or blocks are removed. It survives reset, ownership transfer and restart, and stops at `islands.maxRadius`. Disabling automatic growth keeps earned space; an administrator lowering the maximum radius can shrink the claim. Growth settings and examples are in [Configuration](/skyprime/01-installation-configuration#material-values-and-border-growth).

In the Normal dimension, stone, cobblestone and basalt formation selects the highest level tier the island has reached, then advances by its purchased generator-tier boost, capped at the last configured tier. Each tier uses positive relative material weights. Outputs must be supported solid blocks without gravity. Invalid materials, empty tables and duplicate or invalid thresholds reject the configuration candidate. Nether and End formation does not use these generator tiers.

## Island rankings

`/sky rankings [type=value]` opens the ranking browser. The main menu's Top islands button opens material-value rankings. Select Material value, Bank balance or Votes to change the category, then use the page controls to browse up to 45 islands per page. The menu shows each island's position and score, the current page and your own island's position when ranked. Players without an island can browse too.

| Category | Ordering |
| --- | --- |
| `value` | Highest reconciled material value, then most votes, earliest creation time and ascending UUID |
| `bank` | Highest current internal credit balance, then earliest creation time and ascending UUID |
| `votes` | Most votes, then earliest creation time and ascending UUID |

Rankings include all active islands, including private islands. Entries with current visit access offer travel; inaccessible entries show Visits unavailable. Access is checked again when clicked: an island becoming private requires membership or a valid guest grant, and a ban prevents the visit. Islands undergoing reset leave the rankings until active again; deletion removes their entries.

Ranking reads use cached island records and do not scan world blocks or load island worlds. Value uses the last reconciled total; bank rewards/spending and vote changes update their respective rankings. `/sky top [type=value] [limit=10]` shows the selected ranking in chat or console, with its limit clamped to 1–20.

## Credits and missions

The island bank contains internal SkyPrime credits. Optional Vault deposits and owner-only withdrawals exchange these credits with player accounts at a fixed one-to-one rate. `/sky bank` shows the balance and newest transactions first. Each entry records its timestamp, actor UUID, mission/upgrade/dimension/admin detail, signed amount and resulting balance. The default history retains the latest 100 entries. Admin credits, mission rewards, upgrade spending and paid dimension unlocks change the balance and ledger together.

`/sky missions` shows one-time checkpoints and renewable objectives shared by the island team. Inventory checkpoints verify currently carried supplies and leave the items in place, including recurring checkpoints. Missions combine named objectives using `ALL` or `ANY`; each objective can accept several targets. The browser shows separate counters, configurable icons/descriptions and categories. Disabled entries cannot progress or be claimed. Event objectives count eligible survival/adventure actions by members on their own active island. `/sky claim <id>` requires `MISSIONS` and checks the latest mission definition, progress, prerequisites and claim state before committing its reward. An island can claim each mission once per period, including when members claim simultaneously. Progress and completions survive restarts and terrain resets.

Daily periods begin at 00:00 UTC and weekly periods begin Monday at 00:00 UTC, shifted by the configured offset. Custom intervals use fixed minute windows anchored to the Unix epoch plus the offset. Unclaimed progress expires when its period changes. Prerequisites require enabled definitions with at least one historical completion and must be satisfied before event progress starts. Stable objective IDs retain their counts through amount and presentation edits. Changing an objective type or target set resets only that objective. Removing an objective drops its stored counter on the next progress update or claim. A claimed unchanged schedule remains claimed; changing a repeating schedule starts a new window. A completed one-time definition remains claimed. Clocks moving backward do not reopen previous claims.

| Objective | Counted actions |
| --- | --- |
| `INVENTORY` | Current storage-inventory total across the configured materials; items are kept |
| `CUSTOM` | Positive counters explicitly reported by trusted plugin integrations through the source API |
| `BREAK` | Newly formed generator output, consumed once when a member breaks it; placed or piston-moved blocks do not qualify |
| `HARVEST` | Fully mature crop breaks or successful mature berry/vine harvests; counts harvest actions, not stack sizes |
| `FISH` | Actual caught fish item quantities with the hook inside the member's island |
| `KILL` | Credited mob kills inside the member's island |
| `CRAFT` | Full recipe results collected by ordinary left-click; shift, right-click, hotbar and drop crafting are not counted |
| `BREED` | Successful player-attributed breeding inside the claim, counted by child entity type after the child remains valid; rejected offspring do not count |
| `TAME` | Uncancelled player-attributed taming of a supported animal inside the claim |
| `SHEAR` | Uncancelled player shearing of sheep, mooshrooms, snow golems or bogged inside the claim; counts actions, not drops |
| `SMELT` | Item quantities extracted by a player from a furnace, blast furnace or smoker inside the claim; hopper and campfire output do not count |

A generator block only counts toward a mission once. Blocks you placed, or moved with a piston, do not count, and neither does anything done in creative or spectator mode. Newly formed output qualifies again after its chunk reloads.

The 17 defaults include three inventory checkpoints, eight daily missions, five weekly missions and a one-time wolf-taming mission. Original daily missions cover generator mining, wheat harvests, cod fishing, zombie kills and bread crafting. Added defaults reward breeding four cows (300 credits, 16 wheat, 50 XP), taming one wolf (500 credits, eight bones, 100 XP), shearing eight sheep (250 credits, two iron ingots, 50 XP) and extracting 16 iron ingots (350 credits, eight coal, 75 XP). Daily and weekly objectives may advance together. Operators can change definitions in `config/missions.toml`.

### Personal mission rewards

Mission credits enter the island bank. Optional items with configured names, lore, enchantments, model data and durability, experience points and console-command rewards belong to the teammate who claims the mission, not every teammate. The claim durably records the island progress, credits and a personal reward receipt together. `/sky rewards` opens the paginated inbox, also available from the mission browser. Mission lore lists personal items, XP and the number of server reward actions; it does not expose command text.

Collection is explicit through the inbox or `/sky rewardcollect <receipt UUID>`. All item stacks must fit in storage inventory before delivery starts; armor and offhand slots are not used and nothing is dropped. XP is measured in points, not levels. Full inventory, excessive XP or disconnect before delivery leaves the receipt queued. Queued rewards survive restart, configuration changes, island deletion and membership changes; they retain the rewards configured when claimed. No rewards are delivered automatically on login.

Only queued receipts have a collect action. Delivering receipts show their in-progress state; uncertain deliveries show an administrator-review state and receipt ID. A failure after effects begin, a failed reward command or an interrupted delivery can leave some effects applied. Such receipts are never automatically retried. See [Reward recovery](/skyprime/04-operations-recovery#mission-reward-recovery) before resolving them. Limits are 100 pending receipts per player and 100,000 across the server; a full queue rejects a new personal-reward claim without spending its completion.

## Level milestones

`/sky milestones` lists island-level rewards and the island's current and highest recorded levels. Teammates with `MILESTONES` use `/sky milestone <id>` or the browser to review a reward, then confirm within 30 seconds. Other members can inspect progress. The default milestones award 500 credits at level 10, 1,500 at level 25, 5,000 at level 50 and 10,000 at level 100.

Eligibility uses the island's highest recorded level, not its current value. Value updates and rescans record a new peak when appropriate, including a rescan whose material-value total is unchanged. Reloading the level divisor alone does not raise the saved peak; the browser's refresh action requests a fresh value scan. Falling value, reset and ownership transfer preserve peak levels and claimed milestone IDs. A newly configured milestone below a recorded peak can be claimed if its ID has not been claimed before.

Each milestone can reward an island only once. Confirmation rechecks the island, `MILESTONES` permission, current milestone definition, eligibility and bank capacity. The credit reward, transaction and claim record persist in the same island aggregate. Changed definitions require a fresh preview. Removing a definition does not erase its claim; restoring that ID does not award it again. Milestones may also queue personal item, XP and console-command bundles for the confirming teammate. Credits, claim state and receipt are persisted together; a full personal reward queue prevents the claim. Preview lore lists the rewards, and changed reward definitions invalidate an open confirmation.

## Dimension progression

The Nether and End have separate island-wide unlocks. `/sky dimensions` shows each dimension's server availability, unlock state, required island level and one-time mission claims. The Overworld is always the normal island destination. Teammates with `DIMENSIONS` may review a purchase through the menu or `/sky unlock <nether|end>`; teammates can inspect requirements and travel to available dimensions.

Nether defaults to island level 10 and 5,000 island credits; End defaults to level 50 and 15,000 credits. Default mission requirement lists are empty. Operators must also enable the corresponding global world option. When an unlock is required, meeting the requirements does not spend credits or open access until a teammate with `DIMENSIONS` confirms the quote within 30 seconds. The confirmation rechecks the island, authority, current balance, requirements and complete quoted configuration. The bank debit and unlock are saved together, preventing repeated confirmations from purchasing the same access twice.

Purchased unlocks survive value decreases, reset, ownership transfer and restart. A terrain reset still rebuilds the worlds. Setting `required = false` opens a globally enabled dimension without recording a purchase; turning the requirement back on can therefore close access for islands that never purchased it. A required zero-cost unlock remains an explicit claim. Unlocking does not generate or load a dimension; first admitted travel uses the retained starter as before.

Travel commands, portals, homes, reconnects and external teleports enforce availability for the destination island, including visitors. Bypass permissions do not bypass unlock policy. Relocking preserves world files, saved homes and value accounting. Players already in an unavailable dimension are removed through movement checks or the periodic access check within five seconds. A locked reconnect destination attempts the island's safe Normal home, then the configured external fallback if rescue cannot succeed. Respawn into a locked managed world is redirected outside before safe rescue.

## Independent upgrades

Each track costs `baseCost × (current track level + 1)`. Only teammates with `UPGRADES` purchase upgrades, and concurrent purchases cannot spend the same credits twice. Both the menu and `/sky upgrade <track>` open a purchase preview with the current benefit, next benefit for special upgrades, target level, price, bank balance and balance after purchase. Confirm within 30 seconds or cancel. A purchase carries its displayed island, level, price and complete upgrade rule; changing the price, increase or level cap rejects that purchase and requires a fresh quote. Membership, authority and available credits are checked again before spending. Team capacity counts the owner; home capacity counts `main`.

| Track | Default starting capacity | Increase per purchase | Purchases | First price |
| --- | --- | --- | --- | --- |
| Expansion | Radius 48 | 16 blocks, capped at radius 192 | 9 | 500 |
| Team | 2 members | 1 member | 6 | 750 |
| Homes | 1 home | 1 home | 4 | 500 |
| Generator | 0 extra tiers | 1 extra tier | 2 | 1,000 |
| Speed | No bonus | 20% movement speed | 3 | 1,000 |
| Jump | No bonus | 0.1 jump strength | 3 | 2,000 |
| Crop | No bonus | 10 percentage points of extra-growth chance | 3 | 1,500 |
| Fly | Locked | Unlock `/sky fly` for teammates | 1 | 10,000 |
| Drops | No bonus | 10 percentage points of eligible resource-drop chance | 3 | 3,000 |
| Spawner | No bonus | 10 percentage points of delay reduction | 3 | 5,000 |

Generator upgrades advance relative to the tier already earned from island level, clamped to the strongest configured tier. They do not change island value or leaderboard level. Settings live in `config/progression.toml`.

Speed and Jump affect team members in survival or adventure mode on their own active island. Visitors, players elsewhere and creative/spectator players receive no island bonus. The bonuses use separate attribute modifiers; unrelated potion effects and other modifiers are retained. Player benefits refresh every 40 server ticks, with a next-tick refresh after joining, teleporting, changing worlds or game mode, or respawning. Leaving the eligible island or mode removes the island modifiers; quitting and shutdown also remove them.

Crop applies to wheat, carrots, potatoes, beetroot, cocoa and nether wart within an active island. An uncancelled `BlockGrowEvent` has the configured chance to advance its proposed state by one additional age stage, capped at maturity. This includes bonemeal growth when the server emits that event. It does not scan crops, force chunk loading or change unrelated crop types.

Purchased special-upgrade levels survive restart and reset. Current configuration determines active benefits: setting `maxLevel = 0` disables them, and reducing the cap clamps the effective level without deleting purchases. Speed and Jump are capped at three benefit tiers, Crop and Drops at 100%, Spawner at 75% and Fly at one unlock.

### Island flight

After buying Fly, a teammate can use `/sky fly` inside the team's active island claim in survival or adventure mode. This grants permission to start flying with the normal double-jump gesture; it does not immediately put the player into flight. The toggle requires `skyprime.use` and `skyprime.fly`. Flight opt-in ends when the player leaves the claim, loses membership, permissions or the benefit, changes to an ineligible mode, disconnects, or the plugin stops. A later eligible visit needs a fresh toggle.

Flight access is a shared Boolean server flag. SkyPrime refuses to take ownership of flight that was already allowed by another source. If another plugin removes SkyPrime's grant, the opt-in ends without repeatedly granting it again. Another plugin writing `true` while SkyPrime already owns that flag cannot be distinguished from SkyPrime's own grant; avoid overlapping flight controllers for those players. Creative and spectator flight remains controlled by the server.

When active island flight is revoked, the player receives protection from at most one fall for up to ten seconds. Landing clears that protection on the next entity tick. A teleport clears preceding grace, although revoking active flight after a same-world teleport outside the claim starts a fresh grace period. Changing worlds, death and logout clear grace. Shutdown clears current fall distance but does not leave a running grace timer. A player-data provenance marker lets startup or reconnect remove a stale SkyPrime grant after an interrupted shutdown; see [Operations and recovery](/skyprime/04-operations-recovery).

### Mob resource drops

Drops applies to ordinary mob resource loot, including mobs produced by spawners. The credited killer must be a survival/adventure teammate inside the same active island claim as the mob. A positive, uncancelled damage event must have captured equipment before death; that capture expires on the next entity tick and is consumed by the death event. Deaths without that capture, including programmatic health changes without a corresponding recent damage event, receive no bonus. Each eligible existing stack independently has the configured chance to produce one extra copy. The existing loot list and experience remain unchanged apart from those added copies. The first 64 stacks are considered; invalid amounts, oversized stacks and item metadata are excluded, and each bonus stays within the item's maximum stack size.

Players, unsupported mobs, named mobs, tamed animals and mobs with persistent custom data receive no bonus. Resource materials recorded in carried hands or armor are excluded even when the server clears equipment before the death event; matching equipment still present at death is also excluded. Block drops, equipment, skulls and Wither/Ender Dragon rewards are outside the feature. Plain items inserted by another plugin cannot be distinguished from ordinary loot when they match the allowlist; this is a material/type filter, not loot-origin tracking.

| Mob | Eligible materials |
| --- | --- |
| Zombie, Husk, Drowned, Zoglin | Rotten flesh |
| Skeleton, Stray, Bogged | Bone, arrow |
| Wither skeleton | Bone, coal |
| Spider, Cave spider | String, spider eye |
| Creeper | Gunpowder |
| Enderman | Ender pearl |
| Blaze | Blaze rod |
| Breeze | Breeze rod |
| Slime | Slime ball |
| Magma cube | Magma cream |
| Ghast | Gunpowder, ghast tear |
| Phantom | Phantom membrane |
| Shulker | Shulker shell |
| Cow, Mooshroom | Leather, raw/cooked beef |
| Sheep | Raw/cooked mutton, all 16 wool colors |
| Pig | Raw/cooked porkchop |
| Hoglin | Raw/cooked porkchop, leather |
| Chicken | Feather, raw/cooked chicken |
| Rabbit | Rabbit hide, raw/cooked rabbit, rabbit foot |
| Guardian | Prismarine shard, prismarine crystals, raw/cooked cod |
| Elder guardian | Guardian resources plus wet sponge |
| Witch | Redstone, glowstone dust, sugar, stick, glass bottle, gunpowder, spider eye |
| Zombified piglin | Rotten flesh, gold nugget, gold ingot |
| Squid / Glow squid | Ink sac / glow ink sac |
| Cod | Raw/cooked cod, bone meal |
| Salmon | Raw/cooked salmon, bone meal |
| Pufferfish | Pufferfish, bone meal |
| Tropical fish | Tropical fish, bone meal |
| Horse, Donkey, Mule, Llama, Trader llama | Leather, only while untamed |

### Spawner delay

Spawner reduces the positive delay after a successful ordinary block-spawner cycle inside an active island claim. Multiple entities from the same cycle queue only one adjustment. A task on that block's owning region runs the next tick, reads the current delay and applies the current configured reduction, capped at 75% with a one-tick minimum. It never changes the spawner's minimum/maximum delay, entity settings or required player range, and does not activate dormant spawners.

Cancelled spawn events, unloaded chunks, removed or replaced spawners and a changed owning island identity invalidate pending work. Breaking or placing the block, unloading its chunk or stopping the service clears queued adjustments. The task does not load chunks. Reload changes future adjustments without restoring a delay already shortened. Trial spawners and spawner minecarts are not included.

## Voting

An island takes one vote per player, and only while it is public. You cannot vote for your own island, and banned players cannot vote. Joining a team or being banned removes your vote there. Closing public access keeps the votes already cast.

## Resource limits

Optional caps constrain configured block materials and entity types across an island's generated, enabled dimensions. Block counts cover the claim, while entity counts cover the entire owned worlds, including entities outside the claim. `/sky limits` shows current counts and caps to island members. Counts include pending additions conservatively until their outcome is known. Newly enabled or changed counting rules require initialization before capped additions can proceed.

Existing blocks and entities above a cap remain in place. Removing resources frees capacity; unloading an entity's chunk does not. Entity caps count entities rather than the item quantity inside an item entity or quantities hidden by a stacking plugin. There is no stacker integration.

At the `ITEM` cap, new natural, block and mob item drops are rejected rather than stored for later delivery. Player drops use the cancellable player-drop event, whose cancellation preserves the player's item; this does not provide refunds for every item-spawn producer.

Operators configure types and caps in [resource-limits.toml](/skyprime/01-installation-configuration#resource-caps). Direct block writes from other plugins may bypass gameplay events; use `/sky admin recountlimits <island UUID>` to rebuild those counts. Resource caps do not replace protection permissions or profile CPU usage.

Tracked block changes include placement, breaking, growth, formation, spread, fading, physics, explosions, pistons, fluids, buckets, dispensers, tool transformations, fire and sponges. The cap service uses event outcomes and pending reservations to avoid admitting simultaneous additions beyond available capacity. This event coverage does not intercept arbitrary third-party calls that directly replace blocks.

## Island research

`/sky research` opens shared island research; `/sky research <id>` shows a node's requirements and grants. Nodes can require earlier research, completed challenges, held materials, current island level and credits. Teammates with `UPGRADES` confirm purchases within 30 seconds. Materials remain in inventory; credits, permanent upgrade-level grants and completion save together. Exclusive groups permit one branch choice per island and retain that choice through reset, ownership transfer and configuration edits. See [island research](/skyprime/08-research) for the default tree, configuration examples and limits.

## Island contracts

`/is contracts` opens the island’s saved rotating delivery board. A teammate with `CONTRACTS` can confirm a complete order before its deadline: ordinary inventory items are consumed, island credits are awarded, and personal item/XP/command rewards enter that teammate’s reward inbox. Each offer completes once per island per board. Contracts do not accumulate partial contributions. See [Island contracts](/skyprime/10-contracts) for configuration and transaction recovery.

## Favorites and ratings

Save accessible islands through `/sky favorites` or directory details, and rate another publicly open island after a continuous visit. Ratings use one to five stars with configurable visit time, same-island cooldown and a UTC daily change limit. Current teammates cannot contribute to their own island's ratings. Popularity browsing uses a weighted score with a minimum rating count; existing votes remain separate. See [Favorites and ratings](/skyprime/11-favorites-ratings) for commands, limits and persistence.

## Island activity history

`/is history` and the History menu control show retained membership, permission, rename/home, progression and administrative changes. Each record identifies its actor, time, category, optional target and relevant values. Filters support categories, actor UUIDs and text search, with 45 records per page. History requires the island `HISTORY` action and `skyprime.history`; administrators can inspect any retained island UUID separately.

History follows the permanent island identity through reset and transfer. Deleted-island records remain available to administrators until retention removes them. Defaults retain 90 days, 1000 entries per island and 100,000 entries overall. Separate environment, biome and visitor-policy changes and block edits are outside this history. See [Activity history](/skyprime/12-activity-history) for exact coverage and configuration.

## Island specializations

Each island can choose one configurable path with temporary upgrade levels and production/reward effects. The initial choice and later switches can have different credit costs; switching can require a cooldown, current level, research and completed one-time missions. Purchased upgrades and research remain intact when the path changes. See [Specialization benefits and limits](/skyprime/13-specializations).
