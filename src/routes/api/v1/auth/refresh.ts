import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Response } from 'express'
import { Request as AuthenticatedRequest } from 'express-jwt'
import { JWTPayload, SuccessJSON } from '~/utils/types'
import { getJWT, getTokenExpiry } from '~/utils/auth'
import { db } from '~/index'

export const refreshToken = asyncHandler(
  async (
    req: AuthenticatedRequest<JWTPayload>,
    res: Response<SuccessJSON>,
    next: NextFunction
  ) => {
    const user = await db.user.findUniqueOrThrow({
      where: { id: req.auth?.id },
    })
    const expiresAt = getTokenExpiry()
    const payload = {
      id: user.id,
      role: user.role,
      exp: expiresAt.getTime() * 1000,
    }
    const data = {
      token: getJWT(payload),
      expiresAt,
    }
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
