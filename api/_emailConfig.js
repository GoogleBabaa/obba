import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function loadDotEnv(filePath = path.join(process.cwd(), '.env')) {
  try {
    const text = await readFile(filePath, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, '');
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

export function siteUrl() {
  return process.env.SITE_URL || 'https://www.obbacalculators.com';
}

export function mailFrom() {
  return process.env.MAIL_FROM || process.env.SMTP_USER || 'OBBA Calculators <obbacalculators@gmail.com>';
}

