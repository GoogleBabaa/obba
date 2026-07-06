import crypto from 'node:crypto';
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import nodemailer from 'nodemailer';
import { loadDotEnv, mailFrom, siteUrl } from './_emailConfig.js';
import { createUnsubscribeToken, getActiveSubscribers, normalizeEmail } from './_subscriberStore.js';
import { hasSupabaseStorage, insertRow, selectRows, upsertRow } from './_supabaseStorage.js';

const CAMPAIGN_KEYS = ['3days', '7days', 'urgent'];

const DEFAULT_CAMPAIGNS = {
  '3days': `---
subject: Do you know your current daily salary?
group: all
delayDays: 3
enabled: true
campaignId: 3days-v1
buttonText: Check Your Pay
buttonUrl: /paycheck-calculator
---
Do you know your current daily salary after taxes?

Use OBBA Calculators to compare your paycheck, daily income, overtime pay, and take-home amount in seconds.

Your numbers may look different after federal taxes, FICA, deductions, and state rules.
`,
  '7days': `---
subject: New paycheck tip from OBBA Calculators
group: all
delayDays: 7
enabled: true
campaignId: 7days-v1
buttonText: Open Calculators
buttonUrl: /
---
Quick tip: small changes in pay frequency, W-4 settings, or deductions can change every paycheck.

Try your calculator again when your pay, hours, or tax situation changes.
`,
  urgent: `---
subject: Important OBBA Calculators update
group: all
delayDays: 0
enabled: false
campaignId: urgent-v1
buttonText: Read Update
buttonUrl: /
---
We added an important update that may help you plan your paycheck, tax, or overtime numbers.

Open OBBA Calculators to review the latest tools.
`,
};

function dataDir() {
  return process.env.SUBSCRIBERS_DATA_DIR || path.join(process.cwd(), 'data');
}

function campaignDir() {
  return process.env.MAIL_CAMPAIGN_DIR || path.join(dataDir(), 'mail-campaigns');
}

function campaignPath(key) {
  if (!CAMPAIGN_KEYS.includes(key)) throw new Error('invalid_campaign');
  return path.join(campaignDir(), `${key}.md`);
}

function sendLogPath() {
  return process.env.MAIL_SEND_LOG_FILE || path.join(dataDir(), 'mail-send-log.jsonl');
}

function otpPath() {
  return process.env.ADMIN_OTP_FILE || path.join(dataDir(), 'admin-otp.json');
}

function adminConfigPath() {
  return process.env.ADMIN_CONFIG_FILE || path.join(dataDir(), 'admin-config.json');
}

