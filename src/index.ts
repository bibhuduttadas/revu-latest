import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import router from '~/routes/api/v1'
import errorHandler from '~/middlewares/errorHandler'
import openapiValidator from '~/middlewares/openapiValidator'
import { apiRoot, serverURL } from '~/constants'
import jwtAuth from '~/middlewares/jwtAuth'

// Create app instance
const app = express()

// Enable CORS
app.use(cors())

// Logger
app.use(morgan('combined'))

// Request data parsers
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Static files
app.use(express.static(path.resolve('public')))
app.use('/images', express.static(path.resolve('uploads/images')))
app.use(`${apiRoot}/docs`, express.static(path.resolve('openapi')))

// OpenAPI Validation
app.use(openapiValidator)

// DB client
export const db = new PrismaClient({
  errorFormat: 'minimal',
})

// Route handlers
app.use(apiRoot, jwtAuth, router)

// Error handler
app.use(errorHandler)

// Start the server
const server = app.listen(serverURL.port, () =>
  console.log(
    `🚀 Server running in '${process.env.NODE_ENV}' mode at: ${serverURL.origin}`
  )
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: NodeJS.ErrnoException, promise) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error: ${error.stack}`)
  }
  server.close(() => process.exit(1))
})
