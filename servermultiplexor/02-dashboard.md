---
title: "Multiplexor: Dashboard and wizard"
description: "Monitor local and remote fleets, select servers, and use guided actions"
published: true
date: 2026-10-21T17:07:55.373Z
tags: servermultiplexor, dashboard
editor: markdown
dateCreated: 2026-09-21T00:00:00.000Z
---

Run `./start.sh` or `./start.sh runtime watch` to open the dashboard. `Tab` switches between Local servers and the saved Pterodactyl Remote fleet.

Downloaded builds use `./multiplexor` or `.\multiplexor.exe` with the same arguments. See the [visual guide](/servermultiplexor/00-visual-guide) for the first-server walkthrough.

```none
+-- Plugins ---------------------------------- [+ New] --+
| Server                    State       Port    Primary  |
| paper-dev                 running     25565     [x]    |
| folia-test                stopped     25566     [ ]    |
+-------------------------------------------------------+
+-- Fabric ----------------------------------- [+ New] --+
| fabric-dev                stopped     25567     [x]    |
+-------------------------------------------------------+
+-- Forge ---------------------- [+ Create first server] +
+-- NeoForge ------------------- [+ Create first server] +
```

## Read the dashboard

The header shows fleet availability, players, fleet TPS, and host CPU/memory.

Local servers appear in four vertically stacked groups: **Plugins**, **Fabric**, **Forge**, and **NeoForge**. Empty groups shrink to a clickable **Create first server** strip. Populated groups stretch to share the remaining list space, keeping spare rows inside their borders.

Each row has its configured port and a **Primary** checkbox on the right; each group keeps its own primary server. Additional columns show players, TPS, trend, memory, CPU, and uptime when space permits. All four groups remain visible at 80×24.

Use the Up/Down arrows or the mouse wheel to move through the server list. Overflowing groups scroll to keep the focused row visible. Their headers show the visible range. The wheel moves the current selection, including when the pointer is over blank space inside an expanded group. Remote uses a fleet table.

The selected running server adds CPU/memory charts, facts, and RX/TX charts. A stopped server uses a compact single line. Server and workspace action bars sit below it.

Local metrics refresh every two seconds. macOS uses `nettop` for actual per-Java-process packets and bytes; other platforms leave network metrics unavailable when reliable per-process counters are absent. Remote uses Pterodactyl resource counters at intervals of at least twenty seconds, slowing for larger fleets. Local packet rates use `PPS`; Remote throughput uses `B/s` rather than estimated packets.

The first rate sample is `n/a`. Later samples use measured counter and time differences, rejecting counter resets and restarts. Local and Remote history survives monitor restarts: full-resolution samples last 24 hours, five-minute averages last seven days.

A failed Local group refresh retains that group’s previous servers and readings while other groups continue refreshing; the header identifies the affected group as **METRICS STALE**. With no successful sample, the label is **METRICS UNAVAILABLE**. A successful empty result clears the fleet. `runtime watch --once` exits nonzero on capture failure.

## Navigation

