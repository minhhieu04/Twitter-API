import { ObjectId } from 'mongodb'
import { Media } from '../Others'
import { TweetAudience, TweetType } from '~/constants/enums'

interface TweetConstructor {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  parent_id: string | null // Only null if it is the original tweet
  audience: TweetAudience
  content: string
  mentions: string[]
  hashtags: ObjectId[]
  medias: Media[]
  guest_views?: number
  user_views?: number
  created_at?: Date
  updated_at?: Date
}

export default class Tweet {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  parent_id: ObjectId | null // Only null if it is the original tweet
  audience: TweetAudience
  content: string
  mentions: ObjectId[]
  hashtags: ObjectId[]
  medias: Media[]
  guest_views: number
  user_views: number
  created_at: Date
  updated_at: Date
  constructor({
    _id,
    user_id,
    type,
    parent_id,
    audience,
    content,
    mentions,
    hashtags,
    medias,
    guest_views,
    user_views,
    created_at,
    updated_at
  }: TweetConstructor) {
    const date = new Date()
    this._id = _id
    this.user_id = user_id
    this.type = type
    this.parent_id = parent_id ? new ObjectId(parent_id) : null
    this.audience = audience
    this.content = content
    this.mentions = mentions.map((mention) => new ObjectId(mention))
    this.hashtags = hashtags
    this.medias = medias
    this.guest_views = guest_views || 0
    this.user_views = user_views || 0
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}