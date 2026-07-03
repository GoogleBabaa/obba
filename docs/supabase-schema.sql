create table if not exists obba_subscribers (
  id bigserial primary key,
  email text not null,
  record jsonb not null,
  subscribed_at timestamptz,
  stored_at timestamptz default now()
);

create table if not exists obba_unsubscribes (
  id bigserial primary key,
  email text not null,
  reason text,
  unsubscribed_at timestamptz default now()
);

create table if not exists obba_campaigns (
  key text primary key,
  content text not null,
  updated_at timestamptz default now()
);

create table if not exists obba_send_logs (
  id bigserial primary key,
  campaign_key text,
  campaign_id text,
  email text not null,
  group_name text,
  sent_at timestamptz default now()
);

create table if not exists obba_admin_config (
  id text primary key,
  config jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists obba_admin_otps (
  id text primary key,
  record jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists obba_welcome_queue (
  id text primary key,
  email text not null,
  record jsonb not null,
  status text not null default 'queued',
  send_after timestamptz,
  queued_at timestamptz default now(),
  sent_at timestamptz
);

create index if not exists obba_subscribers_email_idx on obba_subscribers (lower(email));
create index if not exists obba_unsubscribes_email_idx on obba_unsubscribes (lower(email));
create index if not exists obba_send_logs_email_idx on obba_send_logs (lower(email));
create index if not exists obba_welcome_queue_status_idx on obba_welcome_queue (status, send_after);
