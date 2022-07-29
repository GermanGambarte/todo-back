import express from 'express'
import cookieParser from 'cookie-parser'

import usersRouter from './src/routes/user.routes'
import tasksRouter from './src/routes/task.routes'
import authRouter from './src/routes/auth.routes'
import 'dotenv/config'
import { verifyJWT } from './src/middlewares/vefiryJWT'
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use('/', authRouter)
app.use(verifyJWT)
app.use('/users', usersRouter)
app.use('/tasks', tasksRouter)

app.listen(5000, () => {
	console.log('Hola mundo')
})
