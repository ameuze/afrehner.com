import { Router } from 'express'
import { listRuns, getRun, triggerRun, cancelRun } from '../controllers/testRuns.controller'

const router = Router()

router.get('/', listRuns)
router.get('/:id', getRun)
router.post('/', triggerRun)
router.post('/:id/cancel', cancelRun)

export default router
