import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { MEDIAS_MESSAGE } from '~/constants/message'
import mediaService from '~/services/medias.services'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediaService.uploadImage(req)
  return res.json({
    message: MEDIAS_MESSAGE.UPLOAD_IMAGE_SUCCESS,
    result: result
  })
}

export const serveImageController = (req: Request, res: Response) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      if (!res.headersSent) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: MEDIAS_MESSAGE.NOT_FOUND })
      }
    }
  })
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediaService.uploadVideo(req)
  return res.json({
    message: MEDIAS_MESSAGE.UPLOAD_VIDEO_SUCCESS,
    result: result
  })
}

export const serveVideoController = (req: Request, res: Response) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, name), (err) => {
    if (err) {
      if (!res.headersSent) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: MEDIAS_MESSAGE.NOT_FOUND })
      }
    }
  })
}
