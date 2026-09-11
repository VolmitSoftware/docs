---
title: 03 - Islands & Progression
description: Starter terrain, teams, protection, material value and internal credits
published: true
date: 2026-09-05T16:24:00.000Z
tags: skyprime, islands, protection, progression
editor: markdown
dateCreated: 2026-09-05T04:30:00.000Z
---

Each island reserves one cell in a shared grid and keeps the same UUID through ownership transfers and terrain resets. Players can belong to one island team at a time. Claims are square, extend through the world's build height and leave an unclaimed gap between neighboring islands.

## Create and settle

Use `/sky create small`, `/sky create normal`, `/sky create big` or a custom starter ID from `/sky template list`. Operators can [capture starter bundles](/skyprime/06-starter-templates) with per-dimension terrain and supplies. SkyPrime reserves the cell and persists the creation operation before placing terrain. Generation applies a bounded number of blocks on the owning region thread and provides starter supplies. Creation finishes after the terrain is generated and the active state is persisted.

Starter terrain varies deterministically with island identity, cell, size and dimension. Normal islands have irregular ground and undersides, limited ore resources, and varied trees, while retaining a clear home and starter chest. Retrying the same operation reproduces its terrain.

Players inside an active island see a personal world border aligned with its claim. It follows the current radius, including upgrades while standing still, and leaves the server world's border unchanged. Leaving the island restores the previous personal border when SkyPrime still controls it; another plugin's replacement border takes precedence.

`/sky home` uses the `main` home. Owners and managers can save additional named homes and a `visitor` home. Each home includes its dimension; home names are shared across the island's dimensions. Travel checks current access, island bounds, a safe standing position and warmup movement. A failed or cancelled teleport does not count as successful travel. Void rescue sends players to the configured fallback world's safe spawn.

Reset rebuilds the island's terrain and homes but preserves membership, upgrades, bank credits, votes, trusted guests and mission progress/completions. Temporary guest access ends. The default reset policy allows ten replacements per owner, with a 24-hour wait after creation or the last reset. First creation is free; recreating an island after deletion consumes the same persistent replacement allowance and has its own 24-hour cooldown. Deleting an island does not erase owner history. The reset menu displays the remaining allowance and next availability time in UTC; the final admission checks the policy again. Players are evacuated before reset or deletion clears blocks. Deletion removes the island after clearing finishes; its grid cell is never assigned to a new island.

## Team roles

| Role | Responsibilities |
| --- | --- |
| Owner | Team control, manager assignment, ownership offers, reset and deletion |
| Manager | Invitations, allowed team management, homes, settings and upgrades |
| Member | Build, interact, use homes, earn checkpoint rewards and use island chat |
| Visitor | Enter public islands within the configured access restrictions |
| Trusted/temporary guest | Enter the granting island, including private islands, with only the selected extra actions |

Invitations and ownership offers expire. Acceptance checks current membership, bans, capacity and the original authority again. The owner counts toward the team size limit. Ownership transfer preserves island identity and requires acceptance from an existing teammate. The recipient inherits the stricter used replacement allowance and cooldown from the source and recipient histories, preventing transfers from replenishing resets.

Pending invitations and ownership offers are not persisted across restarts. Reset, deletion and ownership transfer also clear pending offers for that island.

## Protection

New islands are private, PvP is disabled, and visitors cannot pick up items. Owners and managers can change `PUBLIC_ACCESS`, `PVP` and `PICKUP`, plus separate visitor controls for `BUILD`, `CONTAINERS`, `INTERACT`, `KILL_MOBS` and `ENTITY_INTERACT`. Visitor action flags default to false and require public access. Named trusted and temporary grants can permit particular actions on private islands. Guests do not earn missions, gain homes, spend credits or manage settings; those operations still require team roles. Bans override grants, and expired or revoked grants cannot authorize a later queued action. Building remains restricted to active claims, and storage failure suspends protected mutations.

Protection covers block placement and breaking, buckets, interactive blocks, container access, item pickup, entities, hanging objects, vehicles and combat. Region boundaries also constrain pistons, fluids, hoppers, projectiles and block spread. Explosions do not destroy blocks in managed worlds. Environmental protections remain active regardless of visitor permissions.

Only enabled island dimensions participate in island travel. A private island is not opened by using a different dimension or entering through a portal. Operator bypass grants access to protected gameplay surfaces; team and ownership changes still require their domain roles.

## Value, levels and generators

`config/values.toml` assigns nonnegative values to blocks. A reconciliation captures chunk snapshots on their owning region, then counts their contents on a bounded worker. Subsequent changes mark affected chunks for coalesced reconciliation. Inventories and container contents do not contribute value.

