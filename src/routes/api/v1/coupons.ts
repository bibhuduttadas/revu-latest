import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Request, Response } from 'express'
import {
  IncludePaginationTotal,
  SuccessJSON,
  SuccessJSONWithPagination,
} from '~/utils/types'
import { db } from '~/index'
import { paginationTotalParam } from '~/constants'
import { Prisma } from '@prisma/client'
import CouponWhereInput = Prisma.CouponWhereInput
import RestrictionCreateManyInput = Prisma.RestrictionCreateManyInput

enum includeParam {
  restrictions = 'restrictions',
}

export const createCoupon = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const {
      code,
      description,
      discountType,
      amount,
      minPurchaseAmount,
      maxPurchaseAmount,
      individualUse,
      usageLimit,
      expiresAt,
      restrictions,
    } = req.body
    const data = await db.coupon.create({
      data: {
        code,
        description,
        discountType,
        amount,
        minPurchaseAmount,
        maxPurchaseAmount,
        individualUse,
        usageLimit,
        expiresAt,
        restrictions: restrictions ? { create: restrictions } : undefined,
      },
      include: restrictions ? { restrictions: true } : undefined,
    })
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getCoupons = asyncHandler(
  async (
    req: Request,
    res: Response<SuccessJSONWithPagination>,
    next: NextFunction
  ) => {
    const { code, customerId, salonId, page, perPage, include } =
      req.query as unknown as {
        code?: string
        customerId?: number
        salonId?: number
        page: number
        perPage: number
        include?: (`${includeParam}` | IncludePaginationTotal)[]
      }
    const where: CouponWhereInput = {
      code,
      restrictions:
        salonId || customerId
          ? {
              some: {
                salonId,
                customerId,
              },
            }
          : undefined,
    }
    const recordsQuery = db.coupon.findMany({
      where,
      include: include?.includes(includeParam.restrictions)
        ? { restrictions: true }
        : undefined,
      skip: (page - 1) * perPage,
      take: perPage,
    })
    let data
    let total = undefined
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.coupon.count({ where }),
        recordsQuery,
      ])
      total = count
      data = records
    } else {
      data = await recordsQuery
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

export const deleteCoupons = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.coupon.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getCoupon = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const { include } = req.query as unknown as {
      include?: `${includeParam}`[]
    }
    const data = await db.coupon.findUniqueOrThrow({
      where: { id },
      include: include?.includes(includeParam.restrictions)
        ? { restrictions: true }
        : undefined,
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const updateCoupon = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const {
      code,
      description,
      discountType,
      amount,
      minPurchaseAmount,
      maxPurchaseAmount,
      individualUse,
      usageLimit,
      usageCount,
      expiresAt,
      restrictions,
    } = req.body
    const data = await db.coupon.update({
      where: { id },
      data: {
        code,
        description,
        discountType,
        amount,
        minPurchaseAmount,
        maxPurchaseAmount,
        individualUse,
        usageLimit,
        usageCount,
        expiresAt,
        restrictions: restrictions
          ? {
              deleteMany: { couponId: id },
              createMany: restrictions?.length
                ? {
                    data: (restrictions as RestrictionCreateManyInput[]).filter(
                      (item) => validateRestriction(item)
                    ),
                  }
                : undefined,
            }
          : undefined,
      },
      include: restrictions ? { restrictions: true } : undefined,
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

function validateRestriction(restriction: RestrictionCreateManyInput) {
  const { salonId, customerId, employeeId, serviceId, categoryId } = restriction
  return salonId || customerId || employeeId || serviceId || categoryId
}
