import { loadDotEnv } from './_emailConfig.js';

function supabaseUrl() {
  return (process.env.SUPABASE_URL || '').replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
}

function supabaseKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
}

export async function hasSupabaseStorage() {
  await loadDotEnv();
  return Boolean(supabaseUrl() && supabaseKey());
}

async function request(table, { method = 'GET', query = '', body, prefer = '' } = {}) {
  const url = `${supabaseUrl()}/rest/v1/${table}${query}`;
  const headers = {
    apikey: supabaseKey(),
    Authorization: `Bearer ${supabaseKey()}`,
    'Content-Type': 'application/json',
  };
  if (prefer) headers.Prefer = prefer;
  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`supabase_${table}_${response.status}: ${text}`);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function insertRow(table, row) {
  return request(table, { method: 'POST', body: row, prefer: 'return=representation' });
}

export async function upsertRow(table, row, conflictColumns = 'id') {
  return request(table, {
    method: 'POST',
    query: `?on_conflict=${encodeURIComponent(conflictColumns)}`,
    body: row,
    prefer: 'resolution=merge-duplicates,return=representation',
  });
}

export async function selectRows(table, query = '') {
  return request(table, { query });
}

export async function deleteRows(table, query = '') {
  return request(table, { method: 'DELETE', query, prefer: 'return=minimal' });
}
