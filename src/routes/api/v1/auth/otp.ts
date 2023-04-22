import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Request, Response } from 'express'
import { OTPResponseData, SuccessJSON } from '~/utils/types'
import { otpExpiration } from '~/constants'
import { db } from '~/index'
import { randomInt } from 'crypto'

export const requestOTP = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { mobile, role } = req.body
    const user = await db.user.update({
      where: {
        mobile_role: {
          mobile,
          role,
        },
      },
      data: {
        loginOTP: randomInt(100000, 999999).toString(),
        loginOTPExpiresAt: new Date(Date.now() + otpExpiration * 1000),
      },
    })
    const data: OTPResponseData = {
      otp: user.loginOTP!,
      expiresAt: user.loginOTPExpiresAt!,
    }
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
