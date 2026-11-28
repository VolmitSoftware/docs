---
title: "Book Menus"
description: "Serve the Adapt resource pack so vanilla clients get book menus"
published: true
date: 2026-11-27T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-26T00:00:00.000Z
---

On Paper, Purpur, Folia, and Spigot, Adapt builds a resource pack and offers it to players on the vanilla Java client. With the pack loaded, the Skills, skill, adaptation, and Mutate menus open as book pages in each skill's theme, with animated page art. Other Adapt menus open on a plain ledger page. A player who declines the pack, or whose client cannot load it, keeps the chest menus, unless `pack.required` is on.

Settings are the `pack` keys in `adapt.toml`. The keys that build, host and schedule the pack apply on restart; `reofferAfterDecline`, the nudge, menu item, mod, prompt, `required` and `uiSounds` keys apply when the file is saved. What players see and click is in [Book menus for players](/adapt/55-book-menus-players).

![Skills page of the book menus](/adapt-assets/book-menus/skills.png =520x)

## Supported servers

| Server | Book menus | Typed input, such as Search |
|---|---|---|
| Paper, Purpur, or Folia, Minecraft 26.1.2 to 26.3 | Through the pack | A dialog over the page |
| Spigot, Minecraft 26.1.2 to 26.3 | Through the pack | Typed in chat. `cancel` stops |
| Fabric, Forge, or NeoForge | Through the Adapt client mod only | Handled by the client mod |

Fabric, Forge, and NeoForge servers have no pack, no pack prompt, no `/adapt pack` command, and no pack folder, and nothing on this page applies to them. Players there install the Adapt client mod, which has the book pages and all of their art built in. A player without the client mod on such a server gets the chest menus and the action bar.

The plugin builds one pack for 26.1.2 through 26.3 clients.

Full pages draw over the player's inventory rows while a page is open. If the server build cannot open those windows, Adapt logs `Pack canvas windows are not available on this server build; pack menus use plain chests` once. Pages then use the chest rows only, and the player's inventory shows below the page.

## Who gets book menus

| Player | Menus |
|---|---|
| Vanilla Java client that loaded the pack | Book pages |
| Vanilla Java client that declined the pack, or whose download failed | Chest menus |
| Adapt client mod | The mod's own book. The pack is never offered |
| Bedrock, through Geyser or Floodgate | Chest menus. The pack is never offered |

A player who runs the Adapt client mod is recognised when the mod answers within `pack.handshakeWindowMillis` of joining. Bedrock players are recognised through the Floodgate or Geyser API when either plugin is loaded. Players cannot switch book menus off for themselves: a player with the pack loaded gets book pages.

## How the pack reaches players

