import { Router } from 'express'
import {
  serveImageController,
  serveVideoController,
  serveVideoStreamController,
  uploadImageController,
  uploadVideoController
} from '~/controllers/medias.controller'

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

/**
 * Description: Upload a single video
 * Path: /upload-video
 * Method: POST
 * Body: { file }
 */
mediaRouter.post('/upload-video', uploadVideoController)

/**
 * Description: View a single video
 * Path: /video/:name
 * Method: GET
 * Params: { name }
 */
mediaRouter.get('/video/:name', serveVideoController) // default
mediaRouter.get('/video-stream/:name', serveVideoStreamController) // custom

export default mediaRouter
