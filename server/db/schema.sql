CREATE TABLE IF NOT EXISTS public_id_allocators (
  entity_type TEXT PRIMARY KEY,
  next_numeric_id BIGINT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  internal_id TEXT PRIMARY KEY,
  public_id BIGINT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  entity_type TEXT NOT NULL DEFAULT 'player',
  privilege_role TEXT NOT NULL DEFAULT 'player',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS entity_type TEXT NOT NULL DEFAULT 'player';

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS privilege_role TEXT NOT NULL DEFAULT 'player';

CREATE TABLE IF NOT EXISTS player_state (
  user_internal_id TEXT PRIMARY KEY REFERENCES users(internal_id) ON DELETE CASCADE,
  level INTEGER NOT NULL DEFAULT 0,
  gold INTEGER NOT NULL DEFAULT 500,
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  working_stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  battle_stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  current_job JSONB NOT NULL DEFAULT '{}'::jsonb,
  player_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  jobs_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  education_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  arena_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  timer_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  guild_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  consortium_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  travel_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  civic_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  legacy_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS player_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS jobs_state JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS education_state JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS arena_state JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS timer_state JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS guild_state JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS consortium_state JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS travel_state JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS civic_state JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS legacy_state JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS auth_sessions (
  token_hash TEXT PRIMARY KEY,
  user_internal_id TEXT NOT NULL REFERENCES users(internal_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_internal_id
  ON auth_sessions (user_internal_id);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at
  ON auth_sessions (expires_at);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  token_hash TEXT PRIMARY KEY,
  user_internal_id TEXT NOT NULL REFERENCES users(internal_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_internal_id
  ON password_reset_tokens (user_internal_id);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at
  ON password_reset_tokens (expires_at);
