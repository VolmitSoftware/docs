---
title: "Multiplexor: Visual guide"
description: "Download Multiplexor, create a server, connect a panel, and keep the app updated"
published: true
date: 2026-09-22T00:00:00.000Z
tags: servermultiplexor, getting-started
editor: markdown
dateCreated: 2026-09-22T00:00:00.000Z
---

Multiplexor opens as a terminal dashboard. These screenshots show the actual application with example instances; release numbers and available actions can change between versions.

## 1. Download and open

Open the [latest release](https://github.com/VolmitSoftware/ServerMultiplexor/releases/latest) and expand **Assets**. Choose `macos-arm64` for an Apple Silicon Mac, `macos-x64` for an Intel Mac, or `windows-x64` for Windows on Intel/AMD.

![GitHub release assets showing the Apple Silicon, Intel Mac, and Windows downloads](/servermultiplexor-assets/downloads.png)

Extract the archive into a writable workspace folder. In a terminal opened there, run `./multiplexor` on macOS or `.\multiplexor.exe` in Windows PowerShell. Compiled downloads do not need Dart. See [installation steps](/servermultiplexor/01-installation-and-updates#download-and-first-launch) for commands, requirements, and Linux source builds.

## 2. Read the dashboard

![Local dashboard with two stopped example instances, server actions, workspace actions, and an update button](/servermultiplexor-assets/dashboard.png)

The top strip summarizes the fleet. Select a server row to show its details and actions below the table. These example instances are stopped; running servers add live readings. Use **Tab** to switch Local/Remote, arrows or a click to select, and **Enter** to open the selected server's actions.

## 3. Create a server

Choose **+ NEW** or press **n**. Select the server platform, then follow the prompts for Minecraft version, name, sharing/isolation, and addons. Use the **plugin** consumer for Paper-family servers; switch consumer for Forge, Fabric, or NeoForge.

![New server platform menu with Paper, Purpur, Folia, Canvas, Leaf, and Spigot](/servermultiplexor-assets/create-server.png)

The picker shows cached-build availability. **Isolated** keeps shared drop-ins, Iris packs, and operator data out of the new instance. After setup, select the server and choose **START**, then **CONSOLE** to view its output. **Esc** backs out of setup without submitting it.

## 4. Manage a server

![Server action card with start, console, addons, backups, runtime settings, and update controls](/servermultiplexor-assets/server-actions.png)

Open a server card with **Enter**, a second click on its row, or **MORE**. Use **RUNTIME** for Java/heap settings, **BACKUPS** for snapshots, and **ADDONS** for plugins or mods. Stop the server before changing addons or creating a backup. Dimmed actions are unavailable in its current state.

The card's **UPDATE** updates that Minecraft server. The dashboard's bottom-right update button updates Multiplexor itself. See [local server commands](/servermultiplexor/03-local-servers) for the complete reference.

## 5. Connect Pterodactyl

Switch to **Remote** with **Tab**, then press **c** to open the connection manager. Select **Add connection** and enter an account label, the panel's HTTPS address, and an API key when prompted. Multiplexor verifies the account before loading its servers.

![Remote connection manager with Add connection selected and no accounts saved](/servermultiplexor-assets/remote-accounts.png)

See [remote account setup](/servermultiplexor/05-remote-servers#accounts) for API permissions and credential storage. Remote profiling also needs [SSH access to the Wings host with Docker permissions](/servermultiplexor/06-remote-profiling); connecting the panel alone does not enable profiling.

## 6. Keep Multiplexor updated

Downloaded releases enable automatic updates by default. Opening the dashboard checks when due, installs a verified newer stable release, and reopens the dashboard. Successful checks are spaced six hours apart; failed checks can retry after fifteen minutes.

Press **u** or click **CHECK FOR UPDATE** to check immediately. When a release is available, the button shows **UPDATE** and its version; select it to review and confirm installation.

![Dashboard footer showing an available Multiplexor update in the bottom-right corner](/servermultiplexor-assets/update-check.png)

Use `./multiplexor update auto off` to disable automatic updates, `update auto on` to enable them, or `update status` to inspect the setting. On Windows, use `.\multiplexor.exe`. Updates replace the application executable; worlds and workspace files stay in place. Source builds show **DEVELOPMENT BUILD** and rebuild through their launcher instead. See [all update controls](/servermultiplexor/01-installation-and-updates#executable-updates).

[All Multiplexor documentation](/servermultiplexor)
