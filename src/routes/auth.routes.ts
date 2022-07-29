import { Router } from 'express'

import { register, login, refresh } from '../controllers/auth.controlles'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/refresh', refresh)

export default router