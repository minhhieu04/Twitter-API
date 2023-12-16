import Tweet from '~/models/schemas/Tweet.schema'
import databaseService from './database.services'
import { TweetReqBody } from '~/models/requests/Tweet.requests'
import { ObjectId } from 'mongodb'

class TweetsService {
  async createTweet(userId: string, body: TweetReqBody) {
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags: [], // TODO: Temporarily leave the array empty
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
}

const tweetsService = new TweetsService()
export default tweetsService
