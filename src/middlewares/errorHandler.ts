import { NextFunction, Request, Response } from 'express'
import {
  NotFoundError,
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime'
import { findMatchingKey } from '~/utils/common'
import type { ErrorJSON } from '~/utils/types'
import { ErrorCode, PrismaErrorCode } from '~/constants'

export default function errorHandler(
  err: any,
  req: Request,
  res: Response<ErrorJSON>,
  next: NextFunction
) {
  let data = undefined
  let statusCode = err.status ?? 500
  let code = err.code
  if (err instanceof NotFoundError) {
    statusCode = 404
    code = ErrorCode.recordNotFound
  } else if (err instanceof PrismaClientKnownRequestError) {
    statusCode = 400
    code = findMatchingKey(PrismaErrorCode, err.code) ?? code
  } else if (err instanceof PrismaClientValidationError) {
    statusCode = 400
    code = ErrorCode.validationError
    // err.message = '(PM) Data validation error'
  }
  if (err.errors) {
    data = err.errors
    for (const index in data) {
      if (data[index].errorCode) {
        data[index].errorCode = data[index].errorCode.replace('.openapi', '')
      }
    }
  }
  if (process.env.NODE_ENV === 'development') {
    console.error(err)
  }
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: err.message,
      data,
    },
  })
}
