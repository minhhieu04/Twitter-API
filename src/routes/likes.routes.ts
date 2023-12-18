import { Router } from 'express'
import { likeTweetController, unlikeTweetController } from '~/controllers/likes.controller'
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

/**
 * Description: unlike a tweet
 * Path: /tweet/:tweet_id
 * Method: Delete
 * Headers: { Authorization: 'Bearer ' + access_token }
 * Body: { tweet_id: string }
 */
likeRouter.delete(
  '/tweet/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unlikeTweetController)
)

export default likeRouter