![Selected server's action card with lifecycle, backup, runtime, and addon controls](/servermultiplexor-assets/server-actions.png)

Click a Local server row to open its card, or use arrows to focus it and press Enter. Remote rows select on the first click and open on the second. **MORE** also opens the focused server card. Clicking the right-hand **Primary** checkbox makes that server the primary for its group without opening the card.

Cards are modal: arrows and the wheel move button focus, Enter activates, and printed button letters act as shortcuts. Clicking outside a card or pressing Esc closes it. Clicking empty space inside does nothing. Disabled actions cannot receive focus or run, and the underlying dashboard stays inactive.

Buttons activate on mouse release only if the pointer remains on the pressed button. Unavailable actions are dimmed. **START** runs in the background, leaving the dashboard open; use **CONSOLE** after startup. The selected panel's range badge cycles chart history.

| Key | Action |
|---|---|
| `Tab` | Switch Local/Remote |
| `↑`, `↓`, wheel | Focus a group’s creation control or a server; move button focus inside a card |
| `←`, `→` | Move horizontally between card buttons |
| `Enter`, **MORE** | Open the focused server card; Enter on a group header creates a server in that group |
| `Space`, right checkbox | Set the focused Local server as its group’s primary; Space toggles batch selection on Remote |
| `v`, left checkbox | Toggle a server in the batch selection |
| `a`, **ALL** | Select the whole fleet, including offscreen rows; repeat to clear |
| `x`, **CLEAR** | Clear the batch selection |
| Printed button letter | Activate an enabled action in the open card |
| `d` | Open the selected server's detail view |
| `S`, `X`, `O` | Stop, force-kill, or open console for the selected server |
| `Shift+R` | Repaint without changing selection, chart range, or open card |
| `g`, `G` | Open running consoles in the focused Local group: native terminal grid on Windows, tmux grid on macOS/Linux |
| `n`, group **+ New** | Create an instance in the focused Local group; Remote opens remote creation |
| `b` | Open checked-server actions; without checks, Remote bulk actions or Local Build & tuning |
| `w`, **WORKSPACES**, workspace **MORE** | Open the workspace card from the landing view |
| `c` | Manage the Remote connection |
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

Check rows to show **N SELECTED**, **START**, **STOP**, **RESTART**, **DELETE**, and **CLEAR**. Server-card actions still apply only to that server. Selections follow server identities across refreshes and scrolling; removed servers are dropped, new servers stay unchecked, and changing Local/Remote view clears selection. Local checks can span multiple groups, including servers with the same name.

Start applies to stopped servers, stop to active servers, and restart to running servers. Local deletion skips locked instances. Commands recheck exact targets, report skips/failures, and never expand an empty selection to the whole fleet. Delete lists targets and requires confirmation; Remote also checks permissions and its typed token.

Batch starts stay headless. Local uses `instance bulk`; Remote uses the same fleet engine as its CLI with the checked IDs. Both default to four concurrent servers; CLI commands accept `--concurrency 1-8`. Each restart stops its server before starting it. Workspace Start all and Stop all apply to the focused Local group; Start all opens that group’s consoles after the batch finishes.

## Guided actions

Wizard forms suspend the monitor and return when complete or cancelled. Esc works from menus, text fields, masked key/PIN fields, confirmations, checklists, and result pauses. Cancelling leaves unsubmitted settings unchanged, including after validation errors.

| Location | Actions |
|---|---|
| Local server card | Lifecycle, console, **BACKUPS**, **RUNTIME**, **UPDATE**, **Addons**, port, isolation, and locks |
| Group **+ New** / **Create first server** | Platform and Minecraft version selection within that group; Fabric and NeoForge already have their platform selected |
| Workspace card | Projects, Build & tuning, Pull latest builds, Create many, Start all stopped, Stop all running, Wipe everything, Diagnostics |
| Plugin workspace **NETWORKS** (`v` in the card) | [Velocity networks](/servermultiplexor/09-proxy-networks) |
| Isolated server **Copy drop-ins** | One-time per-artifact copy without subscribing to future syncs |
| Isolated server **RUNTIME** | [Bot swarms and persistent player sessions](/servermultiplexor/08-swarms-and-sessions) |
| Remote server **PROFILE** (`j`) | [SSH setup, readiness, startup/attach capture, status, downloads, recovery, and live tunnels](/servermultiplexor/06-remote-profiling) |
| Remote server **Open folder** | Start or repair Multiplexor Drive, then open the exact folder in Finder |
| Remote **Pull to Local** / Local **Push to Remote** | [Linked copies, file previews, and transfers](/servermultiplexor/05-remote-servers) |

The workspace card keeps the selected Local/Remote view. Local build, tuning, and start/stop actions use the focused group. **Create many** and **Wipe everything** explicitly cover multiple groups; **NETWORKS** manages plugin servers. **BACKUPS** creates, verifies, and restores snapshots; **RUNTIME** selects per-instance Java, heap, presets, and compatibility checks. Build & tuning also sets console line wrap and log format. Port selection accepts 1 through 65535, offers an available port, and identifies ports configured across consumers.

**UPDATE** prepares a jar or Forge/NeoForge installer candidate, backs up the server, starts an isolated loopback staging copy, and promotes the exact artifact after a Minecraft status response. Custom jars need an explicit Minecraft version. Promotion checks the original server, restores its prior running/stopped state, and rolls back on startup failure. A status response does not verify plugin loading or gameplay.

**Create many** accepts an optional common Minecraft version. Local batches run up to four builds/installers and reserve distinct ports before dispatch. Remote batches reserve distinct allocations, default to four requests, and expose `--concurrency 1-8` in the CLI.

Destructive wipe, delete, and factory-reset prompts default to no, shown in red. Remote mirror push, kill, reinstall, and delete also require typed confirmation. Suspended, installing, maintenance, unavailable, and other non-runnable Remote servers remain visible with mutation actions disabled. Remote bulk selection includes all/selected/running/stopped presets, per-server toggles, progress, and an outcome for each target.

## Builds and addons

Version pickers offer cached versions, manual entry, and Retry if upstream metadata is unavailable. Cached choices work without refresh; fallback choices are never labeled latest. Platform/version entries show fetch age, and the `builds` footer summarizes freshness.

Ordinary creates and updates reuse cached builds younger than 24 hours; older or missing builds are fetched. Spigot reuses existing BuildTools jars regardless of age; force a rebuild with `build spigot --force`. Pull latest builds refreshes every platform owned by the consumer, including Spigot, but runs BuildTools only for a newer upstream Jenkins build. Failures are named in the summary.

Local setup offers an **Addons** checklist before first launch. For an existing server, stop it and open **Addons**. Space, Enter, or click toggles entries; Done downloads and applies the saved per-instance selection. Minecraft versions come from metadata or recognized jar filenames, including Leaf; unknown custom-jar versions are requested inline. ViaBackwards selects ViaVersion automatically. Cancellation or failed installation leaves a new server stopped.

Mohist creation offers persistent Mods/Plugins source subscriptions. Other isolated servers offer one-time artifact copies. See [Builds and content](/servermultiplexor/04-builds-and-content) for sync behavior and catalog configuration.

## Project builds

Open **PROJECTS** from the workspace card, choose **Projects dashboard** from Build & tuning, or run `./start.sh projects dashboard`. A project with one target appears as one direct checkbox row. Projects with multiple targets start collapsed. Expand one to see its targets; two or more targets for the same Fabric, Forge, or NeoForge loader share a collapsible platform row with versions underneath. Single loader targets remain directly under the project. Indentation and connectors show the hierarchy.

Library-only projects such as VolmLib are omitted from dashboard build choices; mixed projects retain all their targets. Required source dependencies are included automatically, and standalone library builds remain available through the CLI. Saved library jobs remain inspectable in run history.

Check a project or platform to include all its buildable descendants, or check individual targets across projects. Checkboxes show `[ ]` for none, `[-]` for some, and `[X]` for all checked. Collapsed descendants count toward selection. The header shows the checked count, configured build limits, and whole-run elapsed time. The live output pane starts visible; press `t` to hide or show the focused target's output.

The project tree uses the space its visible rows need, leaving the remaining area for output. At 120 columns or wider, the tree and output sit beside each other, with the tree width following its labels. Narrower terminals stack them; collapsing a small tree gives more rows to output. Log lines wrap within the output pane.

The run timer measures elapsed time since submission, including queuing and preparation across parallel targets. It freezes when the run succeeds, fails, or is cancelled; an interrupted run stops at its last recorded heartbeat. Run history shows each run's duration when the menu opens.

| Key | Action |
|---|---|
| `↑`, `↓`, wheel, `Home`, `End` | Focus a project, platform, or target |
| `←`, `→` | Collapse or expand a branch; Left on a leaf or collapsed branch focuses its parent |
| `Enter`, disclosure click | Expand or collapse a project or platform; Enter on a target opens actions |
| `Space`, left checkbox | Toggle a target or all buildable descendants of a project or platform, including collapsed rows |
| `a` | Check every listed buildable target, including collapsed projects and offscreen rows |
| All checkbox | Check every listed buildable target; click again to clear |
| `x` | Clear all checked targets |
| `e`, `z` | Expand all branches or collapse all branches |
| `t` | Show or hide the live output pane |
| `Page Up`, `Page Down` | Scroll the selected log when the output pane is visible |
| `m`, **MORE** | Open actions at any tree level, including destinations and build limits |
| `s` | Scan a source directory |
| `i`, **CONVERT** | Convert an existing Gradle project, review the file changes, then confirm to write and scan |
| `b`, **BUILD** | Choose a build scope; defaults to checked targets when any are checked |
| `p`, **LIMITS** | Configure concurrent jobs, total memory in MiB, and total Gradle workers |
| `o`, **LOCATIONS** | List, add, edit, or remove destination configurations; preview delivery |
| `h` | Select a run from history |
| `l` | Open logs |
| `r`, `c` | Retry or cancel the selected run |
| `d` | Preview delivery to a named destination, then confirm to apply it |
| `Shift+R` | Repaint |
| `q`, **BACK**, `Esc`, `Ctrl-C` | Return to the previous view; active builds continue |

The bottom action bar keeps **BACK**, **BUILD**, **LIMITS**, and **LOCATIONS** visible at 48 columns. **CONVERT** and **MORE** appear when space permits; `i` opens conversion and `m` opens actions at any tree level. Enter toggles a branch or opens a target's actions. Buttons activate on matching left-button release, and dragging away cancels the click. Projects menus include **Back** (`q`); Back or Esc returns to the parent menu.

With checks, the build menu defaults to **Build N checked targets**; required dependency targets are included automatically. Without checks, choose one target, every target in its project, or **Every listed project and target**. The last choice includes only dashboard build choices. **Reuse verified artifacts** starts enabled and rebuilds targets whose inputs or saved artifacts differ. **Packaging** starts at **Local**; choose **Compact** for maximum compression. Both retain the declared checks. Collapsing any branch preserves its checks. Checks follow target identities across refreshes, row reordering, and run-history changes. Targets removed from the dashboard build catalog lose their checks; targets shown only in run history cannot be checked. Checks affect build scope only.

Press `p`, or choose **Build limits** from actions, to edit **Parallel builds**, **Total memory budget (MiB)**, and **Total Gradle workers**. Choose **Save limits** to save workspace defaults, or **Back** to discard the edits. Memory controls scheduling reservations, not an operating-system limit. See [Build isolation and limits](/servermultiplexor/13-project-builds#build-isolation-and-limits) for how target requirements use the budget.

**LOCATIONS** shows the saved location selector and destination fields together. At 96 columns or wider, saved locations also appear in a list on the left; at 48 columns, use the compact selector above the fields. Up/Down or Tab moves focus. Left/Right cycles the selected location, kind, or platform. Enter or a field click edits text inline; Enter accepts the text, and Esc cancels that field edit. Existing location names remain fixed. For an export directory, click **[...]** beside **Path**, or press `f` outside a text edit, to open the desktop folder picker. It starts at the current path or its nearest existing parent. Selecting a folder updates the draft; **Save** applies it. Cancel keeps the current path. SSH and desktop sessions without a picker support manual path entry.

**Minecraft version** filters which compatible artifacts are delivered. Export directories allow **Any version (optional)**. A blank instance value uses its server metadata; an entered version must match the instance. Shared drop-ins require an exact version, such as `26.3`. Focus the field for its kind-specific guidance.

Use `a` **New**, `s` **Save**, `r` **Remove**, `p` **Preview**, or `q` **Back**. Leaving or switching locations with unsaved changes asks whether to discard them. Removal asks for confirmation and deletes configuration only, leaving destination files unchanged. Preview requires a saved location without unsaved edits and a selected build run. While editing text, shortcut letters remain ordinary text. A saved location can name an export directory, a managed instance, or shared drop-ins.

Press `i` or **CONVERT**, or choose **Convert Gradle project** from actions. Enter the project root containing `gradlew` and `build.gradle` or `build.gradle.kts`. Conversion displays detected targets and exact file changes before asking to write the declaration and scan the project. See [Declare a Gradle project](/servermultiplexor/13-project-builds#declare-a-gradle-project) for supported source layouts and custom declarations.

Press `d` to choose a saved destination, review the delivery preview, and confirm before applying it. With no destinations, choose **Add destination** or **Back**. Adding a destination saves its configuration; delivery remains a separate action.

The worker retains run state and logs when the view closes. Open the view again or use `projects status` to follow it. See [Project builds](/servermultiplexor/13-project-builds) for source snapshots, dependency ordering, artifact reuse, and delivery rules.

## Remote accounts and console

The connection card adds, selects, renames, repairs, rotates, and removes accounts. Enter the panel HTTPS origin once and keys through masked input. Multiplexor verifies keys before selecting an account and stores them in macOS Keychain, never command arguments or profile YAML. `ptlc_` and `ptla_` select Client/Application roles. A root-admin Client key can provide both API roles when administrative routes allow it; otherwise supply a separate Application key. First-server creation requires Servers read/write and Users, Nodes, Allocations, Nests, and Eggs read access.

Remote creation can use an existing configuration or a Panel egg, including on an empty panel. Cards show all advertised and bind allocations separately, with DNS A/AAAA results for resolvable aliases. Multiplexor does not infer upstream NAT mappings or treat private binds, node FQDNs, and public endpoints as equivalent.

Remote console has a persistent resource header, severity colors, Minecraft `§` formatting, prefix/noise trimming, and batched history rendering. Tab completes common/session commands, selectors, and player names learned from join, leave, login, and `list` output; repeat to cycle matches. Esc, Ctrl-C, or `:exit` returns immediately without stopping the server.

## Network display

Velocity networks appear as a `Velocity / <network>` parent and `├─`/`└─` backends with their own ports, state, and metrics. ASCII terminals use `|-` and `` `- ``. Select any row for instance actions; the selected panel shows network and route, and the right-hand Primary checkbox identifies the group’s primary server. Standalone rows remain separate. Focus and checks follow identities as the tree changes.

The **NETWORKS** creator selects compatible stopped backends, an entry server, proxy port, and local or LAN access, then downloads Velocity or uses a local jar. Each network menu shows its join address, state, and proxy player count, distinguishing unavailable counts from zero. It offers lifecycle controls, proxy console, status, and configuration checks. See [Proxy networks](/servermultiplexor/09-proxy-networks) for membership and configuration rules.

## Update Multiplexor

**CHECK FOR UPDATE** (`u`) runs while the dashboard remains usable. It shows checking, current, available-version, or retry status; failures expose the error. **UPDATE** asks to install, then reopens the same workspace and consumer. Development builds show **DEVELOPMENT BUILD** with rebuild guidance. The shortcut is inactive inside cards and details. See [Executable updates](/servermultiplexor/01-installation-and-updates#executable-updates).

[All Multiplexor documentation](/servermultiplexor)
