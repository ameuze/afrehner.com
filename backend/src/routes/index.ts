import { Router } from 'express'
import testRunsRouter from './testRuns.routes'

const router = Router()

router.use('/test-runs', testRunsRouter)

export default router
