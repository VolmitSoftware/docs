---
title: "Adapt — Complete CSS Page Example"
description: "A responsive Wiki.js landing page built from verified Adapt documentation and source"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "meta, wikijs, css, layouts, adapt, examples"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

This page demonstrates a complete plugin landing page rather than an isolated
component. It uses Adapt's real content model, current requirements, routes,
and visual identity. The layout stays useful as ordinary documentation:
navigation cards have real destinations, claims are verifiable, and important
setup information is visible without reading the whole page.

> The rendered sections use raw HTML with inline CSS so the example remains
> self-contained in Git. Wiki.js must allow HTML and retain inline `style`
> attributes. The final section includes optional scoped CSS for interactive
> states that inline styles cannot express.
{.is-info}

<nav aria-label="Page sections" style="display:flex;gap:.55rem;flex-wrap:wrap;margin:1.25rem 0 1.5rem">
  <a href="#progression" style="padding:.48rem .78rem;border:1px solid rgba(127,127,127,.28);border-radius:999px;color:inherit;text-decoration:none">Progression</a>
  <a href="#play-styles" style="padding:.48rem .78rem;border:1px solid rgba(127,127,127,.28);border-radius:999px;color:inherit;text-decoration:none">Play styles</a>
  <a href="#skill-tree" style="padding:.48rem .78rem;border:1px solid rgba(127,127,127,.28);border-radius:999px;color:inherit;text-decoration:none">TragOul tree</a>
  <a href="#start-here" style="padding:.48rem .78rem;border:1px solid rgba(127,127,127,.28);border-radius:999px;color:inherit;text-decoration:none">Start here</a>
  <a href="#operators" style="padding:.48rem .78rem;border:1px solid rgba(127,127,127,.28);border-radius:999px;color:inherit;text-decoration:none">Operators</a>
  <a href="#implementation" style="padding:.48rem .78rem;border:1px solid rgba(127,127,127,.28);border-radius:999px;color:inherit;text-decoration:none">CSS notes</a>
</nav>

<section aria-label="Adapt introduction" style="position:relative;isolation:isolate;overflow:hidden;padding:clamp(1.5rem,5vw,4.25rem);border:1px solid rgba(255,255,255,.12);border-radius:26px;background:radial-gradient(circle at 82% 18%,rgba(239,57,62,.28),transparent 27%),radial-gradient(circle at 13% 88%,rgba(175,24,30,.24),transparent 25%),linear-gradient(135deg,#0e0d0f 0%,#211416 54%,#480f13 100%);color:#fff;box-shadow:0 24px 60px rgba(28,8,10,.28)">
  <div aria-hidden="true" style="position:absolute;z-index:-1;right:-110px;bottom:-150px;width:380px;height:380px;border:1px solid rgba(255,255,255,.08);transform:rotate(45deg)"></div>
  <div aria-hidden="true" style="position:absolute;z-index:-1;right:7%;bottom:-190px;width:380px;height:380px;border:1px solid rgba(239,57,62,.18);transform:rotate(45deg)"></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:clamp(1.5rem,4vw,3.5rem);align-items:center">
    <div style="max-width:720px">
      <span style="display:inline-block;padding:.34rem .68rem;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,255,255,.07);font-size:.74rem;font-weight:800;letter-spacing:.11em">PASSIVE SKILLS · ACTIVE CHOICES</span>
      <h2 style="margin:.75rem 0 .7rem;font-size:clamp(3rem,9vw,6.2rem);line-height:.88;letter-spacing:-.055em">Adapt.</h2>
      <p style="max-width:650px;margin:0;font-size:clamp(1.05rem,2.5vw,1.38rem);line-height:1.65;color:rgba(255,255,255,.84)">Skills that grow with the way you play. Earn knowledge through normal Minecraft activity, then shape a loadout of abilities that feels like yours.</p>
      <div style="display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1.6rem">
        <a href="/adapt/03-player-usage" style="display:inline-block;padding:.82rem 1.08rem;border-radius:10px;background:#d82f35;color:#fff;font-weight:800;text-decoration:none;box-shadow:0 9px 25px rgba(239,57,62,.24)">Start playing →</a>
        <a href="/adapt/01-installation-configuration" style="display:inline-block;padding:.82rem 1.08rem;border:1px solid rgba(255,255,255,.32);border-radius:10px;color:#fff;font-weight:700;text-decoration:none;background:rgba(255,255,255,.04)">Install Adapt</a>
      </div>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1.4rem;color:rgba(255,255,255,.78);font-size:.84rem">
        <span style="padding:.32rem .6rem;border-radius:999px;background:rgba(255,255,255,.07)">Paper</span>
        <span style="padding:.32rem .6rem;border-radius:999px;background:rgba(255,255,255,.07)">Purpur</span>
        <span style="padding:.32rem .6rem;border-radius:999px;background:rgba(255,255,255,.07)">Folia</span>
        <span style="padding:.32rem .6rem;border-radius:999px;background:rgba(255,255,255,.07)">Java 25</span>
      </div>
    </div>
    <div style="display:grid;place-items:center;min-height:250px">
      <div style="display:grid;place-items:center;width:min(72vw,290px);aspect-ratio:1;border:1px solid rgba(255,255,255,.12);border-radius:32%;background:linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.015));transform:rotate(8deg);box-shadow:inset 0 0 60px rgba(239,57,62,.09),0 25px 50px rgba(0,0,0,.32)">
        <img src="/home-assets/adapt.png" alt="Adapt logo" width="230" height="202" style="width:80%;height:auto;object-fit:contain;transform:rotate(-8deg);filter:drop-shadow(0 18px 20px rgba(0,0,0,.4))">
      </div>
    </div>
  </div>
</section>

<section aria-label="Adapt at a glance" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;margin-top:1rem;border:1px solid rgba(127,127,127,.24);border-radius:16px;overflow:hidden;background:rgba(127,127,127,.2)">
  <div style="padding:1.15rem;background:var(--v-background-base,rgba(127,127,127,.07));color:inherit">
    <strong style="display:block;font-size:clamp(1.65rem,4vw,2.3rem);line-height:1;color:#d82f35">23</strong>
    <span style="display:block;margin-top:.4rem;font-size:.78rem;font-weight:800;letter-spacing:.08em;opacity:.68">SKILL LINES</span>
  </div>
  <div style="padding:1.15rem;background:var(--v-background-base,rgba(127,127,127,.07));color:inherit">
    <strong style="display:block;font-size:clamp(1.65rem,4vw,2.3rem);line-height:1;color:#d82f35">312</strong>
    <span style="display:block;margin-top:.4rem;font-size:.78rem;font-weight:800;letter-spacing:.08em;opacity:.68">DECLARED ADAPTATIONS</span>
  </div>
  <div style="padding:1.15rem;background:var(--v-background-base,rgba(127,127,127,.07));color:inherit">
    <strong style="display:block;font-size:clamp(1.25rem,3vw,1.7rem);line-height:1.15;color:#d82f35">2.0.0-26.2</strong>
    <span style="display:block;margin-top:.4rem;font-size:.78rem;font-weight:800;letter-spacing:.08em;opacity:.68">PLUGIN BUILD</span>
  </div>
  <div style="padding:1.15rem;background:var(--v-background-base,rgba(127,127,127,.07));color:inherit">
    <strong style="display:block;font-size:clamp(1.25rem,3vw,1.7rem);line-height:1.15;color:#d82f35">Play-driven</strong>
    <span style="display:block;margin-top:.4rem;font-size:.78rem;font-weight:800;letter-spacing:.08em;opacity:.68">LEVEL THROUGH PLAY</span>
  </div>
</section>

## Progression that starts with play {#progression}

Adapt does not ask players to choose a class before they understand the
server. The things they already do reveal the skill lines that fit them.

