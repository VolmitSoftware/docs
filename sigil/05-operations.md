---
title: "Sigil: Operations and recovery"
description: "Support limits, backups, diagnostic reports and interrupted rewards"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "sigil, operations, recovery, compatibility"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Sigil stores voucher issuance and reward outcomes in SQLite. Keep the database and signing key together, and review interrupted deliveries before granting replacement rewards.

## Runtime requirements

| Requirement | Supported scope |
|---|---|
| Minecraft | 26.1 through 26.3 |
| Java | Released 25 or newer |
| Server targets | Spigot, Paper, Purpur, Leaf, Folia and Canvas |

Use a server running a supported Minecraft release and released Java 25 or newer.

The startup guard requires a released Java runtime at version 25 or newer and a Minecraft 26.1, 26.2 or 26.3 release, including numeric patch releases such as 26.1.2. It runs before dependency bootstrap. Java early-access builds, Minecraft prerelease/snapshot labels and versions outside this range are rejected. Bukkit's normal `-R0.1-SNAPSHOT` API suffix and Paper's `.build.<number>-stable`, `-beta` or `-alpha` suffixes are accepted. These describe server API builds, not Minecraft prerelease versions.

Folia uses entity and region scheduling for player effects and inventory operations. Operator-mode command rewards are unavailable on regionized servers. External command rewards depend on the called plugin supporting the server's scheduling model.

## Reload and shutdown

The GUI reload button and automatic file watcher reload configuration and installed language files while Sigil stays enabled.

For a plugin reload or unload, use BileTools with Sigil's managed lifecycle support. Sigil refuses preparation while voucher deliveries are active; retry after they finish. When preparation succeeds, it stops accepting new deliveries and closes voucher and language menus before completing shutdown. If preparation is cancelled, Sigil resumes accepting deliveries.

On Folia and other regionized servers, an arbitrary forced disable from a thread that does not own an open inventory cannot safely close that inventory. Use managed BileTools reload/unload or stop the server. Direct forced disable with foreign-owned menus open is unsupported.

## Backups

Stop the server before copying the complete `plugins/Sigil/` directory. Preserve `storage/signing.key` with `storage/redemptions.sqlite` and any SQLite sidecar files. Replacing the signing key invalidates existing voucher signatures. Restoring an older database can lose later issuance and claim records.

Keep each server's SQLite directory separate. Claims and limits apply to that server's database.

## Interrupted deliveries

Run `/sigil recover` to list unresolved records, then `/sigil recover redemption=<uuid>` to inspect an entry. The report includes recorded reward steps and their outcomes.

A server interruption can occur after an external command took effect but before its result was recorded. Check the affected player's inventory, balance, rank or the external plugin's logs before resolving it. Sigil does not automatically replay interrupted rewards.

Use `resolution=delivered` when the reward was delivered or compensation is complete, or `resolution=cancelled` to close the claim without marking it delivered. Resolution records an operator decision; it does not replay rewards, return a consumed item, or restore claim limits and cooldowns. Active deliveries cannot be resolved while they are still running.

## Diagnostics

Use `/sigil status` for journal counts and the scheduler mode. `/sigil debug version` reports the installed version; `/sigil version` is its hidden alias. `/sigil debug dump upload=false` saves a local report containing plugin, server and runtime details.

Upload requires both `general.debug-upload = true` and an explicit `/sigil debug dump upload=true` request. Review the saved report before sharing it. Keep the signing key and database out of public support attachments.

[Back to Sigil](/sigil)
