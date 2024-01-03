import { ParamsDictionary, Query } from 'express-serve-static-core'
import { TweetAudience, TweetType } from '~/constants/enums'
import { Media } from '../Others'

export interface TweetReqBody {
  type: TweetType
  parent_id: string | null
  audience: TweetAudience
  content: string
  mentions: string[]
  hashtags: string[]
  medias: Media[]
}

export interface TweetParams extends ParamsDictionary {
  tweet_id: string
}

export interface TweetQuery extends Query {
  tweet_type: string
  page: string
  limit: string
}