<section aria-label="Adapt progression loop" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:.8rem">
  <article style="position:relative;padding:1.15rem;border:1px solid rgba(127,127,127,.25);border-radius:14px;background:rgba(127,127,127,.055)">
    <span style="display:grid;place-items:center;width:2rem;height:2rem;border-radius:9px;background:#242124;color:#fff;font-weight:900">1</span>
    <h3 style="margin:.8rem 0 .35rem;font-size:1.03rem">Play normally</h3>
    <p style="margin:0;line-height:1.55;opacity:.76">Mine, sprint, build, fight, brew, explore, tame, or work underwater.</p>
  </article>
  <article style="position:relative;padding:1.15rem;border:1px solid rgba(127,127,127,.25);border-radius:14px;background:rgba(127,127,127,.055)">
    <span style="display:grid;place-items:center;width:2rem;height:2rem;border-radius:9px;background:#6e2427;color:#fff;font-weight:900">2</span>
    <h3 style="margin:.8rem 0 .35rem;font-size:1.03rem">Grow a skill</h3>
    <p style="margin:0;line-height:1.55;opacity:.76">Matching activity awards XP to its own line and raises that skill's level.</p>
  </article>
  <article style="position:relative;padding:1.15rem;border:1px solid rgba(127,127,127,.25);border-radius:14px;background:rgba(127,127,127,.055)">
    <span style="display:grid;place-items:center;width:2rem;height:2rem;border-radius:9px;background:#aa272c;color:#fff;font-weight:900">3</span>
    <h3 style="margin:.8rem 0 .35rem;font-size:1.03rem">Earn knowledge</h3>
    <p style="margin:0;line-height:1.55;opacity:.76">Skill levels pay knowledge that can be spent inside that same skill line.</p>
  </article>
  <article style="position:relative;padding:1.15rem;border:1px solid rgba(216,47,53,.35);border-radius:14px;background:rgba(216,47,53,.08)">
    <span style="display:grid;place-items:center;width:2rem;height:2rem;border-radius:9px;background:#d82f35;color:#fff;font-weight:900">4</span>
    <h3 style="margin:.8rem 0 .35rem;font-size:1.03rem">Shape a loadout</h3>
    <p style="margin:0;line-height:1.55;opacity:.8">Spend knowledge and shared ability power on the adaptations you want to carry.</p>
  </article>
</section>

<section aria-label="Knowledge and power explained" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;margin-top:1rem">
  <article style="padding:clamp(1.2rem,3vw,1.8rem);border-radius:17px;background:linear-gradient(145deg,rgba(216,47,53,.14),rgba(216,47,53,.035));border:1px solid rgba(216,47,53,.3)">
    <span style="font-size:.75rem;font-weight:900;letter-spacing:.09em;opacity:.72">KNOWLEDGE</span>
    <h3 style="margin:.4rem 0 .55rem">Can I afford it?</h3>
    <p style="margin:0 0 1rem;line-height:1.6">Knowledge belongs to one skill. Pickaxes knowledge buys Pickaxes adaptations; it cannot be moved to Ranged or Agility.</p>
    <div style="height:8px;border-radius:999px;background:rgba(127,127,127,.16);overflow:hidden"><div style="width:72%;height:100%;border-radius:999px;background:linear-gradient(90deg,#861c21,#ef393e)"></div></div>
    <small style="display:block;margin-top:.45rem;opacity:.68">Earned automatically as that skill levels</small>
  </article>
  <article style="padding:clamp(1.2rem,3vw,1.8rem);border-radius:17px;background:linear-gradient(145deg,rgba(48,46,49,.14),rgba(48,46,49,.035));border:1px solid rgba(127,127,127,.28)">
    <span style="font-size:.75rem;font-weight:900;letter-spacing:.09em;opacity:.68">ABILITY POWER</span>
    <h3 style="margin:.4rem 0 .55rem">Can I carry it?</h3>
    <p style="margin:0 0 1rem;line-height:1.6">Power is shared across the account. Every learned adaptation level uses one point, so a build always involves choices.</p>
    <div style="height:8px;border-radius:999px;background:rgba(127,127,127,.16);overflow:hidden"><div style="width:54%;height:100%;border-radius:999px;background:linear-gradient(90deg,#242124,#777176)"></div></div>
    <small style="display:block;margin-top:.45rem;opacity:.68">Default budget: floor(master level × 0.65)</small>
  </article>
</section>

[Understand skills, knowledge, and power →](/adapt/02-concepts)

## Find your play style {#play-styles}

The complete catalog contains twenty-three lines. These groups are starting
points, not classes; a player can progress in any combination.

<section aria-label="Adapt play styles" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:.9rem">
  <article style="padding:1.15rem;border-top:4px solid #42a95c;border-radius:14px;background:rgba(127,127,127,.06);border-right:1px solid rgba(127,127,127,.22);border-bottom:1px solid rgba(127,127,127,.22);border-left:1px solid rgba(127,127,127,.22)">
    <span aria-hidden="true" style="font-size:1.6rem">↟</span>
    <h3 style="margin:.6rem 0 .3rem">Move</h3>
    <p style="margin:0 0 .8rem;line-height:1.5;opacity:.75">Build momentum on land, in the air, and underwater.</p>
    <a href="/adapt/11-skill-agility">Agility</a> · <a href="/adapt/23-skill-kinetics">Kinetics</a> · <a href="/adapt/28-skill-seaborne">Seaborne</a>
  </article>
  <article style="padding:1.15rem;border-top:4px solid #d82f35;border-radius:14px;background:rgba(127,127,127,.06);border-right:1px solid rgba(127,127,127,.22);border-bottom:1px solid rgba(127,127,127,.22);border-left:1px solid rgba(127,127,127,.22)">
    <span aria-hidden="true" style="font-size:1.6rem">⚔</span>
    <h3 style="margin:.6rem 0 .3rem">Fight</h3>
    <p style="margin:0 0 .8rem;line-height:1.5;opacity:.75">Specialize in weapon rhythm, defense, range, or bare hands.</p>
    <a href="/adapt/30-skill-swords">Swords</a> · <a href="/adapt/26-skill-ranged">Ranged</a> · <a href="/adapt/14-skill-blocking">Blocking</a> · <a href="/adapt/33-skill-unarmed">Unarmed</a>
  </article>
  <article style="padding:1.15rem;border-top:4px solid #d89a2f;border-radius:14px;background:rgba(127,127,127,.06);border-right:1px solid rgba(127,127,127,.22);border-bottom:1px solid rgba(127,127,127,.22);border-left:1px solid rgba(127,127,127,.22)">
    <span aria-hidden="true" style="font-size:1.6rem">◆</span>
    <h3 style="margin:.6rem 0 .3rem">Gather</h3>
    <p style="margin:0 0 .8rem;line-height:1.5;opacity:.75">Turn mining, chopping, and excavation into specialized toolkits.</p>
    <a href="/adapt/25-skill-pickaxes">Pickaxes</a> · <a href="/adapt/13-skill-axes">Axes</a> · <a href="/adapt/20-skill-excavation">Excavation</a>
  </article>
  <article style="padding:1.15rem;border-top:4px solid #7a62c8;border-radius:14px;background:rgba(127,127,127,.06);border-right:1px solid rgba(127,127,127,.22);border-bottom:1px solid rgba(127,127,127,.22);border-left:1px solid rgba(127,127,127,.22)">
    <span aria-hidden="true" style="font-size:1.6rem">✦</span>
    <h3 style="margin:.6rem 0 .3rem">Create</h3>
    <p style="margin:0 0 .8rem;line-height:1.5;opacity:.75">Build, craft, brew, and enchant with deeper utility.</p>
    <a href="/adapt/12-skill-architect">Architect</a> · <a href="/adapt/17-skill-crafting">Crafting</a> · <a href="/adapt/15-skill-brewing">Brewing</a> · <a href="/adapt/19-skill-enchanting">Enchanting</a>
  </article>
  <article style="padding:1.15rem;border-top:4px solid #3198a8;border-radius:14px;background:rgba(127,127,127,.06);border-right:1px solid rgba(127,127,127,.22);border-bottom:1px solid rgba(127,127,127,.22);border-left:1px solid rgba(127,127,127,.22)">
    <span aria-hidden="true" style="font-size:1.6rem">⌖</span>
    <h3 style="margin:.6rem 0 .3rem">Explore</h3>
    <p style="margin:0 0 .8rem;line-height:1.5;opacity:.75">Reward discovery, dimensional travel, and mastery of time.</p>
    <a href="/adapt/18-skill-discovery">Discovery</a> · <a href="/adapt/27-skill-rift">Rift</a> · <a href="/adapt/24-skill-nether">Nether</a> · <a href="/adapt/16-skill-chronos">Chronos</a>
  </article>
  <article style="padding:1.15rem;border-top:4px solid #96577f;border-radius:14px;background:rgba(127,127,127,.06);border-right:1px solid rgba(127,127,127,.22);border-bottom:1px solid rgba(127,127,127,.22);border-left:1px solid rgba(127,127,127,.22)">
    <span aria-hidden="true" style="font-size:1.6rem">♧</span>
    <h3 style="margin:.6rem 0 .3rem">Survive</h3>
    <p style="margin:0 0 .8rem;line-height:1.5;opacity:.75">Grow through farming, companions, hunting, stealth, and adversity.</p>
    <a href="/adapt/21-skill-herbalism">Herbalism</a> · <a href="/adapt/31-skill-taming">Taming</a> · <a href="/adapt/22-skill-hunter">Hunter</a> · <a href="/adapt/29-skill-stealth">Stealth</a> · <a href="/adapt/32-skill-tragoul">TragOul</a>
  </article>
