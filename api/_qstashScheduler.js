import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { loadDotEnv, siteUrl } from './_emailConfig.js';

function dataDir() {
  return process.env.SUBSCRIBERS_DATA_DIR || path.join(process.cwd(), 'data');
}

async function appendMockSchedule(record) {
  const filePath = process.env.QSTASH_MOCK_FILE || path.join(dataDir(), 'qstash-mock-schedules.jsonl');
  await mkdir(path.dirname(filePath), { recursive: true });
  await appendFile(filePath, `${JSON.stringify(record)}\n`, 'utf8');
}

export function delayForCampaign(key, fallback = '1m') {
  if (key === '3days') return '3d';
  if (key === '7days') return '7d';
  if (key === 'urgent') return '1m';
  return fallback;
}

export async function scheduleCampaignWorker({ key, campaignId = '', delay, reason = 'campaign_saved', limit = 10 } = {}) {
  await loadDotEnv();
  const campaignKey = String(key || '').trim();
  if (!campaignKey) throw new Error('missing_campaign_key');

  const workerSecret = process.env.MAIL_WORKER_SECRET || process.env.WELCOME_CRON_SECRET || process.env.CRON_SECRET || process.env.EMAIL_SECRET || '';
  const destination = `${siteUrl()}/api/send-scheduled-mails?type=${encodeURIComponent(campaignKey)}&limit=${Number(limit || process.env.MAIL_BATCH_LIMIT || 10)}${campaignId ? `&campaignId=${encodeURIComponent(campaignId)}` : ''}`;
  const payload = {
    key: campaignKey,
    campaignId,
    delay: delay || delayForCampaign(campaignKey),
    reason,
    destination,
    createdAt: new Date().toISOString(),
  };

  if (process.env.QSTASH_MOCK === 'true') {
    await appendMockSchedule({ ...payload, mode: 'mock' });
    return { ok: true, mocked: true, ...payload };
  }

  const token = process.env.UPSTASH_QSTASH_TOKEN || process.env.QSTASH_TOKEN || '';
  if (!token) {
    return { ok: false, skipped: true, error: 'missing_UPSTASH_QSTASH_TOKEN', ...payload };
  }

  const qstashUrl = (process.env.QSTASH_URL || 'https://qstash.upstash.io').replace(/\/+$/, '');
  const response = await fetch(`${qstashUrl}/v2/publish/${destination}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Upstash-Delay': payload.delay,
      'Upstash-Forward-Authorization': workerSecret ? `Bearer ${workerSecret}` : '',
    },
    body: JSON.stringify({ key: campaignKey, campaignId, reason, limit }),
  });

  const text = await response.text();
  if (!response.ok) {
    return { ok: false, status: response.status, error: text, ...payload };
  }

  let result = {};
  try {
    result = JSON.parse(text);
  } catch {
    result = { raw: text };
  }
  return { ok: true, qstash: result, ...payload };
}

export async function scheduleWelcomeWorker({ delay = '1m', reason = 'welcome_queued', limit = 10 } = {}) {
  await loadDotEnv();
  const workerSecret = process.env.WELCOME_CRON_SECRET || process.env.CRON_SECRET || process.env.MAIL_WORKER_SECRET || process.env.EMAIL_SECRET || '';
  const destination = `${siteUrl()}/api/send-due-welcome-emails?limit=${Number(limit || process.env.MAIL_BATCH_LIMIT || 10)}`;
  const payload = {
    key: 'welcome',
    delay,
    reason,
    destination,
    createdAt: new Date().toISOString(),
  };

  if (process.env.QSTASH_MOCK === 'true') {
    await appendMockSchedule({ ...payload, mode: 'mock' });
    return { ok: true, mocked: true, ...payload };
  }

  const token = process.env.UPSTASH_QSTASH_TOKEN || process.env.QSTASH_TOKEN || '';
  if (!token) {
    return { ok: false, skipped: true, error: 'missing_UPSTASH_QSTASH_TOKEN', ...payload };
  }

  const qstashUrl = (process.env.QSTASH_URL || 'https://qstash.upstash.io').replace(/\/+$/, '');
  const response = await fetch(`${qstashUrl}/v2/publish/${destination}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Upstash-Delay': payload.delay,
      'Upstash-Forward-Authorization': workerSecret ? `Bearer ${workerSecret}` : '',
    },
    body: JSON.stringify({ reason, limit }),
  });

  const text = await response.text();
  if (!response.ok) {
    return { ok: false, status: response.status, error: text, ...payload };
  }

  let result = {};
  try {
    result = JSON.parse(text);
  } catch {
    result = { raw: text };
  }
  return { ok: true, qstash: result, ...payload };
}
