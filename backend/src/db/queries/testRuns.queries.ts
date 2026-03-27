import { randomUUID } from 'crypto'

export interface TestRun {
  id: string
  suite_id: string
  suite_label: string
  status: 'pending' | 'running' | 'passed' | 'failed' | 'cancelled'
  triggered_at: Date
  started_at: Date | null
  finished_at: Date | null
  duration_ms: number | null
  total_tests: number | null
  passed_tests: number | null
  failed_tests: number | null
  skipped_tests: number | null
  report_path: string | null
  report_url: string | null
  error_summary: string | null
  created_at: Date
}

const store = new Map<string, TestRun>()

export async function createTestRun(suiteId: string, suiteLabel: string): Promise<TestRun> {
  const now = new Date()
  const run: TestRun = {
    id: randomUUID(),
    suite_id: suiteId,
    suite_label: suiteLabel,
    status: 'pending',
    triggered_at: now,
    started_at: null,
    finished_at: null,
    duration_ms: null,
    total_tests: null,
    passed_tests: null,
    failed_tests: null,
    skipped_tests: null,
    report_path: null,
    report_url: null,
    error_summary: null,
    created_at: now,
  }
  store.set(run.id, run)
  return run
}

export async function getTestRunById(id: string): Promise<TestRun | null> {
  return store.get(id) ?? null
}

export async function listTestRuns(limit = 20, offset = 0, status?: string): Promise<{ data: TestRun[]; total: number }> {
  let runs = Array.from(store.values())
    .sort((a, b) => b.triggered_at.getTime() - a.triggered_at.getTime())

  if (status) {
    runs = runs.filter(r => r.status === status)
  }

  return {
    data: runs.slice(offset, offset + limit),
    total: runs.length,
  }
}

export function deleteTestRun(id: string): void {
  store.delete(id)
}

export async function updateTestRunStatus(
  id: string,
  status: 'pending' | 'running' | 'passed' | 'failed' | 'cancelled',
  extras?: Partial<Pick<TestRun, 'started_at' | 'finished_at' | 'duration_ms' | 'total_tests' | 'passed_tests' | 'failed_tests' | 'skipped_tests' | 'report_path' | 'report_url' | 'error_summary'>>
): Promise<TestRun | null> {
  const run = store.get(id)
  if (!run) return null
  const updated = { ...run, status, ...extras }
  store.set(id, updated)
  return updated
}