</section>

<p style="text-align:center;margin-top:1.25rem"><a href="/adapt/10-skills-catalog" style="display:inline-block;padding:.72rem 1rem;border-radius:9px;background:#242124;color:#fff;font-weight:800;text-decoration:none">Browse all 23 skills and 312 adaptations →</a></p>

## Designed around the player {#player-experience}

<section aria-label="Adapt player experience" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(255px,1fr));gap:1rem">
  <article style="overflow:hidden;border:1px solid rgba(127,127,127,.25);border-radius:17px;background:rgba(127,127,127,.045)">
    <div style="padding:1.15rem;background:linear-gradient(135deg,#221f22,#441619);color:#fff">
      <span style="font-size:.75rem;font-weight:900;letter-spacing:.09em;color:#ff686c">DISCOVER</span>
      <h3 style="margin:.35rem 0 0">Skills reveal themselves</h3>
    </div>
    <p style="padding:1.15rem;margin:0;line-height:1.6">New players see the skills they have actually touched. The menu grows with their play instead of presenting a wall of unfamiliar choices.</p>
  </article>
  <article style="overflow:hidden;border:1px solid rgba(127,127,127,.25);border-radius:17px;background:rgba(127,127,127,.045)">
    <div style="padding:1.15rem;background:linear-gradient(135deg,#221f22,#441619);color:#fff">
      <span style="font-size:.75rem;font-weight:900;letter-spacing:.09em;color:#ff686c">CHOOSE</span>
      <h3 style="margin:.35rem 0 0">The menu is the interface</h3>
    </div>
    <p style="padding:1.15rem;margin:0;line-height:1.6">Right-click the side of the configured activator block—a bookshelf by default—to inspect skills, spend knowledge, and manage adaptation levels.</p>
  </article>
  <article style="overflow:hidden;border:1px solid rgba(127,127,127,.25);border-radius:17px;background:rgba(127,127,127,.045)">
    <div style="padding:1.15rem;background:linear-gradient(135deg,#221f22,#441619);color:#fff">
      <span style="font-size:.75rem;font-weight:900;letter-spacing:.09em;color:#ff686c">USE</span>
      <h3 style="margin:.35rem 0 0">Passive where it should be</h3>
    </div>
    <p style="padding:1.15rem;margin:0;line-height:1.6">Many adaptations work immediately. Active abilities use gestures that fit the action: sprint, jump, sneak, block, draw, break, or interact.</p>
  </article>
</section>

## Choose the shortest path {#start-here}

<section aria-label="Adapt documentation paths" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:1rem;align-items:stretch">
  <article style="display:flex;flex-direction:column;padding:1.25rem;border:1px solid rgba(216,47,53,.34);border-radius:17px;background:linear-gradient(145deg,rgba(216,47,53,.12),rgba(216,47,53,.025))">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.09em;opacity:.72">PLAYERS</span>
    <h3 style="margin:.45rem 0 .5rem">Learn by doing</h3>
    <p style="margin:0 0 1rem;line-height:1.58;opacity:.78">Open the menu, understand the two budgets, then find the exact trigger for an adaptation.</p>
    <ol style="padding-left:1.2rem;line-height:1.75">
      <li><a href="/adapt/03-player-usage">Player usage</a></li>
      <li><a href="/adapt/02-concepts">Progression concepts</a></li>
      <li><a href="/adapt/10-skills-catalog">Skills catalog</a></li>
    </ol>
  </article>
  <article style="display:flex;flex-direction:column;padding:1.25rem;border:1px solid rgba(127,127,127,.27);border-radius:17px;background:rgba(127,127,127,.055)">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.09em;opacity:.65">SERVER OPERATORS</span>
    <h3 style="margin:.45rem 0 .5rem">Install with intent</h3>
    <p style="margin:0 0 1rem;line-height:1.58;opacity:.78">Install the jar, decide the permission model, tune progression, then verify protection behavior.</p>
    <ol style="padding-left:1.2rem;line-height:1.75">
      <li><a href="/adapt/01-installation-configuration">Installation & configuration</a></li>
      <li><a href="/adapt/04-commands-permissions">Commands & permissions</a></li>
      <li><a href="/adapt/40-operator-runbooks">Operator runbooks</a></li>
    </ol>
  </article>
  <article style="display:flex;flex-direction:column;padding:1.25rem;border:1px solid rgba(127,127,127,.27);border-radius:17px;background:rgba(127,127,127,.055)">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.09em;opacity:.65">PLUGIN DEVELOPERS</span>
    <h3 style="margin:.45rem 0 .5rem">Integrate without bypassing progression</h3>
    <p style="margin:0 0 1rem;line-height:1.58;opacity:.78">Query skills, deny or price ability use, register protectors, and listen for activation outcomes.</p>
    <ol style="padding-left:1.2rem;line-height:1.75">
      <li><a href="/adapt/41-api-getting-started">API setup</a></li>
      <li><a href="/adapt/43-api-ability-use-policy">Ability-use policy</a></li>
      <li><a href="/adapt/45-api-events">Events</a></li>
    </ol>
  </article>
</section>

## Operator snapshot {#operators}

<section aria-label="Adapt operator requirements" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:1rem">
  <article style="padding:1.25rem;border-radius:17px;background:#191719;color:#fff;box-shadow:inset 4px 0 0 #ef393e">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.09em;color:#ff686c">INSTALL</span>
    <h3 style="margin:.4rem 0 .65rem">One backend plugin jar</h3>
    <p style="margin:0;line-height:1.6;color:rgba(255,255,255,.77)">Place the shaded jar in <code style="color:#fff">plugins/</code> on each Paper, Purpur, or Folia backend. Adapt does not go on the proxy.</p>
    <div style="display:flex;gap:.45rem;flex-wrap:wrap;margin-top:1rem;font-size:.8rem">
      <span style="padding:.3rem .55rem;border-radius:999px;background:rgba(255,255,255,.08)">Bukkit API 26.1</span>
      <span style="padding:.3rem .55rem;border-radius:999px;background:rgba(255,255,255,.08)">Java 25</span>
      <span style="padding:.3rem .55rem;border-radius:999px;background:rgba(255,255,255,.08)">Folia supported</span>
    </div>
  </article>
  <article style="padding:1.25rem;border:1px solid rgba(127,127,127,.26);border-radius:17px;background:rgba(127,127,127,.055)">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.09em;opacity:.68">CONFIGURE</span>
    <h3 style="margin:.4rem 0 .65rem">Most gameplay settings hot-reload</h3>
    <p style="margin:0;line-height:1.6;opacity:.77">Adapt watches its root, skill, adaptation, and mutation TOML. Invalid edits are rejected while the active configuration keeps running.</p>
    <p style="margin:.8rem 0 0;font-size:.88rem"><strong>Restart for:</strong> SQL, Redis, metrics, update checks, and integration discovery.</p>
  </article>
  <article style="padding:1.25rem;border:1px solid rgba(127,127,127,.26);border-radius:17px;background:rgba(127,127,127,.055)">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.09em;opacity:.68">AUTHORIZE</span>
    <h3 style="margin:.4rem 0 .65rem">Commands are staff-gated</h3>
    <p style="margin:0;line-height:1.6;opacity:.77"><code>adapt.main</code> gates the entire command tree. Gameplay use nodes default to true, while administrative command nodes default to operators.</p>
    <p style="margin:.8rem 0 0;font-size:.88rem">Normal player progression does not require commands.</p>
  </article>
  <article style="padding:1.25rem;border:1px solid rgba(127,127,127,.26);border-radius:17px;background:rgba(127,127,127,.055)">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.09em;opacity:.68">EXPAND</span>
    <h3 style="margin:.4rem 0 .65rem">Mutations are separate and opt-in</h3>
    <p style="margin:0;line-height:1.6;opacity:.77">The late-game Mutation system starts disabled. It has two slots, domain requirements, switch cooldowns, and combat locking.</p>
    <p style="margin:.8rem 0 0"><a href="/adapt/34-mutations-overview">Review Mutations before enabling →</a></p>
  </article>
