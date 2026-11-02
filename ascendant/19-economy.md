---
title: Economy
description: Community > Economy manages server coin wallets, banking, daily and work earnings, quests, shop items, leaderboards and transaction history
published: true
date: 2026-11-01T00:00:00.000Z
tags: ascendant, discord, economy
editor: markdown
dateCreated: 2026-11-01T00:00:00.000Z
---

**Community > Economy** manages server coin wallets, banking, daily and work earnings, quests, shop items, leaderboards and transaction history. Economy starts disabled. Enable it and save settings before members can earn or spend coins.

## Currency and earnings

Currency has an editable name and symbol. The starting balance is granted once when a member first opens their own wallet or performs an economy action. Looking up another member or receiving an automatic reward does not grant the starting balance. Changing the starting balance does not reissue a grant already claimed by a wallet.

Daily claims default to 100 coins with a 24-hour cooldown. Consecutive claims add 10 coins per streak step, capped at 100 extra coins. Claim within twice the configured cooldown after the previous claim to keep the streak. Work defaults to a random integer from 20 to 50 coins with a one-hour cooldown. Each earning method can be switched off independently.

Balances cannot become negative or exceed 1,000,000,000,000 coins. Wallets and action receipts persist across restarts. Retrying the same action cannot issue its reward or charge a purchase twice.

## Member payments and gifts

Enable **Economy > Payments** to let members send wallet coins with `/economy pay user amount note`. The optional note makes a coin gift personal; this does not transfer inventory items or pets. Payments start disabled, with defaults of 1–10,000 coins per payment, 25,000 outgoing coins per UTC day, and a 60-second sender cooldown.

The sender gets a private Confirm/Cancel prompt that expires after two minutes. No coins move until confirmation. Only the sender can confirm; both people must still be server members, have completed membership screening, and be human accounts. Self-payments are rejected. Confirmation rechecks current settings, available wallet funds, recipient capacity, the daily limit and cooldown. Bank funds are never withdrawn automatically, and pending shop refunds retain their reserved wallet space.

Successful payments debit and credit both wallets in one transaction, preserve total wealth, and do not inflate lifetime earnings or spending. Retries cannot charge twice. Cancelled, expired and failed payments consume no daily allowance or cooldown. A sender may have up to five pending confirmations. Gift notes are limited to 200 characters and never ping members or roles.

Use `/economy history` to view your own recent transactions privately. Both sides of a payment have a shared payment ID, counterparty and note in their history; administrators can inspect them under **Economy > Transactions**. Pending confirmations survive ordinary restarts until expiry, but backup restoration cancels them. Completed transfers and their receipts survive restoration of an older snapshot.

## Banking

**Economy > Banking** enables deposits and configures interest. Banking and interest start disabled. Members use `/economy deposit amount:100` and `/economy withdraw amount:100` to move whole coins between their own wallet and bank. Use `amount:all` to move as many coins as fit in the destination. Each balance has a separate 1,000,000,000,000-coin limit. Pending shop refunds reserve wallet capacity, including during withdrawals. Transfers preserve total wealth and do not count as earnings or spending.

Shop purchases, pet costs and rewards continue to use the wallet. Bank funds must be withdrawn before spending. Withdrawals remain available while Banking or Economy is disabled, so pausing the module does not lock existing savings. Transfers require current server membership and completed membership screening; members cannot transfer another person's coins.

Optional interest defaults to 0.5% per day, capped at 100 coins per member per day, with at most seven days of catch-up after downtime. The rate accepts two decimal places from 0% to 10%, the daily cap accepts 0–1,000,000,000 coins, and catch-up accepts 1–7 days. Interest is rounded down to whole coins, credited to the bank, and counted once as earnings. Coin boosts do not increase interest.

Each account has 24-hour windows starting with its first deposit. Interest uses the lowest balance held during the full window. Additional coins deposited partway through a window become eligible at the next boundary; withdrawing coins reduces the current window's eligible balance. Paid interest can earn interest in the following window. Emptying and refilling the account starts a new window. A bot maintenance pass settles completed windows automatically; transfers also settle any due interest before moving coins. Balance and leaderboard reads do not issue payouts.

