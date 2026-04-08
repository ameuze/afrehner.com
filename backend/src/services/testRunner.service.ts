import { EventEmitter } from 'events'
import { spawn, type ChildProcess } from 'child_process'
import { readFileSync, existsSync, rmSync } from 'fs'
import path from 'path'
import { env } from '../config/env'
import * as testRunService from './testRun.service'

export interface OutputLine {
  chunk: string
  stream: 'stdout' | 'stderr'
  ts: number
}

export interface RunFinishedPayload {
  status: 'passed' | 'failed' | 'cancelled'
  durationMs: number
  totalTests: number
  passedTests: number
  failedTests: number
  skippedTests: number
}

interface ActiveRun {
  process: ChildProcess
  buffer: OutputLine[]
  startedAt: Date
}

interface PlaywrightResults {
  stats?: {
    expected?: number
    unexpected?: number
    skipped?: number
    flaky?: number
  }
  suites?: unknown[]
}

class TestRunnerService extends EventEmitter {
  private activeRuns = new Map<string, ActiveRun>()

  async run(runId: string, specPattern: string, suiteLabel: string): Promise<void> {
    const reportDir = path.resolve(env.REPORTS_DIR, runId)
    const testsDir = path.resolve(env.PLAYWRIGHT_TESTS_DIR)

    const args = [
      'playwright',
      'test',
      specPattern,
      '--reporter=list,json',
    ]

    const proc = spawn('npx', args, {
      cwd: testsDir,
      env: {
        ...process.env,
        PORTFOLIO_URL: env.PORTFOLIO_URL,
        PLAYWRIGHT_JSON_OUTPUT_NAME: path.join(reportDir, 'results.json'),
        FORCE_COLOR: '1',
      },
      shell: process.platform === 'win32',
    })

    const startedAt = new Date()
    this.activeRuns.set(runId, { process: proc, buffer: [], startedAt })

    await testRunService.markRunStarted(runId)
    this.emit('run:started', runId, { startedAt: startedAt.toISOString(), suiteLabel })

    const handleData = (stream: 'stdout' | 'stderr') => (data: Buffer) => {
      const chunk = data.toString()
      const line: OutputLine = { chunk, stream, ts: Date.now() }
      const active = this.activeRuns.get(runId)
      if (active) active.buffer.push(line)
      this.emit('run:output', runId, line)
    }

    proc.stdout?.on('data', handleData('stdout'))
    proc.stderr?.on('data', handleData('stderr'))

    proc.on('close', async (code) => {
      const active = this.activeRuns.get(runId)
      if (!active) return

      const finishedAt = new Date()
      const durationMs = finishedAt.getTime() - active.startedAt.getTime()
      const wasCancelled = code === null

      const results = this.parseResults(reportDir)
      const status = wasCancelled ? 'cancelled' : code === 0 ? 'passed' : 'failed'

      // Delete report dir from disk — stats already parsed, nothing else needed
      rmSync(reportDir, { recursive: true, force: true })

      await testRunService.markRunFinished(runId, status, {
        finishedAt,
        durationMs,
        totalTests: results.total,
        passedTests: results.passed,
        failedTests: results.failed,
        skippedTests: results.skipped,
        errorSummary: status === 'failed' ? active.buffer
          .filter(l => l.stream === 'stderr')
          .map(l => l.chunk)
          .join('')
          .slice(0, 2000) : undefined,
      })

      const payload: RunFinishedPayload = {
        status,
        durationMs,
        totalTests: results.total,
        passedTests: results.passed,
        failedTests: results.failed,
        skippedTests: results.skipped,
      }

      this.emit('run:finished', runId, payload)
      this.activeRuns.delete(runId)
      testRunService.deleteRun(runId)
    })

    proc.on('error', async (err) => {
      this.emit('run:error', runId, { message: err.message })
      this.activeRuns.delete(runId)
      testRunService.deleteRun(runId)
    })
  }

  cancel(runId: string): boolean {
    const active = this.activeRuns.get(runId)
    if (!active) return false
    active.process.kill('SIGTERM')
    return true
  }

  getBuffer(runId: string): OutputLine[] {
    return this.activeRuns.get(runId)?.buffer ?? []
  }

  isRunning(runId: string): boolean {
    return this.activeRuns.has(runId)
  }

  activeRunCount(): number {
    return this.activeRuns.size
  }

  private parseResults(reportDir: string): { total: number; passed: number; failed: number; skipped: number } {
    const resultsFile = path.join(reportDir, 'results.json')
    const empty = { total: 0, passed: 0, failed: 0, skipped: 0 }

    if (!existsSync(resultsFile)) return empty

    try {
      const raw = readFileSync(resultsFile, 'utf-8')
      const data = JSON.parse(raw) as PlaywrightResults
      const stats = data.stats ?? {}
      const expected = stats.expected ?? 0
      const unexpected = stats.unexpected ?? 0
      const skipped = stats.skipped ?? 0
      const flaky = stats.flaky ?? 0
      const total = expected + unexpected + skipped + flaky
      return { total, passed: expected + flaky, failed: unexpected, skipped }
    } catch {
      return empty
    }
  }
}

export const testRunnerService = new TestRunnerService()