</section>

### Optional integrations

<section aria-label="Adapt integrations" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:.8rem">
  <article style="padding:1rem;border:1px solid rgba(127,127,127,.24);border-radius:13px;background:rgba(127,127,127,.045)">
    <strong style="display:block;margin-bottom:.45rem">Protection</strong>
    <span style="line-height:1.6;opacity:.75">WorldGuard, Factions, ChestProtect, Residence, GriefDefender, GriefPrevention, LockettePro</span>
  </article>
  <article style="padding:1rem;border:1px solid rgba(127,127,127,.24);border-radius:13px;background:rgba(127,127,127,.045)">
    <strong style="display:block;margin-bottom:.45rem">Economy & display</strong>
    <span style="line-height:1.6;opacity:.75">Vault pricing and refunds, plus PlaceholderAPI snapshots for scoreboards and interfaces</span>
  </article>
  <article style="padding:1rem;border:1px solid rgba(127,127,127,.24);border-radius:13px;background:rgba(127,127,127,.045)">
    <strong style="display:block;margin-bottom:.45rem">Gameplay bridges</strong>
    <span style="line-height:1.6;opacity:.75">HiddenOre, Iris, AdvancedChests, and MagicCosmetics alter only the relevant abilities</span>
  </article>
</section>

[Read the integration behavior and failure modes →](/adapt/09-integrations)

<section aria-label="Adapt support links" style="position:relative;overflow:hidden;margin-top:2rem;padding:clamp(1.4rem,4vw,2.4rem);border-radius:20px;background:linear-gradient(120deg,#76191d,#d82f35);color:#fff">
  <div aria-hidden="true" style="position:absolute;right:-55px;top:-80px;width:220px;height:220px;border:38px solid rgba(255,255,255,.07);transform:rotate(25deg)"></div>
  <div style="position:relative;display:flex;justify-content:space-between;align-items:center;gap:1.25rem;flex-wrap:wrap">
    <div style="max-width:650px">
      <span style="font-size:.74rem;font-weight:900;letter-spacing:.1em;color:rgba(255,255,255,.72)">READY FOR THE FULL REFERENCE?</span>
      <h2 style="margin:.4rem 0 .45rem;font-size:clamp(1.6rem,4vw,2.5rem)">Build a progression system players discover naturally.</h2>
      <p style="margin:0;color:rgba(255,255,255,.82)">Start with installation, browse every skill, or join the Volmit community for support.</p>
    </div>
    <div style="display:flex;gap:.65rem;flex-wrap:wrap">
      <a href="/adapt" style="padding:.75rem 1rem;border-radius:9px;background:#fff;color:#72161a;font-weight:800;text-decoration:none">Adapt documentation</a>
      <a href="https://volmitsoftware.com/discord" style="padding:.75rem 1rem;border:1px solid rgba(255,255,255,.4);border-radius:9px;color:#fff;font-weight:800;text-decoration:none">Discord</a>
      <a href="https://github.com/VolmitSoftware/Adapt" style="padding:.75rem 1rem;border:1px solid rgba(255,255,255,.4);border-radius:9px;color:#fff;font-weight:800;text-decoration:none">Source</a>
    </div>
  </div>
</section>

## Complete skill tree: TragOul {#skill-tree}

TragOul is Adapt's blood skill. Taking damage raises the line; surviving a hit
at four hearts or less pays bonus XP. Its fourteen adaptations trade pain,
bones, health, and risk for recovery, retaliation, curses, servants, and
corpse effects.

> Adaptations under a skill are independent purchases, not prerequisite
> branches. The four branches below organize the complete TragOul set by
> behavior; they do not add unlock order or requirements.
{.is-info}

