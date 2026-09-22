---
title: "Remote Servers"
description: "Pterodactyl accounts, fleet operations, creation, file transfers, and Multiplexor Drive"
published: true
date: 2026-09-22T00:00:00.000Z
tags: "servermultiplexor, pterodactyl"
editor: markdown
dateCreated: 2026-09-21T00:00:00.000Z
---

Multiplexor manages Pterodactyl servers through saved panel accounts. Use the Remote dashboard or `./start.sh remote ...`; `ptero` is an alias. Commands use the active account unless `--profile <id>` selects another for that command.

## Accounts

In the dashboard, press **Tab** for Remote, then **c** for the connection manager. Select **Add connection** to begin.

![Remote account manager before the first connection is added](/servermultiplexor-assets/remote-accounts.png)

The Remote connection card adds, selects, renames, repairs, rotates, and removes accounts. Enter the HTTPS panel origin and API key through masked input; keys are verified before selecting the account. Standard `ptlc_` and `ptla_` prefixes select the Client or Application role automatically.

A root-admin Client key can access administrative routes on current Pterodactyl releases; enroll a separate Application key when those routes are unavailable. First-server/egg creation requires Servers read/write and Users, Nodes, Allocations, Nests, and Eggs read access.

Non-secret account metadata lives in `.multiplexor/pterodactyl-profiles.yaml`. Persistent bearer keys use macOS Keychain, bound to the exact account and HTTPS origin. Multiplexor never accepts API keys on the command line or saves them in profile YAML.

For CI or non-macOS sessions, pair an origin-bound environment key with its origin, such as `MULTIPLEXOR_PTERODACTYL_DEV_CLIENT_API_KEY` and `MULTIPLEXOR_PTERODACTYL_DEV_ORIGIN=https://panel.example.com`. These credentials last only for the session; use persistent credentials for long-running child-process workflows.

| Command | Purpose |
|---|---|
| `remote connect --url <https://panel> [--id <id>] [--name <name>] [--application] [--replace]` | Add or repair an account through masked API-key input, verify it, and make it active. `remote account add` accepts the same flags. |
| `remote account list` | List accounts, the active account, panel origin, and Client/Application credential status. `accounts` and `profiles` are aliases. |
| `remote account use <id>` | Persist the account used when `--profile` is omitted. |
| `remote account rename <id> <name>` | Rename the local account label without changing its panel origin or credential identity. |
| `remote account key [id] [--role <client\|application>]` | Replace a key through masked input, infer standard key prefixes, verify it, and roll back on failure. |
| `remote account remove <id> --confirm <id>` | Remove an account and its stored credentials with an exact-ID confirmation. |
| `remote verify [--profile <id>]` | Verify credentials, whole-panel visibility, node access, creation capability, and configuration warnings. |

```bash
./start.sh remote connect --url https://panel.example.com --id demo
./start.sh remote verify
```

## Fleet and console

Remote cards and `remote list` show configured advertised allocations, bind allocations, and resolved DNS A/AAAA addresses. These remain separate because the panel cannot describe upstream NAT port mappings.

Actions follow each server's permissions and state. Suspended, installing, maintenance, unavailable, and other non-runnable servers stay visible with mutations disabled. The workspace's Bulk actions menu (`b` without checked rows) provides all/selected/running/stopped presets, per-server toggles, progress, and an outcome for every target. Dashboard checkboxes restrict bulk operations to the checked IDs. Batches default to four workers; starts stay headless and each restart stops its target before starting it. Kill, reinstall, delete, and mirror push use default-no typed confirmations in the wizard.

The Remote console retains a resource header, colors severity and safe Minecraft `§` formatting, trims prefixes/routine noise, and renders history in batches. `Tab` completes common/session commands, selectors, and names learned from recent/live join, leave, login, and `list` output; repeat it to cycle matches. `Esc`, `Ctrl-C`, or `:exit` returns without stopping the server.

