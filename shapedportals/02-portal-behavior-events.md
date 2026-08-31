---
title: "Shaped Portals: Portal Behavior & Troubleshooting"
description: "How portals are created, saved, repaired, and protected"
published: true
date: 2026-08-30T00:00:00.000Z
tags: "shapedportals, portals, events, persistence"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<style>
.sp-reference { max-width: 1120px; margin: 0 auto; line-height: 1.7; }
.sp-reference h2 { margin-top: 2.4rem; padding-bottom: .5rem; border-bottom: 1px solid rgba(127,127,127,.25); font-size: 1.5rem; scroll-margin-top: 5rem; }
.sp-reference h3 { margin-top: 1.6rem; scroll-margin-top: 5rem; }
.sp-reference .sp-nav { display: flex; flex-wrap: wrap; gap: .4rem; margin: 0 0 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(127,127,127,.25); }
.sp-reference .sp-nav a { display: block; padding: .4rem .75rem; border: 1px solid transparent; border-radius: 6px; text-decoration: none; color: inherit; font-size: .9rem; }
.sp-reference .sp-nav a:hover, .sp-reference .sp-nav a[aria-current="page"] { background: rgba(146,93,198,.12); border-color: rgba(146,93,198,.35); }
.sp-reference a:focus-visible, .sp-reference summary:focus-visible { outline: 3px solid #a66bdd; outline-offset: 3px; }
.sp-reference table { width: 100%; display: table; table-layout: fixed; border-collapse: collapse; font-size: .93rem; }
.sp-reference th, .sp-reference td { padding: .8rem; vertical-align: top; text-align: left; overflow-wrap: anywhere; border: 1px solid rgba(127,127,127,.22); }
.sp-reference th:first-child { width: 32%; }
.sp-reference .sp-commands th:first-child { width: 35%; }
.sp-reference .sp-commands th:last-child { width: 20%; }
.sp-reference .sp-permissions th:first-child { width: 40%; }
.sp-reference .sp-permissions th:nth-child(2) { width: 18%; }
.sp-reference .sp-settings th:first-child { width: 35%; }
.sp-reference .sp-settings th:nth-child(2) { width: 22%; }
.sp-reference th { background: rgba(146,93,198,.09); }
.sp-reference td code { white-space: normal; overflow-wrap: anywhere; }
.sp-reference pre { max-width: 100%; overflow-x: auto; }
.sp-reference .sp-media { min-height: 170px; margin: 1.3rem 0; padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: .4rem; border: 1px dashed rgba(127,127,127,.5); border-radius: 8px; background: rgba(146,93,198,.04); text-align: center; }
.sp-reference .sp-media span { max-width: 42rem; font-size: .9rem; }
.sp-reference blockquote, .sp-reference .sp-caution { margin: 1.3rem 0; padding: .9rem 1.1rem; border: 1px solid rgba(127,127,127,.35); border-radius: 6px; background: rgba(127,127,127,.05); color: inherit; }
.sp-reference blockquote p, .sp-reference .sp-caution p { margin: 0; }
.sp-reference details { margin: 1rem 0; padding: .85rem 1rem; border: 1px solid rgba(127,127,127,.3); border-radius: 6px; }
.sp-reference summary { cursor: pointer; font-weight: 600; }
.sp-reference details[open] summary { margin-bottom: .8rem; }
.sp-reference .sp-related { margin-top: 2.5rem; padding-top: 1rem; border-top: 1px solid rgba(127,127,127,.25); }
@media (max-width: 600px) {
  .sp-reference table, .sp-reference tbody { display: block; }
  .sp-reference thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .sp-reference tr { display: block; margin: .7rem 0; padding: .3rem 0; border: 1px solid rgba(127,127,127,.25); border-radius: 6px; }
  .sp-reference td { display: block; width: auto; padding: .4rem .8rem; border: 0; font-size: .92rem; }
  .sp-reference td:first-child { font-weight: 600; }
  .sp-reference td::before { font-weight: 600; }
  .sp-reference .sp-commands td:nth-child(3)::before { content: "Run from: "; }
  .sp-reference .sp-permissions td:nth-child(2)::before, .sp-reference .sp-settings td:nth-child(2)::before { content: "Default: "; }
  .sp-reference .sp-nav { gap: .15rem; }
  .sp-reference .sp-nav a { padding: .4rem .5rem; }
}
</style>

<div class="sp-reference">
<nav class="sp-nav" aria-label="Shaped Portals guides"><a href="/shapedportals">Home</a><a href="/shapedportals/00-overview">Build &amp; commands</a><a href="/shapedportals/01-installation-configuration">Configuration</a><a href="/shapedportals/02-portal-behavior-events" aria-current="page">Portal behavior</a><a href="/shapedportals/03-compatibility-operations">Server setup</a></nav>

Shaped Portals keeps track of the portals it creates so their unusual shapes can survive block updates and restarts. Minecraft still handles travel and destination portals.

[Portal changes](#repair-based-integrity) · [Saved data](#persistent-ownership) · [Protection plugins](#ignition-and-protection-plugins) · [Troubleshooting](#troubleshooting)

## Repair-based integrity

| What changes | What the plugin does |
|---|---|
| A portal block disappears | Refills it if the frame is intact and the missing cell is still replaceable |
| The frame is opened or broken | Removes the managed portal surface and its record |
| A nonreplaceable block occupies the interior | Deactivates the portal rather than removing that block |
| An intact boundary changes material | Refreshes the recorded material at that position |
| A material is removed from the creation whitelist | Keeps existing portals; adds a note to their portal-list entries |
| A portal's chunks are unloaded | Waits for them to load; integrity checks do not load chunks |
| Blocks change through an API or WorldEdit | A periodic check catches changes not covered by normal events |

Integrity must be enabled for repair and cleanup. See [Integrity settings](/shapedportals/01-installation-configuration#integrity).

## Persistent ownership

Managed portals are saved in `plugins/ShapedPortals/portals.json`.

> Back up the portal store alongside your worlds. Do not edit it while the server is running. An invalid or unsupported store prevents the plugin from enabling safely and is preserved for recovery.

## Portal listing and navigation

Use [the portal commands](/shapedportals/00-overview#find-and-visit-a-portal) to find or visit a managed portal.

The list shows each portal's location, size, creator, creation time, and UUID.

Teleportation fails if the portal or world is unavailable, no safe landing exists, or another plugin cancels it.

An unsafe landing requires a separate permission and confirmation. Read the [unsafe teleport warning](/shapedportals/00-overview#find-and-visit-a-portal) before using it.

## Ignition and protection plugins

Ignition denied by a protection plugin is ignored. Before placing shaped portal blocks, the plugin fires a cancellable `PortalCreateEvent` with reason `FIRE`. If it is cancelled, or the frame changes during the event, no portal is placed and no success sound plays.

## Troubleshooting

| Symptom | What to check |
|---|---|
| Lighting the frame does nothing | Run `/sp status`. Check creation is enabled, the world and ignition cause are allowed, and the player has creation permission |
| A frame is rejected | Close every edge, remove blocked interior cells, check the size limits, and keep it in one vertical plane |
| A valid frame is blocked in a protected area | Check the protection plugin's ignition and `PortalCreateEvent` rules |
| A frame fails on Folia | Keep the full shape inside one currently owned region |
| Missing portal blocks come back | This is normal repair behavior while the frame is valid and the cells are replaceable |
| A portal disappears | Check for a broken frame or occupied interior, then inspect the console for persistence or region errors |
| Changes are not being repaired | Check integrity is enabled and the portal's chunks are loaded |
| Teleport refuses to move you | Check the portal still exists, its world is available, a safe landing exists, and no plugin cancelled the move |
| The destination portal is a rectangle | This is normal: vanilla creates destination portals and decides where they go |

Shaped Portals does not pair portals or provide custom destinations. A dedicated routing plugin is needed for fixed links.

<div class="sp-related"><a href="/shapedportals/01-installation-configuration">Configuration</a> · <a href="/shapedportals/03-compatibility-operations">Compatibility</a></div>

</div>
