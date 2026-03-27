import type { Request, Response } from 'express'
import * as testRunService from '../services/testRun.service'
import { testRunnerService } from '../services/testRunner.service'
import { z } from 'zod'

// Suite config lives in config.yaml, but backend needs to know valid suite IDs.
// We read them from an environment-provided JSON or use hardcoded fallback.
function getAvailableSuites(): Array<{ id: string; label: string; spec_pattern: string }> {
  if (process.env.AVAILABLE_SUITES) {
    try {
      return JSON.parse(process.env.AVAILABLE_SUITES)
    } catch {
      // fall through
    }
  }
  return [
    { id: 'demo-saucedemo', label: 'SauceDemo E2E Suite', spec_pattern: 'tests/demo-saucedemo.spec.ts' },
    { id: 'portfolio', label: 'Portfolio Tests', spec_pattern: 'tests/portfolio.spec.ts' },
  ]
}

const triggerSchema = z.object({
  suiteId: z.string().min(1),
})

export async function listRuns(req: Request, res: Response): Promise<void> {
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
  const offset = parseInt(req.query.offset as string) || 0
  const status = req.query.status as string | undefined

  const result = await testRunService.getRuns(limit, offset, status)
  res.json({ ...result, limit, offset })
}

export async function getRun(req: Request, res: Response): Promise<void> {
  const run = await testRunService.getRunById(req.params.id)
  if (!run) {
    res.status(404).json({ error: 'Test run not found' })
    return
  }
  res.json(run)
}

export async function triggerRun(req: Request, res: Response): Promise<void> {
  const parsed = triggerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() })
    return
  }

  const suites = getAvailableSuites()
  const suite = suites.find(s => s.id === parsed.data.suiteId)
  if (!suite) {
    res.status(400).json({ error: `Unknown suite: ${parsed.data.suiteId}` })
    return
  }

  if (testRunnerService.activeRunCount() >= 2) {
    res.status(429).json({ error: 'Too many tests running. Please wait for a current run to finish.' })
    return
  }

  const run = await testRunService.createRun(suite.id, suite.label)

  // Fire and forget — the WS server will stream updates
  testRunnerService.run(run.id, suite.spec_pattern, suite.label).catch(err => {
    console.error(`Test run ${run.id} failed:`, err)
  })

  res.status(201).json({
    id: run.id,
    suiteId: run.suite_id,
    suiteLabel: run.suite_label,
    status: run.status,
    triggeredAt: run.triggered_at,
  })
}

export async function cancelRun(req: Request, res: Response): Promise<void> {
  const run = await testRunService.getRunById(req.params.id)
  if (!run) {
    res.status(404).json({ error: 'Test run not found' })
    return
  }

  if (run.status !== 'running' && run.status !== 'pending') {
    res.status(409).json({ error: `Cannot cancel run with status: ${run.status}` })
    return
  }

  const cancelled = testRunnerService.cancel(req.params.id)
  if (!cancelled) {
    await testRunService.markRunCancelled(req.params.id)
  }

  res.json({ message: 'Cancellation requested', runId: req.params.id })
}
