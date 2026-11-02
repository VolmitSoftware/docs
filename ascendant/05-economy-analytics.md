---
title: Economy analytics
description: Compare coin creation, spending, shop demand and the current distribution of wealth
published: true
date: 2026-10-28T00:00:00.000Z
tags: ascendant, discord, economy, analytics
editor: markdown
dateCreated: 2026-10-28T00:00:00.000Z
---

## Open the report

Open **Economy > Analytics** as an owner or unrestricted administrator with dashboard view access. Choose 7, 30, 90 or 365 days and an optional end date, then select **Load analytics**. Dates use UTC; the current day is incomplete. Reading the report does not award or settle coins.

## Understand the totals

| Total | Includes |
| --- | --- |
| Coins created | Starting wallets, daily and work claims, game wins, leveling rewards, quests, achievements, pet adventure claims, pet passive income and bank interest. |
| Coins spent | Shop purchase reservations, pet feeding, adventure costs and training. |
| Purchase refunds | Coins returned after a purchase is refunded. |
| Staff adjustments | Additions and removals made by staff, shown as a signed net amount. |
| Imported coins | Historical balances imported from the earlier leveling system. |
| Other changes | Any ledger kinds that do not fit the current classifications. |
| Net currency change | Creation minus spending, plus refunds, adjustments, imports and other changes. |

Deposits, withdrawals and member payments move existing coins. They appear in the source breakdown but do not change net currency creation. An outstanding role purchase counts as spending while its funds are reserved; a later refund appears on the refund date.

## Wealth and shop demand

The wealth section combines wallet and bank coins for each recorded wallet. It shows total supply, median wealth, balance bands and the share owned by the richest ten percent of wallets. The group size rounds up, so a server with fewer than ten wallets shows the richest single wallet's share. Zero supply has no concentration percentage.

Wealth is a current snapshot, even when a historical transaction period is selected. The report contains aggregate numbers rather than member names or IDs. Stored totals are returned as decimal strings to avoid rounding large coin sums.

Shop demand groups purchases created in the selected period by item, purchased name and current fulfillment status. It displays up to 100 groups, ordered by purchase count. Old purchases retain their original name and price. Refunded and unresolved purchases remain visible so they are not confused with fulfilled demand.

Expand **Daily totals and coverage** to inspect individual UTC days and the first retained ledger timestamp. Empty days are zero-filled. The report cannot reconstruct transactions from before ledger tracking began.

Compare routine rewards with fulfilled shop spending over several periods before changing prices. Staff corrections and one-time imports are separate so they do not disguise the normal earning rate.
