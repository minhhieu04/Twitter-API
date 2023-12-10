/* eslint-disable no-extra-boolean-cast */
import fs from 'fs'
import path from 'path'
import formidable, { File } from 'formidable'
import { Request } from 'express'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { v4 as uuidv4 } from 'uuid'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // The purpose is to create nested folder
      })
    }
  })
}

export const getFileNameWithoutExtension = (fileName: string) => {
  const nameArr = fileName.split('.')
  nameArr.pop()
  return nameArr.join('')
}

export const getExtension = (fileName: string) => {
  const nameArr = fileName.split('.')
  return nameArr[nameArr.length - 1]
}

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 6,
    keepExtensions: true,
    maxFileSize: 8 * 1024 * 1024, // 8MB
    maxTotalFileSize: 8 * 1024 * 1024 * 6,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }
      resolve(files.image as File[])
    })
  })
}

/**
 * Cách để lưu trữ video HLS vào 1 thư mục riêng biệt để tránh overwrite
 * C1: Tạo unique id cho video ngay từ đầu => Tối ưu hơn
 * C2: Đợi video upload xong rồi tạo folder để move video vào
 */

export const handleUploadVideo = async (req: Request) => {
  const idName = uuidv4()
  // Create a new folder named based on idName to store uploaded videos
  const folderPath = path.resolve(UPLOAD_VIDEO_DIR, idName)
  fs.mkdirSync(folderPath)
  const form = formidable({
    uploadDir: folderPath,
    maxFiles: 1,
    maxFileSize: 80 * 1024 * 1024, // 80MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    },
    // change default fileName to unique id name
    filename: function () {
      return idName
    }
  })

  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!Boolean(files.video)) {
        return reject(new Error('File is empty'))
      }
      const video = (files.video as File[])[0]
      const ext = getExtension(video.originalFilename as string)
      fs.renameSync(video.filepath, video.filepath + '.' + ext)
      video.newFilename = video.newFilename + '.' + ext
      video.filepath = video.filepath + '.' + ext
      resolve(video)
    })
  })
}
