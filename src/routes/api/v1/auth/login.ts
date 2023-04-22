import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Request, Response } from 'express'
import { APIError, SuccessJSON } from '~/utils/types'
import { db } from '~/index'
import { comparePassword, getJWT, getTokenExpiry } from '~/utils/auth'
import { Role } from '@prisma/client'

export const loginUser = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { mobile, role, password, otp } = req.body as {
      mobile: string
      role: Role
      password: string
      otp: string
    }
    const user = await db.user.findUniqueOrThrow({
      where: { mobile_role: { mobile, role } },
    })
    if (password) {
      if (!(user.password && comparePassword(user.password, password))) {
        throw new APIError('Invalid password', 200)
      }
    } else if (otp) {
      if (otp !== user.loginOTP) {
        throw new APIError('Invalid OTP', 200)
      } else if (
        user.loginOTPExpiresAt &&
        user.loginOTPExpiresAt > new Date()
      ) {
        throw new APIError('OTP Expired', 200)
      }
    } else {
      throw new APIError('Either provide password or an OTP', 400)
    }
    const accessTokenExpiresAt = getTokenExpiry()
    const refreshTokenExpiresAt = getTokenExpiry(true)
    let specifiedUser
    const where = { userId: user.id }
    const select = { id: true }
    switch (role) {
      case Role.customer:
        specifiedUser = await db.customer.findFirst({ where, select })
        break
      case Role.merchant:
        specifiedUser = await db.merchant.findFirst({ where, select })
        break
      case Role.employee:
        specifiedUser = await db.employee.findFirst({ where, select })
        break
      case Role.admin:
        break
    }
    const data = {
      userId: user.id,
      roleUserId: specifiedUser?.id,
      role,
      accessToken: {
        token: getJWT({
          id: user.id,
          role: user.role,
          exp: accessTokenExpiresAt.getTime() * 1000,
        }),
        expiresAt: accessTokenExpiresAt,
      },
      refreshToken: {
        token: getJWT({
          id: user.id,
          exp: refreshTokenExpiresAt.getTime() * 1000,
        }),
        expiresAt: refreshTokenExpiresAt,
      },
    }
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
