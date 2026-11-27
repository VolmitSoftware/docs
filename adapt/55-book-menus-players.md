---
title: "Book Menus for Players"
description: "Use Adapt's book pages without the client mod"
published: true
date: 2026-11-27T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-26T00:00:00.000Z
---

On Paper, Purpur, Folia, and Spigot servers that offer it, Adapt sends a resource pack after you join. Accept it and the Adapt menus open as book pages in each skill's theme, with animated page art. Decline it and you keep the chest menus. You stay on the server either way. Players with the Adapt client mod use the mod's own book and are not offered the pack.

On Fabric, Forge, and NeoForge servers there is no pack. Install the Adapt client mod for book menus; without it you get the chest menus and the action bar.

Server owners set up the pack in [Book menus](/adapt/54-book-menus).

## Open the menus

Right-click the side of a bookshelf while not sneaking, with no block in either hand. The server can choose another block or allow the top and bottom faces; see [Player usage](/adapt/03-player-usage#open-and-navigate-the-menu). With the pack loaded, this opens the Skills page.

Press Esc to close any page.

## Get the pack

Accept the prompt when it appears. Run `/adapt pack offer` to get the prompt again, for example after declining it. The reply tells you what happened:

| Reply | Meaning |
|---|---|
| Sent the Adapt pack. | The prompt is on its way |
| No Adapt pack is available. | The server has no pack ready to send |
| This server does not offer the Adapt pack. | The server delivers the pack another way, or not at all |
| Your Adapt client already shows book menus. | You run the Adapt client mod |
| Bedrock clients cannot load the Adapt pack. | You play on Bedrock |
| Your client declined the Adapt pack. Rejoin with Server Resource Packs set to Prompt or Enabled, then run /adapt pack offer. | You declined the pack earlier on this connection, so your client turns it down without asking |

Declining changes two things in your client. For the rest of that connection it declines server packs without asking, so `/adapt pack offer` shows no prompt until you reconnect. And when you joined from your server list, the server's entry gets Server Resource Packs: Disabled, which declines every later pack from that server. To get the pack after declining, edit the server's entry, set Server Resource Packs to Prompt or Enabled, reconnect, and run `/adapt pack offer`. The server also remembers that you declined and does not ask again on its own.

If you accept and the menus stay chests, the download failed. Tell the server staff; `/adapt pack offer` tries again.

## Book or chest menus

On the Skills page, click the book at the right end of the bottom row to open Settings, then pick one:

| Choice | Menus |
|---|---|
| Book | Book pages. Without the pack, the server sends it and book pages start once it loads |
| Chest | Always chest menus |
| Auto | Book pages while the pack is loaded, chest menus otherwise. The default |

The same choice is a command: `/adapt pack menus style=book`, `style=chest`, or `style=auto`. Your choice is saved. On chest menus, the command is the only way back to book pages.

## Reading a page

Each menu is one page. Page controls sit in the bottom row of the page, where your hotbar would be: Back on the left, Previous, the page count and Next in the middle, and tabs or Settings on the right. On the Skills page, Search and the knowledge and power chips sit in the top row. Point at anything for its tooltip; costs, XP guides and descriptions are there.

Messages such as refusals and confirmations appear in the line at the foot of the page, or in the action bar when they do not fit. Pages redraw on their own when your levels or knowledge change.

### Skills

| Control | Click |
|---|---|
| Skill card | Opens the skill. The tooltip shows level, XP to the next level, knowledge, and how the skill earns XP. Greyed cards are skills you have not started |
| Search | Opens a text box. Right-click clears the search |
| Knowledge or power chip | Opens Spending: every adaptation you hold, its refund, and the power it uses. Click an entry to open it |
| Book | Opens Settings |
| Previous, Next | Turn the page |

On Spigot servers, Search asks in chat instead of a text box. Type `cancel` to stop.

### Skill page

![Chronos skill page](/adapt-assets/book-menus/skill-page.png =520x)

| Control | Click |
|---|---|
| Skill icon | Tooltip only: description, level, XP, and knowledge |
| Skill switch | Turns all your adaptations in this skill on or off, when the server allows personal settings |
| Mutate | Opens Mutate |
| Split | Shown instead of Mutate on a mutated skill while you are in debug mode. Click, then click again within three seconds to undo the mutation |
| Adaptation | Opens the adaptation |
| Adaptation, shift-click | Learns the next level. On a permanent adaptation, shift-click again within three seconds to confirm |
| Adaptation, shift-right-click | Then shift-right-click again within three seconds to unlearn one level |
| Previous, Next | Turn the page when the skill has more adaptations |

Each adaptation shows its level as a count and as pips. Its tooltip gives the level, what the next level costs or what stops you from learning it, the description, and the next level's stats. The foot of the page shows how many adaptations you have learned.

On a mutated skill, adaptations are grouped under the skill they come from. The first page uses the lead skill's theme. The last page, in the partner's theme, lists Kept without learning, the adaptations you keep from the parent skills, and Tools. Click either kind to open it.

### Adaptation page

![Adaptation page with level pips and Learn](/adapt-assets/book-menus/adaptation.png =520x)

Tabs at the bottom right switch between Levels, Recipes, and Settings. Recipes appears only when the adaptation has recipes, and Settings only when it has personal settings and the server allows them.

| Tab | Control | Click |
|---|---|---|
| Levels | Level pip | Previews that level and makes it the target. The tooltip shows that level's stats |
| Levels | Learn | Learns up to the target level. The cost shows beside it. On a permanent adaptation, click again within three seconds to confirm |
| Levels | Unlearn | Click, then click again within three seconds: unlearns to the target, or one level when the target is not below your level |
| Recipes | Recipe pick | Shows that recipe in the grid. The tooltip gives the level that unlocks it |
| Settings | Switch | Turns the setting on or off |
| Settings | Choice | Click for the next choice, right-click for the previous one |
| Settings | Lock | The server controls the setting, or you must learn the adaptation first |
| Settings | Reset | Click, then click again within three seconds: returns every setting on this page to the server default |

Recipes with alternatives cycle through them in the grid.

### Mutate

![Mutate partner cards](/adapt-assets/book-menus/mutate-partner.png =520x)

Mutate opens with partner cards for the skill you came from.

| Control | Click |
|---|---|
| Partner card | Picks that skill as the partner. Skills that cannot join are greyed; the tooltip says why |
| Swap | Swaps the lead and the partner. The page takes the new lead's theme |
| Gained and lost entries | Tooltip only: what each skill brings and loses |
| Partners tab | Returns to the partner cards |
| Seal | Click to arm it, then click again within three seconds to mutate |

The seal appears once a partner is picked, and its tooltip warns that a mutation is permanent. After mutating, the new skill's page opens. Mutations are covered in [Mutations](/adapt/35-mutations).

## Confirming with a second click

Learn on a permanent adaptation, Unlearn, Reset, Split, and the Mutate seal each take two clicks. The first click arms the control and shows Confirm learn, Confirm unlearn, Confirm reset, Confirm split, or Confirm mutate. Click the same control again within three seconds to go ahead. Clicking a different control arms that one instead, and leaving the page cancels.

## While a page is open

A book page uses your inventory rows. Items you receive while it is open, for example from another plugin, show once you close the page. Your inventory itself is unchanged.

With the pack loaded, the action bar shows a strip with your ability cooldowns, the XP you just earned with a bar, and short notices. Another plugin's action bar message can hide the strip for up to 1.5 seconds. Adapt's toasts, such as level-ups, show the skill's icon and colour. On chest menus you get Adapt's normal HUD.

## Differences from the client mod

The pages follow the client mod's book, with these differences:

- Each menu is a single page rather than a two-page spread.
- Details the mod shows on the left page, such as costs and descriptions, are in tooltips.
- Pages change in place without a page-turn animation, and the mouse wheel does not turn pages.
- Actions the mod confirms by holding the button take two clicks.
- The header row along the top of the page stays still; the rest of the page art animates.
- Labels in scripts other than Latin, Greek, and Cyrillic can appear only in the tooltip.

## GUI scale

Pages are built for a screen 240 GUI units tall, which the Auto GUI scale always provides. If the top or bottom of a page is cut off, set GUI Scale to Auto or a lower number in Video Settings.
