import { Request } from 'express'
import { getFileNameWithoutExtension, handleUploadSingleImage } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import fs from 'fs'
import { isProduction } from '~/constants/configServer'
import path from 'path'

class MediaService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newFilename = getFileNameWithoutExtension(file.newFilename)
    // const newPath = UPLOAD_DIR + '/' + newFilename + '.jpg'
    const newPath = path.resolve(UPLOAD_DIR, `${newFilename}.jpg`)
    // Handle rename extension and reduce image quality
    await sharp(file.filepath).jpeg({ quality: 80 }).toFile(newPath)
    // Delete original file in temp folder
    fs.unlink(file.filepath, (err) => {
      if (err) {
        console.log(`${file.filepath} was deleted`, err)
      }
    })
    return isProduction
      ? `${process.env.SERVER_HOST_URL}/medias/photo/${newFilename}.jpg`
      : `${process.env.SERVER_LOCAL_URL}/medias/photo/${newFilename}.jpg`
  }
}

const mediaService = new MediaService()
export default mediaService
