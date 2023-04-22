import multer from 'multer'
import { maxUploadFileSize } from '~/constants'
import { Express, Request } from 'express'
import path from 'path'

export const fileUploaderConfig: multer.Options = {
  storage: multer.diskStorage({
    destination: 'uploads/images',
    filename(
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void
    ) {
      const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9)
      const extension = path.extname(file.originalname)
      callback(null, `${file.fieldname}-${uniqueSuffix}${extension}`)
    },
  }),
  limits: {
    fileSize: maxUploadFileSize,
    files: 1,
  },
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
  ) {
    if (!file.mimetype.startsWith('image/')) {
      callback(new Error('Only image files are allowed'))
    }
    callback(null, true)
  },
}
