---
title: "Multiplexor: Dashboard and wizard"
description: "Monitor local and remote fleets, select servers, and use guided actions"
published: true
date: 2026-09-22T00:00:00.000Z
tags: servermultiplexor, dashboard
editor: markdown
dateCreated: 2026-09-21T00:00:00.000Z
---

Run `./start.sh` or `./start.sh runtime watch` to open the dashboard. `Tab` switches between Local servers and the saved Pterodactyl Remote fleet.

Downloaded builds use `./multiplexor` or `.\multiplexor.exe` with the same arguments. See the [visual guide](/servermultiplexor/00-visual-guide) for the first-server walkthrough.

![Local dashboard with example stopped servers and the controls below the fleet table](/servermultiplexor-assets/dashboard.png)

## Read the dashboard

The header shows fleet availability, players, fleet TPS, and host CPU/memory. The server table shows state, players, TPS, trend, memory, CPU, and uptime; narrow terminals omit whole columns. The selected running server adds CPU/memory charts, facts, and RX/TX charts. A stopped server uses a compact single line. Server and workspace action bars sit below it.

Local metrics refresh every two seconds. macOS uses `nettop` for actual per-Java-process packets and bytes; other platforms leave network metrics unavailable when reliable per-process counters are absent. Remote uses Pterodactyl resource counters at intervals of at least twenty seconds, slowing for larger fleets. Local packet rates use `PPS`; Remote throughput uses `B/s` rather than estimated packets.

The first rate sample is `n/a`. Later samples use measured counter and time differences, rejecting counter resets and restarts. Local and Remote history survives monitor restarts: full-resolution samples last 24 hours, five-minute averages last seven days.

Failed Local refreshes retain the previous fleet and readings as **METRICS STALE**. With no successful sample, the label is **METRICS UNAVAILABLE**. A successful empty result clears the fleet. `runtime watch --once` exits nonzero on capture failure.

## Navigation

