import { sendDueWelcomeEmails } from './_welcomeEmails.js';
import { loadDotEnv } from './_emailConfig.js';
import { scheduleWelcomeWorker } from './_qstashScheduler.js';
import { hasSupabaseStorage } from './_supabaseStorage.js';

export default async function handler(req, res) {
  await loadDotEnv();

  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const configuredSecret = process.env.WELCOME_CRON_SECRET || process.env.CRON_SECRET || process.env.MAIL_WORKER_SECRET || process.env.EMAIL_SECRET || '';
  if (process.env.VERCEL && !configuredSecret) {
    return res.status(503).json({ ok: false, error: 'worker_secret_not_configured' });
  }
  if (configuredSecret) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : (req.query?.token || '');
    if (token !== configuredSecret) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }
  }
  if (process.env.VERCEL && !(await hasSupabaseStorage())) {
    return res.status(503).json({ ok: false, error: 'persistent_storage_not_configured' });
  }

  const limit = Number(req.query?.limit || process.env.MAIL_BATCH_LIMIT || 10);
  const result = await sendDueWelcomeEmails({ dryRun: req.query?.dryRun === '1', limit });
  if (!req.query?.dryRun && result.remaining > 0) {
    result.nextBatch = await scheduleWelcomeWorker({
      delay: '1m',
      reason: 'welcome_batch_remaining',
      limit,
    });
  }
  return res.status(200).json({ ok: true, ...result });
}
