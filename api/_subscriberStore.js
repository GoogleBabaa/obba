import crypto from 'node:crypto';
import { mkdir, readFile, appendFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { deleteRows, hasSupabaseStorage, insertRow, selectRows } from './_supabaseStorage.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase();
}

export function isValidEmail(email) {
  return emailPattern.test(normalizeEmail(email));
}

function dataDir() {
  return process.env.SUBSCRIBERS_DATA_DIR || path.join(process.cwd(), 'data');
}

function subscribersPath() {
  return process.env.SUBSCRIBERS_FILE || path.join(dataDir(), 'subscribers.jsonl');
}

function unsubscribesPath() {
  return process.env.UNSUBSCRIBES_FILE || path.join(dataDir(), 'unsubscribes.jsonl');
}

function emailSecret() {
  return process.env.EMAIL_SECRET || process.env.ADMIN_SECRET || 'local-development-email-secret';
}

export function createUnsubscribeToken(email) {
  return crypto
    .createHmac('sha256', emailSecret())
    .update(normalizeEmail(email))
    .digest('hex')
    .slice(0, 32);
}

export function verifyUnsubscribeToken(email, token) {
  if (!email || !token) return false;
  return crypto.timingSafeEqual(
    Buffer.from(createUnsubscribeToken(email)),
    Buffer.from(String(token).slice(0, 32).padEnd(32, '0')),
  );
}

async function ensureDataDir(filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function appendJsonl(filePath, record) {
  await ensureDataDir(filePath);
  await appendFile(filePath, `${JSON.stringify(record)}\n`, 'utf8');
}

async function writeJsonl(filePath, records) {
  await ensureDataDir(filePath);
  const text = records.map((record) => JSON.stringify(record)).join('\n');
  await writeFile(filePath, text ? `${text}\n` : '', 'utf8');
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

export async function addSubscriber(record) {
  const email = normalizeEmail(record.email);
  if (!isValidEmail(email)) throw new Error('invalid_email');

  const savedRecord = {
    ...record,
    email,
    unsubscribeToken: createUnsubscribeToken(email),
    storedAt: new Date().toISOString(),
  };

  if (await hasSupabaseStorage()) {
    await insertRow('obba_subscribers', {
      email,
      record: savedRecord,
      subscribed_at: savedRecord.subscribedAt || savedRecord.storedAt,
    });
  } else {
    await appendJsonl(subscribersPath(), savedRecord);
  }
  return savedRecord;
}

export async function upsertSubscriber(record) {
  const email = normalizeEmail(record.email);
  if (!isValidEmail(email)) throw new Error('invalid_email');

  const usingSupabase = await hasSupabaseStorage();
  const [subscriberRows, unsubscribeRows] = usingSupabase
    ? await Promise.all([
      selectRows('obba_subscribers', `?select=record&email=eq.${encodeURIComponent(email)}&order=stored_at.desc`),
      selectRows('obba_unsubscribes', `?select=email&email=eq.${encodeURIComponent(email)}`),
    ]).then(([subRows, unsubRows]) => [subRows.map((row) => row.record), unsubRows])
    : await Promise.all([
      readJsonl(subscribersPath()),
      readJsonl(unsubscribesPath()),
    ]);
  const isUnsubscribed = unsubscribeRows.some((row) => normalizeEmail(row.email) === email);
  if (isUnsubscribed) {
    if (usingSupabase) {
      await deleteRows('obba_unsubscribes', `?email=eq.${encodeURIComponent(email)}`);
    } else {
      const remainingUnsubscribes = unsubscribeRows.filter((row) => normalizeEmail(row.email) !== email);
      await writeJsonl(unsubscribesPath(), remainingUnsubscribes);
    }
    const reactivatedRecord = await addSubscriber({
      ...record,
      reactivatedAt: new Date().toISOString(),
    });
    return {
      status: 'reactivated',
      created: true,
      record: reactivatedRecord,
    };
  }

  const existing = [...subscriberRows].reverse().find((row) => normalizeEmail(row.email) === email);
  if (existing) {
    return {
      status: 'existing',
      created: false,
      record: existing,
    };
  }

  const savedRecord = await addSubscriber(record);
  return {
    status: 'created',
    created: true,
    record: savedRecord,
  };
}

export async function addUnsubscribe(email, reason = 'user_request') {
  const normalizedEmail = normalizeEmail(email);
  if (!isValidEmail(normalizedEmail)) throw new Error('invalid_email');

  const record = {
    email: normalizedEmail,
    reason,
    unsubscribedAt: new Date().toISOString(),
  };
  if (await hasSupabaseStorage()) {
    await insertRow('obba_unsubscribes', {
      email: normalizedEmail,
      reason,
      unsubscribed_at: record.unsubscribedAt,
    });
  } else {
    await appendJsonl(unsubscribesPath(), record);
  }
  return record;
}

export async function getActiveSubscribers() {
  const [subscriberRows, unsubscribeRows] = await hasSupabaseStorage()
    ? await Promise.all([
      selectRows('obba_subscribers', '?select=record&order=stored_at.asc'),
      selectRows('obba_unsubscribes', '?select=email'),
    ]).then(([subRows, unsubRows]) => [subRows.map((row) => row.record), unsubRows])
    : await Promise.all([
      readJsonl(subscribersPath()),
      readJsonl(unsubscribesPath()),
    ]);

  const unsubscribed = new Set(unsubscribeRows.map((row) => normalizeEmail(row.email)));
  const byEmail = new Map();

  for (const row of subscriberRows) {
    const email = normalizeEmail(row.email);
    if (!isValidEmail(email) || unsubscribed.has(email)) continue;
    byEmail.set(email, {
      ...row,
      email,
      unsubscribeToken: createUnsubscribeToken(email),
    });
  }

  return [...byEmail.values()].sort((a, b) => String(a.subscribedAt || '').localeCompare(String(b.subscribedAt || '')));
}