![Selected server's action card with lifecycle, backup, runtime, and addon controls](/servermultiplexor-assets/server-actions.png)

Click a row to select it; click again, press Enter, or choose **MORE** to open its card. Cards are modal: arrows and the wheel move button focus, Enter activates, and printed button letters act as shortcuts. Clicking outside a card or pressing Esc closes it; clicking empty space inside does nothing. Disabled actions cannot receive focus or run, and the underlying dashboard stays inactive.

Buttons activate on mouse release only if the pointer remains on the pressed button. Unavailable actions are dimmed. **START** runs in the background, leaving the dashboard open; use **CONSOLE** after startup. The selected panel's range badge cycles chart history.

| Key | Action |
|---|---|
| `Tab` | Switch Local/Remote |
| `↑`, `↓`, wheel | Select a server or move focus inside a card |
| `←`, `→` | Move horizontally between card buttons |
| `Enter`, second row click, **MORE** | Open the selected server card; activate a focused card button |
| `Space`, checkbox click | Toggle a server in the batch selection |
| `a`, **ALL** | Select the whole fleet, including offscreen rows; repeat to clear |
| `x`, **CLEAR** | Clear the batch selection |
| Printed button letter | Activate an enabled action in the open card |
| `d` | Open the selected server's detail view |
| `S`, `X`, `O` | Stop, force-kill, or open console for the selected server |
| `Shift+R` | Repaint without changing selection, chart range, or open card |
| `g`, `G` | Open all running Local consoles: native terminal grid on Windows, tmux grid on macOS/Linux |
| `n` | Create an instance |
| `b` | Open checked-server actions; without checks, Remote bulk actions or Local Build & tuning |
| `w`, **WORKSPACES**, workspace **MORE** | Open the workspace card from the landing view |
| `c` | Switch consumer and reload the fleet |
| `r` | Cycle `15m`, `1h`, `6h`, `24h`, `7d` |
| `u` | Check for an executable update from the landing view |
| `q`, `Ctrl-C` | Quit |

The detail view fills the frame with TPS, CPU %, memory MiB, player count, RX/TX, and a runtime-log tail. On wide terminals, network charts span the row above the log. Esc returns to the landing view; Esc there quits. Terminals below 80×24 show a resize prompt.

Mouse input requires SGR events, supported by Terminal.app, iTerm2, kitty, WezTerm, tmux, and VS Code terminals. Click-only reporting uses `?1000` and `?1006`; pointer motion alone does not repaint. Exit disables reporting. Both dashboards repaint fully every thirty seconds, including open cards/details, restoring mouse tracking while preserving selection and range. Normal refreshes redraw changed rows only. `Shift+R` also works in wizard menus.

For a colorless frame with no terminal escape bytes or TTY requirement:

```bash
./start.sh runtime watch --once >> monitor.log
```

## Batch actions

Check rows to show **N SELECTED**, **START**, **STOP**, **RESTART**, **DELETE**, and **CLEAR**. Server-card actions still apply only to that server. Selections follow server identities across refreshes and scrolling; removed servers are dropped, new servers stay unchecked, and changing provider or consumer clears selection.

Start applies to stopped servers, stop to active servers, and restart to running servers. Local deletion skips locked instances. Commands recheck exact targets, report skips/failures, and never expand an empty selection to the whole fleet. Delete lists targets and requires confirmation; Remote also checks permissions and its typed token.

Batch starts stay headless. Local uses `instance bulk`; Remote uses the same fleet engine as its CLI with the checked IDs. Both default to four concurrent servers; CLI commands accept `--concurrency 1-8`. Each restart stops its server before starting it. Workspace Start all and Stop all use these engines; Start all opens consoles after the batch finishes.

## Guided actions

Wizard forms suspend the monitor and return when complete or cancelled. Esc works from menus, text fields, masked key/PIN fields, confirmations, checklists, and result pauses. Cancelling leaves unsubmitted settings unchanged, including after validation errors.

| Location | Actions |
|---|---|
| Local server card | Lifecycle, console, **BACKUPS**, **RUNTIME**, **UPDATE**, **Addons**, port, isolation, and locks |
| **New** | Single-server platform and Minecraft version selection |
| Workspace card | Build & tuning, Pull latest builds, Create many, Start all stopped, Stop all running, Wipe everything, Diagnostics |
| Plugin workspace **NETWORKS** (`v` in the card) | [Velocity networks](/servermultiplexor/09-proxy-networks) |
| Isolated server **Copy drop-ins** | One-time per-artifact copy without subscribing to future syncs |
| Isolated server **RUNTIME** | [Bot swarms and persistent player sessions](/servermultiplexor/08-swarms-and-sessions) |
| Remote server **PROFILE** (`j`) | [SSH setup, readiness, startup/attach capture, status, downloads, recovery, and live tunnels](/servermultiplexor/06-remote-profiling) |
| Remote server **Open folder** | Start or repair Multiplexor Drive, then open the exact folder in Finder |
| Remote **Pull to Local** / Local **Push to Remote** | [Linked copies, file previews, and transfers](/servermultiplexor/05-remote-servers) |

The workspace card keeps the selected Local/Remote view. **BACKUPS** creates, verifies, and restores snapshots; **RUNTIME** selects per-instance Java, heap, presets, and compatibility checks. Build & tuning also sets console line wrap and log format. Port selection accepts 1 through 65535, offers an available port, and identifies ports configured across consumers.

**UPDATE** prepares a jar or Forge/NeoForge installer candidate, backs up the server, starts an isolated loopback staging copy, and promotes the exact artifact after a Minecraft status response. Custom jars need an explicit Minecraft version. Promotion checks the original server, restores its prior running/stopped state, and rolls back on startup failure. A status response does not verify plugin loading or gameplay.

**Create many** accepts an optional common Minecraft version. Local batches run up to four builds/installers and reserve distinct ports before dispatch. Remote batches reserve distinct allocations, default to four requests, and expose `--concurrency 1-8` in the CLI.

Destructive wipe, delete, and factory-reset prompts default to no, shown in red. Remote mirror push, kill, reinstall, and delete also require typed confirmation. Suspended, installing, maintenance, unavailable, and other non-runnable Remote servers remain visible with mutation actions disabled. Remote bulk selection includes all/selected/running/stopped presets, per-server toggles, progress, and an outcome for each target.

## Builds and addons

Version pickers offer cached versions, manual entry, and Retry if upstream metadata is unavailable. Cached choices work without refresh; fallback choices are never labeled latest. Platform/version entries show fetch age, and the `builds` footer summarizes freshness.

Ordinary creates and updates reuse cached builds younger than 24 hours; older or missing builds are fetched. Spigot reuses existing BuildTools jars regardless of age; force a rebuild with `build spigot --force`. Pull latest builds refreshes every platform owned by the consumer, including Spigot, but runs BuildTools only for a newer upstream Jenkins build. Failures are named in the summary.

Local setup offers an **Addons** checklist before first launch. For an existing server, stop it and open **Addons**. Space, Enter, or click toggles entries; Done downloads and applies the saved per-instance selection. Minecraft versions come from metadata or recognized jar filenames, including Leaf; unknown custom-jar versions are requested inline. ViaBackwards selects ViaVersion automatically. Cancellation or failed installation leaves a new server stopped.

Mohist creation offers persistent Mods/Plugins source subscriptions. Other isolated servers offer one-time artifact copies. See [Builds and content](/servermultiplexor/04-builds-and-content) for sync behavior and catalog configuration.

## Remote accounts and console

The connection card adds, selects, renames, repairs, rotates, and removes accounts. Enter the panel HTTPS origin once and keys through masked input. Multiplexor verifies keys before selecting an account and stores them in macOS Keychain, never command arguments or profile YAML. `ptlc_` and `ptla_` select Client/Application roles. A root-admin Client key can provide both API roles when administrative routes allow it; otherwise supply a separate Application key. First-server creation requires Servers read/write and Users, Nodes, Allocations, Nests, and Eggs read access.

Remote creation can use an existing configuration or a Panel egg, including on an empty panel. Cards show all advertised and bind allocations separately, with DNS A/AAAA results for resolvable aliases. Multiplexor does not infer upstream NAT mappings or treat private binds, node FQDNs, and public endpoints as equivalent.

Remote console has a persistent resource header, severity colors, Minecraft `§` formatting, prefix/noise trimming, and batched history rendering. Tab completes common/session commands, selectors, and player names learned from join, leave, login, and `list` output; repeat to cycle matches. Esc, Ctrl-C, or `:exit` returns immediately without stopping the server.

## Network display

Velocity networks appear as a `Velocity / <network>` parent and `├─`/`└─` backends with their own ports, state, and metrics. ASCII terminals use `|-` and `` `- ``. Select any row for instance actions; the selected panel shows network and route, and an asterisk marks the active instance. Standalone rows remain separate. Focus and checks follow identities as the tree changes.

The **NETWORKS** creator selects compatible stopped backends, an entry server, proxy port, and local or LAN access, then downloads Velocity or uses a local jar. Each network menu shows its join address, state, and proxy player count, distinguishing unavailable counts from zero. It offers lifecycle controls, proxy console, status, and configuration checks. See [Proxy networks](/servermultiplexor/09-proxy-networks) for membership and configuration rules.

## Update Multiplexor

**CHECK FOR UPDATE** (`u`) runs while the dashboard remains usable. It shows checking, current, available-version, or retry status; failures expose the error. **UPDATE** asks to install, then reopens the same workspace and consumer. Development builds show **DEVELOPMENT BUILD** with rebuild guidance. The shortcut is inactive inside cards and details. See [Executable updates](/servermultiplexor/01-installation-and-updates#executable-updates).

[All Multiplexor documentation](/servermultiplexor)