1. On start, Adapt builds the pack off the main thread and stores it in `plugins/Adapt/pack/cache/`. A later start with the same content loads the stored pack. When a [pack zip](#pack-zip) that fits is in `plugins/Adapt/pack/`, Adapt uses it instead of building.
2. The log reports the result: `Baked the Adapt pack in <seconds> s: <size> MB, sha1 <hash>.`, or `Loaded the cached Adapt pack ...` for a stored pack.
3. Adapt picks where players download the pack, as described in [Hosting the pack](#hosting-the-pack). By default that is the published copy on GitHub.
4. Adapt offers the pack as `pack.offer` sets: on every join after the client mod window, on the player's first Adapt menu after each join, or only through `/adapt pack offer`.
5. The client shows the vanilla prompt. With `pack.strongPrompt` on, it describes the book menus and, with `pack.mentionMod`, names the Adapt client mod; otherwise it shows the `pack.promptKey` message.
6. When the client reports the pack loaded, Adapt menus open as book pages.

A player who declines keeps chest menus and gets a chat line with the steps that let their client load server packs again. Adapt offers the pack again on their next join. With `pack.reofferAfterDecline = false`, Adapt saves the declined pack's hash with the player's data and does not offer that pack again, after a rejoin or a restart, until its content changes or the player runs `/adapt pack offer`.

The client also remembers the decline. For the rest of that connection it declines every server pack without a prompt. `/adapt pack offer` sends the pack again and replies `Your client turns down server packs here. Edit this server in your server list, set Server Resource Packs to Enabled, then rejoin.`, but nothing appears. A player who joined from the server list also has that entry's Server Resource Packs setting switched to Disabled, which declines every later offer on that server without a prompt. To get the pack after declining, the player sets that option back to Prompt or Enabled and reconnects.

A failed download leaves the player on chest menus and never disconnects them. Adapt does not retry it on that connection; `/adapt pack offer` sends the pack again. The one exception is the first failed download from the [published copy](#published-copy), after which Adapt offers its own hosted pack to every player it had offered the pack to.

When the pack content changes while the server runs, for example because an addon was installed or removed, Adapt builds the pack again. Every player who was offered the old pack gets the new one, including players who declined the old one.

### Nudges

A player who could load the pack and has not is told about it in chat once after joining (`pack.joinNudge`), and again when they open an Adapt menu, at most every two minutes (`pack.menuNudge`). The line has a `[Load the book pack]` click that offers the pack again, or, after a decline, the steps for the server list entry. With `pack.mentionMod`, a second line names the Adapt client mod and links `pack.modUrl`. With `pack.menuItem`, the chest menus show a Get the book menus item in the right corner of the footer; clicking it offers the pack again, or prints the steps when the client refuses server packs. Players with the client mod, Bedrock players and players who loaded the pack see none of this.

### Required pack

With `pack.required = true`, the pack goes out as required. It is offered at join whatever `pack.offer` says, the client prompts even when server packs are disabled for this server, and declining disconnects the player with `This server needs the Adapt pack for its menus. Rejoin and press Proceed on the pack prompt.` Players with `adapt.pack.optional`, which defaults to false, get the pack as optional. Players with the client mod are never sent the pack, and a failed download disconnects no one. When nothing hosts the pack, or `pack.merged` is on, no player is required to load it, and Adapt logs `pack.required is on, but Adapt offers no pack of its own here, so no player is required to load it.`

### Build failures

If the build fails, Adapt logs `Could not build the Adapt resource pack; players keep chest menus` and keeps offering the pack it had before. On the first start, that means chest menus for everyone until the next successful build.

## Pack zip

Each Adapt release comes with `Adapt Pack v<version>.zip`. You do not need it: the plugin builds the same pack itself at startup. To skip that build, use the zip:

1. Download the zip from the same release as your Adapt jar.
2. Put the zip in `plugins/Adapt/pack/`. Create the folder if it is missing.
3. Restart the server.

When Adapt uses the zip, it logs `Using the Adapt pack zip <file>, nothing baked: <size> MB, sha1 <hash>.` Players then get the pack as they would a pack Adapt built: the same prompt, the same download address, and the same book menus. The zip only skips the local build; it does not change where players download from.

The zip must come from the same Adapt release as the plugin jar. A zip that does not match gets one warning with the reason, and Adapt builds its own pack, so book menus still work:

```none
Ignoring the Adapt pack zip plugins/Adapt/pack/Adapt Pack v2.9.0.zip: it was made for Adapt 2.9.0 and this server runs Adapt 3.0.0; Adapt makes its own pack instead.
```

After an update, replace the zip with the one from the new release.

The zip holds only Adapt's own skills and art. On a server with addon skills or addon art, Adapt ignores the zip and builds the whole pack, addon pages included. The same happens when the built-in skills differ from a default install, for example when a skill is turned off.

Adapt reads the folder at start and whenever the pack content changes while the server runs. When the folder holds more than one `.zip`, Adapt tries them in file name order and uses the first that fits.

## Commands

| Command | Permission | Purpose |
|---|---|---|
| `/adapt pack offer` | `adapt.pack` | Send the pack to yourself again, even after declining it |

`adapt.pack` defaults to true. `/adapt pack` does not need `adapt.main`. `adapt.pack.optional`, false by default, keeps the pack optional for its holders while `pack.required` is on. Book pages need a client that reported Adapt's pack loaded, or any server pack in [merged mode](#merged-packs), so a pack the player installed by hand counts only with `pack.merged = true`.

`/adapt pack offer` replies with one of these:

| Reply | Meaning |
|---|---|
| Sent the Adapt pack. | The prompt is on its way |
| No Adapt pack is available. | No pack is built yet |
| The server could not host the Adapt pack. | Players cannot get the published copy, and nothing else hosts the pack: `pack.serve` is off with no `pack.externalUrl`, or the listener could not open |
| This server does not offer the Adapt pack. | `pack.enabled` is off or `pack.merged` is on |
| Your Adapt client already shows book menus. | The player runs the Adapt client mod |
| Bedrock clients cannot load the Adapt pack. | The player is on Bedrock |
| Your client turns down server packs here. Edit this server in your server list, set Server Resource Packs to Enabled, then rejoin. | The pack was sent, but the client declined a pack earlier on this connection and declines this one without a prompt |

## Configuration

| Key | Default | What it does |
|---|---|---|
| `pack.enabled` | `true` | Builds and offers the pack. `false` keeps everyone on chest menus |
| `pack.offer` | `"join"` | `join` offers on every join after the client mod window, `first-open` on the player's first Adapt menu after each join, `off` only through `/adapt pack offer`. Another value logs a warning and uses `join` |
| `pack.reofferAfterDecline` | `true` | Offers the pack again on later joins to a player who declined it. `false` waits until the pack changes or the player runs `/adapt pack offer` |
| `pack.joinNudge` | `true` | Tells a player without the pack about it in chat once after joining, and gives the steps after a decline |
| `pack.menuNudge` | `true` | Repeats that line when a player without the pack opens an Adapt menu, at most every two minutes |
| `pack.menuItem` | `true` | Shows the Get the book menus item in the chest menus of players without the pack |
| `pack.mentionMod` | `true` | Names the Adapt client mod in the prompt, the chat lines, the menu item and the required-pack message |
| `pack.modUrl` | `"https://github.com/VolmitSoftware/Adapt/releases"` | Download link for the client mod in the chat lines. Blank names the mod without a link |
| `pack.strongPrompt` | `true` | Shows the full prompt that describes the book menus. `false` shows only the `pack.promptKey` text |
| `pack.required` | `false` | Sends the pack as required; declining it disconnects the player. See [Required pack](#required-pack) |
| `pack.uiSounds` | `true` | Plays quiet page and click sounds in book menus. `effects.soundsEnabled` and the player's effects preference also mute them |
| `pack.handshakeWindowMillis` | `3000` | Milliseconds after joining that Adapt waits for the Adapt client mod before offering. Clamped to 0 to 60000 |
| `pack.serve` | `true` | Serves the pack from Adapt's own HTTP listener when players cannot use the published copy. Ignored while `pack.externalUrl` is set |
| `pack.bind` | `"0.0.0.0"` | Address the listener binds. `0.0.0.0` listens on every interface |
| `pack.port` | `8164` | TCP port of the listener. `0` picks a free port at each start |
| `pack.publicUrl` | `""` | Base address players download from, such as `http://play.example.com:8164`. Blank uses the bind address, or this machine's address when binding `0.0.0.0` |
| `pack.externalUrl` | `""` | Address of a pack you host yourself. `{sha1}` is replaced with the pack hash. While set, players always download from it and the listener stays closed |
| `pack.releaseUrl` | `"https://github.com/VolmitSoftware/Adapt/releases/download/ResourcePack/Adapt.Pack.v{version}.zip"` | Address of the published pack. `{version}` is replaced with the Adapt version. Blank always hosts the pack on this server |
| `pack.promptKey` | `"adapt.pack.prompt"` | Message key of the prompt text while `pack.strongPrompt` is off. An unknown key uses `adapt.pack.prompt` |
| `pack.export` | `true` | Writes the pack to `pack/export/` when its hash differs from the export already there |
| `pack.merged` | `false` | Players get Adapt's files inside another pack. Adapt still builds and exports the pack, but neither serves nor offers it. See [Merged packs](#merged-packs) |
| `pack.bakeThreads` | `0` | Threads that build the pack. `0` uses half the processor cores, at most four. Clamped to 0 to 16. More threads build faster and use more memory |

Paths are inside `plugins/Adapt/`.

To change the prompt text, edit the `adapt.pack.prompt_strong` message, or `adapt.pack.prompt` with `pack.strongPrompt = false`, in your language file. See [Localization](/adapt/07-localization).

## Hosting the pack

Players download the pack over HTTP, separately from the Minecraft connection. Adapt picks the address in this order:

1. `pack.externalUrl`, when set. See [Your own host](#your-own-host).
2. The published copy at `pack.releaseUrl`, when this server's pack is byte for byte the published one.
3. The built-in listener, while `pack.serve = true`.

### Published copy

This is the default. Every Adapt release publishes its stock pack at:

```none
https://github.com/VolmitSoftware/Adapt/releases/download/ResourcePack/Adapt.Pack.v<version>.zip
```

A server whose pack is the stock one sends players there, so it opens no port and needs no setup. Adapt still builds its own pack, or uses a [pack zip](#pack-zip), and offers the published address only when the two are identical. The client checks the SHA-1, so a wrong or outdated file is never applied. The log shows:

```none
Players download the Adapt pack from https://github.com/VolmitSoftware/Adapt/releases/download/ResourcePack/Adapt.Pack.v<version>.zip.
```

The pack differs from the published one on a server with addon skills or addon art, and on a server where a built-in skill is turned off. Such a server hosts its own pack on the built-in listener.

When a player's download from the published address fails before any player has loaded the pack from there, Adapt logs one line and hosts the pack itself until the next restart:

```none
A player could not download the Adapt pack from <address>; this server hosts it from now on.
```

With `pack.serve = false`, the line ends `pack.serve is false, so the pack is not offered.` instead. Once a player has loaded the pack from the published address, later failed downloads count as that player's own and change nothing.

To host the published copy somewhere else, set `pack.releaseUrl` to that address; it must serve the same file. Set `pack.releaseUrl = ""` to always host the pack on this server.

### Built-in listener

Adapt opens the listener the first time it needs it and logs `Serving the Adapt pack on <bind>:<port>.` A server that uses the published copy never opens it, unless a download from there fails.

1. Open `pack.port`, TCP `8164` by default, for inbound connections in your firewall and your host's panel.
2. Set `pack.publicUrl` to the address and port players reach, such as `http://play.example.com:8164`. Without it, the address in the offer is the bind address or this machine's own address, which players outside your network cannot reach when the server runs behind NAT, in a container, or on a shared host.
3. Restart.

A player who cannot reach the listener accepts the prompt, the download fails, and the player stays on chest menus.

If the port is in use, Adapt logs `Could not serve the Adapt pack on <bind>:<port>: <reason>; the pack is not offered.` Choose another port and restart. With `pack.port = 0` the port changes at every start, so it cannot be opened in a firewall ahead of time.

Behind a reverse proxy, set `pack.publicUrl` to the proxy's base address. Adapt adds a path ending in `<sha1>.zip` to it; forward that path to the listener unchanged.

On a network with several backend servers, each backend that hosts its own pack does so on its own listener. Give each backend its own reachable port and `pack.publicUrl`.

### Your own host

1. Leave `pack.export = true` and start the server once.
2. Upload `pack/export/adapt-pack.zip` to your web host.
3. Set `pack.externalUrl` to its address. Use `{sha1}` if you name uploads by hash, such as `https://cdn.example.com/adapt/{sha1}.zip`.
4. Restart.

The offer carries the hash of the pack Adapt uses, so the hosted file must be that exact zip. Upload it again whenever `pack/export/adapt-pack.sha1` changes, for example after an Adapt update or an addon change.

### No host

With `pack.serve = false`, `pack.externalUrl` blank, and `pack.merged = false`, players get only the published copy. When the pack differs from it, or a download from it failed, no player is offered the pack. With `pack.releaseUrl` also blank, Adapt logs this at start:

```none
pack.serve is false and pack.externalUrl is blank, so the Adapt pack is not offered to players. Set one of them, or set pack.merged when players get the pack inside another pack.
```

## Export folder

With `pack.export = true`, Adapt writes the pack here:

| Path | Contents |
|---|---|
| `pack/export/adapt-pack.zip` | The pack as players download it |
| `pack/export/adapt-pack/` | The same files, unzipped |
| `pack/export/adapt-pack.sha1` | The pack's SHA-1 |

Adapt rewrites the export only when the pack's hash differs from `adapt-pack.sha1`, or when the zip or folder is missing. A changed `adapt-pack.sha1` means the files changed and any copy you host or merged needs updating.

## Merged packs

Set `pack.merged = true` when players get Adapt's files inside another server pack, such as one built by Nexo, ItemsAdder, or CraftEngine, or the pack set in `server.properties`. Adapt then logs `pack.merged is on: the Adapt pack is not offered; players get book menus once their client loads a server pack.`

1. Add Adapt's files to the other pack the way that plugin imports external packs:

| Plugin | Where Adapt's files go |
|---|---|
| Nexo | Copy `pack/export/adapt-pack.zip` into `plugins/Nexo/pack/external_packs/` |
| ItemsAdder | Copy the contents of `pack/export/adapt-pack/` into a new contents folder, such as `plugins/ItemsAdder/contents/adapt/resourcepack/`, then run `/iazip` |
| CraftEngine | Copy the contents of `pack/export/adapt-pack/` into `plugins/CraftEngine/resources/adapt/resourcepack/` |
| `server.properties` | Merge the contents of `pack/export/adapt-pack/` into your own pack's zip before you upload it |

2. Rebuild the other pack, and update its hash where your setup needs one.
3. Repeat both steps whenever `pack/export/adapt-pack.sha1` changes.

When two packs add the same file, the plugin that builds the merged pack decides which one wins. Adapt's files sit under the `adapt` namespace, apart from the language files that blank the Inventory label and the item atlas file that adds Adapt's icon folders.

In merged mode a player gets book pages once their client reports that a server pack loaded. A later report that a pack was declined, failed, or was discarded returns the player to chest menus. Adapt cannot tell which pack loaded, so a client that loaded an unrelated server pack also gets book pages. Bedrock players keep chest menus.

On Paper, Purpur, and Folia, Adapt reads the pack status the player joined with, so a `server.properties` pack counts. On Spigot, only packs sent after the player joined count, so a `server.properties` pack does not give book pages there.

## Other server packs

The pack changes one vanilla text: the Inventory label above the player's inventory is blank in every language, so players with the pack see no Inventory label in any container on the server.

The client holds Adapt's pack next to the `server.properties` pack and packs that other plugins send.

## Addon skills

Skills from addons appear in book menus with their own icons and page themes. A skill without a theme gets a page generated from its colour and icon. Installing or removing an addon while the server runs rebuilds the pack, and players are offered the new one as described in [How the pack reaches players](#how-the-pack-reaches-players). A removed skill's page closes for any player who has it open.

## Page size

Book pages are built for a screen 240 GUI units tall, which is what the client's Auto GUI scale guarantees. At a fixed GUI scale, a window shorter than 240 units at that scale cuts off the top and bottom of the page.
