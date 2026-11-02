---
title: Pet equipment and cosmetics
description: Buy and equip permanent accessories and appearances for economy pets
published: true
date: 2026-10-28T00:00:00.000Z
tags: ascendant, economy, pets
editor: markdown
dateCreated: 2026-10-28T00:00:00.000Z
---

Pets can wear one accessory and one cosmetic at a time. Accessories can increase adventure coins and pet XP. Cosmetics change the displayed pet appearance and have no reward effect.

## Buy and equip

Buy an enabled offer with `/economy buy`, then use `/economy pet equip` to choose an owned pet and item. Use `/economy pet unequip` to clear either slot. Equipment stays in your inventory and can be reused. One purchased copy can be equipped on only one pet at a time.

Pets must be home before changing either slot. A finished adventure must be claimed first. Each accessory and cosmetic has a minimum pet level; a shop offer can also require a member level before purchase.

The pet list and featured pet on a [member profile](/ascendant/02-member-profiles) show the equipped appearance and accessory. Profile visibility rules still apply.

## Configure offers

Open **Economy → Shop** and choose a pet equipment or pet cosmetic item. Set its price, member limit, optional stock limit and level requirements before enabling it. Equipment has separate adventure coin and XP bonus percentages, each limited to 25%. Cosmetics have an appearance name and emoji.

Purchased items keep the settings they had at purchase. Editing or removing an offer does not rewrite an owned item's effects. Adventure rewards include the equipped bonus when the adventure starts and keep that amount until claim. Equipment does not increase passive earnings or stack with another accessory.

If a settings change lowers the pet's effective level below an accessory's requirement, its bonus stops applying to new adventures until the pet qualifies again. An adventure can pay at most 1,000,000,000 coins and 1,000,000 pet XP, including bonuses. A full wallet leaves the completed reward waiting for a later claim.

## Starter offers

The starter shop adds these offers to the local settings draft. Review and save the draft to make them available. Each offer permits one lifetime purchase per member and has no server-wide stock limit.

| Offer | Price | Pet level | Effect |
| --- | ---: | ---: | --- |
| Trail satchel | 750 | 3 | 10% more adventure coins |
| Training bell | 600 | 3 | 15% more adventure pet XP |
| Explorer harness | 2,000 | 10 | 15% more adventure coins and pet XP |
| Meadow ribbon | 150 | 1 | Cosmetic appearance |
| Summit crown | 1,000 | 10 | Cosmetic appearance |

These prices assume the default earnings and adventure rewards. Changing those values can change how quickly an accessory pays for itself. Bonus amounts round down to whole coins or XP.

## Recovery

Pet slots and owned item records are included in economy backups. Recovery checks that equipped items belong to the pet's owner and that a purchased copy has not been equipped more than once. Existing economy recovery rules preserve current transaction and reward records when restoring an older backup.