| Command | Purpose |
|---|---|
| `remote list [--profile <id>]` | List every remote server with all advertised/DNS-resolved and bind IP:port allocations. |
| `remote nodes [--profile <id>]` | Show each node's FQDN, configured/allocated memory and disk, daemon port, and SFTP port. |
| `remote stats <server> [--profile <id>]` | Show current state, CPU, memory, disk, network, and uptime for one server. |
| `remote stats --all [--profile <id>]` | Show aggregate and per-server resource statistics for the panel fleet. |
| `remote history <server> [--since <15m\|6h\|7d>] [--limit <n>] [--json] [--profile <id>]` | Read persisted monitor samples, including derived RX/TX rates, without polling the panel. History keeps raw samples for 24 hours and five-minute rollups for seven days. |
| `remote permissions <server> [--profile <id>]` | Show ownership and the exact Client permissions used to gate server actions. |
| `remote activity <server> [--page <n>] [--per-page <1-100>] [--profile <id>]` | Read the panel's historical server activity/audit feed. |
| `remote start\|stop\|restart\|kill <server> [--profile <id>]` | Send a Pterodactyl power signal. Stop allows five seconds for shutdown, then sends kill if the server remains online. |
| `remote bulk <start\|stop\|restart\|kill\|reinstall\|delete> [servers...] [--all] [--state running\|offline] [--concurrency <1-8>] [--confirm <token>] [--force] [--profile <id>]` | Safely operate on an explicit remote fleet. Every selector is resolved before mutation; state filters use live resource state (`running` includes transitional non-offline states), work is bounded, and every server receives an outcome. Reinstall/delete print the exact token required by `--confirm`. |
| `remote console <server> [--profile <id>]` | Attach to a severity-colored, prefix/noise-trimmed live console with server resource chrome, safe Minecraft `§` formatting, and `Tab` completion for common/session commands, selectors, and observed online player names. Repeated `Tab` cycles ambiguous matches; Esc, Ctrl-C, or `:exit` restores the caller without stopping the server. |
| `remote command <server> <command> [--profile <id>]` | Send one console command. |

```bash
./start.sh remote list
./start.sh remote stats --all
./start.sh remote nodes
./start.sh remote console lobby
./start.sh remote bulk start --all --state offline
./start.sh remote bulk restart lobby survival --concurrency 2
```

Remote polling, Drive checks, and transfer-file hashes use rolling pools of up to four workers. Commit and rollback operations retain their required order, and started operations finish before failure cleanup.

## Creation and settings

Create from an existing server configuration or directly from a Panel egg, including on an empty panel. Egg creation defaults to the connected owner and sole viable node, submits every egg-variable default, and requires values for required blank variables. The catalog lists image labels and values, environment requirements, templates, and available allocations. Create-many validates the whole plan and reserves distinct allocations before dispatch; it defaults to four concurrent requests.

| Command | Purpose |
|---|---|
| `remote catalog [--profile <id>]` | List the Panel owners, nodes/free allocations, nests/eggs, allowed Docker image label/value pairs, egg environment keys/default requirements, and existing templates available for Remote creation. |
| `remote settings <server> [--profile <id>]` | Show limits, feature limits, startup command, and accessible startup variables. |
| `remote create <name> (--template <server>\|--egg <id\|name>) [--owner <id\|username\|email>] [--node <id\|name>] [--image <label\|value>] [--env <KEY=VALUE,...>] [--memory <MiB>] [--swap <MiB>] [--disk <MiB>] [--io <10-1000>] [--cpu <percent>] [--databases <count>] [--allocations <count>] [--backups <count>] [--start] [--profile <id>]` | Create from an existing Application-visible configuration or directly from a Panel egg. Egg creation works on an empty panel, defaults to the connected owner and sole viable node, sends every egg-variable default, and requires explicit values for required blank variables. `--node`, `--image`, `--env`, `--swap`, `--io`, and feature-limit flags apply only to egg creation. |
| `remote create-many (--template <server>\|--egg <id\|name>) (--names <a,b,c>\|--prefix <name> --count <1-100>) [--owner <id\|username\|email>] [--node <id\|name>] [--image <label\|value>] [--env <KEY=VALUE,...>] [--memory <MiB>] [--swap <MiB>] [--disk <MiB>] [--io <10-1000>] [--cpu <percent>] [--databases <count>] [--allocations <count>] [--backups <count>] [--start] [--concurrency <1-8>] [--profile <id>]` | Create several servers from one template or egg. Multiplexor validates the full plan and reserves distinct allocations before the first create request, runs up to four creates in parallel by default, and reports every result. The same egg-only flag restriction as `remote create` applies. |
| `remote rename <server> <name> [--description <text>] [--profile <id>]` | Rename or describe a server using Client permission first and Application fallback when enrolled. |
| `remote reinstall <server> --confirm <server> [--profile <id>]` | Request a reinstall through the least-privileged permitted route. The exact server value is required as confirmation. |
| `remote delete <server> --confirm <server> [--force] [--profile <id>]` | Permanently delete a server through the Application route with exact confirmation. |
| `remote variable <server> --key <variable> --value <value> [--profile <id>]` | Change an editable startup variable. |
| `remote image <server> --image <docker-image> [--profile <id>]` | Select an allowed Docker image when `startup.docker-image` is granted. |
| `remote limits <server> [--memory <MiB>] [--swap <MiB>] [--disk <MiB>] [--io <10-1000>] [--cpu <percent>] [--threads <set>\|--clear-threads] [--databases <count>] [--allocations <count>] [--backups <count>] [--allocation <id>] [--add-allocation <id,...>] [--remove-allocation <id,...>] [--oom-disabled\|--oom-enabled] [--profile <id>]` | Modify resource, feature, and allocation limits through the Application API while preserving unspecified values. |
| `remote startup <server> --command <command> [--profile <id>]` | Modify the administrative startup command while preserving the current egg, image, variables, and install-script policy. |

