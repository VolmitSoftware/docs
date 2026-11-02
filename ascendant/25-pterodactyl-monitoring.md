---
title: Pterodactyl monitoring
description: Administration > Server monitoring reads server state and resource usage from Pterodactyl 2.0
published: true
date: 2026-11-01T00:00:00.000Z
tags: ascendant, discord, pterodactyl, monitoring
editor: markdown
dateCreated: 2026-11-01T00:00:00.000Z
---

**Administration > Server monitoring** reads server state and resource usage from Pterodactyl 2.0. It discovers servers accessible to the configured account, polls the selected servers, and records alerts locally. It never sends power actions, executes commands, changes server files, or publishes Discord messages.

## Credentials

Use a dedicated non-admin Pterodactyl account. Add it as a subuser to each server to monitor. In that account, open **Account > API Credentials** (`/account/api`) and create a Client API key. Application API keys are not supported.

Client keys inherit the account's server permissions; they have no separate read-only token scope. The resource endpoints require server membership. If the subuser form requires a permission, use **Websocket > Connect** only. Do not grant console commands, power controls, files or administrative permissions. The reader does not use the websocket endpoint.

Optional Allowed IPs must match the source address seen by the panel, including the local computer's egress while reviewing and the VPS's address when later deployed.

Set the following in the main local `bot/.env`. The existing VPS installation reads `/etc/volmbot/volmbot.env`:

```dotenv
PTERO_PANEL_URL=https://your-pterodactyl-panel.example.com
PTERO_CLIENT_API_KEY=
PTERO_MONITOR_FILE=./data/ptero.json
```

Use the HTTPS panel origin, without an API suffix, query, embedded credentials or fragment. The key stays server-side and is not returned to the browser, written into monitoring data, or recorded in the audit log. Requests reject redirects and have a timeout.

## Local review

After building, run from `bot/`:

```sh
npm run panel:review -- --review-ptero
```

The additional flag permits only this integration's Pterodactyl and configured VictoriaMetrics reads. Discord sending, publishing and deployment remain blocked. Start with a separate local data directory when reviewing a copy of production settings. Never run the bot's normal startup command merely to preview this feature.

Open Server monitoring, choose **Discover servers**, select servers, save settings and collect a reading. Polling starts disabled. Enable it when ready; it continues while the panel process is running, even if the browser is closed. Owners manage settings and manual collection; administrators can view saved readings.

## Resource overview

The overview totals the saved selection and groups servers by the node names returned by the Client API. Node counts describe nodes represented by those servers; a successful server resource check is not a host health check. Nodes without an accessible selected server are not included.

Current usage totals include only fresh, successful readings. Missing or stale readings are excluded and coverage is shown, so a partial total does not imply zero usage on the missing servers. Configured allocations sum the selected servers' quotas; unlimited or unavailable limits are identified separately. CPU uses 100% per logical core, so 1,800% of configured server quota equals 18 core-equivalents. Allocations can overlap or be oversubscribed and do not represent physical host capacity.

The Client API does not provide the nodes' physical RAM, CPU inventory, or host-wide utilization. These values are not inferred from container limits.

## Polling and alerts

- Polling defaults to 60 seconds and accepts 30–3600 seconds. A new interval takes effect after saving. Polls run serially; a slow collection does not create overlapping requests.
- Alerts cover offline state, CPU, memory, disk and repeated unreachable readings. The default requires three failing readings separated by the configured interval. Repeated manual clicks do not accelerate the failure count.
- CPU is displayed using Pterodactyl's scale: 100% is one logical core. CPU alert thresholds are percentages of the server's configured CPU quota. Memory and disk thresholds are percentages of their limits. A zero/unlimited quota has no percentage alert.
- Offline checks apply to selected servers expected to run. Disable offline alerts or deselect intentionally stopped servers. Suspension or maintenance closes applicable incidents without claiming recovery.
- An API failure is an unavailable reading, not evidence of an offline server. Previously collected values remain visible as stale. Recovery requires a successful observation.
- Alerts are stored locally, including resolved and closed incidents, with a limit of 500 entries. No Discord alert destination is configured. Game-server monitoring retains current samples locally, not a time series of every container reading. Host history is read separately from VictoriaMetrics.

Discovery uses paginated `GET /api/client`. Readings use `GET /api/client/servers/{uuid}/resources`; Wings may cache resources briefly. This reports game-server containers, not host-wide hardware utilization or Minecraft TPS/MSPT.

Monitoring state is included in backups. A restore disables polling and closes active incidents as unconfirmed; review the restored server selection before enabling it again.

## References

