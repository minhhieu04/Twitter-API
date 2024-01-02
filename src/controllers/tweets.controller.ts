import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TWEETS_MESSAGE } from '~/constants/message'
import { TweetReqBody } from '~/models/requests/Tweet.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import tweetsService from '~/services/tweets.services'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await tweetsService.createTweet(user_id, req.body)
  res.json({
    message: TWEETS_MESSAGE.CREATE_TWEET_SUCCESS,
    result: result
  })
}

export const getTweetController = async (req: Request, res: Response) => {
  res.json({
    message: TWEETS_MESSAGE.GET_TWEET_SUCCESSFULLY,
    resutl: req.tweet
  })
}
