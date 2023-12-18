import { Router } from 'express'
import { likeTweetController } from '~/controllers/likes.controller'
import { tweetIdValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handles'

const likeRouter = Router()

/**
 * Description: like a tweet
 * Path: /
 * Method: POST
 * Headers: { Authorization: 'Bearer ' + access_token }
 * Body: { tweet_id: string }
 */
likeRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(likeTweetController)
)

export default likeRouter
