---
title: Applications
description: Configure private staff, tester and partner application forms and review submissions
published: true
date: 2026-10-28T00:00:00.000Z
tags: ascendant, discord, applications
editor: markdown
dateCreated: 2026-10-28T00:00:00.000Z
---

## Open applications

In **Community > Applications > Application forms**, configure the Staff, Tester and Partner forms. Applications start disabled, and each form starts closed.

1. Set the form name and description. Explain the purpose and what applicants should include; avoid requesting passwords, credentials or other secrets.
2. Add one to five questions. Written answers support up to 1,000 characters. Choice questions offer two to ten distinct options. Questions can be required or optional and reordered.
3. Choose reviewer roles and optional applicant roles using comma-separated Discord role IDs. A member needs any one of the configured applicant roles; an empty list allows eligible members to apply.
4. Set the submission cooldown and maximum pending applications per member for this form. Defaults are 168 hours and one pending application.
5. Optionally choose an acceptance role and enable decision DMs.
6. Enable applications, open the relevant forms and save. If the Applications feature is disabled in **Administration > Modules**, enable it there too.

Closing a form stops new submissions while allowing reviewers to finish existing applications. A form changed while a member is filling it out must be reopened before submission.

## Member commands

| Command | Use |
| --- | --- |
| `/apply submit type:<staff\|tester\|partner>` | Open a private application form. |
| `/apply status [page]` | See your application status, ID and decision reason. |
| `/apply withdraw id:<application-id>` | Confirm withdrawal of one of your pending applications. |

Applicants must be current human members of the configured server and complete Discord rules screening. Each successful submission records its form's question labels alongside the answers. A later form edit does not rewrite submitted answers.

The cooldown runs from the submission time. Withdrawing an application does not clear it. Forms and confirmation controls expire after ten minutes or when the bot restarts; reopen the command when necessary.

## Review applications

Owners and unrestricted dashboard administrators use **Community > Applications > Review queue**. Filter by form and status, search by applicant name, Discord ID or application ID, and select a record to read its answers.

Discord administrators and members with a form's reviewer role use `/apply review` to list pending applications they can review. Add `id:<application-id>` to view answers. The `page` option selects queue pages when no ID is supplied, or answer and private-note pages when an ID is supplied.

| Review action | Behavior |
| --- | --- |
| `view` | Read the answers and recorded outcome privately. |
| `claim` | Assign the application to yourself. |
| `release` | Release your claim; administrators can release another reviewer's claim. |
| `note` | Add an internal reviewer note. |
| `accept` | Record acceptance with a reason visible to the applicant. |
| `decline` | Record rejection with a reason visible to the applicant. |

Reviewers cannot review their own applications. A claimed application must be released before another reviewer decides it. Accepted, declined and withdrawn applications are closed. If another reviewer or administrator changes the record or decision settings, reload before confirming a decision.

**Private reviewer notes** are visible only to authorized reviewers. **Decision reasons** are visible through `/apply status` and included in the optional decision DM. Keep internal discussion out of decision reasons.

## Roles and notifications

An accepted application can grant one configured Discord role. The role must be unmanaged, below the bot's highest role and free of moderation or server-management permissions. The bot needs **Manage Roles**. Assign privileged staff roles separately after review.

Acceptance does not grant dashboard or publishing access. Manage those permissions separately in **Administration > Staff access**.

Dashboard reviewers need publish permission when a decision grants a role or sends a DM. Decision notifications start off. A recorded decision remains valid if Discord cannot confirm a role grant or message; inspect the delivery status and Discord before taking further action. Unconfirmed effects are not automatically retried.

## Retention and storage

Closed application retention defaults to 90 days and is configurable from 7 to 365 days. Expired closed records disappear from reads; their answers and notes are physically removed on a subsequent form save or submission. Pending applications remain available for review. Minimal duplicate-submission and cooldown records are retained for up to 366 days.

Set `APPLICATIONS_FILE` to the same private SQLite path for the bot and dashboard. The default is `./data/applications.sqlite`. Keep it outside public dashboard assets. Application data participates in encrypted application backups, whose retention is separate from the application retention setting.

Restoring a backup disables applications and closes all forms. When current application storage exists, its submissions, decisions and cooldowns are retained, including the absence of previously removed records. Without current storage, pending applications in the archive are withdrawn. Role grants and notifications are not replayed. Review forms and recorded outcomes before reopening applications.
