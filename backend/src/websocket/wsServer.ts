import { WebSocketServer, WebSocket } from 'ws'
import type { IncomingMessage } from 'http'
import type { Server } from 'http'
import { testRunnerService, type OutputLine, type RunFinishedPayload } from '../services/testRunner.service'

interface WsClient extends WebSocket {
  subscribedRunId?: string
  isAlive: boolean
}

type WsMessageType =
  | 'subscribe'
  | 'unsubscribe'
  | 'ping'

interface ClientMessage {
  type: WsMessageType
  runId?: string
}

function send(ws: WebSocket, type: string, runId?: string, payload?: unknown): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, runId, payload }))
  }
}

export function createWsServer(server: Server): WebSocketServer {
  const wss = new WebSocketServer({ server, path: '/ws' })

  // Heartbeat to detect dead connections
  const heartbeat = setInterval(() => {
    wss.clients.forEach((rawClient) => {
      const client = rawClient as WsClient
      if (!client.isAlive) {
        client.terminate()
        return
      }
      client.isAlive = false
      client.ping()
    })
  }, 30000)

  wss.on('close', () => clearInterval(heartbeat))

  // Wire test runner events → broadcast to subscribed clients
  testRunnerService.on('run:started', (runId: string, payload: unknown) => {
    broadcast(wss, runId, 'run:started', runId, payload)
  })

  testRunnerService.on('run:output', (runId: string, line: OutputLine) => {
    broadcast(wss, runId, 'run:output', runId, line)
  })

  testRunnerService.on('run:finished', (runId: string, payload: RunFinishedPayload) => {
    broadcast(wss, runId, 'run:finished', runId, payload)
  })

  testRunnerService.on('run:error', (runId: string, payload: unknown) => {
    broadcast(wss, runId, 'run:error', runId, payload)
  })

  wss.on('connection', (rawClient: WebSocket, _req: IncomingMessage) => {
    const client = rawClient as WsClient
    client.isAlive = true

    client.on('pong', () => { client.isAlive = true })

    client.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString()) as ClientMessage

        if (msg.type === 'ping') {
          send(client, 'pong')
          return
        }

        if (msg.type === 'subscribe' && msg.runId) {
          client.subscribedRunId = msg.runId

          // Replay buffered output for already-running tests
          const buffer = testRunnerService.getBuffer(msg.runId)
          if (buffer.length > 0) {
            send(client, 'run:started', msg.runId, {})
            for (const line of buffer) {
              send(client, 'run:output', msg.runId, line)
            }
          }
        }

        if (msg.type === 'unsubscribe') {
          client.subscribedRunId = undefined
        }
      } catch {
        send(client, 'error', undefined, { message: 'Invalid message format' })
      }
    })

    client.on('close', () => {
      client.subscribedRunId = undefined
    })
  })

  return wss
}

function broadcast(wss: WebSocketServer, runId: string, type: string, msgRunId: string, payload: unknown): void {
  wss.clients.forEach((rawClient) => {
    const client = rawClient as WsClient
    if (client.subscribedRunId === runId) {
      send(client, type, msgRunId, payload)
    }
  })
}
