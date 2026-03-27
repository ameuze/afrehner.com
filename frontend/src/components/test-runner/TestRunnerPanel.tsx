import { useState } from 'react'
import { Play, Square, RotateCcw, ChevronDown } from 'lucide-react'
import type { SiteConfig } from '../../types/config'
import { useTestRunner } from '../../hooks/useTestRunner'
import { TerminalWindow } from '../ui/TerminalWindow'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { TestOutput } from './TestOutput'

const STATUS_CONFIG = {
  idle: { label: 'Ready', variant: 'default' as const },
  connecting: { label: 'Connecting...', variant: 'blue' as const },
  running: { label: 'Running', variant: 'yellow' as const },
  passed: { label: 'All Passed', variant: 'green' as const },
  failed: { label: 'Failed', variant: 'red' as const },
  cancelled: { label: 'Cancelled', variant: 'default' as const },
  error: { label: 'Error', variant: 'red' as const },
  busy: { label: 'Server Busy', variant: 'yellow' as const },
}

export function TestRunnerPanel({ config }: { config: SiteConfig }) {
  const { test_runner } = config
  const [selectedSuite, setSelectedSuite] = useState(test_runner.default_suite)
  const { state, triggerRun, cancelRun, reset } = useTestRunner()

  const isActive = state.status === 'connecting' || state.status === 'running'
  const isDone = ['passed', 'failed', 'cancelled', 'error', 'busy'].includes(state.status)
  const statusCfg = STATUS_CONFIG[state.status]

  const handleRun = () => triggerRun(selectedSuite)

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <section id="test-runner" className="border-t border-[var(--border-subtle)]">
      <div className="section-container">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[var(--accent-green)] text-sm">// 05</span>
          <h2 className="text-3xl font-bold">{test_runner.title}</h2>
        </div>
        <p className="text-[var(--text-muted)] mb-8 max-w-2xl">
          {test_runner.description}
        </p>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Suite selector */}
          <div className="relative">
            <select
              value={selectedSuite}
              onChange={e => setSelectedSuite(e.target.value)}
              disabled={isActive}
              className="appearance-none bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-[var(--accent-green)] disabled:opacity-50 font-mono cursor-pointer"
            >
              {test_runner.available_suites.map(suite => (
                <option key={suite.id} value={suite.id}>{suite.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          </div>

          {/* Run / Cancel */}
          {!isActive ? (
            <Button variant="primary" onClick={handleRun} disabled={isActive}>
              <Play size={14} />
              Run Tests
            </Button>
          ) : (
            <Button variant="danger" onClick={cancelRun}>
              <Square size={14} />
              Stop
            </Button>
          )}

          {isDone && (
            <Button variant="ghost" onClick={reset}>
              <RotateCcw size={14} />
              Reset
            </Button>
          )}

          {/* Status badge */}
          <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
        </div>

        {/* Stats bar */}
        {state.stats && (
          <div className="flex flex-wrap gap-4 mb-6 font-mono text-sm">
            <span className="text-[var(--text-muted)]">
              Total: <span className="text-[var(--text-primary)]">{state.stats.total}</span>
            </span>
            <span className="text-[var(--accent-green)]">
              ✓ {state.stats.passed} passed
            </span>
            {state.stats.failed > 0 && (
              <span className="text-[var(--accent-red)]">
                ✗ {state.stats.failed} failed
              </span>
            )}
            <span className="text-[var(--text-muted)]">
              {formatDuration(state.stats.durationMs)}
            </span>
          </div>
        )}

        {/* Busy notice */}
        {state.status === 'busy' && (
          <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-lg border border-[var(--accent-yellow)] bg-[var(--accent-yellow)]/10 text-sm font-mono text-[var(--accent-yellow)]">
            {state.error}
          </div>
        )}

        {/* Terminal output */}
        {(state.lines.length > 0 || state.status === 'connecting' || (state.error && state.status !== 'busy')) && (
          <TerminalWindow
            title={`playwright test — ${test_runner.available_suites.find(s => s.id === selectedSuite)?.label ?? selectedSuite}`}
            className="mb-6"
            showCursor={isActive}
            height="400px"
          >
            {state.status === 'connecting' && state.lines.length === 0 && (
              <p className="text-[var(--text-muted)]">Connecting to test runner...</p>
            )}
            {state.error && (
              <p className="text-[var(--accent-red)]">Error: {state.error}</p>
            )}
            <TestOutput lines={state.lines} />
          </TerminalWindow>
        )}

        {/* Idle state hint */}
        {state.status === 'idle' && (
          <TerminalWindow title="playwright — ready" showCursor>
            <p className="text-[var(--text-muted)]">
              Select a test suite and click <span className="text-[var(--accent-green)]">Run Tests</span> to watch real Playwright automation execute live.
            </p>
            <p className="text-[var(--text-muted)] mt-2">
              Output streams via WebSocket in real time. No fake demos — these are actual browser tests.
            </p>
          </TerminalWindow>
        )}
      </div>
    </section>
  )
}
