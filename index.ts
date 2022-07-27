import express from 'express'

import usersRouter from './src/routes/user.routes'
import tasksRouter from './src/routes/task.routes'
import 'dotenv/config'
const app = express()

app.use(express.json())
app.use('/users', usersRouter)
app.use('/tasks', tasksRouter)

app.listen(5000, () => {
	console.log('Hola mundo')
})