<section aria-label="Complete TragOul skill tree" style="padding:clamp(1rem,3vw,1.6rem);border:1px solid rgba(127,127,127,.24);border-radius:22px;background:radial-gradient(circle at 50% 0,rgba(216,47,53,.12),transparent 30%),rgba(127,127,127,.025)">
  <div style="max-width:590px;margin:0 auto;padding:1.4rem;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:linear-gradient(135deg,#171416,#471518);color:#fff;text-align:center;box-shadow:0 16px 36px rgba(37,10,13,.2)">
    <span style="display:inline-block;padding:.27rem .58rem;border-radius:999px;background:rgba(255,255,255,.08);font-size:.7rem;font-weight:900;letter-spacing:.1em;color:rgba(255,255,255,.76)">SKILL ROOT</span>
    <h3 style="margin:.55rem 0 .35rem;font-size:clamp(1.7rem,5vw,2.6rem)">TragOul</h3>
    <p style="margin:0;line-height:1.55;color:rgba(255,255,255,.78)">Earn XP by taking damage and surviving it. Low-health survival pays extra.</p>
    <div style="display:flex;justify-content:center;gap:.45rem;flex-wrap:wrap;margin-top:.9rem;font-size:.78rem">
      <span style="padding:.3rem .55rem;border-radius:999px;background:rgba(239,57,62,.17)">14 adaptations</span>
      <span style="padding:.3rem .55rem;border-radius:999px;background:rgba(239,57,62,.17)">Icon: Crimson Roots</span>
      <span style="padding:.3rem .55rem;border-radius:999px;background:rgba(239,57,62,.17)">High-risk sustain</span>
    </div>
  </div>
  <div aria-hidden="true" style="width:2px;height:30px;margin:0 auto;background:linear-gradient(#d82f35,rgba(127,127,127,.38))"></div>
  <div aria-hidden="true" style="width:min(84%,900px);height:2px;margin:0 auto 1rem;background:linear-gradient(90deg,transparent,rgba(216,47,53,.5) 10%,rgba(216,47,53,.5) 90%,transparent)"></div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:1rem">
    <article style="padding:1rem;border-top:4px solid #d82f35;border-radius:15px;background:var(--v-background-base,rgba(127,127,127,.06));box-shadow:0 7px 20px rgba(0,0,0,.06)">
      <div style="display:flex;align-items:center;gap:.65rem;margin-bottom:.8rem">
        <span aria-hidden="true" style="display:grid;place-items:center;width:2rem;height:2rem;border-radius:9px;background:#d82f35;color:#fff">↩</span>
        <div><strong style="display:block">Retaliation</strong><small style="opacity:.66">Make attackers regret the hit</small></div>
      </div>
      <div style="display:grid;gap:.6rem">
        <div style="padding:.78rem;border:1px solid rgba(127,127,127,.22);border-radius:10px;background:rgba(127,127,127,.045)">
          <strong>Thorns</strong>
          <span style="display:block;margin-top:.22rem;font-size:.88rem;line-height:1.45;opacity:.74">Reflect flat damage to whoever hits you, including projectile shooters.</span>
        </div>
        <div style="padding:.78rem;border:1px solid rgba(127,127,127,.22);border-radius:10px;background:rgba(127,127,127,.045)">
          <strong>Globe of Pain</strong>
          <span style="display:block;margin-top:.22rem;font-size:.88rem;line-height:1.45;opacity:.74">Split a melee hit across the target and nearby valid mobs.</span>
        </div>
        <div style="padding:.78rem;border:1px solid rgba(127,127,127,.22);border-radius:10px;background:rgba(127,127,127,.045)">
          <strong>Curse of Frailty</strong>
          <span style="display:block;margin-top:.22rem;font-size:.88rem;line-height:1.45;opacity:.74">Attackers receive Weakness and, at higher progression, Slowness.</span>
        </div>
      </div>
    </article>

    <article style="padding:1rem;border-top:4px solid #2b9ea5;border-radius:15px;background:var(--v-background-base,rgba(127,127,127,.06));box-shadow:0 7px 20px rgba(0,0,0,.06)">
      <div style="display:flex;align-items:center;gap:.65rem;margin-bottom:.8rem">
        <span aria-hidden="true" style="display:grid;place-items:center;width:2rem;height:2rem;border-radius:9px;background:#237f85;color:#fff">+</span>
        <div><strong style="display:block">Sustain</strong><small style="opacity:.66">Live through the next exchange</small></div>
      </div>
      <div style="display:grid;gap:.6rem">
        <div style="padding:.78rem;border:1px solid rgba(127,127,127,.22);border-radius:10px;background:rgba(127,127,127,.045)">
          <strong>Will of Pain</strong>
          <span style="display:block;margin-top:.22rem;font-size:.88rem;line-height:1.45;opacity:.74">Drain a fixed amount from an attacker and heal the life it actually loses.</span>
        </div>
        <div style="padding:.78rem;border:1px solid rgba(127,127,127,.22);border-radius:10px;background:rgba(127,127,127,.045)">
          <strong>Soul Siphon</strong>
          <span style="display:block;margin-top:.22rem;font-size:.88rem;line-height:1.45;opacity:.74">Heal from credited damage, with a per-second recovery cap.</span>
        </div>
        <div style="padding:.78rem;border:1px solid rgba(127,127,127,.22);border-radius:10px;background:rgba(127,127,127,.045)">
          <strong>Blood Pact</strong>
          <span style="display:block;margin-top:.22rem;font-size:.88rem;line-height:1.45;opacity:.74">Large hits can grant a random bundle of temporary combat buffs.</span>
        </div>
        <div style="padding:.78rem;border:1px solid rgba(127,127,127,.22);border-radius:10px;background:rgba(127,127,127,.045)">
          <strong>Marrow Armor</strong>
          <span style="display:block;margin-top:.22rem;font-size:.88rem;line-height:1.45;opacity:.74">Consume one carried bone to absorb part of a sufficiently large hit.</span>
        </div>
        <div style="padding:.78rem;border:1px solid rgba(127,127,127,.22);border-radius:10px;background:rgba(127,127,127,.045)">
          <strong>Last Rites</strong>
          <span style="display:block;margin-top:.22rem;font-size:.88rem;line-height:1.45;opacity:.74">Refuse a lethal hit, remain at 1 HP, and briefly escape under spirit effects.</span>
        </div>
      </div>
    </article>

    <article style="padding:1rem;border-top:4px solid #8a858a;border-radius:15px;background:var(--v-background-base,rgba(127,127,127,.06));box-shadow:0 7px 20px rgba(0,0,0,.06)">
      <div style="display:flex;align-items:center;gap:.65rem;margin-bottom:.8rem">
        <span aria-hidden="true" style="display:grid;place-items:center;width:2rem;height:2rem;border-radius:9px;background:#4d494d;color:#fff">☠</span>
        <div><strong style="display:block">Deathcraft</strong><small style="opacity:.66">Turn kills into a battlefield engine</small></div>
      </div>
      <div style="display:grid;gap:.6rem">
        <div style="padding:.78rem;border:1px solid rgba(127,127,127,.22);border-radius:10px;background:rgba(127,127,127,.045)">
          <strong>Corpse Lances</strong>
          <span style="display:block;margin-top:.22rem;font-size:.88rem;line-height:1.45;opacity:.74">Launch a seeking lance from a kill; chains cost your own health on impact.</span>
        </div>
        <div style="padding:.78rem;border:1px solid rgba(127,127,127,.22);border-radius:10px;background:rgba(127,127,127,.045)">
          <strong>Bone Harvest</strong>
          <span style="display:block;margin-top:.22rem;font-size:.88rem;line-height:1.45;opacity:.74">Kills can drop collectible blood or bone globes with temporary benefits.</span>
        </div>
        <div style="padding:.78rem;border:1px solid rgba(127,127,127,.22);border-radius:10px;background:rgba(127,127,127,.045)">
          <strong>Corpse Explosion</strong>
          <span style="display:block;margin-top:.22rem;font-size:.88rem;line-height:1.45;opacity:.74">Detonate slain mobs into bounded novas that damage nearby hostiles.</span>
        </div>
        <div style="padding:.78rem;border:1px solid rgba(127,127,127,.22);border-radius:10px;background:rgba(127,127,127,.045)">
          <strong>Skeletal Servant</strong>
          <span style="display:block;margin-top:.22rem;font-size:.88rem;line-height:1.45;opacity:.74">Spend bones and maximum health to raise a temporary fighting pack.</span>
        </div>
      </div>
    </article>

    <article style="padding:1rem;border-top:4px solid #8d57a7;border-radius:15px;background:var(--v-background-base,rgba(127,127,127,.06));box-shadow:0 7px 20px rgba(0,0,0,.06)">
      <div style="display:flex;align-items:center;gap:.65rem;margin-bottom:.8rem">
        <span aria-hidden="true" style="display:grid;place-items:center;width:2rem;height:2rem;border-radius:9px;background:#714188;color:#fff">◉</span>
        <div><strong style="display:block">Affliction</strong><small style="opacity:.66">Track weakness and spread decay</small></div>
      </div>
      <div style="display:grid;gap:.6rem">
        <div style="padding:.78rem;border:1px solid rgba(127,127,127,.22);border-radius:10px;background:rgba(127,127,127,.045)">
          <strong>Death Sense</strong>
          <span style="display:block;margin-top:.22rem;font-size:.88rem;line-height:1.45;opacity:.74">See wounded nearby creatures through walls with health-colored outlines.</span>
        </div>
        <div style="padding:.78rem;border:1px solid rgba(127,127,127,.22);border-radius:10px;background:rgba(127,127,127,.045)">
          <strong>Plague Bearer</strong>
          <span style="display:block;margin-top:.22rem;font-size:.88rem;line-height:1.45;opacity:.74">Spread your poison or wither to nearby mobs when the marked target dies.</span>
        </div>
      </div>
    </article>
  </div>
</section>

### Example TragOul loadouts

These combinations illustrate how the nodes can work together. They are not
presets, and the number of levels a player can hold still depends on ability
power, server configuration, permissions, and adaptation costs.

