import { Router } from 'express'
import {
  serveImageController,
  serveVideoController,
  uploadVideoHLSController,
  serveVideoStreamController,
  uploadImageController,
  uploadVideoController,
  serveM3u8Controller,
  serveSegmentController
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
mediaRouter.post('/upload-video-hls', uploadVideoHLSController)

/**
 * Description: View a single video
 * Path: /video/:name
 * Method: GET
 * Params: { name }
 */
mediaRouter.get('/video/:name', serveVideoController) // default
mediaRouter.get('/video-stream/:name', serveVideoStreamController) // custom
mediaRouter.get('/video-hls/:id/master.m3u8', serveM3u8Controller)
mediaRouter.get('/video-hls/:id/:v/:segment', serveSegmentController)

export default mediaRouter
