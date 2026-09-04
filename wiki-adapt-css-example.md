---
title: "Adapt CSS Page Example"
description: "A compact Wiki.js landing page example using Adapt content"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "meta, wikijs, css, layouts, adapt, examples"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

This page shows how a plugin landing page can combine a clear introduction,
task links, media, and one feature example. Use the
[Adapt documentation](/adapt) for the current gameplay and configuration
reference.

<section aria-label="Adapt introduction" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:clamp(1.5rem,5vw,4rem);align-items:center;padding:clamp(1.5rem,5vw,3.5rem);border:1px solid rgba(255,255,255,.14);background:linear-gradient(135deg,#171113,#48181c);color:#fff">
  <div>
    <p style="margin:0;color:#ff9aa0;font-size:.75rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase">Adapt</p>
    <h2 style="margin:.35rem 0 .8rem;font-size:clamp(2.4rem,8vw,5rem);line-height:.95">Skills grow as you play.</h2>
    <p style="margin:0;max-width:58ch;color:rgba(255,255,255,.84)">Earn skill experience through normal Minecraft activities, then spend knowledge on the adaptations that suit your play style.</p>
    <nav aria-label="Adapt example actions" style="display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1.3rem">
      <a href="/adapt/03-player-usage" style="padding:.7rem .9rem;border:1px solid #d7353c;background:#d7353c;color:#fff!important;text-decoration:none">Player guide</a>
      <a href="/adapt/01-installation-configuration" style="padding:.7rem .9rem;border:1px solid rgba(255,255,255,.5);color:#fff!important;text-decoration:none">Install Adapt</a>
    </nav>
  </div>
  <div role="img" aria-label="Placeholder for an Adapt skill menu video" style="display:grid;min-height:210px;place-content:center;gap:.35rem;padding:1rem;border:1px dashed rgba(255,255,255,.55);text-align:center">
    <strong>Skill menu video goes here</strong>
    <span style="color:rgba(255,255,255,.72)">Show XP being earned, then open the skill menu and buy an adaptation.</span>
  </div>
</section>

## How progression works

<section aria-label="Adapt progression" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:1rem">
  <article style="padding:1rem;border:1px solid rgba(127,127,127,.35)"><strong>1. Play</strong><p style="margin:.45rem 0 0">Actions such as mining, building, combat, movement, and enchanting raise related skills.</p></article>
  <article style="padding:1rem;border:1px solid rgba(127,127,127,.35)"><strong>2. Earn knowledge</strong><p style="margin:.45rem 0 0">Skill milestones provide knowledge, the currency used for adaptations.</p></article>
  <article style="padding:1rem;border:1px solid rgba(127,127,127,.35)"><strong>3. Choose adaptations</strong><p style="margin:.45rem 0 0">Spend knowledge on passive and active abilities, then change the build as needed.</p></article>
</section>

## Find what you need

- [Player guide *Open the menu, learn adaptations, and manage a build*](/adapt/03-player-usage)
- [Installation and configuration *Set up Adapt and change server-wide rules*](/adapt/01-installation-configuration)
- [Skills *Browse every skill and its adaptations*](/adapt/10-skills-catalog)
- [Commands and permissions *Control access for players and staff*](/adapt/04-commands-permissions)
- [Troubleshooting *Check common setup and gameplay problems*](/adapt/40-operator-runbooks)
{.links-list}

## TragOul skill tree example {#skill-tree}

TragOul gains XP when the player takes damage. Its 14 adaptations cover
retaliation, healing, curses, corpse effects, and summoned servants.

> The groups below organize the page. TragOul adaptations are separate
> purchases and do not have prerequisite branches.
{.is-info}

<section aria-label="TragOul skill tree" style="padding:clamp(1rem,3vw,1.5rem);border:1px solid rgba(127,127,127,.35)">
  <div style="max-width:560px;margin:0 auto 1rem;padding:1.1rem;border:1px solid #9b3036;background:#36161a;color:#fff;text-align:center">
    <p style="margin:0;color:#ffadb1;font-size:.72rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase">Skill root</p>
    <h3 style="margin:.3rem 0">TragOul</h3>
    <p style="margin:0;color:rgba(255,255,255,.78)">Survive damage to earn XP, with extra XP after a low-health hit.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:1rem">
    <article style="padding:1rem;border:1px solid rgba(127,127,127,.35)">
      <h3 style="margin:0 0 .65rem">Retaliation</h3>
      <p><strong>Thorns</strong><br>Reflect damage to the attacker.</p>
      <p><strong>Globe of Pain</strong><br>Share a melee hit with nearby valid mobs.</p>
      <p><strong>Curse of Frailty</strong><br>Apply Weakness and later Slowness to attackers.</p>
    </article>
    <article style="padding:1rem;border:1px solid rgba(127,127,127,.35)">
      <h3 style="margin:0 0 .65rem">Sustain</h3>
      <p><strong>Will of Pain</strong><br>Drain life from an attacker.</p>
      <p><strong>Soul Siphon</strong><br>Heal from credited damage.</p>
      <p><strong>Blood Pact</strong><br>Turn some large hits into temporary buffs.</p>
      <p><strong>Marrow Armor</strong><br>Spend a bone to absorb part of a large hit.</p>
      <p><strong>Last Rites</strong><br>Survive a lethal hit at one health.</p>
    </article>
    <article style="padding:1rem;border:1px solid rgba(127,127,127,.35)">
      <h3 style="margin:0 0 .65rem">Deathcraft</h3>
      <p><strong>Corpse Lances</strong><br>Launch a seeking lance from a kill.</p>
      <p><strong>Bone Harvest</strong><br>Let kills drop temporary recovery or buff globes.</p>
      <p><strong>Corpse Explosion</strong><br>Damage nearby hostiles when a mob dies.</p>
      <p><strong>Skeletal Servant</strong><br>Spend bones and maximum health on temporary servants.</p>
    </article>
    <article style="padding:1rem;border:1px solid rgba(127,127,127,.35)">
      <h3 style="margin:0 0 .65rem">Affliction</h3>
      <p><strong>Death Sense</strong><br>Outline wounded nearby creatures.</p>
      <p><strong>Plague Bearer</strong><br>Spread poison or wither when a marked mob dies.</p>
    </article>
  </div>
</section>

### XP and configuration

The default skill award uses raw incoming damage and can run once every
450 milliseconds. It grants `4.8 XP` per point of raw damage, plus `28 XP`
when the final hit leaves the player alive at four hearts or less.

TragOul's skill file is:

~~~text
plugins/Adapt/skills/tragoul.toml
~~~

~~~toml
enabled = true
cooldownDelay = 450
damageReceivedXpMultiplier = 4.8
lowHealthSurvivalXP = 28
takeAwaySkillsOnDeath = false
deathXpLoss = 250
~~~

Each adaptation has a separate file under
`plugins/Adapt/adaptations/`. Those files control costs, levels, effects,
cooldowns, sounds, particles, and any XP earned by that adaptation. See the
[complete TragOul reference](/adapt/32-skill-tragoul) before changing live
values.

### Media plan

<section aria-label="Adapt media placeholders" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:1rem">
  <div role="img" aria-label="Placeholder for a TragOul skill menu image" style="display:grid;min-height:150px;place-content:center;gap:.3rem;padding:1rem;border:1px dashed rgba(127,127,127,.7);text-align:center"><strong>TragOul menu image goes here</strong><span style="opacity:.7">Show the skill level and XP bar.</span></div>
  <div role="img" aria-label="Placeholder for an adaptation purchase animation" style="display:grid;min-height:150px;place-content:center;gap:.3rem;padding:1rem;border:1px dashed rgba(127,127,127,.7);text-align:center"><strong>Adaptation purchase GIF goes here</strong><span style="opacity:.7">Show a node being learned.</span></div>
  <div role="img" aria-label="Placeholder for Skeletal Servant gameplay" style="display:grid;min-height:150px;place-content:center;gap:.3rem;padding:1rem;border:1px dashed rgba(127,127,127,.7);text-align:center"><strong>Skeletal Servant video goes here</strong><span style="opacity:.7">Show summoning, targeting, and expiry.</span></div>
</section>

## Layout notes

This example uses one responsive grid rule throughout:

~~~css
grid-template-columns:
  repeat(auto-fit, minmax(min(100%, 230px), 1fr));
~~~

`auto-fit` uses available space, and the inner `min()` keeps the cards from
overflowing a narrow screen. The page uses square borders, short sections, and
plain media placeholders so the screenshots and gameplay remain the focus.

See [Wiki.js CSS layouts](/wiki-css-layout-examples) for the reusable
stylesheet and accessibility checks.