<section aria-label="Example TragOul loadouts" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:1rem">
  <article style="display:flex;flex-direction:column;padding:1.15rem;border:1px solid rgba(43,158,165,.34);border-radius:15px;background:linear-gradient(145deg,rgba(43,158,165,.1),rgba(43,158,165,.025))">
    <span style="font-size:.72rem;font-weight:900;letter-spacing:.09em;opacity:.68">RECOVERY-FIRST</span>
    <h3 style="margin:.45rem 0 .55rem">The Survivor</h3>
    <p style="margin:0 0 .8rem;line-height:1.55;opacity:.76">Will of Pain restores life when an attacker connects. Soul Siphon rewards your counterattack. Last Rites creates one final escape window.</p>
    <div style="display:flex;gap:.35rem;flex-wrap:wrap;margin-top:auto">
      <span style="padding:.3rem .5rem;border-radius:999px;background:rgba(43,158,165,.14);font-size:.78rem">Will of Pain</span>
      <span style="padding:.3rem .5rem;border-radius:999px;background:rgba(43,158,165,.14);font-size:.78rem">Soul Siphon</span>
      <span style="padding:.3rem .5rem;border-radius:999px;background:rgba(43,158,165,.14);font-size:.78rem">Last Rites</span>
    </div>
  </article>
  <article style="display:flex;flex-direction:column;padding:1.15rem;border:1px solid rgba(138,133,138,.36);border-radius:15px;background:linear-gradient(145deg,rgba(138,133,138,.11),rgba(138,133,138,.025))">
    <span style="font-size:.72rem;font-weight:900;letter-spacing:.09em;opacity:.68">SUMMON & CASCADE</span>
    <h3 style="margin:.45rem 0 .55rem">The Bone Commander</h3>
    <p style="margin:0 0 .8rem;line-height:1.55;opacity:.76">Servants fight under your mark. Their kills can feed Corpse Explosion, while Bone Harvest turns the battlefield into collectible recovery and buffs.</p>
    <div style="display:flex;gap:.35rem;flex-wrap:wrap;margin-top:auto">
      <span style="padding:.3rem .5rem;border-radius:999px;background:rgba(138,133,138,.14);font-size:.78rem">Skeletal Servant</span>
      <span style="padding:.3rem .5rem;border-radius:999px;background:rgba(138,133,138,.14);font-size:.78rem">Corpse Explosion</span>
      <span style="padding:.3rem .5rem;border-radius:999px;background:rgba(138,133,138,.14);font-size:.78rem">Bone Harvest</span>
    </div>
  </article>
  <article style="display:flex;flex-direction:column;padding:1.15rem;border:1px solid rgba(216,47,53,.34);border-radius:15px;background:linear-gradient(145deg,rgba(216,47,53,.1),rgba(216,47,53,.025))">
    <span style="font-size:.72rem;font-weight:900;letter-spacing:.09em;opacity:.68">ABSORB & ANSWER</span>
    <h3 style="margin:.45rem 0 .55rem">The Retaliator</h3>
    <p style="margin:0 0 .8rem;line-height:1.55;opacity:.76">Marrow Armor softens large blows, Thorns answers the attacker, Curse of Frailty weakens it, and Blood Pact can turn pain into momentum.</p>
    <div style="display:flex;gap:.35rem;flex-wrap:wrap;margin-top:auto">
      <span style="padding:.3rem .5rem;border-radius:999px;background:rgba(216,47,53,.12);font-size:.78rem">Marrow Armor</span>
      <span style="padding:.3rem .5rem;border-radius:999px;background:rgba(216,47,53,.12);font-size:.78rem">Thorns</span>
      <span style="padding:.3rem .5rem;border-radius:999px;background:rgba(216,47,53,.12);font-size:.78rem">Curse of Frailty</span>
      <span style="padding:.3rem .5rem;border-radius:999px;background:rgba(216,47,53,.12);font-size:.78rem">Blood Pact</span>
    </div>
  </article>
</section>

### Detailed node example: Skeletal Servant

<section aria-label="Skeletal Servant detail" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));border:1px solid rgba(127,127,127,.25);border-radius:17px;overflow:hidden">
  <div style="padding:clamp(1.2rem,3vw,1.8rem);background:linear-gradient(145deg,#171416,#3a3135);color:#fff">
    <span style="display:inline-block;padding:.28rem .58rem;border-radius:999px;background:rgba(255,255,255,.08);font-size:.7rem;font-weight:900;letter-spacing:.09em">ACTIVE ADAPTATION</span>
    <h3 style="margin:.65rem 0 .45rem;font-size:1.55rem">Skeletal Servant</h3>
    <p style="margin:0;line-height:1.6;color:rgba(255,255,255,.76)">A clear example of Adapt's risk-and-reward design: the player gains a temporary fighting pack but commits resources and maximum health while it remains alive.</p>
  </div>
  <div style="padding:clamp(1.2rem,3vw,1.8rem);background:rgba(127,127,127,.045)">
    <dl style="display:grid;grid-template-columns:minmax(80px,.45fr) minmax(0,1.55fr);gap:.7rem 1rem;margin:0">
      <dt style="font-weight:800">Trigger</dt><dd style="margin:0">Sneak and right-click while holding bones.</dd>
      <dt style="font-weight:800">Resource</dt><dd style="margin:0">Consumes bones; the required amount falls with level.</dd>
      <dt style="font-weight:800">Capacity</dt><dd style="margin:0">One living servant per learned level.</dd>
      <dt style="font-weight:800">Tradeoff</dt><dd style="margin:0">Each living servant lowers maximum health to a configured floor.</dd>
      <dt style="font-weight:800">Inheritance</dt><dd style="margin:0">Servant attacks can use applicable TragOul effects such as siphon, curses, and plague.</dd>
      <dt style="font-weight:800">Lifecycle</dt><dd style="margin:0">Servants expire; summoning at the cap recycles the oldest by default.</dd>
    </dl>
  </div>
</section>

### How TragOul XP is earned

TragOul listens for damage to the player. A valid hit records the incoming raw
damage, then awards XP when the skill cooldown is ready.

<section aria-label="TragOul XP formula" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:.8rem">
  <article style="padding:1.1rem;border:1px solid rgba(216,47,53,.3);border-radius:14px;background:linear-gradient(145deg,rgba(216,47,53,.11),rgba(216,47,53,.025))">
    <span style="font-size:.72rem;font-weight:900;letter-spacing:.09em;opacity:.68">BASE AWARD</span>
    <strong style="display:block;margin:.45rem 0;font-size:1.25rem">raw damage × 4.8 XP</strong>
    <span style="display:block;line-height:1.5;opacity:.75">Paid at most once per 450 ms by default.</span>
  </article>
  <article style="padding:1.1rem;border:1px solid rgba(43,158,165,.32);border-radius:14px;background:linear-gradient(145deg,rgba(43,158,165,.1),rgba(43,158,165,.025))">
    <span style="font-size:.72rem;font-weight:900;letter-spacing:.09em;opacity:.68">SURVIVAL BONUS</span>
    <strong style="display:block;margin:.45rem 0;font-size:1.25rem">+28 XP</strong>
    <span style="display:block;line-height:1.5;opacity:.75">Added when the hit leaves the player alive at 8 health—four hearts—or less.</span>
  </article>
  <article style="padding:1.1rem;border:1px solid rgba(127,127,127,.26);border-radius:14px;background:rgba(127,127,127,.05)">
    <span style="font-size:.72rem;font-weight:900;letter-spacing:.09em;opacity:.68">NO AWARD</span>
    <strong style="display:block;margin:.45rem 0;font-size:1.05rem">Blocked or invalid hits</strong>
    <span style="display:block;line-height:1.5;opacity:.75">No credit while dead, invulnerable, or actively blocking the hit with a shield.</span>
  </article>
</section>

#### XP examples

| Situation | Calculation | Result |
|---|---:|---:|
| Valid hit for 2 raw damage | `2 × 4.8` | `9.6 XP` |
| Valid hit for 6 raw damage | `6 × 4.8` | `28.8 XP` |
| The same 6-damage hit leaves the player at four hearts | `(6 × 4.8) + 28` | `56.8 XP` |
| Another hit arrives before the 450 ms award cooldown expires | Stats still record the hit; no new award | `0 XP` |
| The player blocks the hit with a shield | Rejected before stats and XP | `0 XP` |
{.dense}

The base award uses raw event damage. The low-health check uses the health that
would remain after final mitigated damage. This distinction matters when armor,
Resistance, or another plugin changes the final hit.

#### Dedicated adaptation XP

Nine TragOul adaptations add their own event XP on top of the skill's
damage-received path.

| Adaptation | Config key | Default award |
|---|---|---:|
| Blood Pact | `xpPerProc` | `24` per proc |
| Bone Harvest | `xpPerGlobeSpawned` | `8` per globe spawned |
| Corpse Explosion | `xpPerMobHit` | `6` per mob damaged by the nova |
| Soul Siphon | `xpPerHeal` | `3` per siphon heal |
| Skeletal Servant | `xpPerSummon` | `30` per summon |
| Marrow Armor | `xpPerAbsorb` | `8` per absorbed hit |
| Curse of Frailty | `xpPerCurse` | `5` per curse applied |
| Plague Bearer | `xpPerInfection` | `6` per infected mob |
| Last Rites | `xpPerSave` | `120` per death defied |
{.dense}

