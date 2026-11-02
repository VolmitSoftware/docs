---
title: "BileTools: Configuration"
description: "Every biletools.yml key with its default"
published: true
date: 2026-11-01T00:00:00.000Z
tags: "biletools, configuration"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Configuration lives in `plugins/BileTools/biletools.yml`. The table below lists the defaults written on first run. BileTools rewrites supported values after loading and restores missing keys. On a Velocity proxy, settings live in `plugins/biletools/biletools.json` instead; that file has its own section below.

## Runtime

| Key | Default | Effect |
|---|---|---|
| `language` | `en_US` | Selects the default locale used for player and operator text. The selector updates this value |
| `metrics` | `true` | Enables anonymous bStats reporting. Changes from the in-game editor apply immediately |
| `update-notifications` | `true` | Checks BileTools' stable GitHub releases for shared update notices and `/volmit plugins updates`. Changes from the in-game editor apply immediately. See [Update notifications](/volmlib/api/github-releases) |

## Watcher

Controls automatic hot-reload.

| Key | Default | Effect |
|---|---|---|
| `watcher.idle-poll-ticks` | `20` | Coordinator check interval when no watcher, staging, deletion, or reload work is pending. Minimum `1` |
| `watcher.active-poll-ticks` | `5` | Coordinator check interval while watcher, staging, deletion, or reload work is pending. Minimum `1` |
| `watcher.fingerprint-debounce-ticks` | `8` | Consecutive stable file-stamp checks required before staging a jar. Minimum `1` |
| `watcher.ignore` | see below | Plugin names the watcher will never auto-manage |
| `watcher.only` | `[]` | If non-empty, switches to allowlist mode: **only** these are auto-managed |
{.dense}

Default `watcher.ignore`:

```yaml
watcher:
  ignore:
    - LuckPerms
    - Vault
    - ProtocolLib
    - packetevents
    - WorldGuard
    - CoreProtect
    - spark
```

These plugins are excluded because they commonly hold static state, register protocol hooks, or support other plugins.

Automatic reload waits for a jar to finish changing. Temporary upload files are ignored. Changes made during a reload apply in the next batch.

Manual `/bile load`, `/bile unload`, and `/bile reload` operations bypass the
automatic filter and cadence.

## Lifecycle and observability

| Key | Default | Effect |
|---|---|---|
| `lifecycle.health-check` | `true` | Fail the reload if the plugin is not actually enabled and registered afterwards |
| `observability.log-timings` | `true` | Log unload, load and reload phase timings |
| `archive-plugins` | `true` | Archive a copy of a jar before `uninstall` deletes it |

Exceptions raised during plugin enable or disable always fail the lifecycle operation, even when `health-check` is disabled. The optional health check additionally verifies the resulting enabled and registered state. Bukkit lifecycle operations have a fixed 120-second deadline; an unfinished callback keeps later lifecycle operations blocked until it finishes. Runtime recovery copies are independent of `archive-plugins`; see [Hot reload behavior](/biletools/hot-reload).

### Native Paper author declarations

These keys belong in the target plugin's `paper-plugin.yml`, not in `biletools.yml`. Each defaults to `false` when omitted and must be a YAML boolean.

| Key | Meaning |
|---|---|
| `biletools.runtime-load` | Opt into experimental native loading on Paper 26.3 build 142 |
| `biletools.runtime-bootstrap` | Declare a repeatable runtime bootstrapper; required if `bootstrapper` is present |
| `biletools.runtime-classpath` | Declare repeatable runtime classpath setup; required if `loader` is present |

