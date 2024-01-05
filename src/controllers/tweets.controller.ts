import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetType } from '~/constants/enums'
import { TWEETS_MESSAGE } from '~/constants/message'
import { Pagination, TweetParams, TweetQuery, TweetReqBody } from '~/models/requests/Tweet.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import Tweet from '~/models/schemas/Tweet.schema'
import databaseService from '~/services/database.services'
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
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await tweetsService.increaseView(req.params.tweet_id, user_id)
  const tweet = {
    ...req.tweet,
    guest_views: result.guest_views,
    user_views: result.user_views,
    total_views: result.guest_views + result.user_views,
    updated_at: result.updated_at
  } as Tweet
  res.json({
    message: TWEETS_MESSAGE.GET_TWEET_SUCCESSFULLY,
    resutl: tweet
  })
}

export const getTweetChildrenController = async (req: Request<TweetParams, any, any, TweetQuery>, res: Response) => {
  const limit = +req.query.limit
  const page = +req.query.page
  const tweet_type = +req.query.tweet_type as TweetType
  const user_id = req.decode_authorization?.user_id

  const { total, tweets } = await tweetsService.getTweetChildren({
    tweet_id: req.params.tweet_id,
    limit,
    page,
    tweet_type,
    user_id
  })
  res.json({
    message: TWEETS_MESSAGE.GET_TWEET_CHILDREN_SUCCESSFULLY,
    result: {
      tweets,
      tweet_type,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}

export const getNewFeedsController = async (req: Request<ParamsDictionary, any, any, Pagination>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const limit = +req.query.limit
  const page = +req.query.page
  const result = await tweetsService.getNewFeeds({
    user_id,
    limit,
    page
  })
  res.json({
    message: TWEETS_MESSAGE.GET_NEW_FEEDS_SUCCESSFULLY,
    result
  })
}
