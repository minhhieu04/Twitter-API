import express from 'express'
import env from 'dotenv'
import databaseService from '~/services/database.services'
import userRouter from '~/routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediaRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import cors from 'cors'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import tweetRouter from './routes/tweets.routes'
import bookmarkRouter from './routes/bookmarks.routes'
import likeRouter from './routes/likes.routes'
import searchRouter from './routes/search.routes'
// import '~/utils/fake'

env.config()

const app = express()
const PORT = process.env.PORT_LOCAL
databaseService.connect().then(() => {
  databaseService.createIndexUsers()
  databaseService.createIndexRefreshTokens()
  databaseService.createIndexFollowers()
  databaseService.createIndexVideoStatus()
  databaseService.createIndexTweets()
})
app.use(express.json())
app.use(cors())

// create uploads folder
initFolder()

app.get('/', (req, res) => {
  res.send('Twitter API')
})

app.use('/users', userRouter)
app.use('/medias', mediaRouter)
app.use('/tweets', tweetRouter)
app.use('/bookmarks', bookmarkRouter)
app.use('/likes', likeRouter)
app.use('/search', searchRouter)
app.use(defaultErrorHandler)
// app.use('/medias/video', express.static(UPLOAD_VIDEO_DIR))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
