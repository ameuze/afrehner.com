import { useCallback, useEffect, useRef, useState } from 'react'
import { api, ApiError } from '../lib/api'

export type RunnerStatus = 'idle' | 'connecting' | 'running' | 'passed' | 'failed' | 'cancelled' | 'error' | 'busy'

export interface OutputLine {
  chunk: string
  stream: 'stdout' | 'stderr'
  ts: number
}

export interface RunnerState {
  status: RunnerStatus
  runId: string | null
  lines: OutputLine[]
  error: string | null
  stats: {
    total: number
    passed: number
    failed: number
    durationMs: number
  } | null
}

const WS_URL = (() => {
  const base = import.meta.env.VITE_WS_URL
  if (base) return base
  // Derive from current page location
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${window.location.host}`
})()

export function useTestRunner() {
  const [state, setState] = useState<RunnerState>({
    status: 'idle',
    runId: null,
    lines: [],
    error: null,
    stats: null,
  })

  const wsRef = useRef<WebSocket | null>(null)

  const closeWs = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const triggerRun = useCallback(async (suiteId: string) => {
    setState({ status: 'connecting', runId: null, lines: [], error: null, stats: null })
    closeWs()

    try {
      const run = await api.triggerRun(suiteId)
      const runId = run.id

      setState(s => ({ ...s, status: 'connecting', runId }))

      const ws = new WebSocket(`${WS_URL}/ws`)
      wsRef.current = ws

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'subscribe', runId }))
      }

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string) as {
            type: string
            runId?: string
            payload?: {
              chunk?: string
              stream?: 'stdout' | 'stderr'
              ts?: number
              status?: string
              durationMs?: number
              totalTests?: number
              passedTests?: number
              failedTests?: number

              message?: string
            }
          }

          if (msg.runId && msg.runId !== runId) return

          switch (msg.type) {
            case 'run:started':
              setState(s => ({ ...s, status: 'running' }))
              break
            case 'run:output': {
              const p = msg.payload ?? {}
              const line: OutputLine = {
                chunk: p.chunk ?? '',
                stream: p.stream ?? 'stdout',
                ts: p.ts ?? Date.now(),
              }
              setState(s => ({ ...s, lines: [...s.lines, line] }))
              break
            }
            case 'run:finished': {
              const p = msg.payload ?? {}
              const status = (p.status ?? 'failed') as RunnerStatus
              setState(s => ({
                ...s,
                status,
                stats: {
                  total: p.totalTests ?? 0,
                  passed: p.passedTests ?? 0,
                  failed: p.failedTests ?? 0,
                  durationMs: p.durationMs ?? 0,
                },
              }))
              closeWs()
              break
            }
            case 'run:error':
              setState(s => ({ ...s, status: 'error', error: msg.payload?.message ?? 'Unknown error' }))
              closeWs()
              break
          }
        } catch {
          // ignore parse errors
        }
      }

      ws.onerror = () => {
        setState(s => ({ ...s, status: 'error', error: 'WebSocket connection failed' }))
      }

      ws.onclose = () => {
        // If still in connecting/running state when WS closes unexpectedly, mark error
        setState(s => {
          if (s.status === 'connecting' || s.status === 'running') {
            return { ...s, status: 'error', error: 'Connection lost' }
          }
          return s
        })
      }
    } catch (err) {
      const isBusy = err instanceof ApiError && err.status === 429
      setState(s => ({
        ...s,
        status: isBusy ? 'busy' : 'error',
        error: err instanceof Error ? err.message : 'Failed to trigger run',
      }))
    }
  }, [closeWs])

  const cancelRun = useCallback(async () => {
    if (!state.runId) return
    try {
      await api.cancelRun(state.runId)
      setState(s => ({ ...s, status: 'cancelled' }))
    } catch {
      // ignore
    }
    closeWs()
  }, [state.runId, closeWs])

  const reset = useCallback(() => {
    closeWs()
    setState({ status: 'idle', runId: null, lines: [], error: null, stats: null })
  }, [closeWs])

  useEffect(() => () => closeWs(), [closeWs])

  return { state, triggerRun, cancelRun, reset }
}
