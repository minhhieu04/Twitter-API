/* eslint-disable no-extra-boolean-cast */
import fs from 'fs'
import path from 'path'
import formidable, { File } from 'formidable'
import { Request } from 'express'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { forEach } from 'lodash'

export const initFoler = () => {
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

export const getExtention = (fileName: string) => {
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

export const handleUploadVideo = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    maxFiles: 1,
    maxFileSize: 80 * 1024 * 1024, // 80MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('video/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
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
      const ext = getExtention(video.originalFilename as string)
      fs.renameSync(video.filepath, video.filepath + '.' + ext)
      video.newFilename = video.newFilename + '.' + ext
      resolve(video)
    })
  })
}