Changing banking settings or the Economy enabled switch settles completed windows under the previous settings, then starts fresh windows. Unrelated shop or pet edits do not restart banking windows. Disabled time earns no interest, and missed days beyond the catch-up limit are skipped. Payout clocks and transfer receipts persist across restarts.

Economy leaderboards rank total wealth by default, with Wallet and Bank alternatives. Every row shows both balances. Leveling's coin profile, rank and coin leaderboard also count wallet plus bank. Saving coins therefore does not lower a member's total-wealth rank.

## Leveling and games

Economy and Leveling share `LEVELING_FILE`, which defaults to `./data/leveling.sqlite`. There is one spendable wallet plus a separate bank balance. Leveling's coin display and leaderboard use total wealth.

Leveling's existing chat and voice coin reward rules determine milestone amounts. Both Economy and its leveling integration must be enabled for new payouts. Rewards and XP commit together. Milestones crossed while payouts are disabled do not pay retroactively; manual XP changes do not pay coins. Resetting XP or leaving the server does not erase a wallet or allow already claimed milestones to pay again.

Game rewards start disabled. When enabled, a completed win pays the configured amount, subject to a per-member cooldown shared across games and a daily coin cap. The defaults are 10 coins per win, a 60-second cooldown and 100 coins per UTC day. Draws, losses, cancellations and expired or interrupted sessions do not pay. Rewards use the same wallet as leveling, earnings and the shop.

## Daily and weekly quests

**Economy > Quests** configures up to 30 daily or weekly goals. Quests start disabled, with six editable starter definitions:

| Quest | Period | Goal | Coins | Member chat XP |
| --- | --- | --- | ---: | ---: |
| Daily conversation | Daily | Earn 100 chat XP | 25 | 25 |
| Daily victory | Daily | Win 1 game | 20 | 20 |
| Daily pet care | Daily | Feed a pet once | 15 | 15 |
| Weekly conversation | Weekly | Earn 1,000 chat XP | 150 | 100 |
| Weekly victories | Weekly | Win 5 games | 100 | 75 |
| Weekly adventures | Weekly | Claim 3 completed pet adventures | 100 | 75 |

Each definition has an enable switch, name, reset period, objective, target and rewards. Targets accept 1–1,000,000; coin rewards accept 0–1,000,000,000 and XP rewards accept 0–1,000,000. At least one reward must be positive. Duplicating a quest creates a new disabled definition with its own progress. Saving quest settings does not enable the activities they depend on.

Objectives count actual eligible actions while Economy, Quests and the definition are enabled:

- **Earn chat XP:** counts XP added to Leveling's shared chat track after its cooldowns and exclusions. Configured reaction XP and voice XP combined into that track can count; separate voice-track XP does not. Manual adjustments and quest rewards do not advance quests.
- **Win games:** counts completed wins even when direct game coin rewards are disabled or their cooldown or daily cap prevents a payout. Draws, losses, cancellations and expired sessions do not count.
- **Feed pets:** counts every successful direct feeding, including feeding a fully satisfied pet. Pet-food item uses count only when they restore needed fullness or happiness.
- **Train pets:** counts successful training sessions.
- **Claim completed pet adventures:** counts successful completed-adventure claims, not departures or timer expiry.

Members use `/economy quests` to view private progress, rewards, reset times and claim references. Optional `period` and `page` arguments filter and paginate the list. Claim a completed goal with `/economy quest claim quest_id:<reference>` using its current reference. References include the period, so an old command cannot claim a different day's reward.

Daily periods end at 00:00 UTC; weekly periods end on Monday at 00:00 UTC. Finish and claim before that boundary. Progress starts from eligible activity recorded while the feature is enabled; past activity is not backfilled. Each member's name, objective, period, target and rewards become fixed on their first progress for that quest. Later definition edits apply to that member's next period. Disabling or removing a definition stops further progress and new claims; disabling Quests or Economy stops all quest progress and new claims.

