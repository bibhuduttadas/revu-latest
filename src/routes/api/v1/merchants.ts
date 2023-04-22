import { db } from '~/index'
import { Role } from '@prisma/client'
import asyncHandler from '~/middlewares/asyncHandler'
import { Request as AuthenticatedRequest } from 'express-jwt'
import type { NextFunction, Request, Response } from 'express'
import type {
  IncludePaginationTotal,
  JWTPayload,
  SuccessJSON,
  SuccessJSONWithPagination,
} from '~/utils/types'
import { EntityType } from '~/utils/types'
import { paginationTotalParam } from '~/constants'
import { excludeKey } from '~/utils/common'
import { withFileURLs } from '~/utils/fileSystem'
import { hashPassword } from '~/utils/auth'

enum includeParam {
  profile = 'profile',
  salons = 'salons',
}

export const createMerchant = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const {
      firstName,
      lastName,
      gender,
      mobile,
      password,
      email,
      aadhar,
      profileImageId,
    } = req.body
    const result = await db.merchant.create({
      data: {
        user: {
          create: {
            firstName,
            lastName,
            gender,
            mobile,
            password: password ? hashPassword(password) : undefined,
            email,
            role: Role.merchant,
            profileImageId,
          },
        },
        aadhar,
      },
      include: {
        user: { include: { profileImage: true } },
      },
    })
    const { user, ...merchant } = result
    const data = {
      ...excludeKey(user, 'password', 'loginOTP', 'loginOTPExpiresAt'),
      ...merchant,
    }
    withFileURLs(req, data, EntityType.merchant)
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getMerchants = asyncHandler(
  async (
    req: Request,
    res: Response<SuccessJSONWithPagination>,
    next: NextFunction
  ) => {
    const { page, perPage, include } = req.query as unknown as {
      page: number
      perPage: number
      include?: (`${includeParam}` | IncludePaginationTotal)[]
    }
    const includeUser = include?.includes(includeParam.profile) ?? false
    const includeSalons = include?.includes(includeParam.salons) ?? false
    const recordsQuery = db.merchant.findMany({
      include: {
        user: includeUser ? { include: { profileImage: true } } : undefined,
        salons: includeSalons,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })
    let data
    let total = undefined
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.merchant.count(),
        recordsQuery,
      ])
      total = count
      data = records
    } else {
      data = await recordsQuery
    }
    if (includeUser) {
      data = data.map(({ user, ...rest }) => ({
        ...excludeKey(user, 'password', 'loginOTP', 'loginOTPExpiresAt'),
        ...rest,
      }))
      withFileURLs(req, data, EntityType.merchant)
    }
    return res.status(200).json({
      success: true,
      data,
      _pagination: {
        page,
        perPage,
        total,
      },
    })
  }
)

export const deleteMerchants = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.merchant.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getMerchant = asyncHandler(
  async (
    req: AuthenticatedRequest<JWTPayload>,
    res: Response<SuccessJSON>,
    next: NextFunction
  ) => {
    const id = Number(req.params.id)
    const { include } = req.query as {
      include?: `${includeParam}`[]
    }
    const result = await db.merchant.findUniqueOrThrow({
      where: id ? { id } : { userId: req.auth!.id },
      include: {
        user: { include: { profileImage: true } },
        salons: include?.includes(includeParam.salons) ?? false,
      },
    })
    const { user, ...merchant } = result
    const data = {
      ...excludeKey(user, 'password', 'loginOTP', 'loginOTPExpiresAt'),
      ...merchant,
    }
    withFileURLs(req, data, EntityType.merchant)
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
