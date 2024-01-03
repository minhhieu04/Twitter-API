import { isUserLoggedInValidator } from './../middlewares/users.middlewares'
import { Router } from 'express'
import { createTweetController, getTweetChildrenController, getTweetController } from '~/controllers/tweets.controller'
import { audienceValidator, createTweetValidator, tweetIdValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handles'

const tweetRouter = Router()

/**
 * Description: Create a new tweet
 * Path: /
 * Method: POST
 * Headers: { Authorization: 'Bearer ' + access_token }
 * Body: { TweetReqBody }
 */
tweetRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  wrapRequestHandler(createTweetController)
)

/**
 * Description: Get tweet detail
 * Path: /:tweet_id
 * Method: GET
 * Headers: { Authorization?: 'Bearer ' + access_token }
 */
tweetRouter.get(
  '/:tweet_id',
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetController)
)

/**
 * Description: Get tweet children
 * Path: /:tweet_id
 * Method: GET
 * Headers: { Authorization?: 'Bearer ' + access_token }
 * Params: { tweet_id: string}
 * Query: { page: string, limit: string, tweet_type: TweetType }
 */
tweetRouter.get(
  '/:tweet_id/children',
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetChildrenController)
)

export default tweetRouter