### TragOul skill configuration

Adapt writes this file on first load:

```text
plugins/Adapt/skills/tragoul.toml
```

| Key | Default | Meaning |
|---|---:|---|
| `enabled` | `true` | Registers and runs the TragOul skill |
| `skillColor` | `"&b"` | Legacy color used in menus and messages |
| `showParticles` | `true` | Shows TragOul's skill-level damage and death effects |
| `cooldownDelay` | `450` | Milliseconds between damage-received XP awards |
| `damageReceivedXpMultiplier` | `4.8` | XP paid per point of raw incoming damage |
| `lowHealthSurvivalXP` | `28` | Bonus XP after surviving at four hearts or less |
| `challengeTragReward` | `500` | Base knowledge reward for TragOul skill milestones |
| `takeAwaySkillsOnDeath` | `false` | When enabled, death removes XP and lowers every learned TragOul adaptation by one level |
| `deathXpLoss` | `250` | XP removed by that optional death penalty, never below zero |
{.dense}

Example with the code defaults:

```toml
enabled = true
skillColor = "&b"
showParticles = true

cooldownDelay = 450
damageReceivedXpMultiplier = 4.8
lowHealthSurvivalXP = 28
challengeTragReward = 500

takeAwaySkillsOnDeath = false
deathXpLoss = 250
```

Valid skill and adaptation TOML edits hot-reload. A malformed edit is rejected
and the last valid in-memory configuration keeps running. Back up customized
files before using an administrative default/reset command.

#### Global settings that also affect TragOul

| File | Setting | Effect |
|---|---|---|
| `plugins/Adapt/adapt.toml` | `xpCurve` | Converts TragOul XP into skill level |
| `plugins/Adapt/adapt.toml` | `experienceMaxLevel` | Caps the skill line; the default is `1000` |
| `plugins/Adapt/adapt.toml` | `powerPerLevel` | Builds the shared ability-power budget; default `0.65` |
| `plugins/Adapt/adapt.toml` | `blacklistedWorlds` | Suppresses skill XP and adaptation effects in listed worlds |
| `plugins/Adapt/adapt.toml` | `allowAdaptationsInCreative` | Allows adaptation effects in Creative when enabled |
| `plugins/Adapt/adapt.toml` | `adaptationUsageConflicts` | Prevents configured adaptation pairs from running together |
{.dense}

The default `ADAPT_BALANCED` XP curve reaches skill level `L` at
`100 × L² + 1200 × L` XP. See
[Configuration Math](/adapt/05-configuration-math) before changing the curve
or multiplier: they compound.

### Death behavior

<section aria-label="TragOul death behavior" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:.8rem">
  <article style="padding:1rem;border:1px solid rgba(43,158,165,.3);border-radius:13px;background:rgba(43,158,165,.06)">
    <strong>Default</strong>
    <span style="display:block;margin-top:.35rem;line-height:1.5;opacity:.76">Death does not remove TragOul XP or adaptation levels.</span>
  </article>
  <article style="padding:1rem;border:1px solid rgba(216,47,53,.3);border-radius:13px;background:rgba(216,47,53,.06)">
    <strong>TragOul penalty enabled</strong>
    <span style="display:block;margin-top:.35rem;line-height:1.5;opacity:.76"><code>takeAwaySkillsOnDeath = true</code> removes up to <code>deathXpLoss</code> XP and lowers each learned TragOul adaptation one level.</span>
  </article>
  <article style="padding:1rem;border:1px solid rgba(127,127,127,.27);border-radius:13px;background:rgba(127,127,127,.05)">
    <strong>Global hardcore reset</strong>
    <span style="display:block;margin-top:.35rem;line-height:1.5;opacity:.76">Adapt's global hardcore reset takes precedence and wipes the player's complete skill data instead.</span>
  </article>
</section>

### Skill milestones

TragOul tracks damage survived and the number of hits received. The
`trag.hitsrecieved` spelling is intentional and matches the stored stat key.

| Advancement | Stored stat | Threshold | Knowledge reward |
|---|---|---:|---:|
| `challenge_trag_1k` | `trag.damage` | `1,000` | `500` |
| `challenge_trag_10k` | `trag.damage` | `10,000` | `1,000` |
| `challenge_trag_100k` | `trag.damage` | `100,000` | `2,500` |
| `challenge_trag_hits_500` | `trag.hitsrecieved` | `500` hits | `500` |
| `challenge_trag_hits_5k` | `trag.hitsrecieved` | `5,000` hits | `1,000` |
{.dense}

### Adaptation reference

Each adaptation has its own file under
`plugins/Adapt/adaptations/<id>.toml`. Every TragOul adaptation has five
levels. At default settings, one learned level also consumes one point from the
player's shared ability-power budget.

| Adaptation | ID | Main trigger | Initial / base / factor |
|---|---|---|---:|
| Thorns | `tragoul-thorns` | The player is struck | `4 / 4 / 0.72` |
| Globe of Pain | `tragoul-globe` | The player lands a melee hit near other mobs | `4 / 4 / 0.72` |
| Will of Pain | `tragoul-healing` | A living attacker damages the player | `4 / 4 / 0.72` |
| Corpse Lances | `tragoul-lance` | A credited kill starts a seeking chain | `4 / 4 / 0.72` |
| Blood Pact | `tragoul-blood-pact` | A sufficiently large incoming hit rolls a proc | `4 / 4 / 0.62` |
| Bone Harvest | `tragoul-bone-harvest` | A credited kill can spawn a collectible globe | `4 / 4 / 0.72` |
| Corpse Explosion | `tragoul-corpse-explosion` | A credited kill starts a bounded nova | `4 / 4 / 0.72` |
| Soul Siphon | `tragoul-soul-siphon` | Credited final damage heals the player | `4 / 4 / 0.72` |
| Skeletal Servant | `tragoul-skeletal-servant` | Sneak-right-click with bones | `5 / 5 / 0.75` |
| Marrow Armor | `tragoul-marrow-armor` | A large hit while carrying bones | `4 / 4 / 0.72` |
| Curse of Frailty | `tragoul-curse-of-frailty` | An attacker damages the player | `4 / 4 / 0.72` |
| Death Sense | `tragoul-death-sense` | Passive scan of wounded nearby entities | `3 / 3 / 0.60` |
| Plague Bearer | `tragoul-plague-bearer` | A marked poisoned or withered mob dies | `4 / 4 / 0.72` |
| Last Rites | `tragoul-last-rites` | An incoming hit would be lethal | `6 / 6 / 0.85` |
{.dense}

The final column shows `initialCost / baseCost / costFactor`. Knowledge cost
for level `L` is `max(1, baseCost + baseCost × L × costFactor)`, with the
initial cost added when buying level 1. Buying several levels pays every step,
not only the target level.

#### Shared adaptation settings

Every `tragoul-*.toml` adaptation file also carries these common keys:

| Key | Purpose |
|---|---|
| `enabled` | Registers and allows this adaptation |
| `permanent` | Prevents normal unlearning when enabled |
| `showParticles` | Allows this adaptation's particle effects |
| `showSounds` | Allows this adaptation's sounds |
| `initialCost` | Extra knowledge charged for level 1 |
| `baseCost` | Starting value in the per-level knowledge formula |
| `costFactor` | Growth applied as levels rise |
| `maxLevel` | Highest purchasable level |
{.dense}

### Adaptation milestones

