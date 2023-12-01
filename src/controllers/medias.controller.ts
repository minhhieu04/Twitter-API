import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/message'
import mediaService from '~/services/medias.services'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediaService.handleUploadSingleImage(req)
  console.log(result)
  return res.json({ result })
}

export const serveImageController = (req: Request, res: Response) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_DIR, name), (err) => {
    if (err) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Not Found' })
    }
  })
}