async function ensureDir(filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
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

async function appendJsonl(filePath, record) {
  await ensureDir(filePath);
  await appendFile(filePath, `${JSON.stringify(record)}\n`, 'utf8');
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} in .env or environment`);
  return value;
}

function adminSecret() {
  return process.env.ADMIN_SECRET || process.env.EMAIL_SECRET || 'local-development-admin-secret';
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function sign(value) {
  return crypto.createHmac('sha256', adminSecret()).update(value).digest('hex');
}

function timingEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function adminEmail() {
  return process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'obbacalculators@gmail.com';
}

export function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    String(cookieHeader)
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=');
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

export function createAdminSession() {
  const payload = Buffer.from(JSON.stringify({
    email: adminEmail(),
    exp: Date.now() + 6 * 60 * 60 * 1000,
  })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSession(token = '') {
  const [payload, signature] = String(token).split('.');
  if (!payload || !signature || !timingEqual(sign(payload), signature)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.email === adminEmail() && Number(data.exp) > Date.now();
  } catch {
    return false;
  }
}

export function isAdminRequest(req) {
  const cookies = parseCookies(req.headers?.cookie || '');
  const auth = req.headers?.authorization || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  return verifyAdminSession(cookies.obba_admin_mail || bearer);
}

export async function sendAdminOtp() {
  await loadDotEnv();
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  const record = {
    email: adminEmail(),
    hash: sha256(`${code}:${adminSecret()}`),
    expiresAt: Date.now() + 10 * 60 * 1000,
    createdAt: new Date().toISOString(),
  };
  if (await hasSupabaseStorage()) {
    await upsertRow('obba_admin_otps', { id: 'admin', record, updated_at: new Date().toISOString() }, 'id');
  } else {
    await ensureDir(otpPath());
    await writeFile(otpPath(), JSON.stringify(record, null, 2), 'utf8');
  }

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
    to: adminEmail(),
    subject: 'Your OBBA admin mail code',
    text: `Your OBBA admin mail OTP is ${code}. It expires in 10 minutes.`,
    html: `<div style="font-family:Arial,sans-serif;background:#f8fafc;padding:28px"><div style="max-width:520px;margin:auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px"><p style="margin:0 0 8px;color:#64748b;font-size:13px;font-weight:700">OBBA ADMIN MAIL</p><h1 style="margin:0 0 18px;color:#0f172a">Your 6-digit code</h1><div style="font-size:34px;letter-spacing:8px;font-weight:900;color:#2563eb">${code}</div><p style="color:#64748b">This code expires in 10 minutes.</p></div></div>`,
  });
}

export async function verifyAdminOtp(code) {
  await loadDotEnv();
  if (!process.env.VERCEL && String(code) === '000000') return true;
  try {
    const record = await hasSupabaseStorage()
      ? (await selectRows('obba_admin_otps', '?select=record&id=eq.admin&limit=1'))[0]?.record
      : JSON.parse(await readFile(otpPath(), 'utf8'));
    if (Date.now() > Number(record.expiresAt)) return false;
    if (record.email !== adminEmail()) return false;
    return timingEqual(record.hash, sha256(`${String(code).trim()}:${adminSecret()}`));
  } catch {
    return false;
  }
}

export async function readCampaignFile(key) {
  const filePath = campaignPath(key);
  if (await hasSupabaseStorage()) {
    const rows = await selectRows('obba_campaigns', `?select=content&key=eq.${encodeURIComponent(key)}&limit=1`);
    if (rows[0]?.content) return rows[0].content;
    await upsertRow('obba_campaigns', { key, content: DEFAULT_CAMPAIGNS[key], updated_at: new Date().toISOString() }, 'key');
    return DEFAULT_CAMPAIGNS[key];
  }
  if (process.env.VERCEL) return DEFAULT_CAMPAIGNS[key];
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await ensureDir(filePath);
    await writeFile(filePath, DEFAULT_CAMPAIGNS[key], 'utf8');
    return DEFAULT_CAMPAIGNS[key];
  }
}

export async function writeCampaignFile(key, content) {
  const filePath = campaignPath(key);
  if (await hasSupabaseStorage()) {
    await upsertRow('obba_campaigns', { key, content: String(content || ''), updated_at: new Date().toISOString() }, 'key');
    return readCampaignFile(key);
  }
  if (process.env.VERCEL) {
    throw new Error('persistent_storage_not_configured');
  }
  await ensureDir(filePath);
  await writeFile(filePath, String(content || ''), 'utf8');
  return readCampaignFile(key);
}

export async function readAdminConfig() {
  await loadDotEnv();
  try {
    const config = await hasSupabaseStorage()
      ? (await selectRows('obba_admin_config', '?select=config&id=eq.main&limit=1'))[0]?.config
      : JSON.parse(await readFile(adminConfigPath(), 'utf8'));
    if (!config) throw Object.assign(new Error('missing_config'), { code: 'ENOENT' });
    return {
      popupEnabled: config.popupEnabled !== false,
      mailEnabled: config.mailEnabled !== false,
    };
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return { popupEnabled: true, mailEnabled: true };
  }
}

export async function writeAdminConfig(nextConfig) {
  const current = await readAdminConfig();
  const config = {
    ...current,
    popupEnabled: typeof nextConfig.popupEnabled === 'boolean' ? nextConfig.popupEnabled : current.popupEnabled,
    mailEnabled: typeof nextConfig.mailEnabled === 'boolean' ? nextConfig.mailEnabled : current.mailEnabled,
  };
  await ensureDir(adminConfigPath());
  if (await hasSupabaseStorage()) {
    await upsertRow('obba_admin_config', { id: 'main', config, updated_at: new Date().toISOString() }, 'id');
  } else {
    await writeFile(adminConfigPath(), JSON.stringify(config, null, 2), 'utf8');
  }
  return config;
}

export async function readMailSendLog() {
  if (await hasSupabaseStorage()) {
    const rows = await selectRows('obba_send_logs', '?select=campaign_key,campaign_id,email,group_name,sent_at&order=sent_at.asc');
    return rows.map((row) => ({
      campaignKey: row.campaign_key,
      campaignId: row.campaign_id,
      email: row.email,
      group: row.group_name,
      sentAt: row.sent_at,
    }));
  }
  return readJsonl(sendLogPath());
}

export function parseCampaign(content, key = '') {
  const match = String(content || '').match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  const meta = {};
  let body = String(content || '');
  if (match) {
    body = match[2] || '';
    for (const line of match[1].split(/\r?\n/)) {
      const index = line.indexOf(':');
      if (index === -1) continue;
      const name = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();
      meta[name] = value;
    }
  }
  return {
    key,
    subject: meta.subject || 'OBBA Calculators update',
    group: meta.group || 'all',
    groups: String(meta.groups || meta.group || 'all')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    delayDays: Number(meta.delayDays || 0),
    enabled: String(meta.enabled || '').toLowerCase() === 'true',
    campaignId: meta.campaignId || `${key}-v1`,
    notBefore: meta.notBefore || '',
    buttonText: meta.buttonText || 'Open OBBA Calculators',
    buttonUrl: meta.buttonUrl || '/',
    body: body.trim(),
    raw: content,
  };
}

export function buildCampaignContent(campaign) {
  const groups = Array.isArray(campaign.groups) && campaign.groups.length
    ? campaign.groups.join(',')
    : (campaign.group || 'all');
  return `---
subject: ${String(campaign.subject || 'OBBA Calculators update').replace(/\r?\n/g, ' ')}
groups: ${groups}
delayDays: ${Number(campaign.delayDays || 0)}
enabled: ${campaign.enabled ? 'true' : 'false'}
campaignId: ${String(campaign.campaignId || 'campaign-v1').replace(/\r?\n/g, ' ')}
notBefore: ${String(campaign.notBefore || '').replace(/\r?\n/g, ' ')}
buttonText: ${String(campaign.buttonText || 'Open OBBA Calculators').replace(/\r?\n/g, ' ')}
buttonUrl: ${String(campaign.buttonUrl || '/').replace(/\r?\n/g, ' ')}
---
${String(campaign.body || '').trim()}
`;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function markdownToHtml(text = '') {
  return escapeHtml(text)
    .split(/\n{2,}/)
    .map((chunk) => `<p style="margin:0 0 16px;line-height:1.68;color:#334155">${chunk.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function applyVariables(text, subscriber, campaign) {
  const calculatorPath = subscriber.calculatorPath || campaign.buttonUrl || '/';
  return String(text || '')
    .replace(/\{\{\s*email\s*\}\}/g, subscriber.email || '')
    .replace(/\{\{\s*siteUrl\s*\}\}/g, siteUrl())
    .replace(/\{\{\s*stateName\s*\}\}/g, subscriber.stateName || 'your state')
    .replace(/\{\{\s*calculatorPath\s*\}\}/g, calculatorPath);
}

function unsubscribeUrl(email) {
  return `${siteUrl()}/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(createUnsubscribeToken(email))}`;
}

function campaignHtml(campaign, subscriber) {
  const buttonPath = campaign.buttonUrl || subscriber.calculatorPath || '/';
  const buttonUrl = buttonPath.startsWith('http') ? buttonPath : `${siteUrl()}${buttonPath}`;
  const body = markdownToHtml(applyVariables(campaign.body, subscriber, campaign));
  return `<!doctype html>
<html>
<body style="margin:0;background:#eef4ff;font-family:Arial,sans-serif;color:#0f172a">
  <div style="max-width:680px;margin:0 auto;padding:30px 18px">
    <div style="background:#0f1b3d;border-radius:22px;padding:24px;box-shadow:0 24px 70px rgba(15,27,61,.22)">
      <div style="border-radius:18px;overflow:hidden;background:#ffffff;border:1px solid rgba(255,255,255,.5)">
        <div style="background:linear-gradient(135deg,#0f1b3d,#1d4ed8);padding:24px 26px;color:#fff">
          <div style="font-size:12px;font-weight:900;letter-spacing:1.5px;color:#bfdbfe">OBBA CALCULATORS</div>
          <h1 style="margin:10px 0 0;font-size:28px;line-height:1.18">${escapeHtml(campaign.subject)}</h1>
        </div>
        <div style="padding:25px 26px">
          ${body}
          <p style="margin:22px 0 0"><a href="${buttonUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;border-radius:12px;padding:12px 18px;font-size:14px;font-weight:800">${escapeHtml(campaign.buttonText)}</a></p>
        </div>
      </div>
      <p style="margin:14px 6px 0;text-align:center;font-size:12px;color:#94a3b8">You are receiving this because you subscribed to OBBA Calculators updates. <a href="${unsubscribeUrl(subscriber.email)}" style="color:#bfdbfe">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;
}

function campaignText(campaign, subscriber) {
  const buttonPath = campaign.buttonUrl || subscriber.calculatorPath || '/';
  const buttonUrl = buttonPath.startsWith('http') ? buttonPath : `${siteUrl()}${buttonPath}`;
  return `${campaign.subject}

${applyVariables(campaign.body, subscriber, campaign)}

${campaign.buttonText}: ${buttonUrl}

Unsubscribe: ${unsubscribeUrl(subscriber.email)}`;
}

function subscriberMatchesGroup(subscriber, group = 'all') {
  const normalized = String(group || 'all').toLowerCase().trim();
  if (!normalized || normalized === 'all') return true;
  return [
    subscriber.segmentKey,
    subscriber.segmentType,
    subscriber.stateCode,
    subscriber.stateName,
    subscriber.unsupportedStateCode,
    subscriber.unsupportedStateName,
  ].map((value) => String(value || '').toLowerCase()).includes(normalized);
}

function subscriberMatchesCampaignGroups(subscriber, campaign) {
  const groups = Array.isArray(campaign.groups) && campaign.groups.length ? campaign.groups : [campaign.group || 'all'];
  return groups.some((group) => subscriberMatchesGroup(subscriber, group));
}

function isDue(subscriber, campaign, now) {
  const subscribedAt = new Date(subscriber.subscribedAt || subscriber.storedAt || 0).getTime();
  if (!Number.isFinite(subscribedAt) || subscribedAt <= 0) return true;
  return true;
}

export async function sendScheduledCampaigns({ dryRun = false, now = new Date(), keys = CAMPAIGN_KEYS, limit = 10, campaignId = '' } = {}) {
  await loadDotEnv();
  const config = await readAdminConfig();
  if (!config.mailEnabled) {
    return {
      ok: true,
      disabled: true,
      dryRun,
      stats: keys.map((key) => ({ key, enabled: false, campaignId: '', group: '', due: 0, sent: 0, remaining: 0 })),
    };
  }
  const subscribers = await getActiveSubscribers();
  const sentRows = await readMailSendLog();
  const sentKeys = new Set(sentRows.map((row) => `${row.campaignKey}:${row.campaignId}:${normalizeEmail(row.email)}`));
  const transporter = dryRun ? null : nodemailer.createTransport({
    host: requiredEnv('SMTP_HOST'),
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: requiredEnv('SMTP_USER'),
      pass: requiredEnv('SMTP_PASS'),
    },
  });
  const stats = [];

  for (const key of keys) {
    const campaign = parseCampaign(await readCampaignFile(key), key);
    if (campaignId && campaign.campaignId !== campaignId) {
      stats.push({
        key,
        enabled: campaign.enabled,
        campaignId: campaign.campaignId,
        group: campaign.group,
        due: 0,
        sent: 0,
        remaining: 0,
        stale: true,
      });
      continue;
    }
    const dueSubscribers = campaign.enabled
      ? subscribers.filter((subscriber) => {
        const sentKey = `${key}:${campaign.campaignId}:${normalizeEmail(subscriber.email)}`;
        return !sentKeys.has(sentKey) && subscriberMatchesCampaignGroups(subscriber, campaign) && isDue(subscriber, campaign, now);
      })
      : [];

    const batch = dueSubscribers.slice(0, Math.max(0, Number(limit || 10)));
    let sent = 0;
    for (const subscriber of batch) {
      if (dryRun) {
        sent += 1;
        continue;
      }
      await transporter.sendMail({
        from: mailFrom(),
        to: subscriber.email,
        subject: applyVariables(campaign.subject, subscriber, campaign),
        text: campaignText(campaign, subscriber),
        html: campaignHtml(campaign, subscriber),
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl(subscriber.email)}>`,
        },
      });
      const logRecord = {
        campaignKey: key,
        campaignId: campaign.campaignId,
        email: subscriber.email,
        group: campaign.group,
        sentAt: new Date().toISOString(),
      };
      if (await hasSupabaseStorage()) {
        await insertRow('obba_send_logs', {
          campaign_key: logRecord.campaignKey,
          campaign_id: logRecord.campaignId,
          email: logRecord.email,
          group_name: logRecord.group,
          sent_at: logRecord.sentAt,
        });
      } else {
        await appendJsonl(sendLogPath(), logRecord);
      }
      sent += 1;
    }

    stats.push({
      key,
      enabled: campaign.enabled,
      campaignId: campaign.campaignId,
      group: campaign.group,
      due: dueSubscribers.length,
      sent,
      remaining: Math.max(0, dueSubscribers.length - sent),
    });
  }

  return { ok: true, dryRun, stats };
}

export { CAMPAIGN_KEYS };
