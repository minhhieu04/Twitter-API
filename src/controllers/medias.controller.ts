import { NextFunction, Request, Response } from 'express'
import path from 'path'
import mediaService from '~/services/medias.services'
import { handleUploadSingleImage } from '~/utils/file'
console.log(path.resolve('uploads'))

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediaService.handleUploadSingleImage(req)
  console.log(result)
  return res.json({ result })
}
