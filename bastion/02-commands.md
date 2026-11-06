---
title: "Bastion: Commands and permissions"
description: Claim menus, command help, and operator diagnostics
published: true
date: 2026-11-06T00:00:00.000Z
tags: bastion, commands, permissions
editor: markdown
dateCreated: 2026-10-14T17:39:17.297Z
---

`/bastion` opens localized command help, and `/bn` is its alias. Bastion does not register `/claim` or `/claims`, so it does not compete with other claim plugins for those names. Help lists available commands and their parameters; menus provide selection and confirmation for claim changes.

The claim anchor menu lets the owner opt into automatic refueling and set a target of 25%, 50%, 75%, or 100% of the configured power capacity. When enabled, hoppers can insert only the configured plain fuel from the same claim and child plot. Bastion consumes up to 16 items per processing cycle through its recorded fuel transaction; unloaded anchors are left untouched. Ownership transfer disables the opt-in.

## Common commands

| Command | Purpose |
| --- | --- |
| `/bastion menu` | Open your claim menu |
| `/bastion status` | Show new-claim, language, hot-reload and upkeep settings; claim, child-plot and storage state; PlaceholderAPI, WorldGuard, Vault and web-map state; and the Java version and scheduler |
| `/bastion icon` | Choose or reset the selected claim's display icon; owners only |
| `/bastion circle <radius>` | Select a full-height circle centered on your current block |
| `/bastion selection` | Edit or preview the selected rectangle, chunk area, or circle |
| `/bastion createarea <name>`, `claimarea`, `unclaimarea` | Review creating, expanding, or releasing the selected columns |
| `/bastion flag <flag> <true\|false\|default>` | Set a selected claim's protection rule or restore its default |
| `/bastion spawnrule <type\|reason> <key> <allow\|deny\|default>` | Set or reset a creature spawning rule |
| `/bastion activity` | Browse changes to the selected claim |
| `/bastion welcome` | Edit the selected claim's entry messages |
| `/bastion inbox` | Read your saved notifications |
| `/bastion directory` | Browse public claims and request visits |
| `/bastion listing` | Edit the selected claim's public listing |
| `/bastion visits` | Approve or decline incoming visit requests |
| `/bastion autoclaim` | Toggle automatic chunk claiming |
| `/bastion autostatus` | Show the current automatic claiming session |
| `/bastion autostop` | Stop automatic claiming |
| `/bastion config` | Open configuration and language inventory editors |
| `/bastion policy` | Edit global and world defaults for claims and wilderness |
| `/bastion feedback` | Set denial channels and the shared player cooldown |
| `/bastion rules` | Edit permission conditions for the claim or plot at your position; staff can edit wilderness rules there |
| `/bastion why <flag>` | Explain your current column's result, access check, policy source, matching condition, or extension provider and rule |
| `/bastion server menu` | Manage server-owned claims |
| `/bastion server icon` | Choose or reset a server claim's display icon |
| `/bastion server gamemode` | Review a game-mode policy for selected server land |
| `/bastion server create <name>`, `createarea <name>` | Review creation from the current chunk or block selection |
| `/bastion server select <name-or-UUID>` | Select server land for staff commands |
| `/bastion server claim`, `claimarea`, `unclaimarea` | Review server-land expansion or selected-area release |
| `/bastion server rename <name>`, `delete` | Review rename or removal |
| `/bastion server flags`, `flag <flag> <value>`, `spawnrule <kind> <key> <value>` | Edit or reset server-land rules |
| `/bastion server plots`, `createplot <name>` | Manage server plots or create one from selected blocks |
| `/bastion language` | Open paginated language controls in chat |
| `/bastion language update` | Check the language repository and merge changes into installed files, at most once every five minutes; needs `bastion.config` or `volmit.language.admin` |
| `/bastion debug` | Open diagnostic command help |
| `/bastion debug version` | Show the installed version |
| `/bastion version` | Hidden alias for the installed version |
| `/bastion debug dump upload=false` | Save a local diagnostic report |
| `/bastion debug dump upload=true` | Save and explicitly request a report upload |