- [Pterodactyl v2 API](https://docs.pterodactyl.io/v2/api)
- [Create account API key](https://docs.pterodactyl.io/v2/api/client-api/clientCreateAccountAPIKey)
- [List client servers](https://docs.pterodactyl.io/v2/api/client-api/clientListClientServers)
- [Get server resources](https://docs.pterodactyl.io/v2/api/client-api/clientGetServerResources)

## Host metrics through VictoriaMetrics

Ascendant reads host CPU, RAM, uptime and filesystem capacity from the existing VictoriaMetrics database over Tailscale. Grafana Alloy continues collecting the metrics on each host; Ascendant requires no additional Node Exporter service, Prometheus server or public port. Grafana's existing dashboards, retention and alert rules are unchanged.

Set these in the main local `bot/.env`, then restart the local review process:

```dotenv
PTERO_VICTORIA_METRICS_URL=http://100.101.253.70:8428
PTERO_METRICS_HOSTS='[{"id":"buf-game-01","name":"Buffalo game node","instance":"buf-game-01"},{"id":"lax-game-01","name":"Los Angeles game node","instance":"lax-game-01"}]'
```

Each entry has a unique stable `id`, display `name`, and the exact `instance` label used by Alloy in VictoriaMetrics. Add other hosts to this list to include them in the overview. The URL and selection stay server-side. The previous `PTERO_NODE_EXPORTERS` setting and standalone installer are no longer used.

The reader permits only a literal Tailscale IPv4 address in `100.64.0.0/10` on HTTP port 8428, with no custom path, embedded credentials, query or fragment. It makes bounded GET requests to `/api/v1/query` and `/api/v1/query_range` using fixed metric queries and rejects redirects. It never calls write, delete, administration, alert-management or ingestion endpoints. Pterodactyl credentials are never sent to VictoriaMetrics. This integration uses the existing tailnet access rules, not a Grafana login.

### Local review

Use `npm run panel:review -- --review-ptero` after building. Discord sending, publishing and deployment remain blocked. In **Server monitoring**, choose **Check resources now**. Host metrics use the same polling interval and enable/disable control as game-server monitoring. Configured hosts are included even if no game servers are selected. Automatic polling starts disabled.

The preview computer must be on the tailnet and allowed to reach the VictoriaMetrics host on TCP 8428. Existing QualityNode administrator grants may already permit this. If access is missing, add a narrow grant from the monitoring computer to that host; retain the rest of the policy. No inbound port 9100 is needed on the game nodes. A future deployment uses the main `/etc/volmbot/volmbot.env` and requires equivalent access from the VPS; do not deploy merely to review locally.

### Reading the overview

- CPU count is logical CPUs/vCPUs visible to the operating system. CPU usage is a rate over five minutes of stored CPU counters, on a 0–100% scale. It does not require two Ascendant checks, but the upstream collector must have enough samples.
- RAM used is total RAM minus `MemAvailable`, including reclaimable cache in available memory. Virtual-machine totals describe the guest, not the hypervisor's physical hardware.
- Filesystems show used, total and available space individually. They are not summed because shared disks and multiple mounts can double-count capacity.
- Freshness comes from the source metrics, with a 180-second window to accommodate the 60-second Alloy collection interval. A successful query alone does not make old data current. Failed or stale hosts are excluded from current totals, and coverage is displayed.
- Host readings include the operating system and all workloads. Pterodactyl server allocations remain a separate summary.
- The overview retains the latest sample locally. History graphs read the existing time series from VictoriaMetrics; retention remains controlled by VictoriaMetrics.
- Existing local alert thresholds apply to game servers. Ascendant does not modify or duplicate Grafana's host alert rules and does not forward Grafana notifications to Discord.

### Host history

Select a configured host and a range of 1 hour, 6 hours, 24 hours, 7 days or 30 days in **Host history**. Only the selected host is queried. Reading history works while automatic resource polling is paused and does not change its schedule.

The charts show CPU utilization, RAM used and total capacity, and incoming/outgoing network rates. CPU and network use five-minute counter rates, including counter-reset handling. RAM used is total minus available memory. Network rates use B/s, KiB/s or MiB/s and exclude loopback and common container, bridge and Tailscale interface names to reduce duplicate traffic accounting; they describe the remaining host interfaces, not individual game servers or billed transfer totals.

Missing historical samples remain gaps. A longer range cannot show data from before collection started or outside the database retention period. Source-freshness checks apply at each historical point, so a successful query does not fill a collector outage with old readings. Longer ranges use coarser steps to keep charts bounded.

History is read on demand through the same infrastructure-read permission and local review guard. Requests accept only configured host IDs and the listed ranges, never an arbitrary query or remote URL. Results are cached briefly in memory; Ascendant does not copy the time-series database or modify upstream data. Discord sending, publishing and deployment remain blocked in review mode.

Source: [VictoriaMetrics query API](https://docs.victoriametrics.com/victoriametrics/url-examples/#apiv1query).
