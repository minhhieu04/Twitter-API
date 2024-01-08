import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { TweetAudience, TweetType } from '~/constants/enums'
import Tweet from '~/models/schemas/Tweet.schema'

class SearchService {
  async search({ content, page, limit, user_id }: { content: string; page: number; limit: number; user_id: string }) {
    const userIdObj = new ObjectId(user_id)
    const [tweets, total] = await Promise.all([
      databaseService.tweets
        .aggregate([
          {
            $match: {
              $text: {
                $search: content
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $match: {
              $or: [
                {
                  audience: TweetAudience.Everyone
                },
                {
                  $and: [
                    {
                      audience: 1
                    },
                    {
                      'user.twitter_circle': {
                        $in: [userIdObj]
                      }
                    }
                  ]
                }
              ]
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $lookup: {
              from: 'hashtags',
              localField: 'hashtags',
              foreignField: '_id',
              as: 'hashtags'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'mentions',
              foreignField: '_id',
              as: 'mentions'
            }
          },
          {
            $addFields: {
              mentions: {
                $map: {
                  input: '$mentions',
                  as: 'mention',
                  in: {
                    _id: '$$mention._id',
                    name: '$$mention.name',
                    username: '$$mention.username',
                    email: '$$mention.email'
                  }
                }
              }
            }
          },
          {
            $lookup: {
              from: 'bookmarks',
              localField: '_id',
              foreignField: 'tweet_id',
              as: 'bookmarks'
            }
          },
          {
            $lookup: {
              from: 'likes',
              localField: '_id',
              foreignField: 'tweet_id',
              as: 'likes'
            }
          },
          {
            $lookup: {
              from: 'tweets',
              localField: '_id',
              foreignField: 'parent_id',
              as: 'tweets_children'
            }
          },
          {
            $addFields: {
              hashtags: {
                $size: '$hashtags'
              },
              likes: {
                $size: '$likes'
              },
              retweet_count: {
                $size: {
                  $filter: {
                    input: '$tweets_children',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.type', 1]
                    }
                  }
                }
              },
              comment_count: {
                $size: {
                  $filter: {
                    input: '$tweets_children',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.type', 2]
                    }
                  }
                }
              },
              quote_count: {
                $size: {
                  $filter: {
                    input: '$tweets_children',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.type', 3]
                    }
                  }
                }
              }
            }
          },
          {
            $project: {
              tweets_children: 0,
              user: {
                password: 0,
                email_verify_token: 0,
                forgot_password_token: 0,
                twitter_circle: 0,
                date_of_birth: 0
              }
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseService.tweets
        .aggregate([
          {
            $match: {
              $text: {
                $search: content
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $match: {
              $or: [
                {
                  audience: TweetAudience.Everyone
                },
                {
                  $and: [
                    {
                      audience: 1
                    },
                    {
                      'user.twitter_circle': {
                        $in: [userIdObj]
                      }
                    }
                  ]
                }
              ]
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    const tweetIds = tweets.map((tweet) => tweet._id as ObjectId)
    const date = new Date()
    await databaseService.tweets.updateMany(
      {
        _id: {
          $in: tweetIds
        }
      },
      {
        $inc: {
          user_views: 1
        },
        $set: {
          updated_at: date
        }
      }
    )
    tweets.forEach((tweet) => {
      ;(tweet.updated_at = date), (tweet.user_views += 1)
    })
    return {
      tweets,
      total: total[0].total
    }
  }
}

const searchService = new SearchService()

export default searchService
