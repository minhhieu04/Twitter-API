import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LIKES_MESSAGE } from '~/constants/message'
import { LikeTweetReqBody } from '~/models/requests/Like.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import likeService from '~/services/likes.services'

export const likeTweetController = async (req: Request<ParamsDictionary, any, LikeTweetReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { tweet_id } = req.body
  const result = await likeService.likeTweet(user_id, tweet_id)
  return res.json({
    message: LIKES_MESSAGE.LIKE_A_TWEET_SUCCESS,
    result: result
  })
}
