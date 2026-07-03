import { readFile } from 'node:fs/promises';
import path from 'node:path';
import nodemailer from 'nodemailer';
import { loadDotEnv, mailFrom, siteUrl } from '../api/_emailConfig.js';
import { createUnsubscribeToken, getActiveSubscribers } from '../api/_subscriberStore.js';
import { readAdminConfig } from '../api/_adminMailSystem.js';

function argValue(name, fallback = '') {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

function hasArg(name) {
  return process.argv.includes(name);
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} in .env or environment`);
  return value;
}

async function readOptionalFile(filePath) {
  if (!filePath) return '';
  return readFile(path.resolve(filePath), 'utf8');
}

function applyTemplate(template, subscriber) {
  const rootUrl = siteUrl();
  const unsubscribeUrl = `${rootUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${encodeURIComponent(subscriber.unsubscribeToken)}`;
  return template
    .replace(/\{\{\s*email\s*\}\}/g, subscriber.email)
    .replace(/\{\{\s*unsubscribeUrl\s*\}\}/g, unsubscribeUrl)
    .replace(/\{\{\s*siteUrl\s*\}\}/g, rootUrl);
}

function defaultHtml(subject, body) {
  const safeSubject = subject.replace(/[<>&]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[char]));
  const paragraphs = body
    .split(/\n{2,}/)
    .map((chunk) => `<p style="margin:0 0 16px;line-height:1.65;color:#334155">${chunk.replace(/\n/g, '<br>')}</p>`)
    .join('');
  return `<!doctype html>
<html>
<body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a">
  <div style="max-width:640px;margin:0 auto;padding:28px 18px">
    <div style="background:#0f1b3d;color:#fff;border-radius:16px 16px 0 0;padding:22px 24px">
      <div style="font-size:13px;letter-spacing:1.5px;color:#93c5fd;font-weight:700">OBBA CALCULATORS</div>
      <h1 style="margin:8px 0 0;font-size:26px;line-height:1.2">${safeSubject}</h1>
    </div>
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 16px 16px;padding:24px">
      ${paragraphs}
      <p style="margin:20px 0 0"><a href="{{siteUrl}}" style="color:#2563eb;font-weight:700">Open OBBA Calculators</a></p>
      <div style="margin:28px 0 0;padding-top:18px;border-top:1px solid #e2e8f0">
        <p style="margin:0 0 10px;font-size:12px;color:#64748b">You are receiving this because you subscribed to OBBA Calculators updates.</p>
        <a href="{{unsubscribeUrl}}" style="display:inline-block;border:1px solid #cbd5e1;border-radius:999px;padding:6px 11px;font-size:11px;line-height:1;color:#64748b;text-decoration:none">Unsubscribe</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

await loadDotEnv();
const adminConfig = await readAdminConfig();
if (!adminConfig.mailEnabled) {
  console.log('Mail system is OFF. Newsletter send skipped.');
  process.exit(0);
}

const subject = argValue('--subject');
if (!subject) {
  throw new Error('Usage: node scripts/send-newsletter.mjs --subject "Subject" --text email.txt [--html email.html] [--group state-florida] [--dry-run] [--limit 10]');
}

const textFile = argValue('--text');
const htmlFile = argValue('--html');
const dryRun = hasArg('--dry-run');
const limit = Number(argValue('--limit', '0'));
const testTo = argValue('--test-to');
const group = argValue('--group').toLowerCase().trim();

const textTemplate = await readOptionalFile(textFile) || 'New OBBA Calculators update is ready.\n\nVisit {{siteUrl}}\n\nUnsubscribe anytime: {{unsubscribeUrl}}';
const htmlTemplate = await readOptionalFile(htmlFile) || defaultHtml(subject, textTemplate);
let subscribers = await getActiveSubscribers();

if (group) {
  subscribers = subscribers.filter((subscriber) => {
    const values = [
      subscriber.segmentKey,
      subscriber.segmentType,
      subscriber.stateCode,
      subscriber.stateName,
      subscriber.unsupportedStateCode,
      subscriber.unsupportedStateName,
    ].map((value) => String(value || '').toLowerCase());
    return values.includes(group);
  });
}

if (testTo) {
  subscribers = [{ email: testTo, unsubscribeToken: createUnsubscribeToken(testTo) }];
}
if (limit > 0) subscribers = subscribers.slice(0, limit);

console.log(`Preparing ${subscribers.length} email(s).${group ? ` Group: ${group}.` : ''}${dryRun ? ' Dry run only.' : ''}`);
if (!subscribers.length) process.exit(0);

const transporter = dryRun ? null : nodemailer.createTransport({
  host: requiredEnv('SMTP_HOST'),
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: requiredEnv('SMTP_USER'),
    pass: requiredEnv('SMTP_PASS'),
  },
});

const from = mailFrom();
if (!dryRun && !from) throw new Error('Missing MAIL_FROM or SMTP_USER');

for (const subscriber of subscribers) {
  const text = applyTemplate(textTemplate, subscriber);
  const html = applyTemplate(htmlTemplate, subscriber);

  if (dryRun) {
    console.log(`[dry-run] ${subscriber.email} | ${subject}`);
    continue;
  }

  await transporter.sendMail({
    from,
    to: subscriber.email,
    subject,
    text,
    html,
    headers: {
      'List-Unsubscribe': `<${siteUrl()}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${encodeURIComponent(subscriber.unsubscribeToken)}>`,
    },
  });
  console.log(`sent ${subscriber.email}`);
}

console.log('Done.');
