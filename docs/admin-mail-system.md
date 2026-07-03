# OBBA Admin Mail System

This system lets you write campaign emails in files and send them automatically.

## Admin URLs

Open these pages:

```txt
/admin/mail/3days
/admin/mail/7days
/admin/mail/urgent
```

The page asks for a 6-digit OTP sent to `ADMIN_EMAIL`. Local development also accepts `000000`.

## File Format

Each admin page edits one markdown file in:

```txt
data/mail-campaigns/3days.md
data/mail-campaigns/7days.md
data/mail-campaigns/urgent.md
```

Example:

```md
---
subject: Do you know your current daily salary?
group: all
delayDays: 3
enabled: true
campaignId: 3days-v1
buttonText: Check Your Pay
buttonUrl: /paycheck-calculator
---
Do you know your current daily salary after taxes?

Use OBBA Calculators to compare paycheck, daily income, overtime pay, and take-home amount.
```

## Rules

- `group: all` sends to all active subscribers.
- `group: state-florida` sends only that state group.
- `group: common-future-states` sends unsupported/future state leads.
- `delayDays: 3` sends 3 days after subscription.
- `delayDays: 7` sends 7 days after subscription.
- `delayDays: 0` is for urgent campaigns.
- `enabled: false` keeps the file saved but inactive.
- `campaignId` prevents duplicate sends. Change it when you want a new version to send again.

Supported variables:

```txt
{{email}}
{{siteUrl}}
{{stateName}}
{{calculatorPath}}
```

## Worker

When an admin saves a campaign, the system creates a new campaign version and schedules an Upstash QStash delayed job. The site server stays idle until QStash calls the worker endpoint.

- Urgent: starts after 1 minute.
- 3 days: starts after 3 days.
- 7 days: starts after 7 days.
- Each worker call sends at most 10 emails by default.
- If more emails remain, the worker schedules the next batch for 1 minute later.
- When all emails are sent, no new worker job is scheduled.

Dry run:

```powershell
npm run mail:scheduled:dry
```

Send due emails:

```powershell
npm run mail:scheduled:send
```

Hosted worker endpoint:

```txt
GET /api/send-scheduled-mails
Authorization: Bearer YOUR_MAIL_WORKER_SECRET
```

QStash calls the hosted worker endpoint automatically after the configured delay:

```txt
POST /api/send-scheduled-mails?type=urgent&limit=10
Authorization: Bearer YOUR_MAIL_WORKER_SECRET
```

With `MAIL_BATCH_LIMIT=10`, the send rate is 10 emails per minute only while a campaign has remaining recipients.

Examples:

```powershell
npm run mail:scheduled:send -- --type urgent --limit 10
npm run mail:scheduled:send -- --type 3days --limit 10
npm run mail:scheduled:send -- --type 7days --limit 10
```

For Vercel production, use Supabase storage. Create the tables from `docs/supabase-schema.sql`, then set:

```txt
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
UPSTASH_QSTASH_TOKEN=...
MAIL_WORKER_SECRET=...
```

Local development can still use `data/` files as a fallback when Supabase env vars are not set.