`/sky value` requests a full reconciliation of one island's claimed chunks. One value scan runs at a time, and requests for an island already scanning share its current operation. Rankings use cached island snapshots, ordered by value, votes, creation time and UUID. Level is integer island value divided by `runtime.levelDivisor`.

In the Normal dimension, stone, cobblestone and basalt formation selects the highest level tier the island has reached, then advances by its purchased generator-tier boost, capped at the last configured tier. Each tier uses positive relative material weights. Outputs must be supported solid blocks without gravity. Invalid materials, empty tables and duplicate or invalid thresholds reject the configuration candidate. Nether and End formation does not use these generator tiers.

## Credits and missions

The island bank contains internal SkyPrime credits, separate from external economies. `/sky bank` shows the balance and newest transactions first. Each entry records its timestamp, actor UUID, mission/upgrade/admin detail, signed amount and resulting balance. The default history retains the latest 100 entries. Admin credits, mission rewards and upgrade spending change the balance and ledger together.

`/sky missions` shows one-time checkpoints and renewable objectives shared by the island team. One-time inventory checkpoints verify currently carried supplies and leave the items in place. Event objectives count eligible survival/adventure actions by members on their own active island. `/sky claim <id>` checks the latest mission definition, progress, prerequisites and claim state before committing its reward. An island can claim each mission once per period, including when members claim simultaneously. Progress and completions survive restarts and terrain resets.

Daily periods begin at 00:00 UTC; weekly periods begin Monday at 00:00 UTC. Unclaimed progress expires when its period changes. Prerequisites require at least one historical completion and must be satisfied before event progress starts. Changing an objective or target discards incompatible unfinished progress; a claimed period remains claimed. Clocks moving backward do not reopen previous claims.

| Objective | Counted actions |
| --- | --- |
| `INVENTORY` | Current storage-inventory material count; only permitted for one-time missions |
| `BREAK` | Newly formed generator output, consumed once when a member breaks it; placed or piston-moved blocks do not qualify |
| `HARVEST` | Fully mature crop breaks or successful mature berry/vine harvests; counts harvest actions, not stack sizes |
| `FISH` | Actual caught fish item quantities with the hook inside the member's island |
| `KILL` | Credited mob kills inside the member's island |
| `CRAFT` | Full recipe results collected by ordinary left-click; shift, right-click, hotbar and drop crafting are not counted |

Generator provenance is an in-memory cache, bounded at 32,768 blocks. Chunk unload, restart, movement by piston and replacement clear eligibility. After a chunk reload, newly formed output qualifies again. Creative and spectator actions do not earn event progress.

The three initial checkpoints award 100, 250 and 500 credits. Five daily missions award a total of 1,400 credits when all are completed and claimed; five weekly missions award a total of 10,800 after their checkpoint prerequisites. Daily and weekly objectives may advance together. Defaults cover generator mining, wheat harvests, cod fishing, zombie kills and bread crafting. Operators can change targets, amounts, prerequisites and rewards in `config/missions.toml`.

## Independent upgrades

Each track costs `baseCost × (current track level + 1)`. Only owners and managers purchase upgrades, and concurrent purchases cannot spend the same credits twice. A menu purchase carries its displayed island, level and price; a change to any of these rejects that purchase and asks the player to review a fresh quote. Team capacity counts the owner; home capacity counts `main`.

| Track | Default starting capacity | Increase per purchase | Purchases | First price |
| --- | --- | --- | --- | --- |
| Expansion | Radius 48 | 16 blocks, capped at radius 192 | 9 | 500 |
| Team | 2 members | 1 member | 6 | 750 |
| Homes | 1 home | 1 home | 4 | 500 |
| Generator | 0 extra tiers | 1 extra tier | 2 | 1,000 |

Generator upgrades advance relative to the tier already earned from island level, clamped to the strongest configured tier. They do not change island value or leaderboard level. Settings live in `config/progression.toml`.

Each island stores at most one vote per player UUID, and accepting votes requires public access. Team members cannot vote for their own island, and banned players cannot vote. Joining the team or being banned removes that player's vote; they can vote again if they later become eligible. Closing public access retains existing votes.

`/sky chat` toggles a private channel for the accessible island currently occupied, or the player's own team when elsewhere. It reaches online teammates and visitors still on the island. `/sky chat <message>` sends one message, while `/sky chat off` returns to public chat. Visitors lose channel access when they leave; banned or removed players cannot keep receiving messages through a stale channel.
