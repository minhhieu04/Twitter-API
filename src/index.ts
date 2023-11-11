import express from 'express'
import env from 'dotenv'
import databaseService from '~/services/database.services'
import userRouter from '~/routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'

env.config()

const app = express()
const PORT = process.env.PORT_LOCAL
databaseService.connect()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Twitter API')
})

app.use('/users', userRouter)
app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
