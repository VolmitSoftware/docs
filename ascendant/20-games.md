---
title: Games
description: Community > Games configures seven Discord games
published: true
date: 2026-11-01T00:00:00.000Z
tags: ascendant, discord, games
editor: markdown
dateCreated: 2026-11-01T00:00:00.000Z
---

**Community > Games** configures seven Discord games. Games starts disabled. An owner or unrestricted dashboard administrator with configuration access can edit and save settings. Review mode displays settings without saving changes.

## Commands

| Command | Play |
| --- | --- |
| `/game tictactoe opponent` | Accept a challenge, then alternate placing X and O. Three in a row wins. |
| `/game connect4 opponent` | Accept a challenge, then alternate dropping pieces into seven columns. Four in a row wins. |
| `/game game2048` | Use direction buttons to slide and combine tiles on a four-by-four board. Reach 2048. |
| `/game rps opponent` | Accept a challenge and choose rock, paper or scissors. Choices remain hidden until both players choose. |
| `/game language` | Identify the language of a phrase using answer buttons. Phrases come from a bundled question set. |
| `/game hangman` | Open **Enter guess** to submit a letter or the full phrase. |
| `/game wordle` | Open **Enter guess** to submit a word matching the answer's length. |
| `/game stats [member] [game] [scope]` | Inspect your statistics or another member's. Scope is all-time (default) or current season; game is optional. |
| `/game leaderboard [game] [scope]` | Show the top 10 members across all games or one game, for all-time or the current season. |
| `/game season` | Show the current season and its dates. |

Commands are registered in the configured Discord server when the bot starts. Games uses interaction buttons and forms; it does not need the Message Content intent. Winning can award coins when [Economy game rewards](/ascendant/19-economy) are enabled. Game results do not award XP.

Economy controls the payout per win, reward cooldown and daily limit. Draws, losses, cancellations, expired games and interrupted sessions do not pay. A completed win has a durable transaction receipt so a repeated interaction cannot pay twice. Cooldowns and daily limits apply across games for each member.

## Settings

The Games switch controls the whole feature. Each game also has its own switch and total playing time. Changing settings ends existing games and pending challenges; start new games after saving.

| Setting | Default | Range |
| --- | --- | --- |
| Challenge timeout | 1 minute | 10 seconds to 10 minutes |
| Maximum sessions per server | 50 | 1 to 100 |
| Tic tac toe | 5 minutes | 10 seconds to 1 hour |
| Connect Four | 10 minutes | 10 seconds to 1 hour |
| 2048 | 15 minutes | 10 seconds to 1 hour |
| Rock paper scissors | 5 minutes | 10 seconds to 1 hour |
| Guess language | 1 minute | 10 seconds to 1 hour |
| Hangman and Wordle | 5 minutes each | 10 seconds to 1 hour |

The multiplayer playing timer begins when the challenged member accepts. Moves do not extend it. Pending challenges and active games both count toward the server limit. Each member can participate in one pending or active game at a time. Only the challenged member can accept or decline; the initiating member can cancel. Bot accounts and self-challenges are rejected.

## Word lists

Hangman and Wordle accept one word per line, with up to 1,000 entries per list. Blank lines and duplicate entries are removed. Words are normalized to lowercase and Unicode NFC. Each entry needs 2 to 20 letters, counted as displayed characters rather than UTF-16 code units. Hangman permits spaces between words; Wordle does not. Digits and punctuation are rejected.

Hangman reveals spaces automatically. Wordle's answer length follows the selected word; guesses are not restricted to the saved answer list. Wordle accounts for repeated letters when marking exact and misplaced matches.

## Statistics and seasons

Completed rounds record each participant's win, loss or draw, total games played, win percentage and best completed 2048 score. Pending challenges, cancellations, timeouts, and interrupted rounds do not count. Statistics begin with this feature; earlier games cannot be reconstructed. Statistics remain readable when playing is disabled.

In **Community > Games > Stats & seasons**, choose all-time, current season or a saved season and optionally filter by game. The dashboard shows up to 50 members. Rankings sort by points, then wins, then member ID for a stable tie order. A win earns 3 ranking points, a draw earns 1 and a loss earns 0. These points are not spendable coins or XP; game reward and quest settings continue to control those rewards separately.

An owner or unrestricted administrator can start one season at a time with a name and duration of 1–365 days (30 by default). The season ends at its scheduled time, including while the bot is offline. Closing early requires confirmation. Closed seasons retain their standings, and starting a new season does not reset all-time history. The archive selector lists the latest 100 seasons. Seasons do not automatically restart or distribute prizes.

A result belongs to the season active when it is saved, provided its completion time falls inside that season. Games started before a season can count if they finish during it. Delayed results received after a season closes count only toward all-time totals, keeping closed standings unchanged. Repeated settlement attempts cannot count the same game twice.

## Storage and recovery

`GAMES_FILE` defaults to `./data/games.json`; the dashboard and bot must use the same path. Settings saves check their revision to prevent overwriting another administrator's changes. Encrypted application backups include settings and word lists. Restoring a backup disables Games until an administrator reviews and enables it.

Game sessions exist only in memory. Restarting or disconnecting the bot ends them; old controls cannot resume a game. Expired and completed sessions release their slots. Buttons are bound to the original message and participating members, and stale board versions cannot apply another move.

`GAMES_STATS_FILE` defaults to `./data/game-stats.sqlite`. Both services must share this path as well as the settings file. Completed results and seasons survive restarts. Encrypted backups include this database; SQLite restoration requires the bot and dashboard to be stopped. Recovery preserves current result receipts and season standings, retains backup-only results in all-time history, and closes active seasons. Review restored standings before starting another season.
