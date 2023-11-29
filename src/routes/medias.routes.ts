import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controller'

const mediaRouter = Router()

mediaRouter.post('/upload-image', uploadSingleImageController)

export default mediaRouter
