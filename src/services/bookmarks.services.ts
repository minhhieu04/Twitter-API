import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Bookmark from '~/models/schemas/Bookmark.schema'

class BookmarkService {
  async bookmarkTweet(user_id: string, tweet_id: string) {
    const bookmarkDocument = await databaseService.bookmarks.findOneAndUpdate(
      {
        tweet_id: new ObjectId(tweet_id),
        user_id: new ObjectId(user_id)
      },
      {
        $setOnInsert: new Bookmark({
          tweet_id: new ObjectId(tweet_id),
          user_id: new ObjectId(user_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return bookmarkDocument
  }

  async unbookmarkTweet(user_id: string, tweet_id: string) {
    await databaseService.bookmarks.findOneAndDelete({
      tweet_id: new ObjectId(tweet_id),
      user_id: new ObjectId(user_id)
    })
  }
}
const bookmarkService = new BookmarkService()

export default bookmarkService