Coins go to the wallet and XP goes to the member's chat track, never the pet. Both rewards and the claim receipt commit together; retries cannot pay twice. A claim with XP requires Leveling to be enabled and room for the full XP reward. A full wallet also blocks the whole claim until room is available. Coin boosts do not increase quest rewards, and quest XP does not issue milestone coins or advance another quest. Successful claims appear in transaction history as quest rewards.

## Shop

The shop starts disabled and empty. Add items with a name, description, price, minimum chat level, purchase limit and optional lifetime stock cap. Item IDs remain stable when settings are edited, preserving purchase limits and history.

- **Item:** a collectible held in the member's inventory, with a configurable quantity limit.
- **Title:** a named collectible displayed in inventory. It does not change the member's Discord nickname.
- **Role:** grants an eligible Discord role. Each member can purchase a role or title once.
- **Pet:** adopts the selected pet type. Each member can own one of each type, even if several shop listings offer it. The purchase and adoption complete together.
- **Consumable:** one use restores a pet's fullness and happiness or grants pet XP. The member selects one of their own pets at home.
- **Boost:** one use activates a temporary percentage bonus to daily, work and game-win coins.

Consumable and boost purchase limits apply to the quantity currently owned, so members can buy replacements after using them. Stock remains a lifetime sales limit. Ordinary collectibles, roles, titles and pets retain their existing purchase rules.

Use `/economy inventory` to find an item ID, then `/economy use item_id` to consume one unit. Pet food and XP treats also require `pet_id`. Purchased units retain their original effect and are used oldest first, even if a listing is edited, disabled or removed. The inventory describes the next unit to be used. A failed use leaves inventory unchanged. Shop can be disabled while owned items remain usable; Economy must be enabled, and pet items also require Pets.

Coin boosts add the configured percentage to the base payout, rounding down to whole coins. One boost may be active per member; another cannot be consumed until it expires. `/economy boosts` shows the active bonus and expiry. Game rewards still respect their daily cap, including bonus coins. Boosts do not affect starting balances, administrator adjustments, refunds, leveling milestones, adventure rewards or passive pet income. Their expiry continues while the bot is offline or Economy is disabled.

The bot needs Manage Roles and its highest role must be above the shop role. Managed roles, privileged roles, economy management roles and reserved verification, support, beta, leveling and invite reward roles are excluded. The bot checks again before delivery. These checks follow Discord's [role hierarchy](https://github.com/discord/discord-api-docs/blob/main/developers/topics/permissions.mdx#permission-hierarchy).

A role purchase reserves coins and stock before delivery. Successful delivery completes the purchase; a confirmed failure refunds it. If the Discord outcome is uncertain, the purchase remains visible for reconciliation instead of issuing an automatic refund that could give away a role for free. Inventory shows purchased items; transaction and purchase history show the charge and delivery outcome.

The bot can confirm an uncertain purchase when it observes the member's role. Administrators can also resolve it from Transactions after checking Discord: select fulfilled or refunded, provide a reason, and type `resolve`. A refund restores coins and releases stock; it does not remove a Discord role. Resolution requests have durable receipts, so retrying after a lost connection cannot refund twice.

### Starter shop

Use **Add starter shop** in Shop to append ten editable offers to the current draft, then save settings. Existing items, edited starter prices and module switches stay unchanged. Repeating the action adds only missing starter IDs; it never replaces a listing or resets a purchase limit. If the additions would exceed the 100-item catalog limit, none are added. Review mode allows draft editing but cannot save.

| Offer | Coins | Effect | Maximum owned |
| --- | ---: | --- | ---: |
| Pet snack | 15 | +35 fullness, +15 happiness | 5 |
| Hearty pet meal | 30 | +80 fullness, +40 happiness | 3 |
| XP treat | 75 | +50 pet XP | 3 |
| Large XP treat | 200 | +150 pet XP | 2 |
| Coin boost (2 hours) | 40 | +25% daily, work and game coins | 1 |
| Coin boost (8 hours) | 120 | +50% daily, work and game coins | 1 |
| Trailblazer title | 500 | Inventory collectible | 1, once per member |
| Pet companion title | 1,500 | Inventory collectible | 1, once per member |
| Community regular role | 2,500 | Staff-selected Discord role | 1, once per member |
| Community veteran role | 7,500 | Staff-selected Discord role | 1, once per member |

