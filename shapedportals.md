---
title: "Shaped Portals"
description: "Build custom-shaped Nether and End portals and manage them in-game"
published: true
date: 2026-09-01T00:00:00.000Z
tags: "shapedportals, portals, folia, configuration"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<section aria-label="Shaped Portals introduction" style="position:relative;isolation:isolate;overflow:hidden;padding:clamp(1.5rem,5vw,4rem);border:1px solid rgba(255,255,255,.14);border-radius:24px;background:radial-gradient(circle at 84% 18%,rgba(192,132,252,.3),transparent 28%),radial-gradient(circle at 14% 92%,rgba(91,33,182,.3),transparent 30%),linear-gradient(135deg,#0b0712 0%,#21102f 54%,#4a146b 100%);color:#fff;box-shadow:0 22px 55px rgba(35,12,50,.3)">
  <div aria-hidden="true" style="position:absolute;z-index:-1;right:-120px;bottom:-190px;width:390px;height:390px;border:1px solid rgba(255,255,255,.1);transform:rotate(45deg)"></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:clamp(1.5rem,4vw,3.5rem);align-items:center">
    <div style="max-width:720px">
      <span style="display:inline-block;padding:.34rem .68rem;border:1px solid rgba(255,255,255,.22);border-radius:999px;background:rgba(255,255,255,.08);font-size:.74rem;font-weight:800;letter-spacing:.1em">NATIVE NETHER + END PORTALS</span>
      <h2 style="margin:.8rem 0 .75rem;font-size:clamp(2.5rem,7vw,5.2rem);line-height:.94;letter-spacing:-.045em">Build the shape you want.</h2>
      <p style="max-width:650px;margin:0;font-size:clamp(1.02rem,2.4vw,1.28rem);line-height:1.65;color:rgba(255,255,255,.86)">Create upright Nether portals or horizontal End portals with custom outlines and sizes. The blocks are native, so Minecraft still handles travel and destination creation.</p>
      <nav aria-label="Get started" style="display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1.6rem">
        <a href="/shapedportals/00-overview#build-your-first-portal" style="display:inline-block;padding:.8rem 1.08rem;border-radius:10px;background:#fff;color:#3b0d55;font-weight:800;text-decoration:none">Build your first portal →</a>
        <a href="/shapedportals/01-installation-configuration" style="display:inline-block;padding:.8rem 1.08rem;border:1px solid rgba(255,255,255,.4);border-radius:10px;background:rgba(255,255,255,.05);color:#fff;font-weight:700;text-decoration:none">Install and configure</a>
      </nav>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1.35rem;color:rgba(255,255,255,.8);font-size:.84rem">
        <span style="padding:.32rem .6rem;border-radius:999px;background:rgba(255,255,255,.08)">Spigot 1.20.1+</span>
        <span style="padding:.32rem .6rem;border-radius:999px;background:rgba(255,255,255,.08)">Java 17 bytecode</span>
        <span style="padding:.32rem .6rem;border-radius:999px;background:rgba(255,255,255,.08)">Paper + Folia</span>
      </div>
    </div>
    <div style="display:grid;place-items:center;min-height:250px">
      <div style="display:grid;place-items:center;width:min(68vw,285px);aspect-ratio:1;border:1px solid rgba(255,255,255,.14);border-radius:30%;background:linear-gradient(145deg,rgba(255,255,255,.11),rgba(255,255,255,.02));transform:rotate(7deg);box-shadow:inset 0 0 60px rgba(192,132,252,.12),0 24px 48px rgba(0,0,0,.34)">
        <img src="/home-assets/shapedportals.jpg" alt="Shaped Portals logo" width="220" height="220" style="width:78%;height:auto;object-fit:contain;border-radius:18px;transform:rotate(-7deg);filter:drop-shadow(0 16px 18px rgba(0,0,0,.42))">
      </div>
    </div>
  </div>
</section>

