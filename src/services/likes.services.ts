import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Like from '~/models/schemas/Like.schema'

class LikeService {
  async likeTweet(user_id: string, tweet_id: string) {
    const likeDocument = await databaseService.likes.findOneAndUpdate(
      {
        tweet_id: new ObjectId(tweet_id),
        user_id: new ObjectId(user_id)
      },
      {
        $setOnInsert: new Like({
          tweet_id: new ObjectId(tweet_id),
          user_id: new ObjectId(user_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return likeDocument
  }
}
const likeService = new LikeService()

export default likeService
