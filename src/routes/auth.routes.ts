import { Router } from 'express'

import {
	register,
	login,
	refresh,
	logout
} from '../controllers/auth.controlles'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/refresh', refresh)
router.get('/logout', logout)

export default router
