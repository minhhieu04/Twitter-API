import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schemas'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Follower from '~/models/schemas/Follower.schema'
import VideoStatus from '~/models/schemas/VideoStatus.shema'
import Tweet from '~/models/schemas/Tweet.schema'
config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@minhhieu.rhbjque.mongodb.net/?retryWrites=true&w=majority`
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })
    this.db = this.client.db(process.env.DB_NAME)
  }

  public async connect(): Promise<void> {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (err) {
      console.log('Could not connect to MongoDB. Please check your connection string.')
      throw err
    }
  }

  async createIndexVideoStatus() {
    const exists = await this.videoStatus.indexExists('name_1')
    if (!exists) {
      this.videoStatus.createIndex({ name: 1 }, { unique: true })
    }
  }

  async createIndexUsers() {
    const exists = await this.users.indexExists(['email_1', 'email_1_password_1', 'username_1'])
    if (!exists) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
      this.users.createIndex({ username: 1 }, { unique: true })
    }
  }

  async createIndexRefreshTokens() {
    const exists = await this.refreshToken.indexExists(['exp_1', 'token_1'])
    if (!exists) {
      this.refreshToken.createIndex(
        { exp: 1 },
        // Automatically removed from the refreshToken collection when the exp field expires
        { expireAfterSeconds: 0 }
      )
      this.refreshToken.createIndex({ token: 1 })
    }
  }

  createIndexFollowers() {
    const exists = this.followers.indexExists('user_id_1_followed_user_id_1')
    if (!exists) {
      this.followers.createIndex({ user_id: 1, followed_user_id: 1 })
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKEN_COLLECTION as string)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWERS_COLLECTION as string)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(process.env.DB_VIDEO_STATUS_COLLECTION as string)
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection(process.env.DB_TWEETS_COLLECTION as string)
  }
}
const databaseService = new DatabaseService()

export default databaseService
