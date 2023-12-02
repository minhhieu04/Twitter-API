import { Request } from 'express'
import { getFileNameWithoutExtension, handleUploadImage, handleUploadVideo } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import fs from 'fs'
import { isProduction } from '~/constants/configServer'
import path from 'path'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Orthers'

class MediaService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newFilename = getFileNameWithoutExtension(file.newFilename)
        // const newPath = UPLOAD_IMAGE_DIR + '/' + newFilename + '.jpg'
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newFilename}.jpg`)
        // Handle rename extension and reduce image quality
        await sharp(file.filepath).jpeg({ quality: 80 }).toFile(newPath)
        // Delete original file in temp folder
        fs.unlink(file.filepath, (err) => {
          if (err) {
            console.log(`${file.filepath} was deleted`, err)
          }
        })
        return {
          url: isProduction
            ? `${process.env.SERVER_HOST_URL}/medias/photo/${newFilename}.jpg`
            : `${process.env.SERVER_LOCAL_URL}/medias/photo/${newFilename}.jpg`,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    const file = await handleUploadVideo(req)
    const result: Media = {
      url: isProduction
        ? `${process.env.SERVER_HOST_URL}/medias/video-stream/${file.newFilename}`
        : `${process.env.SERVER_LOCAL_URL}/medias/video-stream/${file.newFilename}`,
      type: MediaType.Video
    }
    return result
  }
}

const mediaService = new MediaService()
export default mediaService
