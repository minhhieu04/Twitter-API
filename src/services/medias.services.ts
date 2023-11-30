import { Request } from 'express'
import { getFileNameWithoutExtension, handleUploadSingleImage } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import fs from 'fs'

class MediaService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newFilename = getFileNameWithoutExtension(file.newFilename)
    const newPath = UPLOAD_DIR + '/' + newFilename + '.jpg'
    // Handle rename extension and reduce image quality
    await sharp(file.filepath).jpeg({ quality: 80 }).toFile(newPath)
    // Delete original file in temp folder
    fs.unlinkSync(file.filepath)
    // return `${process.env.SERVER_LOCAL_URL} /${newFilename}`
    return newPath
  }
}

const mediaService = new MediaService()
export default mediaService