Both version commands require `bastion.command`. Debug dumps require `bastion.debug`; uploads also require `general.debugUploadEnabled`. Reports contain server and plugin diagnostics; review the local report before sharing it. Creating a dump without an upload argument defaults to local output.

Protection changes require `bastion.manage` and claim ownership or `MANAGE_FLAGS`. The settings menu includes searchable flags, creature types, and spawn reasons, with categories and an explicit-overrides filter. See [protection settings](/bastion/04-protection-settings) for defaults and precedence.

Server commands use their own selected server claim, falling back to the server land at your position. Geometry, rename, removal and game-mode actions require confirmation. Plot protection is available from each plot's menu. World policy and server management require separate staff permissions; neither grants protection bypass. Permission-rule edits use the same authority as ordinary flag edits. The editor reviews saves and condition removal; removing a condition keeps its flag value and makes it unconditional.

## Circular selections

Run `/bastion circle <radius>` or choose **Select circle** in the selection menu. The shortcut starts at radius 4. Radius controls change the saved selection around its original center; moving does not recenter it. Selecting a circle again uses your current block. Setting corners or selecting chunks returns to a rectangle.

Radius is a whole number from 0 to 564, subject to the player's land-size limit. Radius 0 selects one column. A column belongs to the circle when its squared X/Z distance from the center is at most the squared radius: radius 3 selects 29 columns, and radius 4 selects 49. Every selected column covers the full world height.

Selection alone changes no ownership. Use the area commands or menu controls to review the exact charge or refund, conflicts, resulting land and remaining allowance before confirming. Expanding over already-owned columns charges only for new land. Release refunds only owned columns and cannot remove the core, a bound anchor, or any part of a child plot. Circular claims use their center column as the core. Player area reviews expire after 30 seconds; changing the selection invalidates its open review.

Previews sample the circle's block edges with a bounded number of particles. The saved claim uses exact column masks regardless of how many preview points are shown. Staff can use the same selection with server `createarea`, `claimarea`, and `unclaimarea`; server land does not charge player allowances. Child plots still require rectangular selections.

## Permissions

Permissions allow access to a feature; claim ownership, role permissions, and confirmation checks still apply.

| Permission | Default | Purpose |
| --- | --- | --- |
| `bastion.command` | Everyone | Base command access |
| `bastion.create` | Everyone | Claim creation |
| `bastion.manage` | Everyone | Claim management within ownership/role limits |
| `bastion.home`, `bastion.unstuck` | Everyone | Home travel and escape tools. Both wait 15 seconds after player combat; `bastion.bypass` skips the home wait |
| `bastion.inspect` | Everyone | Land inspection |
| `bastion.fuel`, `bastion.anchor` | Everyone | Fueling and anchor operations |
| `bastion.accrual`, `bastion.buyblocks` | Everyone | Configured allowance earning and purchases |
| `bastion.market` | Everyone | Child-plot market operations |
| `bastion.language.self` | Everyone | Personal language selection |
| `bastion.fly` | Operators | Claim flight where supported |
| `bastion.config` | Operators | Configuration access |
| `bastion.policy` | Operators | Global/world protection defaults and denial feedback |
| `bastion.server` | Operators | Server-owned land and plot management |
| `bastion.debug` | Operators | Diagnostic reports |
| `bastion.update` | Operators | Release notifications when `general.updateNotifications` is on |
| `bastion.admin` | Operators | Administrative claim tools |
| `bastion.bypass` | Nobody | Explicitly granted protection bypass |
| `bastion.gamemode.bypass` | Nobody | Skip server-zone game modes; separate from protection bypass |

[Installation](/bastion/01-installation) · [Capabilities](/bastion/08-feature-map) · [Bastion](/bastion)
