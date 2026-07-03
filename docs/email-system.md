# OBBA Email Update System

This is the self-owned newsletter system for OBBA Calculators.

It has three parts:

- `/api/subscribe` saves popup signups.
- `/api/unsubscribe` handles unsubscribe links.
- `scripts/send-newsletter.mjs` sends email through your SMTP account.
- `scripts/send-due-welcome-emails.mjs` sends queued welcome emails after the 1-minute delay.
- `scripts/send-scheduled-mails.mjs` sends file-based admin campaigns such as 3-day, 7-day, and urgent emails.

## Setup

Create `.env` from `.env.example`:

```powershell
Copy-Item .env.example .env
```

Fill these values:

```txt
SITE_URL=https://www.obbacalculators.com
SUBSCRIBERS_STORE=file
SUBSCRIBERS_DATA_DIR=./data
EMAIL_SECRET=a-long-random-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=obbacalculators@gmail.com
SMTP_PASS=your-google-app-password
MAIL_FROM="OBBA Calculators <obbacalculators@gmail.com>"
WELCOME_CRON_SECRET=change-this-private-worker-secret
MAIL_WORKER_SECRET=change-this-private-mail-worker-secret
MAIL_BATCH_LIMIT=10
ADMIN_EMAIL=obbacalculators@gmail.com
ADMIN_SECRET=change-this-private-admin-secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

For Gmail, `SMTP_PASS` must be a Google App Password. Do not use the normal Gmail login password. In the Google account, enable 2-Step Verification, then create an app password for Mail and paste that 16-character password into `.env`.

`data/` is ignored by Git so real subscriber emails are not committed. On Vercel, use Supabase instead of local files.

## Subscriber Storage

Local/self-hosted mode stores signups in:

```txt
data/subscribers.jsonl
data/unsubscribes.jsonl
data/welcome-email-queue.jsonl
```

Each row is one JSON object. Duplicate emails are deduped when sending. Unsubscribed emails are skipped.

Every generated email includes:

- `List-Unsubscribe` email header.
- A small `Unsubscribe` button in the email footer.

When a user clicks unsubscribe, `/api/unsubscribe` records the email in `data/unsubscribes.jsonl`. The sender script removes that email from all active send lists automatically. If the same user subscribes again later, the unsubscribe record is removed and the user becomes active again.

## Welcome Email

When a new or reactivated subscriber signs up, `/api/subscribe` queues a welcome email for 1 minute later.

The welcome email is a branded card-style email with this message:

```txt
You’re all set 🎉

You’ll now receive helpful paycheck, tax, overtime, and calculator updates from OBBA Calculators.

We’ll only send updates when something useful is added or when a change may affect your pay.

[Back to Calculator]
```

Process due welcome emails:

```powershell
npm run welcome:send
```

Dry run:

```powershell
npm run welcome:dry
```

For true automation on a local/server machine, run `npm run welcome:send` every minute with Windows Task Scheduler or cron.

For hosted automation, schedule this protected endpoint every minute:

```txt
GET https://www.obbacalculators.com/api/send-due-welcome-emails
Authorization: Bearer YOUR_WELCOME_CRON_SECRET
```

You can also test it in dry-run mode:

```txt
GET https://www.obbacalculators.com/api/send-due-welcome-emails?dryRun=1
Authorization: Bearer YOUR_WELCOME_CRON_SECRET
```

## State Groups

When `/api/subscribe` receives Vercel location headers, it saves the user's state and assigns a group.

Supported state calculator groups:

```txt
state-california
state-florida
state-hawaii
state-illinois
state-indiana
state-nebraska
state-texas
state-virginia
state-washington
```

If the detected state does not have a calculator yet, the subscriber is saved in:

```txt
common-future-states
```

The unsupported state is still saved in `unsupportedStateCode` and `unsupportedStateName` so you can see which calculators to build later.

Important: Vercel serverless functions do not persist local file writes. For Vercel production, keep using `SUBSCRIBERS_WEBHOOK_URL` or add a real database/storage service. The send script works best from your local machine or a self-hosted server where `data/` persists.

## Send A Dry Run

Create a plain text email body:

```txt
Get paycheck, tax, and overtime updates before rules change.

New calculator updates are live on {{siteUrl}}.

Unsubscribe: {{unsubscribeUrl}}
```

Then run:

```powershell
npm run newsletter:dry -- --subject "OBBA Calculators Update" --text .\emails\update.txt
```

## Send One Test Email

Run:

```powershell
npm run newsletter:send -- --subject "OBBA Calculators Test" --text .\emails\update.txt --test-to obbacalculators@gmail.com
```

## Send To All Active Subscribers

```powershell
npm run newsletter:send -- --subject "OBBA Calculators Update" --text .\emails\update.txt
```

Optional limit:

```powershell
npm run newsletter:send -- --subject "OBBA Calculators Update" --text .\emails\update.txt --limit 25
```

Send only one group:

```powershell
npm run newsletter:send -- --subject "Florida Paycheck Update" --text .\emails\florida.txt --group state-florida
npm run newsletter:send -- --subject "Future State Calculator Updates" --text .\emails\future-states.txt --group common-future-states
```

## Template Variables

Text and HTML templates support:

- `{{email}}`
- `{{siteUrl}}`
- `{{unsubscribeUrl}}`

If no HTML file is provided, the script generates a branded OBBA email layout automatically.
