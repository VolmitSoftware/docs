---
title: "Brimstone: Diagnostics"
description: "Status, debug reports, bStats, update notices, and console messages"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "brimstone, diagnostics, bstats"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

This page covers how to check Brimstone's state, what its reports contain, the outside services it can contact, and what its console messages mean.

## Status

`/brimstone status` shows five lines:

| Line | Content |
|---|---|
| Configuration | Whether launches are enabled, the server language, and whether hot reload is on |
| Effects | Configured launchers, active owned TNT, and active secondary effects |
| Services | Crafting, bStats, and update notices |
| Compatibility | Java 25 and the supported Minecraft range, and Folia region or Bukkit main-thread scheduling |
| Integrations | WorldGuard as ready, absent, degraded, or disabled, and whether other protection plugins are checked |

The startup log ends with `Brimstone ready in <n> ms with <scheduler> scheduling and <n> TNT types.`. `/brimstone version` and `/brimstone debug version` print the installed version.

## Debug reports

`/brimstone debug dump` saves a report under `plugins/Brimstone/debug/`. To upload one to mclo.gs, run `/brimstone debug dump upload=true`. `debug.uploadEnabled` defaults to on; set it to `false` to refuse uploads. A report uploads only when an operator asks for one.

Brimstone adds these entries to the shared report:

- Launcher definitions, active TNT, and secondary effects.
- Entity limits and effect settings.
- The bStats setting and whether the client started.
- Crafting and update-notification settings, and the cooldown.
- Whether launches are enabled, the WorldGuard state with its version and mode, whether protection plugins are checked, and the scheduler.
- The language, language source, revision, last check, and last error.
- The suite heartbeat.
- The session counters below.

`/brimstone debug version` shows the plugin version.

### Session counters

Reports include launch attempts and successes, rejection reasons, entity-quota refusals, suppressed secondary spawns, and particle-budget totals. Counters last for one plugin session: file changes and `/brimstone clear` keep them, and restarting the plugin resets them. They hold no player or world identities and write no per-event log lines.

A launch attempt is a main-hand left-click in the air with a launcher while Brimstone is running. Plain TNT, off-hand use, and other clicks do not count. A success means Brimstone tracked the TNT and took the inventory cost, not that the TNT later exploded. Rejections separate denied interactions, unknown types, permissions, world and protection rules, cooldown, fuel, entity limits, and spawn, inventory, or tracking failures.

Quota counters record failed entity reservations and transfers into a full world. Secondary counters record failed child-entity reservations and spawn attempts. These overlap: a secondary quota refusal adds to both totals. Removing an active effect is not a suppressed spawn.

Particle totals describe requested and granted budget, with the difference recorded as suppressed. They do not confirm what a client rendered. Activity while a report is collected can make related totals differ slightly.

## bStats

Brimstone reports anonymous usage statistics under bStats plugin ID `34582` using the official Bukkit client, with no custom charts. Reporting is on by default.

Set `metrics.enabled = false` in `brimstone.toml` or `/brimstone config` to stop it as soon as the change applies. Turning it back on starts a new client. The shared `plugins/bStats/config.yml` opt-out always wins; restart the server after changing that file.

## Update notices

`general.updateNotifications = true` checks GitHub releases for `VolmitSoftware/Brimstone` once at startup. Players with `brimstone.update`, which defaults to operators, are told when a newer release exists. Brimstone never downloads or installs updates. Turning the setting off stops notices without a restart.

`/volmit plugins updates` shows the shared report to operators and players with `volmit.update`. `brimstone.update` allows this plugin's entry.

## Console messages

| Message | Meaning and fix |
|---|---|
| `Brimstone requires Minecraft 26.1 through 26.3 on Java 25 or newer; found Minecraft <version> on Java <version>.` | The server or Java version is unsupported. Brimstone stops before downloading libraries. |
| `Brimstone could not enable` | Startup failed, often from an invalid `brimstone.toml`. The startup banner prints after the exception. Read the exception that follows, fix the cause, and restart. |
| `Rejected Brimstone file changes; the last known good settings remain active` | A saved file is invalid. Read the exception, correct the file, and save again. |
| `Configured language could not load; using English` | The configured language file is invalid. Correct it or select another language. |
| `Could not install Brimstone language <locale>; English remains active` | The download failed. Check network access to GitHub, then select the language again. |
| `Brimstone could not check the language source:` | The repository check failed. Installed files and English stay active. Run `/brimstone language update` to try again. |
| `WorldGuard integration could not initialize; protected actions will be denied` | WorldGuard is installed but incompatible or failing. Fix WorldGuard or set `access.worldGuard = "DISABLED"`. |
| `WorldGuard <version> protection enabled.` | Brimstone attached to WorldGuard. |
| `WorldGuard could not capture launcher permissions` | WorldGuard failed while Brimstone read the launching player's permissions. The integration is degraded until WorldGuard enables again. |
| `WorldGuard protection query failed; denying TNT effects` | A region query failed. The integration is degraded until WorldGuard enables again. Read the exception that follows. |
| `A protection plugin failed during a block break check; denying TNT effects` | Another plugin threw an exception while Brimstone checked a block. Read the exception that follows, or set `access.protectionPlugins = false`. |
| `Timed out removing <n> owned effects during shutdown; owned entities are not saved to disk.` | Removal did not finish in five seconds. Owned effects are not saved, so they do not return after a restart. |
{.dense}

## Related pages

- [Installation *Requirements and first start*](/brimstone/01-installation)
- [Configuration *The `debug`, `metrics`, and `general` settings*](/brimstone/03-configuration)
- [Integrations *WorldGuard, other protection plugins, and suite metrics*](/brimstone/06-integrations)
{.links-list}
