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
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handles'

const mediaRouter = Router()

/**
 * Description: Upload a single image
 * Path: /upload-image
 * Method: POST
 * Headers: { Authorization: 'Bearer ' + access_token }
 * Body: { file }
 */
mediaRouter.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadImageController)
)

/**
 * Description: View a single image
 * Path: /photo/:name
 * Method: GET
 * Params: { name }
 */
mediaRouter.get('/photo/:name', wrapRequestHandler(serveImageController))

/**
 * Description: Upload a single video
 * Path: /upload-video
 * Method: POST
 * Headers: { Authorization: 'Bearer ' + access_token }
 * Body: { file }
 */
mediaRouter.post(
  '/upload-video',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoController)
)

/**
 * Description: Upload a single video and convert to HSL video (m3u8)
 * Path: /upload-video
 * Method: POST
 * Headers: { Authorization: 'Bearer ' + access_token }
 * Body: { file }
 */
mediaRouter.post(
  '/upload-video-hls',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoHLSController)
)

/**
 * Description: View a single video (default)
 * Path: /video/:name
 * Method: GET
 * Params: { name }
 */
mediaRouter.get('/video/:name', wrapRequestHandler(serveVideoController))

/**
 * Description: View a single video using HLS stream
 * Path: /video-hls/:name
 * Method: GET
 * Params: { name }
 */
mediaRouter.get('/video-stream/:name', wrapRequestHandler(serveVideoStreamController))

/**
 * Description: Serve video m3u8
 * Path: /video-hls/:id/master.m3u8
 * Method: GET
 * Params: { id }
 */
mediaRouter.get('/video-hls/:id/master.m3u8', wrapRequestHandler(serveM3u8Controller))

/**
 * Description: Serve segment of m3u8
 * Path: /video-hls/:id/:v/:segment
 * Method: GET
 * Params: { id, v, segment }
 */
mediaRouter.get('/video-hls/:id/:v/:segment', wrapRequestHandler(serveSegmentController))

/**
 * Description: Check video encoding status
 * Path: /video-status/:id
 * Method: GET
 * Headers: { Authorization: 'Bearer ' + access_token }
 * Params: { id }
 */
mediaRouter.get('/video-status/:id', wrapRequestHandler(videoStatusController))

export default mediaRouter
