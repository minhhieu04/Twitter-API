import fs from 'fs'
import path from 'path'

export const initFoler = (folderName: string) => {
  const uploadFolderPath = path.resolve(folderName)
  if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath, {
      recursive: true // The purpose is to create nested folder
    })
  }
}