```bash
./start.sh remote catalog
./start.sh remote create survival --egg paper --memory 4096 --disk 0
./start.sh remote create-many --template lobby --prefix event- --count 3 --concurrency 4
```

## Transfers

**Pull to Local** creates a stopped, isolated instance from a stopped Remote server and links the pair. Isolation excludes unrelated shared drop-ins, Iris packs, and operator data. `.multiplexor-remote.json` stores the exact account, immutable server identity, display name, Local consumer, and transfer timestamps; later pushes use that identity instead of matching names.

**Push to Remote** previews a file diff for the linked server, an existing `--to` target, or a new `--new` target. Local must be stopped. Review the preview, then repeat with its exact confirmation token.

| Command | Purpose |
|---|---|
| `remote pull <server> --as <local> [--profile <id>] [--consumer <profile>]` | Copy the transferable files of a stopped Remote server into a new, stopped Local instance and record its exact remote account/server link. Pull never changes the Remote, refuses a running Remote, and refuses to overwrite an existing Local instance. |
| `remote push <local> [--to <server>] [--mirror] [--link] [--start\|--no-restart] [--confirm <token>] [--profile <id>] [--consumer <profile>]` | Diff a stopped Local instance against its linked Remote, or the existing server selected by `--to`, then push changed/new files. Without `--confirm`, prints the exact token and exits without mutation. The default preserves remote-only files; `--mirror` deletes them and requires the stronger destructive token. A previously running target is stopped for the transfer and restarted after success unless `--no-restart`; `--start` starts a previously stopped target. `--link` records the selected target as the Local instance's new link. After committing files, an unverified explicit `--link` or `--start` outcome returns nonzero so the same idempotent workflow can repair it. |
| `remote push <local> --new <name> (--template <server>\|--egg <id\|name>) [creation flags] [--link] [--start] [--confirm <token>] [--profile <id>] [--consumer <profile>]` | Resolve and show the exact source UUID/egg ID, owner, node, image, startup, environment variable names (values are redacted), resources, features, final power state, and link action before creating anything. The composite confirmation token still binds every exact environment value, the complete creation plan, and the current Local snapshot. The durable intent identity does not change when Local files later change, so a freshly previewed and confirmed retry resumes the same created server instead of allocating another one. The server is created stopped, receives and validates Local files before its first start, then starts only with `--start`. An unlinked Local records the new pairing automatically; an already-linked Local preserves its existing target unless `--link` explicitly replaces it. A failed transfer leaves the new server stopped and prints the exact existing-target retry command. |

### Update and mirror

Pull records a baseline for the exact Local instance and Remote UUID. Update uploads only changed/new files listed in the preview, preserves Remote-only changes and deletions, and preserves Remote files deleted locally. Different edits to the same file on both sides block the push and identify the conflict; reconcile it before retrying. Without a baseline, the preview compares current Local and Remote files. Verified transfers advance the baseline under `.multiplexor/pterodactyl-transfer-baselines/`, including across restarts.

Mirror makes the transferable Remote tree match Local, deleting Remote-only files after the stronger destructive confirmation. Transfers include worlds, server jars, plugins/mods, and normal configuration; they exclude `logs/`, `crash-reports/`, `session.lock`, and Multiplexor metadata. The displayed byte count measures uploads; backups and verification still read Remote files.

### Credentials, confirmation, and recovery

Transfers reuse Drive account credentials but connect directly over SFTP to the selected server. They require neither a browsing mount nor unrelated accounts. Interactive use can enroll a missing account and approve the target fingerprint. Headless use prints the exact `remote drive install --profile ... --no-open` and target-scoped `remote drive trust <server> --profile ...` commands needed to complete setup.

Confirmation binds the exact Local snapshot and planned adds, overwrites, and deletes. Create & Push also binds every resolved creation field, desired final state, and link decision. Environment values are redacted in the preview but remain bound by the token. Changed inputs require a fresh preview.

After stopping the target, Multiplexor rereads Remote files. Every non-empty push backs up the complete Remote tree under `.multiplexor/pterodactyl-transfers/backups/`, writes a recovery manifest, and rolls back automatically if upload fails. The CLI prints backup, intent, and recovery paths.

