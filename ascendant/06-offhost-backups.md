---
title: Off-host backups
description: Configure encrypted S3-compatible backup copies and verify them with isolated restore drills
published: true
date: 2026-10-29T00:19:40.000Z
tags: ascendant, backups, operations
editor: markdown
dateCreated: 2026-10-28T00:00:00.000Z
---

## Local scheduling

The backup worker checks schedules once per minute. An interval schedule with no previous successful snapshot is due on the next check; later intervals run from the last successful snapshot. Daily schedules use the configured UTC hour. Scheduling decisions use one timestamp for both the due-time calculation and comparison, including at UTC midnight.

Failed snapshots retry after fifteen minutes. Retention failures remain visible but preserve the successful snapshot time and do not trigger an early replacement.

## Connect storage

Open **Operations > Backups > Off-host encrypted copies** as the dashboard owner. Copies start disabled. A storage account is not required to use local backups or review these settings.

Set the following variables in the server environment, then restart the dashboard service. Keep credentials in the server environment or its protected `.env` file; they are never editable or returned through the dashboard.

| Variable | Value |
| --- | --- |
| `BACKUP_S3_ENDPOINT` | HTTPS origin for an S3-compatible service, such as `https://s3.us-east-1.amazonaws.com`. Use the regional endpoint for the bucket. Paths, query strings and embedded credentials are rejected. |
| `BACKUP_S3_BUCKET` | Existing private bucket name. |
| `BACKUP_S3_REGION` | Signing region required by the provider; defaults to `us-east-1`. |
| `BACKUP_S3_PREFIX` | Dedicated object prefix; defaults to `ascendant-backups`. Use letters, digits, underscores, hyphens and slash-separated segments. |
| `BACKUP_S3_ACCESS_KEY_ID` | Dedicated storage access key. |
| `BACKUP_S3_SECRET_ACCESS_KEY` | Storage secret key. |
| `BACKUP_S3_SESSION_TOKEN` | Optional token for temporary credentials. Update expired credentials and restart the service. |
| `BACKUP_S3_MAX_ARCHIVE_BYTES` | Maximum encrypted archive size per copy. Defaults to `1073741824` (1 GiB); supports 1 KiB through 5 GiB. |

The transport uses path-style S3 requests and AWS Signature Version 4. The provider must support `PutObject`, `GetObject` and conditional `DeleteObject`, and return an object ETag on downloads. Grant those operations only under the dedicated bucket prefix. Ascendant does not list buckets, enumerate unrelated objects, change bucket permissions or create storage accounts. Use a private bucket with public access blocked. Requests require HTTPS, reject redirects and time out after ten minutes.

After configuration, refresh the page and check the displayed destination. Choose retention and drill interval, enable copies, and save. Changing the endpoint, bucket or prefix pauses copying until the owner reviews and saves the new destination. Credential rotation alone does not change the destination identity.

## Copy and verify

Create a local backup or enable scheduled backups first. Off-host copies reuse those encrypted snapshots. The worker checks once per minute and handles at most one new copy per attempt, with a fifteen-minute retry interval. It copies the latest local archive and snapshots created after off-host copies were enabled. Older archives can be copied by their ID through the owner API.

**Copy latest backup** starts a copy immediately. The worker saves an attempt receipt before upload, uses a unique installation and archive path, and refuses to overwrite an existing object. An existing object is downloaded and verified before a retry can succeed.

Each successful copy must pass all of these checks:

- Downloaded length and SHA-256 match the local encrypted archive.
- The archive authenticates and decrypts with this server's recovery key.
- The manifest matches the expected archive ID, paths and supported size limits; extracted file checksums match.
- Every extracted SQLite database passes `PRAGMA integrity_check`.

The drill extracts to a private temporary folder and removes it when finished. It does not replace live files, run the bot, contact Discord or apply a restore. A successful drill proves archive readability and database integrity, not that every external service or feature will work after a disaster.

**Run restore drill** downloads and checks the latest copied archive again. **Verify this copy** checks a specific receipt. Automatic repeat drills default to every 168 hours; owners can choose 1–720 hours. Successful new copies also count as drills.

The page shows the thirty most recent receipts for the configured destination, last successful copy, last drill and the latest error. Upload, checksum, decryption, permission and retention failures remain visible. Off-host failures also feed the existing backup health check and Operations alerts when those alerts are configured. This feature does not create a Discord destination automatically.

## Retention and recovery material

Remote retention defaults to fourteen verified archives and accepts 1–365. Protected pre-restore snapshots are retained separately. Cleanup only deletes objects present in this installation's durable receipt ledger and uses the ETag recorded during verification. Changed objects, locked objects and provider permission failures remain in storage for review. At most ten objects are removed per maintenance pass. Bucket versioning can retain old versions after deletion; configure the provider's lifecycle rules separately if those versions need expiry.

Scheduled local retention keeps snapshots awaiting an off-host copy while copying is enabled. Failed storage can therefore increase local disk use. Manual deletion remains an explicit owner action. Check free disk space and delivery errors when storage is unavailable.

Unreadable remote receipt records do not stop local scheduled snapshots. Retention pauses until those records are repaired so an unverified archive cannot be deleted accidentally.

The remote key is `<prefix>/<installation UUID>/<archive UUID>.vmbak`. Only the encrypted archive is uploaded. **The recovery key is never uploaded.** Export it separately from the local backup controls and keep it somewhere available if this server is lost. The `.env` file is excluded from archives and needs its own protected backup.

The local backup directory contains `offhost.json`, which records settings, installation identity and receipts but no storage credentials. Preserve it with your operator recovery material. It is excluded from data snapshots, so restoring application data does not roll back delivery history or change the remote destination. The ledger accepts up to 2,000 receipts and stops new copies rather than discarding ownership history when full. Keep its history before planning an operator reset or moving to a new installation.

To recover after losing the server, download a `.vmbak` object through your storage provider and import it with the separately saved recovery key. Use the existing offline restore command with both bot and dashboard stopped. Dashboard imports are limited to 512 MiB; larger files can be transferred to the server for the offline workflow. Review feature settings and delivery history before enabling restored modules. Ticket snapshots now include participants, issue references and transcripts; current ticket operations are preserved by the ticket restore policy.

## Owner API

| Method and path | Purpose |
| --- | --- |
| `GET /api/backups/offhost` | Read redacted destination, settings and receipts. |
| `PUT /api/backups/offhost` | Save `revision`, `enabled`, `retain` and `verifyEveryHours`. A stale revision is rejected. |
| `POST /api/backups/offhost/copy` | Copy latest local archive, or pass `{ "id": "archive UUID" }`. |
| `POST /api/backups/offhost/verify` | Drill latest copied archive, or pass its archive ID. |

All routes require the dashboard owner. Review mode allows status reads but blocks configuration changes and every remote request. A running operation prevents another copy or drill from starting.

## Protocol references

The transport follows [AWS Signature Version 4](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-create-signed-request.html) and is tested against Amazon's [published signing example](https://docs.aws.amazon.com/AmazonS3/latest/developerguide/sig-v4-header-based-auth.html). Conditional uploads follow [PutObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html), and conditional cleanup follows [DeleteObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObject.html).
