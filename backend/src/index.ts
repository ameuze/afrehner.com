import './config/env' // validate env first
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { rateLimit } from 'express-rate-limit'
import path from 'path'
import { mkdirSync, existsSync } from 'fs'
import { env } from './config/env'
import apiRouter from './routes/index'
import { createWsServer } from './websocket/wsServer'
import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/requestLogger'

// Ensure reports directory exists
mkdirSync(path.resolve(env.REPORTS_DIR), { recursive: true })

const app = express()

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(express.json())
app.use(requestLogger)

// Rate limit test trigger endpoint only
const triggerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: { error: 'Too many test runs triggered. Please wait before running again.' },
  standardHeaders: true,
  legacyHeaders: false,
})

app.post('/api/test-runs', triggerLimiter)

// API routes
app.use('/api', apiRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() })
})

// Serve frontend static files if built (production)
const publicDir = path.join(__dirname, '../public')
if (existsSync(publicDir)) {
  app.use(express.static(publicDir))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'))
  })
}

app.use(errorHandler)

const server = createServer(app)

// Attach WebSocket server
createWsServer(server)

server.listen(env.PORT, () => {
  console.log(`Backend running on port ${env.PORT} (${env.NODE_ENV})`)
  if (existsSync(publicDir)) console.log(`Serving frontend from: ${publicDir}`)
  console.log(`Reports served from: ${path.resolve(env.REPORTS_DIR)}`)
  console.log(`Playwright tests dir: ${path.resolve(env.PLAYWRIGHT_TESTS_DIR)}`)
})

export default app