<section aria-label="Shaped Portals at a glance" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;margin-top:1rem;border:1px solid rgba(127,127,127,.25);border-radius:16px;overflow:hidden;background:rgba(127,127,127,.2)">
  <div style="padding:1.1rem;background:var(--v-background-base,rgba(127,127,127,.07));color:inherit"><strong style="display:block;font-size:1.35rem;color:#a855f7">Nether + End</strong><span style="display:block;margin-top:.35rem;font-size:.76rem;font-weight:800;letter-spacing:.07em;opacity:.68">PORTAL TYPES</span></div>
  <div style="padding:1.1rem;background:var(--v-background-base,rgba(127,127,127,.07));color:inherit"><strong style="display:block;font-size:1.35rem;color:#a855f7">256</strong><span style="display:block;margin-top:.35rem;font-size:.76rem;font-weight:800;letter-spacing:.07em;opacity:.68">DEFAULT MAXIMUM CELLS</span></div>
  <div style="padding:1.1rem;background:var(--v-background-base,rgba(127,127,127,.07));color:inherit"><strong style="display:block;font-size:1.35rem;color:#a855f7"><code>/sp</code></strong><span style="display:block;margin-top:.35rem;font-size:.76rem;font-weight:800;letter-spacing:.07em;opacity:.68">ADMIN COMMAND</span></div>
  <div style="padding:1.1rem;background:var(--v-background-base,rgba(127,127,127,.07));color:inherit"><strong style="display:block;font-size:1.35rem;color:#a855f7">Hot reload</strong><span style="display:block;margin-top:.35rem;font-size:.76rem;font-weight:800;letter-spacing:.07em;opacity:.68">CONFIGURATION</span></div>
</section>

## Pick a portal

<section aria-label="Portal types" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:.9rem">
  <article style="padding:1.2rem;border-top:4px solid #8b5cf6;border-right:1px solid rgba(127,127,127,.24);border-bottom:1px solid rgba(127,127,127,.24);border-left:1px solid rgba(127,127,127,.24);border-radius:14px;background:rgba(139,92,246,.06)">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.08em;color:#a78bfa">VERTICAL</span>
    <h3 style="margin:.45rem 0 .4rem">Nether portals</h3>
    <p style="margin:0;line-height:1.58;opacity:.8">Close an upright frame around 2 to 256 connected interior blocks, then light the inside.</p>
  </article>
  <article style="padding:1.2rem;border-top:4px solid #14b8a6;border-right:1px solid rgba(127,127,127,.24);border-bottom:1px solid rgba(127,127,127,.24);border-left:1px solid rgba(127,127,127,.24);border-radius:14px;background:rgba(20,184,166,.06)">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.08em;color:#2dd4bf">HORIZONTAL</span>
    <h3 style="margin:.45rem 0 .4rem">End portals</h3>
    <p style="margin:0;line-height:1.58;opacity:.8">Close an End Portal Frame boundary around 1 to 256 connected cells, then insert every eye.</p>
  </article>
  <article style="padding:1.2rem;border-top:4px solid #64748b;border-right:1px solid rgba(127,127,127,.24);border-bottom:1px solid rgba(127,127,127,.24);border-left:1px solid rgba(127,127,127,.24);border-radius:14px;background:rgba(127,127,127,.055)">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.08em;opacity:.65">VANILLA MECHANICS</span>
    <h3 style="margin:.45rem 0 .4rem">Native travel</h3>
    <p style="margin:0;line-height:1.58;opacity:.8">Shaped Portals changes valid frames. It does not pair portals, choose destinations, or replace Minecraft travel.</p>
  </article>
</section>

## Choose a guide