Create & Push records a durable intent under `.multiplexor/pterodactyl-transfers/intents/` and uses its unique ID as the panel `external_id`. This identity binds the Local consumer/canonical instance path, profile, proposed name, immutable creation configuration, and start/link requirements; Local file fingerprints can change. A newly previewed and confirmed retry therefore resumes the same committed server after an ambiguous create response, Local edits, or failed transfer. Ambiguous, duplicate, or mismatched identities stop without another panel mutation.

If only the requested link or final running state failed and Local is unchanged, an exact retry repairs those outcomes without uploading again. Changed Local files resume normal comparison and transfer against the same server. A failed transfer leaves a new server stopped and prints the existing-target retry command.

### Pull, test, and push

Stop the Remote server in the dashboard, then:

```bash
./start.sh remote pull survival --as survival-local --consumer plugin
./start.sh runtime start survival-local
```

After making and testing changes, stop Local, preview, and confirm:

```bash
./start.sh runtime stop survival-local --graceful
./start.sh remote push survival-local --consumer plugin
./start.sh remote push survival-local --consumer plugin --confirm <token>
```

To create a stopped target, upload before its first boot, and then start it:

```bash
./start.sh remote push survival-local --new survival-staging --egg paper --start --consumer plugin
```

Repeat with the printed token. An unlinked Local instance records the new pairing automatically; an already-linked instance keeps its link unless `--link` replaces it.

## Multiplexor Drive

Multiplexor Drive mounts accessible servers into `~/Multiplexor Drive`, grouped by account. It requires `rclone` and OpenSSH; macOS uses rclone's loopback NFS mount. The Remote server menu's **Open folder** starts or repairs the drive and opens that exact server folder in Finder. Edits, moves, and deletions in mounted folders immediately change the remote server.

A dedicated local Ed25519 identity is generated per account; only its public key is registered through the Client API. Wings host fingerprints require explicit trust. API keys are never SFTP passwords, and Drive settings/runtime state contain no API keys, private-key contents, or cleartext Panel passwords. A Panel password can be enrolled through secure input as an SSH-key fallback.

| Command | Purpose |
|---|---|
| `remote drive install [--profile <id>\|--all-profiles] [--username <name>] [--mount-root <path>] [--known-hosts <path>] [--no-key] [--no-open]` | Set up the local Multiplexor Drive, defaulting to every saved account and `~/Multiplexor Drive`; verify SSH host fingerprints, mount every accessible server, and open the drive in Finder. By default it generates a per-profile Ed25519 key and registers only its public half through the Client API. |
| `remote drive add [--profile <id>] [--username <name>] [--no-key]` | Add or refresh one remote account in Multiplexor Drive. Stop the drive first when changing its accounts. |
| `remote drive remove [profile] --confirm <profile>` | Remove one account and its saved SFTP password from Multiplexor Drive with exact confirmation. |
| `remote drive password [profile]` | Enroll the Panel password through secure interactive input as an SSH-key fallback. |
| `remote drive trust [server] [--profile <id>]` | Scan Wings SFTP host keys, display every SHA256 fingerprint, and persist them only after an explicit default-no confirmation. Supplying a server scans only that selected target; omitting it retains the all-configured-Drive workflow. |
| `remote drive doctor` | Check rclone, the local mount provider, SFTP authentication, SSH host trust, and safe Drive-folder ownership. |
| `remote drive start\|status\|stop` | Mount all configured servers locally, inspect their current paths and health, or stop the mounts safely. No SMB server or administrator authorization is involved. |
| `remote drive open [server] [--profile <id>]` | Open `~/Multiplexor Drive` in Finder, or open the exact local folder for a server. The drive starts or repairs itself first when necessary. |
| `remote files <...>` / `remote smb <...>` | Compatibility aliases for `remote drive`; new workflows should use the Drive name. |

Mounts last until `remote drive stop` or a reboot. Run `remote drive start` afterward to restore configured mounts; `remote drive open` also starts or repairs them on demand. Stop the drive before changing its accounts.

Before remounting, Multiplexor preserves Finder `.DS_Store` files found in detached mount folders or VFS write caches under `.multiplexor-local-recovery` or `finder-metadata-recovery`. Other local files, directories, and symlinks remain untouched and block the mount with their exact path.

```bash
./start.sh remote drive install
./start.sh remote drive status
./start.sh remote drive open survival
```

See [Remote Profiling](/servermultiplexor/06-remote-profiling) for JProfiler startup captures, runtime attachment, and live SSH sessions.

[ServerMultiplexor](/servermultiplexor)
