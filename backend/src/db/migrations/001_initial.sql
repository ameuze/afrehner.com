CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE IF NOT EXISTS test_run_status AS ENUM ('pending', 'running', 'passed', 'failed', 'cancelled');

CREATE TABLE IF NOT EXISTS test_runs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suite_id      VARCHAR(100) NOT NULL,
  suite_label   VARCHAR(200) NOT NULL,
  status        test_run_status NOT NULL DEFAULT 'pending',
  triggered_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at    TIMESTAMPTZ,
  finished_at   TIMESTAMPTZ,
  duration_ms   INTEGER,
  total_tests   INTEGER,
  passed_tests  INTEGER,
  failed_tests  INTEGER,
  skipped_tests INTEGER,
  report_path   VARCHAR(500),
  report_url    VARCHAR(500),
  error_summary TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_test_runs_status ON test_runs(status);
CREATE INDEX IF NOT EXISTS idx_test_runs_triggered_at ON test_runs(triggered_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_runs_suite_id ON test_runs(suite_id);
