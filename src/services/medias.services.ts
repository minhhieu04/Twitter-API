import { Request } from 'express'
import { getFileNameWithoutExtension, handleUploadImage, handleUploadVideo } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import fs from 'fs'
import { isProduction } from '~/constants/configServer'
import path from 'path'
import { EncodingStatus, MediaType } from '~/constants/enums'
import { Media } from '~/models/Orthers'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.shema'

class Queue {
  items: string[]
  encoding: boolean
  constructor() {
    this.items = []
    this.encoding = false
  }

  async enqueue(item: string) {
    this.items.push(item)
    this.processEncode()
    const idName = getFileNameWithoutExtension(item.split('/').pop() as string)
    await databaseService.videoStatus.insertOne(
      new VideoStatus({
        name: idName,
        status: EncodingStatus.Pending,
        message: 'Pending'
      })
    )
  }

  async processEncode() {
    if (this.encoding) return
    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]
      const idName = getFileNameWithoutExtension(videoPath.split('/').pop() as string)
      await databaseService.videoStatus.updateOne(
        { name: idName },
        {
          $set: {
            status: EncodingStatus.Processing,
            message: 'Processing'
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
      try {
        // handle encodeHLSVideo
        await encodeHLSWithMultipleVideoStreams(videoPath)
        // delete file originally uploaded
        fs.unlinkSync(videoPath)
        // removed from queue
        this.items.shift()
        await databaseService.videoStatus.updateOne(
          { name: idName },
          {
            $set: {
              status: EncodingStatus.Success,
              message: 'Success'
            },
            $currentDate: {
              updated_at: true
            }
          }
        )
        console.log(`Encode video ${videoPath} success`)
      } catch (error) {
        await databaseService.videoStatus
          .updateOne(
            { name: idName },
            {
              $set: {
                status: EncodingStatus.Failed,
                message: 'Failed'
              },
              $currentDate: {
                updated_at: true
              }
            }
          )
          .catch((err) => {
            console.error('Update video status error', err)
          })
        console.error(`Encode video ${videoPath} error`)
        console.error(error)
      }
      this.encoding = false
      this.processEncode()
    } else {
      console.error('Encode video queue is empty')
    }
  }
}
const queue = new Queue()

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
    console.log(file)
    const result: Media = {
      url: isProduction
        ? `${process.env.SERVER_HOST_URL}/medias/video-stream/${file.newFilename}`
        : `${process.env.SERVER_LOCAL_URL}/medias/video-stream/${file.newFilename}`,
      type: MediaType.Video
    }
    return result
  }

  async uploadHLSVideo(req: Request) {
    const file = await handleUploadVideo(req)
    // Handle video encoding using FIFO queue
    // => Not processing at the same time will cause the server to crash
    queue.enqueue(file.filepath)
    const newIdName = getFileNameWithoutExtension(file.newFilename) // abcxyz.mp4 => abcxyz
    const result: Media = {
      url: isProduction
        ? `${process.env.SERVER_HOST_URL}/medias/video-hls/${newIdName}/master.m3u8`
        : `${process.env.SERVER_LOCAL_URL}/medias/video-hls/${newIdName}/master.m3u8`,
      type: MediaType.HLS
    }
    return result
  }

  async getVideoStatus(id: string) {
    const data = await databaseService.videoStatus.findOne({ name: id })
    return data
  }
}

const mediaService = new MediaService()
export default mediaService
