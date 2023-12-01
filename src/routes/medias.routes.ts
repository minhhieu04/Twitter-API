import { Router } from 'express'
import { serveImageController, uploadImageController } from '~/controllers/medias.controller'

const mediaRouter = Router()

/**
 * Description: Upload a single image
 * Path: /upload-image
 * Method: POST
 * Body: { file }
 */
mediaRouter.post('/upload-image', uploadImageController)

/**
 * Description: View a single image
 * Path: /photo/:name
 * Method: GET
 * Params: { name }
 */
mediaRouter.get('/photo/:name', serveImageController)

export default mediaRouter
