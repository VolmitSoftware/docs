---
title: "BileTools: Commands and Permissions"
description: "The /bile command tree"
published: true
date: 2026-10-28T00:00:00.000Z
tags: "biletools, commands, permissions"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Plugin version

`/biletools debug version` displays `BileTools vVERSION`, using the installed plugin version and the Director help heading gradient. `/biletools version` runs the same command but stays hidden from help and command suggestions. Both routes use the normal root command permissions.

## Commands

The root command is `/biletools`. On a Bukkit server the aliases are `bile`, `bi`, `b`, `vomit`, and `vom`. Notation: `<required>`, `[optional]`.

| Command | Description |
|---|---|
| `/bile language` | Open the clickable language picker |
| `/bile language self <locale\|reset>` | Select or reset your personal BileTools language |
| `/bile language server <locale>` | Change the BileTools server default |
| `/bile language server edit [locale]` | Open the per-language message editor in game |
| `/volmit plugins languages [lang]` | Open the shared picker or change every enabled provider's server default |
| `/bile config` | Open the complete in-game settings and language editor |
| `/biletools debug version` | Show the installed plugin version |
| `/biletools debug dump [upload=true]` | Save a diagnostic report, uploading by default |
| `/bile load <plugin>` | Load a plugin jar from the plugins directory |
| `/bile unload <plugin>` | Unload an installed plugin |
| `/bile reload <plugin>` | Reload an installed plugin |
| `/bile inspect <plugin>` | Inspect dependents, recovery availability, reload participation, and teardown capability |
| `/bile uninstall <plugin>` | Delete a plugin jar from the plugins directory |
| `/bile install <plugin> [version]` | Install a plugin from the Bile library |
| `/bile library [plugin]` | List library plugins, or versions for one plugin |

### Parameters

| Command | Parameter | Default | Notes |
|---|---|---|---|
| `load` / `unload` / `reload` / `inspect` / `uninstall` | `plugin` | *required* | Tab-completes from installed plugins |
| `install` | `plugin` | *required* | Tab-completes from the Bile library |
| `install` | `version` | `latest` | Tab-completes from available library versions |
| `library` | `plugin` | `*` | Omit or pass `*` to list everything |
{.dense}

> `/bile uninstall` deletes the jar from disk. If `archive-plugins` is `true`
> (the default), BileTools archives a copy first. This is still a destructive
> filesystem operation.
{.is-warning}

Manual `/bile load`, `/bile unload`, and `/bile reload` commands bypass the
`watcher.ignore` and `watcher.only` filters. Those filters control only automatic watcher reloads.

`/bile inspect` is read-only and uses the same `bile.use` permission as the lifecycle commands. A reported recovery copy or cooperative contract does not guarantee that a plugin can reverse its external side effects. See [Hot reload behavior](/biletools/hot-reload) for deadlines and recovery limits.

## Permissions

| Node | Default | Description |
|---|---|---|
| `bile.use` | `op` | Manage plugins |
| `biletools.config` | `op` | Open the settings editor and change the server language |
| `biletools.debug` | `op` | Save and optionally upload diagnostic reports |
| `biletools.update` | `op` | Receive BileTools update notices and see BileTools in `/volmit plugins updates`. See [Update notifications](/volmlib/api/github-releases) |
| `biletools.language.self` | `true` | Choose or reset your BileTools language; also requires `volmit.language.self` |
| `volmit.language.self` | `true` | Shared requirement for personal language selection |

`bile.use` covers plugin-management commands. There is no read-only subset or separate node for the destructive `uninstall` subcommand.

## Velocity proxy

On a Velocity proxy BileTools registers a smaller command set. Every subcommand requires `bile.use`.

| Command | Description |
|---|---|
| `/biletools load <jar or id>` | Load a plugin from the proxy's plugins directory |
| `/biletools unload <id>` | Unload a loaded plugin |
| `/biletools reload <id>` | Unload a loaded plugin and load it again |
| `/biletools inspect <id>` | Inspect dependencies, recovery copies, owned resources, and the lifecycle worker |
| `/biletools list` | List loaded plugins and the watcher state |
| `/biletools version` | Show the installed BileTools version |
| `/biletools help` | List the proxy subcommands |

`biletools` and `bile` are the only two aliases on the proxy. A proxy command takes precedence over a backend command with the same name, so the short aliases are not registered there; they would shadow backend commands for every connected player.

`/bile reload biletools` is refused. See [Velocity proxy](/biletools/velocity).

## Diagnostic reports

`/biletools debug dump` saves a report under `plugins/BileTools/debug/` and uploads it to mclo.gs by default. Add `upload=false` for a local-only report. Remote deploy keys, addresses, and targets appear only as entry counts, and the server's private key is never included. See [Shared diagnostic reports](/volmlib/api/diagnostics).

## Configuration editor

`/bile config` opens the settings editor. Changes are validated, saved to `biletools.yml`, and applied without a reload. Boolean, numeric, and list settings can be edited in game. Remote deploy trust settings (trusted keys, allowed addresses, the bind address, and deployment targets) are file-only: the editor neither shows nor edits them. See [Remote Deploy](/biletools/remote-deploy).

## Language selection

`/bile language` opens the language picker. Personal selection requires both `biletools.language.self`
and `volmit.language.self`. Server selection requires `biletools.config` or `volmit.language.admin`. See [Languages](/languages).


## Update notifications

`update-notifications` in `biletools.yml` defaults to `true`. It enables checks for stable GitHub releases from `VolmitSoftware/BileTools` and includes this plugin in one combined Volmit join notice. Set it to `false` to disable this plugin's checks and notices. Configuration reloads and config-menu changes apply the setting without restarting.

`/volmit plugins updates` opens the shared Director report for registered plugins. Operators and players with `volmit.update` can view all participating plugins; `biletools.update` grants access to this plugin and defaults to operators. Checks retain cached release metadata on failures and respect GitHub rate limits. Nothing is downloaded or installed. Shared report text is English; the notification setting's config-menu text is included in the plugin's translated catalogs.
