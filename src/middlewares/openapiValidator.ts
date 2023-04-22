import { middleware } from 'express-openapi-validator'
import path from 'path'
import { fileUploaderConfig } from '~/middlewares/fileUploader'

export default middleware({
  apiSpec: path.resolve('openapi/api.yaml'),
  validateResponses: false,
  fileUploader: fileUploaderConfig,
})
