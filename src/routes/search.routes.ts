import { Router } from 'express'
import { searchController } from '~/controllers/search.controller'
import { wrapRequestHandler } from '~/utils/handles'
const searchRouter = Router()

searchRouter.get('/', wrapRequestHandler(searchController))

export default searchRouter