Plugin authors must satisfy the [native Paper contract](/biletools/api#native-paper-author-contract). The declarations do not bypass the exact-build or lifecycle-event restrictions.

## Remote deploy

| Key | Default | Effect |
|---|---|---|
| `remote-deploy.slave.slave-enabled` | `false` | Listen for incoming jar deployments |
| `remote-deploy.slave.slave-port` | `9876` | Listener port |
| `remote-deploy.slave.slave-bind-address` | `0.0.0.0` | Interface the listener binds to |
| `remote-deploy.slave.trusted-keys` | `[]` | Public keys of masters allowed to deploy |
| `remote-deploy.slave.allowed-addresses` | `[]` | Master IPs or CIDR ranges allowed to connect. Empty allows any address |
| `remote-deploy.master.master-enabled` | `false` | Push jars to configured targets |
| `remote-deploy.master.master-deploy-to` | `[]` | Targets as `host:port` |
| `remote-deploy.master.trusted-keys` | `[]` | Public keys of receivers this master sends to |
| `remote-deploy.master.master-deploy-signatures` | `["MyPlugin", "AnotherPlugin"]` | Which plugins get pushed |
| `remote-deploy.socket-timeout-ms` | `15000` | Socket timeout. Minimum `1000` |
| `remote-deploy.max-transfer-bytes` | `268435456` | 256 MiB cap per transfer. Minimum 1 MiB |
{.dense}

The master and the receiver both default to off. Each server's key is not a
configuration value: BileTools generates it in `plugins/BileTools/remote-deploy/`.
Read [Remote Deploy](/biletools/remote-deploy) before you enable either half.

## Velocity proxy (biletools.json)

The proxy edition reads `plugins/biletools/biletools.json` and has no language, metrics, remote-deploy, or in-game editor settings. Its keys are listed on [Velocity proxy](/biletools/velocity#settings).

## Language files

The server default is the `language` key above. Any id matching `[A-Za-z0-9_-]{2,32}` is accepted, including a custom locale.

| Path under `plugins/BileTools/` | Contents |
|---|---|
| `languages/<locale>.toml` | Editable catalogs: generated English, installed repository locales, and custom locales |
| `languages/language-preferences.properties` | Personal language choices |
| `languages/.upstream/<locale>.toml` | Unedited upstream copy last merged into each installed repository locale, plus the English reference last written |
| `languages/.upstream/upstream.properties` | Tracked repository, branch, revision, ETag, last check time, and a SHA-256 per stored file |
{.dense}

Translations track the `master` branch of `VolmitSoftware/BileTools` (`src/main/resources/languages`). At startup and on `/bile language update`, BileTools asks GitHub for the newest commit touching that folder, at most once per five minutes, and fetches every installed repository locale at that commit. The console logs `BileTools languages match VolmitSoftware/BileTools@master (<commit>).` or one `Updated BileTools language <locale> ...` line per changed file. A failed check logs once and leaves English and every installed file active. There is no periodic check.

Each update is a per-key merge: new upstream keys are added, keys you have not edited take the upstream value, keys you edited are kept, and keys removed upstream are removed only if you had not edited them. English merges the same way from the built-in catalog after a plugin update. Custom files are never touched. A repository locale that is not installed downloads when it is selected; when the configured `language` is not installed, English stays active until the download finishes and the locale then activates.

A custom locale is any other `languages/<id>.toml`. An optional `[meta]` table sets `name` (the name shown in the picker, editor, and settings editor) and `base` (another locale to fall back to before English, up to four levels):

```toml
[meta]
name = "Pirate Speak"
base = "de_DE"
```

When `language` names a non-repository locale id that has no file, BileTools creates it from the English reference with `name` set to the id and `base = "en_US"`. A partial catalog stays selectable: its valid messages are used and the rest fall back one key at a time. During hot reload, invalid TOML keeps the last readable version active until you fix the file; language updates do not trigger a hot reload.

See [Languages](/languages).

## In-game settings editor

`/bile config` exposes every setting except the remote deploy trust settings. Boolean, numeric, and list values are editable, and the language entry opens the language tools. Changes are validated, saved atomically, and applied live. Receiver changes restart the listener; metrics changes start or stop bStats.

`remote-deploy.slave.trusted-keys`, `remote-deploy.slave.allowed-addresses`, `remote-deploy.slave.slave-bind-address`, `remote-deploy.master.master-deploy-to`, and `remote-deploy.master.trusted-keys` never appear in the editor. Edit them directly in `biletools.yml`, then reload BileTools or restart the server. Enabling either half of remote deploy from the editor loads the server key, or generates it if it does not exist yet.

The language entry opens `/bile language server edit`, which edits messages without changing anyone's selected language. It needs `biletools.config` or `volmit.language.admin`.

## Update notifications

`update-notifications` in `biletools.yml` defaults to `true`. It enables checks for stable GitHub releases from `VolmitSoftware/BileTools` and includes this plugin in one combined Volmit join notice. Set it to `false` to disable this plugin's checks and notices. Configuration reloads and config-menu changes apply the setting without restarting.

`/volmit plugins updates` opens the shared Director report for registered plugins. Operators and players with `volmit.update` can view all participating plugins; `biletools.update` grants access to this plugin and defaults to operators. Checks retain cached release metadata on failures and respect GitHub rate limits. Nothing is downloaded or installed. Shared report text is English; the notification setting's config-menu text is included in the plugin's translated catalogs.
