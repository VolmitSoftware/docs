---
title: "Multiplexor: Installation and updates"
description: "Requirements, launchers, command syntax, and executable updates"
published: true
date: 2026-09-22T00:00:00.000Z
tags: servermultiplexor, installation
editor: markdown
dateCreated: 2026-09-21T00:00:00.000Z
---

Multiplexor runs on Windows, macOS, and Linux. Use a compiled release or launch it from a source checkout.

For a screenshot walkthrough, start with the [visual guide](/servermultiplexor/00-visual-guide).

## Requirements

| Component | Required for |
|---|---|
| Java 17+, or the version your server requires | Running Minecraft servers |
| Dart 3.10+ and Git | Running and building from source |
| tmux | Interactive runtime consoles on macOS/Linux |
| Node.js 22+ and npm | Mineflayer gameplay commands |
| macOS Keychain | Persistent Pterodactyl credentials; origin-bound environment credentials support CI/non-macOS sessions |
| rclone and OpenSSH | Multiplexor Drive; macOS mounts use loopback NFS |
| SSH access with Docker permissions | [Remote JProfiler profiling](/servermultiplexor/06-remote-profiling) |

## Download and first launch

Open [GitHub Releases](https://github.com/VolmitSoftware/ServerMultiplexor/releases/latest), expand **Assets**, and choose the archive for your computer. `<version>` below is the release version shown on that page; **Source code** archives require a source build.

![GitHub release page with platform-specific executable archives under Assets](/servermultiplexor-assets/downloads.png)

The pictured release is an example; use the latest release's matching archive.

| Computer | Download |
|---|---|
| Mac with Apple Silicon (M-series) | `multiplexor-v<version>-macos-arm64.tar.gz` |
| Mac with an Intel processor | `multiplexor-v<version>-macos-x64.tar.gz` |
| Windows x64 (Intel/AMD) | `multiplexor-v<version>-windows-x64.zip` |
| Linux or another architecture | Use [Source builds](/servermultiplexor/10-workspace-and-source); no matching compiled release is currently published |

Extract the archive into a writable folder you want to use as the Minecraft workspace, such as `MinecraftWorkspace` in your home directory. Open a terminal in that folder and run the extracted executable. Compiled releases contain `multiplexor` or `multiplexor.exe` and need neither Dart nor the source launchers.

**macOS:**

```bash
cd ~/MinecraftWorkspace
chmod +x multiplexor
./multiplexor --version
./multiplexor
```

**Windows PowerShell:**

```powershell
Set-Location "$HOME\MinecraftWorkspace"
.\multiplexor.exe --version
.\multiplexor.exe
```

No arguments opens the [dashboard](/servermultiplexor/02-dashboard). First launch creates workspace folders in the current directory unless it finds an existing workspace above it; use `--root <path>` to select one explicitly. Start from the same workspace folder each time. The executable directory must remain writable for updates.

Create and run a local server from the same folder:

```bash
./multiplexor consumer use plugin
./multiplexor server create demo --type purpur --auto-build
./multiplexor runtime start demo
./multiplexor runtime watch
```

On Windows, replace `./multiplexor` with `.\multiplexor.exe`. `remote verify` and `remote list` inspect configured [Pterodactyl accounts](/servermultiplexor/05-remote-servers).

## Launch from source

From a [source checkout](/servermultiplexor/10-workspace-and-source), run `./start.sh` on macOS/Linux or `.\start.ps1` in Windows PowerShell. Both accept the same commands; no arguments opens the dashboard. Windows needs neither WSL, Git Bash, nor tmux, and supports Windows PowerShell 5.1 and PowerShell 7 quoted arguments.

```bash
./start.sh --version
./start.sh
./start.sh consumer use plugin
./start.sh server create demo --type purpur --auto-build
./start.sh runtime start demo
./start.sh runtime watch
./start.sh remote verify
./start.sh remote list
```

The launchers resolve Dart dependencies and rebuild when Dart source, `pubspec.yaml`, or `pubspec.lock` is newer than the executable. Unchanged builds run immediately. They use Flutter's cached Dart SDK directly when available. Compilation failure preserves the previous executable, removes the partial build, and exits nonzero without launching stale code. `MULTIPLEXOR_REBUILD=1` forces recompilation; launcher diagnostics go to stderr, leaving stdout parseable.

On macOS, the launcher installs missing tmux through Homebrew when available. Windows emits `multiplexor.exe`; macOS emits `multiplexor`. Node installation and repair for gameplay commands are covered under [Gameplay checks](/servermultiplexor/07-gameplay-checks).

## Command syntax

Use `./start.sh <namespace> <action> [args]`, or pass the same arguments directly to the compiled executable. Local commands and wizard operations share validation: unknown options, missing values, repeated single-value options, and extra positional arguments are rejected. Boolean options accept `--flag`, `--flag=true`, or `--flag=false`.

| Global option | Meaning |
|---|---|
| `--consumer <profile>` | Override the active consumer for one command |
| `--root <path>` | Use another workspace |
| `--verbose` | Print argument-normalization diagnostics |
| `help <command>` or `<command> --help` | Show focused command help |

## Executable updates

**Automatic updates are on by default for downloaded releases.** Opening the dashboard checks for a newer stable release when due, verifies and installs it, then continues into the dashboard. Keep the executable in a writable folder; no administrator prompt is used.

Press **u** or select **CHECK FOR UPDATE** at the dashboard's bottom right to check immediately. If an update is available, select **UPDATE** to confirm installation. This updates Multiplexor; **UPDATE** inside a server card updates that Minecraft server instead.

![Multiplexor dashboard footer with an available application update](/servermultiplexor-assets/update-check.png)

| Command | Behavior |
|---|---|
| `update [install]` | Download, verify, and install a newer stable compiled release |
| `update check` | Check without downloading an executable or changing settings |
| `update status` | Show version, executable path, automatic-update setting, and last check |
| `update auto [on\|off]` | Read or change automatic updates for this executable |

These commands run before workspace initialization and need neither a workspace nor Dart. Only releases built with `tool/build_exe.dart --version <semver>` can install updates. Source runs and ordinary development builds compile local source instead. Older downloads need one manual replacement with an updater-enabled release. Installation requires a writable executable directory and does not request elevation.

Interactive launches with no arguments, `wizard`, or `runtime watch` check on first use, then at most once every six hours after a successful check. Updates select a newer stable semantic version for the current supported platform; they never downgrade or choose a prerelease. Downloads must pass `SHA256SUMS`, archive, and executable-version checks.

Automatic installation replaces the executable and reopens the dashboard with the same arguments and working directory. A manual `update` installs the release; launch the executable again to open the dashboard. Windows completes replacement through a temporary helper after the process exits. Preparation failures retain the existing executable; replacement failures restore it. Network failures leave the dashboard usable and permit retry after fifteen minutes. Server instances, worlds, credentials, and workspace files are outside the update.

Preferences and check times are stored per executable in `~/.multiplexor/self-update` (`%USERPROFILE%\.multiplexor\self-update` on Windows). `MULTIPLEXOR_NO_UPDATE=1` skips one automatic check. Help, version, noninteractive commands, and background server/watch processes do not auto-update.

Inspect the setting, check/install manually, or change automatic updates:

```bash
./multiplexor update status
./multiplexor update check
./multiplexor update
./multiplexor update auto off
./multiplexor update auto on
```

Use `.\multiplexor.exe` on Windows. `update check` only reports availability; `update` installs. Disabling automatic updates leaves these manual commands available. Source checkouts use their local source and launcher rebuilds; executable updates do not pull Git changes.

[All Multiplexor documentation](/servermultiplexor)