All offers have unlimited server-wide stock and no chat-level requirement, so the starter catalog also works when Leveling is disabled. Ownership limits on usable items are inventory limits, not daily purchase limits; using an item frees room to buy another. A member can hold one of each boost, but can activate only one at a time. Titles appear in inventory, not on rank cards or Discord profiles.

Role offers start disabled with no role selected. Choose an eligible cosmetic role and enable each offer when ready. Disabled unbound role offers can be saved; enabled offers require a role. Every assigned role, including an assignment on a disabled offer, still passes the normal permission and reserved-role checks. Importing never creates or grants Discord roles.

Prices use the default 100-coin daily claim, 20–50 hourly work reward, 10-coin feeding and 20-coin/30-XP training as their baseline. Food costs more than direct feeding in exchange for use without a feeding cooldown; treats cost more per XP than training. With one first-streak daily claim and two 35-coin work claims, the two-hour boost adds 41 coins after rounding, covering its 40-coin price. Without a daily claim, it may not repay its cost. Longer boosts reward an active session, while cosmetic titles and roles give members longer savings goals.

Review prices if earning rates, adventure rewards or passive income change; the preset does not scale automatically. Pet items require an owned pet at home with Pets enabled. Add an adoption listing for an existing pet type if members do not already have a way to adopt. The preset does not enable Economy, Shop, Pets, training or passive earnings.

## Pets

Pets use the shared coin wallet. Configure them under **Community > Economy > Pets**, enable pets, and add a **Pet** reward in Shop with a price and pet type. Economy, Pets and Shop must all be enabled for adoption. Dog, Cat and Dragon types and editable adventures are provided as starting settings; no pet is added to the shop automatically.

Members feed pets to restore fullness and happiness and earn pet XP. Fullness and happiness range from 0 to 100 and decline over elapsed time at the configured hourly rates, including while the bot is offline. Pets never die. Feeding costs coins, has a per-pet cooldown, restores 35 fullness and 15 happiness up to 100, and grants the configured XP. Feeding is unavailable during an adventure.

Pet levels are separate from member chat and voice levels. Pet settings control XP per level and the maximum level. Level is one plus total pet XP divided by XP per level, rounded down and capped at the maximum level. Changing the curve changes displayed levels without deleting accumulated XP. Adventure minimum levels refer to the pet; shop minimum levels refer to the member's chat level.

Each pet can take one timed adventure at a time. Starting requires at least 20 fullness and 10 happiness, consumes those amounts, and charges the adventure's cost. The duration, reward and XP are fixed when it starts. Editing or removing an adventure later does not change that trip. Members claim completed adventures to receive coins and pet XP; no message is sent automatically when the timer finishes. Progress survives restarts, and retrying a claim cannot pay twice. If the whole reward cannot fit in the wallet, it remains waiting until the member makes room and claims again.

Disabling pets or Economy prevents new adoptions, feeds, training, pet-item uses and adventure starts. Members can still inspect owned pets and claim completed trips or previously accrued passive income. Removing or disabling a pet type prevents new purchases and new passive earnings without deleting pets already owned. Their saved identity and care remain available when pets are enabled.

### Training

Training starts disabled. Configure its coin cost, cooldown and XP under Pets. Defaults are 20 coins, one hour and 30 pet XP. `/economy pet train` requires a pet at home with at least 20 fullness and 10 happiness, consumes those amounts, charges the cost and grants XP together. The cooldown belongs to the pet and is separate from feeding. Training cannot run while an adventure is waiting to be claimed.

### Passive earnings

Passive earnings start disabled, and every pet type starts at zero coins per hour. Enable the feature and set rates for the types that should earn. The hourly rate is the type's base rate multiplied by `1 + (pet level - 1) * levelBonusPercent / 100`. The default level bonus is 5% per level above level one.

