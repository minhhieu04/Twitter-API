import Hashtag from '~/models/schemas/Hashtag.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import databaseService from './database.services'
import { TweetReqBody } from '~/models/requests/Tweet.requests'
import { ObjectId, ReturnDocument, WithId } from 'mongodb'

class TweetsService {
  async checkAndCreateHashtags(hashtags: string[]) {
    const hashtagDocuments = await Promise.all(
      hashtags.map((hashtag) => {
        // Find the hashtag in the database, if found, take it, if not, create a new one
        return databaseService.hashtags.findOneAndUpdate(
          { name: hashtag },
          {
            $setOnInsert: new Hashtag({ name: hashtag })
          },
          {
            upsert: true,
            returnDocument: 'after'
          }
        )
      })
    )
    return hashtagDocuments.map((hashtag) => hashtag?._id) as ObjectId[]
  }

  async createTweet(userId: string, body: TweetReqBody) {
    const hashtags = await this.checkAndCreateHashtags(body.hashtags)
    console.log(hashtags)
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags,
        medias: body.medias,
        mentions: body.mentions,
        parent_id: body.parent_id,
        user_id: new ObjectId(userId),
        type: body.type
      })
    )
    const newTweet = await databaseService.tweets.findOne({ _id: result.insertedId })
    return newTweet
  }

  async increaseView(tweet_id: string, user_id?: string) {
    const result = await databaseService.tweets.findOneAndUpdate(
      {
        _id: new ObjectId(tweet_id)
      },
      {
        $inc: user_id ? { user_views: 1 } : { guest_views: 1 },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          user_views: 1,
          guest_views: 1
        }
      }
    )
    return result as WithId<{
      user_views: number
      guest_views: number
    }>
  }
}

const tweetsService = new TweetsService()
export default tweetsService
