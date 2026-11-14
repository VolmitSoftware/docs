---
title: "Self-Hosted Editor Relay"
description: "Run your own relay between Gloss servers and the web editor"
published: true
date: 2026-11-13T00:00:00.000Z
tags: "gloss, editor, relay"
editor: markdown
dateCreated: 2026-11-13T00:00:00.000Z
---

The relay connects the Gloss web editor to servers that accept no inbound connections. A server connects out to the relay over a WebSocket, a browser connects to it and asks for one server by its fingerprint, and the relay forwards the editor's requests to that server and the answers back. Gloss uses the hosted relay at `wss://gloss-relay-437930007071.us-central1.run.app` unless you change `relayUrl` under `[editor]` in `gloss.toml`. A `gloss.toml` that already has a `relayUrl` line keeps that address; to move to the hosted relay, delete the line (the default applies when the file reloads, and Gloss writes the line back at the next start) or set it to the address above, then pair browsers again. How the editor picks between the relay and the server's own listener is on [Web Editor & Sync](/gloss/18-web-editor#connecting-the-server).

The relay keeps everything in memory. It stores no documents, tokens or messages, and it logs no payloads. A restart drops every connection, and servers and browsers reconnect by themselves.

## What the relay can see

TLS protects traffic on the wire, but the relay reads every message it forwards, including the editor's tokens and the documents being edited. Whoever runs a relay can read the traffic that passes through it. Run your own, or turn the relay off with `relayEnabled = false` and use the server's direct listener.

The relay cannot pose as your server. Before the editor sends a token or pairing secret over the relay, the server signs a random challenge from the browser with its key, and the editor checks that key against the fingerprint from the pairing link. A relay that forwards to the real server can still read the traffic.

The relay does not check tokens. The server checks each forwarded request's token, scopes and folders the same way as a direct one. The relay checks the browser's origin against `ALLOWED_APP_ORIGINS`; the plugin's `allowedOrigins` applies to the direct listener only.

## Run the relay

Build the image from `gloss-web/sync-relay/` in the Gloss source of the release your servers run:

```sh
docker build -t gloss-relay .
docker run --rm -p 8080:8080 -e ALLOWED_APP_ORIGINS=https://gloss.volmitsoftware.com gloss-relay
```

The image runs a compiled relay binary as a non-root user and needs no volume. Without Docker, run `dart run bin/relay.dart` in that folder with the Dart SDK.

- Run exactly one instance. Routing is in memory, so a second instance would not see the first one's servers.
- Serve it on its own hostname behind TLS, so servers reach it at a `wss://` address. The plugin accepts `ws://` only on loopback.
- Keep CPU allocated between messages (on Cloud Run, `--no-cpu-throttling`) so pings and timeouts keep running.
- A host that caps request time ends WebSocket connections at that cap. Set it as high as the host allows; servers and browsers reconnect.
- Set `TRUSTED_PROXY_HOPS` to the number of proxies in front of the relay that append to `X-Forwarded-For`. The default of 1 fits one load balancer. A relay that browsers reach directly needs `TRUSTED_PROXY_HOPS=0`; otherwise any client can choose its own address.
- `GET /healthz` reports connection counts. On Cloud Run it never reaches the relay: Google's front end answers paths ending in `z` with a 404. Check a Cloud Run relay with a WebSocket handshake to `/app` instead, which upgrades for an origin in `ALLOWED_APP_ORIGINS` and answers 403 for any other.

Then point each server at it in `gloss.toml`:

```toml
[editor]
relayUrl = "wss://relay.example.net"
```

The server connects at the next `/gloss editor pair`, or at start when it already has a paired browser. A browser keeps the relay address from the link it paired with, so pair browsers again after you change `relayUrl`.

### Your own editor

If you serve the editor yourself, add its origin, such as `https://gloss.example.net`, to `ALLOWED_APP_ORIGINS` on the relay and to `allowedOrigins` on each server, and set `editorUrl` under `[editor]` so pairing links open it. Deploy the editor from the same Gloss release as the plugin and the relay.

## Limits

A relay message holds at most 1 MiB by default. Keep the relay's `MAX_FRAME_BYTES` equal to each server's `relayFrameBytes`. The server cuts document lists and batch reads to fit. A request that does not fit, such as a large image upload, is refused, and the editor says "This is too large to send over the relay." with the next step: connect directly, or publish fewer documents at once.

Each address may hold `MAX_SERVER_CONNECTIONS_PER_ADDRESS` server connections and `MAX_APP_CONNECTIONS_PER_ADDRESS` browser connections; past that the relay refuses new ones. An IPv6 address counts by its /64.

A browser must subscribe within `SUBSCRIPTION_TIMEOUT_SECONDS` and hold a live update stream the server accepted within `SIGN_IN_TIMEOUT_SECONDS` of subscribing, which needs a valid token. Pairing fits in that time.

## Settings

The relay reads environment variables.

| Variable | Default | Meaning |
|---|---|---|
| `PORT` | `8080` | Listening port |
| `BIND_ADDRESS` | `0.0.0.0` | Listening address |
| `TRUSTED_PROXY_HOPS` | `1` | Proxies in front of the relay that append to `X-Forwarded-For`; `0` when browsers connect directly |
| `ALLOWED_APP_ORIGINS` | `https://gloss.volmitsoftware.com,https://gloss-editor.web.app,https://gloss-editor.firebaseapp.com` | Comma-separated exact browser origins (`scheme://host[:port]`, no wildcards) |
| `MAX_FRAME_BYTES` | `1048576` | Largest message in bytes |
| `MAX_APP_MESSAGES_PER_SECOND` | `120` | Messages per second from one browser |
| `MAX_AGENT_MESSAGES_PER_SECOND` | `2000` | Messages per second from one server |
| `MAX_PENDING_PER_APP` | `64` | Unanswered requests per browser |
| `MAX_STREAMS_PER_APP` | `4` | Live update streams per browser |
| `MAX_PENDING_GLOBAL` | `4096` | Unanswered requests in total |
| `MAX_APPS_PER_SERVER` | `64` | Browsers connected to one server |
| `MAX_APPS_PER_ADDRESS_PER_SERVER` | `8` | Browsers from one address connected to one server |
| `MAX_SERVER_CONNECTIONS_PER_ADDRESS` | `32` | Server connections from one address |
| `MAX_APP_CONNECTIONS_PER_ADDRESS` | `64` | Browser connections from one address |
| `MAX_SERVERS` | `1000` | Registered servers |
| `MAX_APPS` | `4096` | Browser connections |
| `HANDSHAKE_TIMEOUT_SECONDS` | `10` | Time for a server to register |
| `SUBSCRIPTION_TIMEOUT_SECONDS` | `10` | Time for a browser to ask for a server |
| `SIGN_IN_TIMEOUT_SECONDS` | `30` | Time after that for a browser to open an accepted live update stream |
| `REQUEST_TIMEOUT_SECONDS` | `10` | Time for a server to answer |
| `PING_INTERVAL_SECONDS` | `30` | WebSocket ping interval; a peer that misses a pong is closed |
