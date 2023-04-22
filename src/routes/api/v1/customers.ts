import { db } from '~/index'
import { Role } from '@prisma/client'
import asyncHandler from '~/middlewares/asyncHandler'
import type { NextFunction, Request, Response } from 'express'
import {
  EntityType,
  IncludePaginationTotal,
  SuccessJSON,
  SuccessJSONWithPagination,
} from '~/utils/types'
import { paginationTotalParam } from '~/constants'
import { excludeKey } from '~/utils/common'
import { withFileURLs } from '~/utils/fileSystem'
import { hashPassword } from '~/utils/auth'

enum includeParam {
  profile = 'profile',
}

export const createCustomer = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const {
      firstName,
      lastName,
      gender,
      mobile,
      password,
      email,
      profileImageId,
    } = req.body
    const result = await db.customer.create({
      data: {
        user: {
          create: {
            firstName,
            lastName,
            gender,
            mobile,
            password: password ? hashPassword(password) : undefined,
            email,
            profileImageId,
            role: Role.customer,
          },
        },
      },
      include: {
        user: { include: { profileImage: true } },
      },
    })
    const { user, ...customer } = result
    const data = {
      ...excludeKey(user, 'password', 'loginOTP', 'loginOTPExpiresAt'),
      ...customer,
    }
    withFileURLs(req, data, EntityType.customer)
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getCustomers = asyncHandler(
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
    const recordsQuery = db.customer.findMany({
      include: {
        user: includeUser ? { include: { profileImage: true } } : undefined,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })
    let data
    let total = undefined
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.customer.count(),
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
      withFileURLs(req, data, EntityType.customer)
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

export const deleteCustomers = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.customer.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getCustomer = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const result = await db.customer.findUniqueOrThrow({
      where: { id },
      include: { user: { include: { profileImage: true } } },
    })
    const { user, ...customer } = result
    const data = {
      ...excludeKey(user, 'password', 'loginOTP', 'loginOTPExpiresAt'),
      ...customer,
    }
    withFileURLs(req, data, EntityType.customer)
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const updateCustomer = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const {
      firstName,
      lastName,
      gender,
      mobile,
      password,
      email,
      profileImageId,
      wishListedSalonIds,
    } = req.body
    const result = await db.customer.update({
      where: { id },
      data: {
        user: {
          update: {
            firstName,
            lastName,
            gender,
            mobile,
            profileImageId,
            password: password ? hashPassword(password) : undefined,
            email,
            role: Role.customer,
          },
        },
        wishListedSalons: wishListedSalonIds
          ? {
              disconnect: wishListedSalonIds.remove?.length
                ? wishListedSalonIds.remove.map((id: number) => ({ id }))
                : undefined,
              connect: wishListedSalonIds.add?.length
                ? wishListedSalonIds.add.map((id: number) => ({ id }))
                : undefined,
            }
          : undefined,
      },
      include: {
        user: { include: { profileImage: true } },
      },
    })
    const { user, ...customer } = result
    const data = {
      ...excludeKey(user, 'password', 'loginOTP', 'loginOTPExpiresAt'),
      ...customer,
    }
    withFileURLs(req, data, EntityType.customer)
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
