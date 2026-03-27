import {
  createTestRun,
  getTestRunById,
  listTestRuns,
  updateTestRunStatus,
  deleteTestRun,
  type TestRun,
} from '../db/queries/testRuns.queries'

export { type TestRun }

export function deleteRun(id: string): void {
  deleteTestRun(id)
}

export async function createRun(suiteId: string, suiteLabel: string): Promise<TestRun> {
  return createTestRun(suiteId, suiteLabel)
}

export async function getRunById(id: string): Promise<TestRun | null> {
  return getTestRunById(id)
}

export async function getRuns(limit: number, offset: number, status?: string) {
  return listTestRuns(limit, offset, status)
}

export async function markRunStarted(id: string): Promise<TestRun | null> {
  return updateTestRunStatus(id, 'running', { started_at: new Date() })
}

export async function markRunFinished(
  id: string,
  status: 'passed' | 'failed' | 'cancelled',
  data: {
    finishedAt: Date
    durationMs: number
    totalTests: number
    passedTests: number
    failedTests: number
    skippedTests: number
    errorSummary?: string
  }
): Promise<TestRun | null> {
  return updateTestRunStatus(id, status, {
    finished_at: data.finishedAt,
    duration_ms: data.durationMs,
    total_tests: data.totalTests,
    passed_tests: data.passedTests,
    failed_tests: data.failedTests,
    skipped_tests: data.skippedTests,
    error_summary: data.errorSummary,
  })
}

export async function markRunCancelled(id: string): Promise<TestRun | null> {
  return updateTestRunStatus(id, 'cancelled', { finished_at: new Date() })
}