<nav aria-label="Shaped Portals documentation" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem;align-items:stretch">
  <a href="/shapedportals/00-overview" style="display:block;min-height:155px;padding:1.2rem;border:1px solid rgba(168,85,247,.34);border-top:4px solid #a855f7;border-radius:14px;background:rgba(168,85,247,.06);color:inherit;text-decoration:none"><span style="display:block;font-size:.72rem;font-weight:900;letter-spacing:.09em;color:#a855f7">01</span><strong style="display:block;margin-top:.5rem;font-size:1.08rem">Build and command</strong><span style="display:block;margin-top:.4rem;line-height:1.5;opacity:.76">Create both portal types, browse managed portals, teleport, and check permissions.</span></a>
  <a href="/shapedportals/01-installation-configuration" style="display:block;min-height:155px;padding:1.2rem;border:1px solid rgba(127,127,127,.26);border-top:4px solid #7c3aed;border-radius:14px;background:rgba(127,127,127,.055);color:inherit;text-decoration:none"><span style="display:block;font-size:.72rem;font-weight:900;letter-spacing:.09em;color:#8b5cf6">02</span><strong style="display:block;margin-top:.5rem;font-size:1.08rem">Install and configure</strong><span style="display:block;margin-top:.4rem;line-height:1.5;opacity:.76">Check requirements, use the in-game editor, and find every configuration key.</span></a>
  <a href="/shapedportals/02-portal-behavior-events" style="display:block;min-height:155px;padding:1.2rem;border:1px solid rgba(127,127,127,.26);border-top:4px solid #0d9488;border-radius:14px;background:rgba(127,127,127,.055);color:inherit;text-decoration:none"><span style="display:block;font-size:.72rem;font-weight:900;letter-spacing:.09em;color:#14b8a6">03</span><strong style="display:block;margin-top:.5rem;font-size:1.08rem">Portal behavior</strong><span style="display:block;margin-top:.4rem;line-height:1.5;opacity:.76">Understand creation events, saved records, integrity checks, and protection plugins.</span></a>
  <a href="/shapedportals/03-compatibility-operations" style="display:block;min-height:155px;padding:1.2rem;border:1px solid rgba(127,127,127,.26);border-top:4px solid #2563eb;border-radius:14px;background:rgba(127,127,127,.055);color:inherit;text-decoration:none"><span style="display:block;font-size:.72rem;font-weight:900;letter-spacing:.09em;color:#3b82f6">04</span><strong style="display:block;margin-top:.5rem;font-size:1.08rem">Compatibility and diagnostics</strong><span style="display:block;margin-top:.4rem;line-height:1.5;opacity:.76">Review server support, Folia limits, debug reports, and React metrics.</span></a>
  <a href="/shapedportals/04-architecture-limits" style="display:block;min-height:155px;padding:1.2rem;border:1px solid rgba(127,127,127,.26);border-top:4px solid #64748b;border-radius:14px;background:rgba(127,127,127,.055);color:inherit;text-decoration:none"><span style="display:block;font-size:.72rem;font-weight:900;letter-spacing:.09em;color:#94a3b8">05</span><strong style="display:block;margin-top:.5rem;font-size:1.08rem">Developer reference</strong><span style="display:block;margin-top:.4rem;line-height:1.5;opacity:.76">Read the geometry, persistence, event, region-ownership, and build contracts.</span></a>
  <a href="/shapedportals/02-portal-behavior-events#troubleshooting" style="display:block;min-height:155px;padding:1.2rem;border:1px solid rgba(245,158,11,.3);border-top:4px solid #d97706;border-radius:14px;background:rgba(245,158,11,.055);color:inherit;text-decoration:none"><span style="display:block;font-size:.72rem;font-weight:900;letter-spacing:.09em;color:#f59e0b">HELP</span><strong style="display:block;margin-top:.5rem;font-size:1.08rem">Troubleshooting</strong><span style="display:block;margin-top:.4rem;line-height:1.5;opacity:.76">Check rejected frames, permissions, protection rules, missing blocks, and travel.</span></a>
</nav>

<section aria-label="Commands and support" style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-top:1.5rem;padding:1.2rem 1.3rem;border:1px solid rgba(127,127,127,.25);border-radius:14px;background:rgba(127,127,127,.055)">
  <div><strong style="display:block">Command aliases</strong><span style="display:block;margin-top:.25rem;opacity:.75"><code>/shapedportals</code> · <code>/shapedportal</code> · <code>/sp</code></span></div>
  <nav aria-label="Support and downloads" style="display:flex;gap:.55rem;flex-wrap:wrap"><a href="https://www.spigotmc.org/resources/shaped-portals.95595/" style="padding:.55rem .8rem;border-radius:9px;background:#7e22ce;color:#fff;font-weight:700;text-decoration:none">Download</a><a href="https://volmitsoftware.com/discord" style="padding:.55rem .8rem;border:1px solid rgba(127,127,127,.32);border-radius:9px;color:inherit;text-decoration:none">Discord</a><a href="https://github.com/VolmitSoftware/ShapedPortals" style="padding:.55rem .8rem;border:1px solid rgba(127,127,127,.32);border-radius:9px;color:inherit;text-decoration:none">Source</a></nav>
</section>
