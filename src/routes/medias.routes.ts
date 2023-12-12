import { Router } from 'express'
import {
  serveImageController,
  serveVideoController,
  uploadVideoHLSController,
  serveVideoStreamController,
  uploadImageController,
  uploadVideoController,
  serveM3u8Controller,
  serveSegmentController,
  videoStatusController
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
 * Description: View a single video (default)
 * Path: /video/:name
 * Method: GET
 * Params: { name }
 */
mediaRouter.get('/video/:name', serveVideoController)

/**
 * Description: View a single video using HLS stream
 * Path: /video-hls/:name
 * Method: GET
 * Params: { name }
 */
mediaRouter.get('/video-stream/:name', serveVideoStreamController)

/**
 * Description: Serve video m3u8
 * Path: /video-hls/:id/master.m3u8
 * Method: GET
 * Params: { id }
 */
mediaRouter.get('/video-hls/:id/master.m3u8', serveM3u8Controller)

/**
 * Description: Serve segment of m3u8
 * Path: /video-hls/:id/:v/:segment
 * Method: GET
 * Params: { id, v, segment }
 */
mediaRouter.get('/video-hls/:id/:v/:segment', serveSegmentController)

/**
 * Description: Check video encoding status
 * Path: /video-status/:id
 * Method: GET
 * Params: { id }
 */
mediaRouter.get('/video-status/:id', videoStatusController)

export default mediaRouter
