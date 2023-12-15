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
