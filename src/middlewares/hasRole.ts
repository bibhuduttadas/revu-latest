import { APIError, JWTPayload, SuccessJSON } from '~/utils/types'
import { Request as AuthenticatedRequest } from 'express-jwt'
import { NextFunction, Response } from 'express'
import { Role } from '@prisma/client'
import { ErrorCode } from '~/constants'

interface RoleCriteria {
  anyOf?: Role[]
  noneOf?: Role[]
  any?: boolean
}

export default function hasRole(criteria: RoleCriteria) {
  return (
    req: AuthenticatedRequest<JWTPayload>,
    res: Response<SuccessJSON>,
    next: NextFunction
  ) => {
    let authorized = false
    if (req.auth?.role) {
      if (criteria.any) {
        authorized = true
      } else {
        authorized = !criteria.noneOf?.includes(req.auth.role)
        authorized = criteria.anyOf?.includes(req.auth.role) ?? authorized
      }
    }
    if (!authorized) {
      throw new APIError(
        'Unauthorized to perform this action',
        401,
        ErrorCode.unauthorized
      )
    }
    next()
  }
}
