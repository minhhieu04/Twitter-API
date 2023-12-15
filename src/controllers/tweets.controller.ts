import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetReqBody } from '~/models/requests/Tweet.requests'

export const createTweetController = (req: Request<ParamsDictionary, any, TweetReqBody>, res: Response) => {
  res.json('success')
}
