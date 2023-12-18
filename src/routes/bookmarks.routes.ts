import { Router } from 'express'
import { bookmarkTweetController } from '~/controllers/bookmarks.controller'
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
bookmarkRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(bookmarkTweetController))

export default bookmarkRouter
