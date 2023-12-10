import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { MEDIAS_MESSAGE } from '~/constants/message'
import mediaService from '~/services/medias.services'
import fs from 'fs'
import mime from 'mime'
import { HttpStatusCode } from 'axios'

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

export const uploadVideoHLSController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediaService.uploadHLSVideo(req)
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

export const serveVideoStreamController = (req: Request, res: Response) => {
  const range = req.headers.range
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Requires Range header')
  }

  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)

  // Dung lượng video (bytes)
  const videoSize = fs.statSync(videoPath).size
  // Dung lượng video cho mỗi phân đoạn stream
  const chunkSize = 10 ** 6 // 1MB
  // Lấy giá trị byte bắt đầu từ header range
  const start = Number(range.replace(/\D/g, ''))
  // Lấy giá trị byte kết thúc, nếu vượt quá dung lượng thì lấy giá trị videoSize
  const end = Math.min(start + chunkSize, videoSize)
  // Dung lượng thực tế cho mỗi đoạn Video stream sẽ thường là giá trị chunkSize, trừ đoạn cuối cùng
  const contentLength = end - start

  const contentType = mime.getType(videoPath) || 'video/*'

  const headers = {
    'Content-Range': `bytes ${start}-${end - 1}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }

  res.writeHead(HTTP_STATUS.PARTICAL_CONTENT, headers)

  const videoStream = fs.createReadStream(videoPath, { start, end })
  videoStream.pipe(res)

  videoStream.on('error', (err) => {
    console.error('Error reading video stream:', err)
    res.end()
  })

  res.on('close', () => {
    // Ensure the stream is closed if the client disconnects
    videoStream.destroy()
  })
}
