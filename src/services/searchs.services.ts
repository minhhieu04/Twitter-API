import databaseService from './database.services'

class SearchService {
  async search({ content, page, limit }: { content: string; page: number; limit: number }) {
    const data = await databaseService.tweets
      .find({ $text: { $search: content } })
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()

    return data
  }
}

const searchService = new SearchService()

export default searchService