A pet earns only while it is at home, its type is enabled, Economy and Pets are enabled, passive earnings are enabled, and both fullness and happiness remain above zero. Accrual stops at the point either care value reaches zero. Adventures, including completed trips waiting for a claim, do not earn passive coins. Eligible offline time counts, up to the configured earning-hour cap since the previous collection; the default is 24 hours. Feeding, training and settings saves do not reset that cap.

Use `/economy pet collect` to move accrued whole coins into the wallet. Fractions carry forward, and the default collection cooldown is one hour per pet. Reads do not collect or restart the timer. Rate, level, care and enable-state changes settle earlier time under its earlier terms, so enabling a feature or increasing a rate cannot pay for past disabled time. Previously earned coins remain collectable while paused. If the whole payout cannot fit in the wallet, it remains available without consuming the cooldown.

The member lookup under **Economy > Transactions** shows usable inventory, active boosts, owned pets, training and collection cooldowns, passive income and adventure status. Member item-use and pet-care actions belong to their Discord commands.

## Discord commands

| Command | Purpose |
| --- | --- |
| `/economy balance` | Open your wallet or view a member's wallet, bank and total wealth. |
| `/economy deposit` | Move a positive whole-coin amount or `all` into your bank. |
| `/economy withdraw` | Move a positive whole-coin amount or `all` back to your wallet. |
| `/economy pay` | Confirm a payment to another member, optionally with a gift note. |
| `/economy history` | Privately view your own transaction history, with pagination. |
| `/economy daily` | Claim the available daily reward. |
| `/economy work` | Claim a work reward when its cooldown has elapsed. |
| `/economy quests` | Privately list quest progress, rewards and claim references; filter by period and page. |
| `/economy quest claim` | Claim a completed quest with its current period-bound `quest_id` reference. |
| `/economy shop` | Browse enabled shop items. |
| `/economy buy` | Purchase an item by its stable ID and confirm the quoted price. |
| `/economy inventory` | View purchased items and the next usable unit's effect. |
| `/economy use` | Consume one owned item, with a pet ID for food or XP treats. |
| `/economy boosts` | View your active coin boost and expiry. |
| `/economy leaderboard` | Rank total wealth, or choose `sort:wallet` or `sort:bank`. |
| `/economy adjust` | Add, remove or set coins with an audit reason. |
| `/economy pet list` | List your pets and their IDs. |
| `/economy pet status` | Inspect one pet's level, care needs and adventure. |
| `/economy pet feed` | Spend coins to feed a pet and earn pet XP. |
| `/economy pet train` | Spend coins and care points to train a pet. |
| `/economy pet collect` | Collect accrued passive pet income. |
| `/economy pet adventures` | List available trips, IDs, costs and level requirements. |
| `/economy pet adventure` | Send your pet on a timed trip. |
| `/economy pet claim` | Collect a completed trip's coins and pet XP. |

Administrative adjustments require server ownership, Manage Server or a configured economy management role. Dashboard access requires an owner or unrestricted administrator; changes also require configuration permission. Review mode blocks changes and Discord directory lookups. Adjustments remain available while Economy is disabled so administrators can correct balances before reopening it.

## History and recovery

Transactions record the member, amount, resulting balance, account, reason, actor and time. Interest entries show the resulting bank balance; deposits and withdrawals show the wallet change and resulting wallet balance. Settings saves and dashboard adjustments also appear in the dashboard activity log. Leaderboards rank current balances, not lifetime earnings.

The Leveling and Economy backup includes wallets, bank balances and interest clocks, inventory, purchased item effects, active boosts, pets, passive earnings, adventures, purchases, quest progress and durable receipts. Restore is an offline operation with both the bot and dashboard stopped. It disables new earning and spending until settings are reviewed; bank withdrawals, completed pet adventures and accrued passive income remain available. Discord roles are not rolled back. Restore preserves current economy records when applying an older snapshot so transfers, interest, spent coins, consumed items, boost activations, pet progress and completed rewards cannot be rolled back and claimed again. Current quest progress and claim receipts also survive restoration. For members who have claimed quest XP, restore retains their current chat XP so an older snapshot cannot remove that awarded XP while retaining its claim receipt.
