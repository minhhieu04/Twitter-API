import express from 'express'
import env from 'dotenv'
import databaseService from '~/services/database.services'
import userRouter from '~/routes/users.routes'
import { errorHandler } from './utils/handles'

env.config()

const app = express()
const PORT = process.env.PORT_LOCAL
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Twitter API')
})

app.use('/users', userRouter)
app.use(errorHandler)

databaseService.connect()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
