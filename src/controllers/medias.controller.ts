import { NextFunction, Request, Response } from 'express'
import formidable from 'formidable'
import path from 'path'
console.log(path.resolve('uploads'))

export const uploadSingleImageController = (req: Request, res: Response, next: NextFunction) => {
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 1024 * 1024 // 1MB
  })
  form.parse(req, (err, fields, files) => {
    if (err) {
      throw new err()
    }
    res.json({ message: 'ok' })
  })
}
