import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { TWEETS_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/handles'
import { validate } from '~/utils/validation'

const tweetType = numberEnumToArray(TweetType)
const tweetAudience = numberEnumToArray(TweetAudience)
const mediaType = numberEnumToArray(MediaType)

export const createTweetValidator = validate(
  checkSchema({
    type: {
      isIn: {
        options: [tweetType], // [[0,1,2,3]]
        errorMessage: TWEETS_MESSAGE.INVALID_TYPE
      }
    },
    audience: {
      isIn: {
        options: [tweetAudience],
        errorMessage: TWEETS_MESSAGE.INVALID_AUDIENCE
      }
    },
    parent_id: {
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          // Nếu type là Retweet, Comment, QuoteTweet (1,2,3) thì parent_id phải là tweet_id của tweet cha
          if ([TweetType.Retweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) && !ObjectId.isValid(value)) {
            throw new Error(TWEETS_MESSAGE.PARENT_ID_MUST_BE_A_VALID_TWEET_ID)
          }
          // Nếu type là Tweet (1) thì parent_id phải là null
          if (TweetType.Tweet === type && value !== null) {
            throw new Error(TWEETS_MESSAGE.PARENT_ID_MUST_BE_NULL)
          }
          return true
        }
      }
    },
    content: {
      isString: true,
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          const mentions = req.body.mentions as string[]
          const hashtags = req.body.hashtags as string[]
          // Nếu type là Tweet, Comment, QuoteTweet và không có mentions và hashtag thì content không được là string rỗng
          if (
            [TweetType.Tweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) &&
            isEmpty(mentions) &&
            isEmpty(hashtags) &&
            value === ''
          ) {
            throw new Error(TWEETS_MESSAGE.CONTENT_MUST_BE_NOT_EMPTY_STRING)
          }
          // Nếu type là Retweet thì content phải là string rỗng
          if (TweetType.Retweet === type && value !== '') {
            throw new Error(TWEETS_MESSAGE.CONTENT_MUST_BE_EMPTY_STRING)
          }
          return true
        }
      }
    },
    mentions: {
      isArray: true,
      custom: {
        options: (value) => {
          if (value.some((item: any) => !ObjectId.isValid(item))) {
            throw new Error(TWEETS_MESSAGE.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
          }
          return true
        }
      }
    },
    hashtags: {
      isArray: true,
      custom: {
        options: (value) => {
          if (value.some((item: any) => typeof item !== 'string')) {
            throw new Error(TWEETS_MESSAGE.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING)
          }
          return true
        }
      }
    },
    medias: {
      isArray: true,
      custom: {
        options: (value) => {
          if (
            value.some((item: any) => {
              typeof item.url !== 'string' || !mediaType.includes(item.type)
            })
          ) {
            throw new Error(TWEETS_MESSAGE.MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
          }
          return true
        }
      }
    }
  })
)

export const tweetIdValidator = validate(
  checkSchema(
    {
      tweet_id: {
        custom: {
          options: async (value) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: TWEETS_MESSAGE.INVALID_TWEET_ID,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            const tweet = await databaseService.tweets.findOne({ _id: new ObjectId(value) })
            if (!tweet) {
              throw new ErrorWithStatus({
                message: TWEETS_MESSAGE.TWEET_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['body', 'params']
  )
)
