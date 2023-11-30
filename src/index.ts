import express from 'express'
import env from 'dotenv'
import databaseService from '~/services/database.services'
import userRouter from '~/routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediaRouter from './routes/medias.routes'
import { initFoler } from './utils/file'
import { UPLOAD_DIR } from './constants/dir'

env.config()

const app = express()
const PORT = process.env.PORT_LOCAL
databaseService.connect()
app.use(express.json())

// create uploads folder
initFoler()

app.get('/', (req, res) => {
  res.send('Twitter API')
})

app.use('/users', userRouter)
app.use('/medias', mediaRouter)
app.use(defaultErrorHandler)
app.use('/medias/photo', express.static(UPLOAD_DIR))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
