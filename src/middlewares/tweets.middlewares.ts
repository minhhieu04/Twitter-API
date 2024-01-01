import { wrapRequestHandler } from './../utils/handles'
import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType, UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { TWEETS_MESSAGE, USERS_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import Tweet from '~/models/schemas/Tweet.schema'
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
          options: async (value, { req }) => {
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
            ;(req as Request).tweet = tweet
            return true
          }
        }
      }
    },
    ['body', 'params']
  )
)

// Muốn sử dụng async/await trong handler express thì phải sử dụng try/catch hoặc wrapRequestHandler
export const audienceValidator = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tweet = req.tweet as Tweet
  const { user_id } = req.decode_authorization as TokenPayload
  if (tweet.audience === TweetAudience.TweetCircle) {
    // Kiểm tra người xem đã đăng nhập chưa
    if (!user_id) {
      throw new ErrorWithStatus({ message: USERS_MESSAGE.ACCESS_TOKEN_IS_REQUIRED, status: HTTP_STATUS.UNAUTHORIZED })
    }
    const author = await databaseService.users.findOne({ _id: new ObjectId(tweet.user_id) })
    // Kiểm tra tài khoản tác giả có vấn đề gì (bị khóa/bị xóa) không
    if (!author || author.verify === UserVerifyStatus.Banned) {
      throw new ErrorWithStatus({ message: USERS_MESSAGE.USER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }
    // Kiểm tra người dùng có phải là tác giả hay người nằm trong twitter circle của tác giả hay không
    const isInTwitterCirle = author.twitter_circle.some((user_circle_id) => user_circle_id.equals(user_id))
    if (!author._id.equals(user_id) && !isInTwitterCirle) {
      throw new ErrorWithStatus({ message: TWEETS_MESSAGE.TWEET_IS_NOT_PUBLIC, status: HTTP_STATUS.FORBIDDEN })
    }
  }
  next()
})
