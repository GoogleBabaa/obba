import crypto from 'node:crypto';
import { mkdir, readFile, appendFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import nodemailer from 'nodemailer';
import { loadDotEnv, mailFrom, siteUrl } from './_emailConfig.js';
import { createUnsubscribeToken, normalizeEmail } from './_subscriberStore.js';
import { readAdminConfig } from './_adminMailSystem.js';
import { hasSupabaseStorage, insertRow, selectRows, upsertRow } from './_supabaseStorage.js';

function dataDir() {
  return process.env.SUBSCRIBERS_DATA_DIR || path.join(process.cwd(), 'data');
}

function welcomeQueuePath() {
  return process.env.WELCOME_EMAIL_QUEUE_FILE || path.join(dataDir(), 'welcome-email-queue.jsonl');
}

async function ensureDataDir(filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function appendJsonl(filePath, record) {
  await ensureDataDir(filePath);
  await appendFile(filePath, `${JSON.stringify(record)}\n`, 'utf8');
}

async function readJsonl(filePath) {
  try {
    const text = await readFile(filePath, 'utf8');
    return text
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeJsonl(filePath, records) {
  await ensureDataDir(filePath);
  const text = records.map((record) => JSON.stringify(record)).join('\n');
  await writeFile(filePath, text ? `${text}\n` : '', 'utf8');
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} in .env or environment`);
  return value;
}

function unsubscribeUrl(email) {
  return `${siteUrl()}/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(createUnsubscribeToken(email))}`;
}

export function welcomeEmailHtml(record) {
  const calculatorPath = record.calculatorPath || '/';
  const backUrl = `${siteUrl()}${calculatorPath}`;
  const stateLine = record.stateName
    ? `You are grouped with ${record.stateName} updates, so calculator changes that may matter to your pay can reach you faster.`
    : 'You are on the main OBBA updates list for calculator and paycheck changes.';

  return `<!doctype html>
<html>
<body style="margin:0;background:#eef4ff;font-family:Arial,sans-serif;color:#0f172a">
  <div style="max-width:680px;margin:0 auto;padding:30px 18px">
    <div style="background:#0f1b3d;border-radius:22px;padding:24px;box-shadow:0 24px 70px rgba(15,27,61,.22)">
      <div style="border-radius:18px;overflow:hidden;background:linear-gradient(135deg,#eff6ff 0%,#ffffff 55%,#dbeafe 100%);border:1px solid rgba(255,255,255,.5)">
        <div style="padding:28px 26px 24px;text-align:center">
          <div style="display:inline-block;background:#0f1b3d;color:#93c5fd;border-radius:999px;padding:7px 12px;font-size:11px;font-weight:800;letter-spacing:1.4px">OBBA CALCULATORS</div>
          <h1 style="margin:18px 0 12px;font-size:30px;line-height:1.18;color:#10203f">You&apos;re all set</h1>
          <div style="font-size:36px;line-height:1;margin-bottom:14px">&#127881;</div>
          <p style="margin:0 auto 14px;max-width:520px;font-size:16px;line-height:1.65;color:#334155">You&apos;ll now receive helpful paycheck, tax, overtime, and calculator updates from OBBA Calculators.</p>
          <p style="margin:0 auto;max-width:520px;font-size:14px;line-height:1.65;color:#64748b">We&apos;ll only send updates when something useful is added or when a change may affect your pay.</p>
          <div style="margin:22px auto 0;max-width:500px;border:1px solid #dbeafe;border-radius:14px;background:rgba(255,255,255,.72);padding:14px;color:#475569;font-size:13px;line-height:1.55">${stateLine}</div>
          <p style="margin:24px 0 0"><a href="${backUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;border-radius:12px;padding:12px 18px;font-size:14px;font-weight:800">Back to Calculator</a></p>
        </div>
      </div>
      <p style="margin:14px 6px 0;text-align:center;font-size:12px;color:#94a3b8">No longer want these emails? <a href="${unsubscribeUrl(record.email)}" style="color:#bfdbfe">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;
}

export function welcomeEmailText(record) {
  const calculatorPath = record.calculatorPath || '/';
  return `You're all set

You'll now receive helpful paycheck, tax, overtime, and calculator updates from OBBA Calculators.

We'll only send updates when something useful is added or when a change may affect your pay.

Back to Calculator: ${siteUrl()}${calculatorPath}

Unsubscribe: ${unsubscribeUrl(record.email)}`;
}

export async function queueWelcomeEmail(record, delayMs = 60_000) {
  const email = normalizeEmail(record.email);
  const queuedRecord = {
    id: crypto.randomUUID(),
    email,
    queuedAt: new Date().toISOString(),
    sendAfter: new Date(Date.now() + delayMs).toISOString(),
    status: 'queued',
    record: {
      email,
      stateName: record.stateName || '',
      segmentKey: record.segmentKey || '',
      segmentName: record.segmentName || '',
      calculatorPath: record.calculatorPath || '/',
    },
  };
  if (await hasSupabaseStorage()) {
    await upsertRow('obba_welcome_queue', {
      id: queuedRecord.id,
      email,
      record: queuedRecord,
      status: 'queued',
      send_after: queuedRecord.sendAfter,
      queued_at: queuedRecord.queuedAt,
    }, 'id');
  } else {
    await appendJsonl(welcomeQueuePath(), queuedRecord);
  }
  return queuedRecord;
}

export async function sendWelcomeEmail(record) {
  await loadDotEnv();
  const transporter = nodemailer.createTransport({
    host: requiredEnv('SMTP_HOST'),
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: requiredEnv('SMTP_USER'),
      pass: requiredEnv('SMTP_PASS'),
    },
  });

  await transporter.sendMail({
    from: mailFrom(),
    to: record.email,
    subject: 'You are all set with OBBA Calculators',
    text: welcomeEmailText(record),
    html: welcomeEmailHtml(record),
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl(record.email)}>`,
    },
  });
}

export async function sendDueWelcomeEmails({ dryRun = false, now = new Date(), limit = 10 } = {}) {
  await loadDotEnv();
  const config = await readAdminConfig();
  if (!config.mailEnabled) return { due: 0, sent: 0, disabled: true };
  const useSupabase = await hasSupabaseStorage();
  const rows = useSupabase
    ? (await selectRows('obba_welcome_queue', '?select=id,record,status,send_after&status=eq.queued&order=send_after.asc')).map((row) => ({
      ...row.record,
      id: row.id,
      status: row.status,
      sendAfter: row.send_after || row.record?.sendAfter,
    }))
    : await readJsonl(welcomeQueuePath());
  const due = [];
  const remaining = [];

  for (const row of rows) {
    if (row.status !== 'queued') continue;
    if (new Date(row.sendAfter) <= now) due.push(row);
    else remaining.push(row);
  }

  const batch = due.slice(0, Math.max(0, Number(limit || 10)));

  for (const row of batch) {
    if (dryRun) {
      console.log(`[dry-run] welcome ${row.record.email}`);
      remaining.push(row);
      continue;
    }
    await sendWelcomeEmail(row.record);
    const sentRow = {
      ...row,
      status: 'sent',
      sentAt: new Date().toISOString(),
    };
    if (useSupabase) {
      await upsertRow('obba_welcome_queue', {
        id: sentRow.id,
        email: sentRow.email,
        record: sentRow,
        status: 'sent',
        send_after: sentRow.sendAfter,
        queued_at: sentRow.queuedAt,
        sent_at: sentRow.sentAt,
      }, 'id');
    } else {
      remaining.push(sentRow);
    }
    console.log(`welcome sent ${row.record.email}`);
  }

  if (!useSupabase) await writeJsonl(welcomeQueuePath(), remaining);
  return {
    due: due.length,
    sent: dryRun ? 0 : batch.length,
    remaining: Math.max(0, due.length - batch.length),
  };
}
