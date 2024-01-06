import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { SearchQuery } from '~/models/requests/Search.requests'
import searchService from '~/services/searchs.services'
import { SEARCHS_MESSAGE } from '~/constants/message'
export const searchController = async (req: Request<ParamsDictionary, any, any, SearchQuery>, res: Response) => {
  const page = +req.query.page
  const limit = +req.query.limit
  const content = req.query.content
  const resutl = await searchService.search({ content, page, limit })
  res.json({
    message: SEARCHS_MESSAGE.SEARCH_SUCCESS,
    resutl
  })
}
