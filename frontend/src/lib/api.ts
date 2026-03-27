const BASE = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError((body as { error?: string }).error ?? `HTTP ${res.status}`, res.status)
  }
  return res.json() as Promise<T>
}

export interface TestRunSummary {
  id: string
  suiteId: string
  suiteLabel: string
  status: 'pending' | 'running' | 'passed' | 'failed' | 'cancelled'
  triggeredAt: string
}

export interface TestRun extends TestRunSummary {
  startedAt: string | null
  finishedAt: string | null
  durationMs: number | null
  totalTests: number | null
  passedTests: number | null
  failedTests: number | null
  skippedTests: number | null
  reportUrl: string | null
  errorSummary: string | null
}

export const api = {
  triggerRun: (suiteId: string) =>
    request<TestRunSummary>('/api/test-runs', {
      method: 'POST',
      body: JSON.stringify({ suiteId }),
    }),

  cancelRun: (runId: string) =>
    request<{ message: string }>(`/api/test-runs/${runId}/cancel`, { method: 'POST' }),

  getRunHistory: (limit = 10) =>
    request<{ data: TestRun[]; total: number }>(`/api/test-runs?limit=${limit}`),

  getRun: (runId: string) =>
    request<TestRun>(`/api/test-runs/${runId}`),
}