| Adaptation | Tracked achievement | Thresholds and rewards |
|---|---|---|
| Thorns | Damage reflected | `500 → 400`, `5,000 → 1,500`; one-off reflected kill |
| Globe of Pain | Mobs sharing damage | `1,000 → 400`; one-off five-target share |
| Will of Pain | Health stolen | `500 → 400`, `10,000 → 1,500` |
| Corpse Lances | Lances connected / lance kills | `200 → 400`; `100 kills → 1,000` |
| Blood Pact | Health sacrificed / empowered kills | `200 → 400`; `500 kills → 1,000`; one-off all-in kill |
| Bone Harvest | Globes collected | `500 → 300`, `5,000 → 1,000` |
| Corpse Explosion | Mobs detonated | `500 → 400`, `5,000 → 1,500` |
| Soul Siphon | Health siphoned | `500 → 400`, `10,000 → 1,500` |
| Skeletal Servant | Servants summoned | `50 → 400`, `500 → 1,500` |
| Marrow Armor | Damage absorbed | `500 → 400`, `5,000 → 1,500` |
| Curse of Frailty | Curses applied | `100 → 400`, `1,000 → 1,500` |
| Death Sense | Wounded prey sensed | `1,000 → 600` |
| Plague Bearer | Mobs infected | `100 → 400`, `1,000 → 1,500` |
| Last Rites | Deaths defied | `5 → 500`, `50 → 2,000` |
{.dense}

### Full tuning example: Skeletal Servant

Skeletal Servant shows the level of control available in a single adaptation
file:

```text
plugins/Adapt/adaptations/tragoul-skeletal-servant.toml
```

| Key | Default | Behavior |
|---|---:|---|
| `boneCostBase` | `8` | Bones required at the start of the level scale |
| `boneCostReduction` | `5` | Reduction at full level percent; final cost never below 1 |
| `durationTicksBase` | `400` | Base servant lifetime |
| `durationTicksFactor` | `800` | Lifetime added at full level percent |
| `cooldownMillisBase` | `10000` | Base summon cooldown |
| `cooldownMillisFactor` | `9000` | Cooldown removed at full level percent; final cooldown never below 1000 ms |
| `servantCapPerLevel` | `1.0` | Living servants allowed per learned level, hard-capped at 16 |
| `replaceOldestAtCap` | `true` | Recycles the oldest servant instead of rejecting a summon |
| `playerThreatWindowMillis` | `5000` | Time the last attacker or attacked target remains the pack's mark |
| `gearChancePerPiece` | `0.55` | Chance for each armor slot to receive gear |
| `enchantChanceBase` | `0.0` | Starting enchant chance |
| `enchantChanceFactor` | `0.45` | Enchant chance added at full level percent |
| `bowChance` | `0.3` | Chance to spawn with a bow instead of a sword |
| `healthBonusPerLevel` | `3.0` | Servant maximum-health points added per learned level |
| `attackBonusPerLevel` | `1.0` | Servant attack-damage points added per learned level |
| `retargetIntervalTicks` | `20` | Delay between retarget passes |
| `targetSearchRadius` | `12` | Hostile-mob search radius, capped at 24 |
| `xpPerSummon` | `30` | TragOul XP awarded per successful summon |
| `healthCostEnabled` | `true` | Enables owner maximum-health upkeep |
| `healthCostPerMinion` | `2.0` | Owner maximum-health points removed per living servant |
| `minimumOwnerMaxHealth` | `4.0` | Lowest maximum health the upkeep may leave |
{.dense}

Servants do not burn in daylight, drop no loot, and expire. Their gear scales
with level. They inherit applicable TragOul combat effects and route their kills
through Corpse Explosion. Creative mode skips the bone cost.

### Permissions and runtime gates

| Gate | Default behavior |
|---|---|
| Skill permission | `adapt.use.tragoul`, default true |
| Adaptation permission | `adapt.use.<id-without-hyphens>`, such as `adapt.use.tragoulthorns`, default true |
| Unset use node | Treated as allowed; explicitly set a node to false to deny it |
| Operator/debug bypass | Operators and players in Adapt debug mode bypass use checks |
| World | No XP or effects in `blacklistedWorlds` |
| Game mode | Effects refuse Spectator and, by default, Creative |
| Protection | Every registered protector must allow the action and location |
| API policy | Another plugin may deny use through Adapt's ability-use policy or cancellable event |
| Conflicts | A learned adaptation named in `adaptationUsageConflicts` blocks the configured pair |
| Profile readiness | An unsafe, unloaded, or retired player profile keeps Adapt inactive for that session |
{.dense}

Players normally open the skill from the bookshelf activator. `/adapt gui`
opens the same interface but requires `adapt.gui`, which defaults to operators.

### Troubleshooting

| Symptom | Check |
|---|---|
| Taking damage gives no TragOul XP | Confirm the skill is enabled, the world is not blacklisted, `adapt.use.tragoul` is not denied, the player is not invulnerable, and the hit was not blocked with a shield |
| Some hits count but do not pay XP | The 450 ms default award cooldown suppresses rapid payouts; damage and hit stats continue to accumulate |
| TragOul is absent from a new player's menu | With `guiShowAllSkills = false`, untouched skills stay hidden until the player earns XP, knowledge, or a level |
| An adaptation is learned but silent | Check both enable flags, the dynamic use node, game mode, world blacklist, protector result, configured conflicts, API policy, and profile readiness |
| Skeletal Servant will not summon | Sneak-right-click with bones, wait for cooldown, verify free capacity or `replaceOldestAtCap`, and confirm the player can pay the bone and health costs |
| A TOML edit appears ignored | Check the console for a rejected parse; Adapt keeps the previous valid snapshot when the new file is malformed |
| Integration-dependent behavior is missing | Restart after installing or enabling integrations; Adapt discovers optional plugins only while enabling |
{.dense}

> Numeric defaults above describe the audited Adapt build. Server owners can
> change every listed TOML value, disable the skill or an adaptation, and alter
> the global XP and power curves. Diagnose the server's live files rather than
> assuming defaults.
{.is-warning}

<p style="text-align:center;margin-top:1rem"><a href="/adapt/32-skill-tragoul" style="display:inline-block;padding:.72rem 1rem;border-radius:9px;background:#d82f35;color:#fff;font-weight:800;text-decoration:none">Open the complete per-adaptation mechanics and configuration →</a></p>

## Implementation notes {#implementation}

### Visual system

| Token | Value | Use |
|---|---|---|
| Adapt red | `#d82f35` | Primary actions, active steps, important numbers |
| Bright red | `#ef393e` | Decorative glow, borders, and large accents |
| Charcoal | `#191719` | Hero, operator cards, grounded contrast |
| Neutral surface | `rgba(127,127,127,.055)` | Theme-tolerant cards |
| Neutral border | `rgba(127,127,127,.25)` | Separation in light and dark themes |
| Large radius | `17px`–`26px` | Branded panels and hero |
{.dense}

The page uses the red and charcoal identity visible in Adapt's logo and store
art. Red is reserved for hierarchy and action; most cards remain neutral so a
long documentation page does not become visually exhausting.

### Responsive strategy

Every major multi-column region uses the same intrinsic grid pattern:

```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(245px, 1fr));
gap: 1rem;
```

Cards create as many columns as fit and stack when their minimum width no
longer fits. `clamp()` scales hero spacing and typography without a breakpoint.
Action rows use `flex-wrap`, and code-like values live inside elements that can
wrap instead of forcing horizontal page overflow.

### Optional scoped interaction CSS

Inline styles cannot define `:hover`, `:focus-visible`, or reduced-motion
preferences. The following can be placed in the Wiki.js CSS Override when the
page wrapper uses `class="adapt-showcase"`. The prefix keeps the rules from
changing unrelated documentation.

```css
.adapt-showcase {
  --adapt-red: #d82f35;
}

.adapt-showcase a {
  text-underline-offset: 0.18em;
}

.adapt-showcase a:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 3px;
  box-shadow: 0 0 0 6px #72161a;
}

@media (prefers-reduced-motion: no-preference) {
  .adapt-showcase .interactive-card {
    transition:
      transform 160ms ease,
      border-color 160ms ease,
      box-shadow 160ms ease;
  }

  .adapt-showcase .interactive-card:hover {
    transform: translateY(-3px);
    border-color: rgba(216, 47, 53, 0.55);
    box-shadow: 0 12px 28px rgba(36, 12, 14, 0.14);
  }
}
```

Hover is decorative only. Links, headings, descriptions, and actions remain
visible without it. The fixed dark panels declare their own text colors; all
neutral panels inherit the active Wiki.js theme color.

For additional individual components and alternative page structures, see the
[Wiki.js CSS & Layout Gallery](/wiki-css-layout-examples).
