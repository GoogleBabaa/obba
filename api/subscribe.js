import { isValidEmail, upsertSubscriber } from './_subscriberStore.js';
import { queueWelcomeEmail } from './_welcomeEmails.js';
import { hasSupabaseStorage } from './_supabaseStorage.js';
import { scheduleWelcomeWorker } from './_qstashScheduler.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function decodeHeader(value) {
  if (!value) return '';
  try {
    return decodeURIComponent(String(value));
  } catch {
    return String(value);
  }
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || '';
}

const US_STATE_NAMES = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  DC: 'District of Columbia',
};

const STATE_CALCULATOR_GROUPS = {
  CA: { segmentKey: 'state-california', segmentName: 'California Paycheck Calculator', calculatorPath: '/california-paycheck-calculator' },
  FL: { segmentKey: 'state-florida', segmentName: 'Florida Paycheck Calculator', calculatorPath: '/florida-paycheck-calculator' },
  HI: { segmentKey: 'state-hawaii', segmentName: 'Hawaii Paycheck Calculator', calculatorPath: '/hawaii-paycheck-calculator' },
  IL: { segmentKey: 'state-illinois', segmentName: 'Illinois Paycheck Calculator', calculatorPath: '/illinois-paycheck-calculator' },
  IN: { segmentKey: 'state-indiana', segmentName: 'Indiana Paycheck Calculator', calculatorPath: '/indiana-paycheck-calculator' },
  NE: { segmentKey: 'state-nebraska', segmentName: 'Nebraska Paycheck Calculator', calculatorPath: '/nebraska-paycheck-calculator' },
  TX: { segmentKey: 'state-texas', segmentName: 'Texas Paycheck Calculator', calculatorPath: '/texas-paycheck-calculator' },
  VA: { segmentKey: 'state-virginia', segmentName: 'Virginia Paycheck Calculator', calculatorPath: '/virginia-paycheck-calculator' },
  WA: { segmentKey: 'state-washington', segmentName: 'Washington Paycheck Calculator', calculatorPath: '/washington-paycheck-calculator' },
};

function getSubscriberSegment(stateCode, stateName) {
  const calculatorGroup = STATE_CALCULATOR_GROUPS[stateCode];
  if (calculatorGroup) {
    return {
      segmentType: 'state-calculator',
      ...calculatorGroup,
      unsupportedStateCode: '',
      unsupportedStateName: '',
    };
  }

  return {
    segmentType: 'common',
    segmentKey: 'common-future-states',
    segmentName: 'Common Future State Leads',
    calculatorPath: '',
    unsupportedStateCode: stateCode || '',
    unsupportedStateName: stateName || '',
  };
}

function cleanStateCode(value) {
  const code = String(value || '').trim().toUpperCase();
  return US_STATE_NAMES[code] ? code : '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const email = String(body.email || '').trim().toLowerCase();
  if (!emailPattern.test(email) || !isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'invalid_email' });
  }

  const region = decodeHeader(req.headers['x-vercel-ip-country-region']);
  const vercelStateCode = cleanStateCode(region);
  const bodyStateCode = cleanStateCode(body.stateCode || body.browserStateCode);
  const stateCode = vercelStateCode || bodyStateCode;
  const stateName = String(body.stateName || US_STATE_NAMES[stateCode] || '').trim();
  const segment = getSubscriberSegment(stateCode, stateName);

  const record = {
    email,
    subscribedAt: body.subscribedAt || new Date().toISOString(),
    page: body.page || '',
    pageTitle: body.pageTitle || '',
    referrer: body.referrer || '',
    timezone: body.timezone || '',
    browserStateCode: body.browserStateCode || '',
    browserStateName: body.browserStateName || '',
    stateCode,
    stateName,
    segmentType: segment.segmentType,
    segmentKey: segment.segmentKey,
    segmentName: segment.segmentName,
    calculatorPath: segment.calculatorPath,
    unsupportedStateCode: segment.unsupportedStateCode,
    unsupportedStateName: segment.unsupportedStateName,
    language: body.language || '',
    country: decodeHeader(req.headers['x-vercel-ip-country']),
    region,
    city: decodeHeader(req.headers['x-vercel-ip-city']),
    latitude: decodeHeader(req.headers['x-vercel-ip-latitude']),
    longitude: decodeHeader(req.headers['x-vercel-ip-longitude']),
    ip: getClientIp(req),
    userAgent: req.headers['user-agent'] || '',
  };

  const hasPersistentStorage = await hasSupabaseStorage();
  const shouldStoreToFile = hasPersistentStorage || process.env.SUBSCRIBERS_STORE === 'file' || (!process.env.VERCEL && process.env.SUBSCRIBERS_STORE !== 'webhook');
  let fileStored = false;
  let fileError = '';
  let subscriberStatus = '';
  let welcomeQueued = false;
  let welcomeSchedule = null;

  if (shouldStoreToFile) {
    try {
      const result = await upsertSubscriber(record);
      subscriberStatus = result.status;
      fileStored = result.created;
      if (result.created || result.status === 'existing') {
        await queueWelcomeEmail(result.record);
        welcomeQueued = true;
        welcomeSchedule = await scheduleWelcomeWorker({
          delay: '1m',
          reason: `subscriber_${result.status}`,
          limit: Number(process.env.MAIL_BATCH_LIMIT || 10),
        });
      }
    } catch (error) {
      fileError = error.message || 'file_store_failed';
    }
  }

  const webhookUrl = process.env.SUBSCRIBERS_WEBHOOK_URL;
  if (!webhookUrl) {
    if (process.env.VERCEL && !hasPersistentStorage) {
      return res.status(503).json({
        ok: false,
        error: 'persistent_storage_not_configured',
        message: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured in Vercel production.',
      });
    }
    const reason = fileStored
      ? ''
      : subscriberStatus === 'existing'
        ? 'already_subscribed'
        : subscriberStatus === 'reactivated'
          ? 'reactivated'
          : 'SUBSCRIBERS_WEBHOOK_URL_not_configured';
    return res.status(200).json({
      ok: true,
      stored: fileStored,
      fileStored,
      fileError,
      subscriberStatus,
      welcomeQueued,
      welcomeSchedule,
      reason,
      record,
    });
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    return res.status(502).json({ ok: false, error: 'webhook_failed' });
  }

  return res.status(200).json({ ok: true, stored: true, fileStored, subscriberStatus, welcomeQueued });
}
