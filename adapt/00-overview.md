---
title: "Overview"
description: "Adapt skills, knowledge, adaptations, and ability power"
published: true
date: 2026-09-28T22:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt tracks 23 skills. Skill XP produces a level and knowledge for that skill. Knowledge buys adaptation levels in that skill only. Those levels spend account-wide ability power, which comes from master level.

| System | Role |
|---|---|
| Skills | XP from the activity on that skill's page. File: `skills/<id>.toml` |
| Knowledge | Spent only inside the skill that awarded it |
| Adaptations | Level 0 is unlearned. File: `adaptations/<id>.toml` |
| Master level | One curve over master XP from skill level-ups |
| Ability power | `floor(masterLevel * powerPerLevel)`, plus any region bonus. Each learned level costs 1. Region grants cost 0 |

Rules and formulas are in [Concepts](/adapt/02-concepts) and [Configuration math](/adapt/05-configuration-math). Files and keys are in [Installation and configuration](/adapt/01-installation-configuration). Every skill is listed in the [Skills catalog](/adapt/10-skills-catalog).
