import { Router } from 'express'
import { bookmarkTweetController, unbookmarkTweetController } from '~/controllers/bookmarks.controller'
import { tweetIdValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handles'

const bookmarkRouter = Router()

/**
 * Description: Create a new bookmark tweet
 * Path: /
 * Method: POST
 * Headers: { Authorization: 'Bearer ' + access_token }
 * Body: { tweet_id: string }
 */
bookmarkRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(bookmarkTweetController)
)

/**
 * Description: unbookmark a tweet
 * Path: /tweet/:tweet_id
 * Method: DELETE
 * Headers: { Authorization: 'Bearer ' + access_token }
 * params: { tweet_id }
 */
bookmarkRouter.delete(
  '/tweet/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unbookmarkTweetController)
)

export default bookmarkRouter
