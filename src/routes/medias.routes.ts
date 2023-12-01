import { Router } from 'express'
import { serveImageController, uploadSingleImageController } from '~/controllers/medias.controller'

const mediaRouter = Router()

/**
 * Description: Upload a single image
 * Path: /upload-image
 * Method: POST
 * Body: { file }
 */
mediaRouter.post('/upload-image', uploadSingleImageController)

/**
 * Description: View a single image
 * Path: /photo/:name
 * Method: GET
 * Params: { name }
 */
mediaRouter.get('/photo/:name', serveImageController)

export default mediaRouter
