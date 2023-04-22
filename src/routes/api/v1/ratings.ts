import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Request, Response } from 'express'
import {
  EntityType,
  IncludePaginationTotal,
  SuccessJSON,
  SuccessJSONWithPagination,
} from '~/utils/types'
import { db } from '~/index'
import { paginationTotalParam } from '~/constants'
import { Prisma, RatingType } from '@prisma/client'
import { prepareOrderBy } from '~/utils/db'
import { withFileURLs } from '~/utils/fileSystem'

enum includeParam {
  review = 'review',
}

export const createRating = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { type, starCount, parentId, review, customerId, orderItemId } =
      req.body
    const data = await db.rating.create({
      data: {
        type,
        starCount,
        parentId,
        review: review ? { create: review } : undefined,
        customer: customerId ? { connect: { id: customerId } } : undefined,
        orderItem: orderItemId ? { connect: { id: orderItemId } } : undefined,
      },
      include: review
        ? { review: { include: { gallery: { include: { items: true } } } } }
        : undefined,
    })
    withFileURLs(req, data, EntityType.rating)
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getRatings = asyncHandler(
  async (
    req: Request,
    res: Response<SuccessJSONWithPagination>,
    next: NextFunction
  ) => {
    const {
      salonId,
      employeeId,
      customerId,
      types,
      page,
      perPage,
      sortBy,
      include,
    } = req.query as unknown as {
      salonId?: number
      types?: RatingType[]
      employeeId?: number
      customerId?: number
      page: number
      perPage: number
      sortBy?: string[]
      include?: (`${includeParam}` | IncludePaginationTotal)[]
    }
    const where: Prisma.RatingWhereInput = {
      type: types ? { in: types } : undefined,
      orderItem:
        salonId || employeeId
          ? {
              appointmentSlot: {
                employeeId,
                appointment: salonId ? { salonId } : undefined,
              },
            }
          : undefined,
      customerId,
    }
    const recordsQuery = db.rating.findMany({
      include: include?.includes(includeParam.review)
        ? { review: { include: { gallery: { include: { items: true } } } } }
        : undefined,
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: prepareOrderBy(sortBy),
    })
    let data
    let total = undefined
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.rating.count({ where }),
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

export const deleteRatings = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.rating.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getRating = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const { include } = req.query as unknown as {
      include?: `${includeParam}`[]
    }
    const data = await db.rating.findUniqueOrThrow({
      include: include?.includes(includeParam.review)
        ? { review: { include: { gallery: { include: { items: true } } } } }
        : undefined,
      where: { id },
    })
    withFileURLs(req, data, EntityType.rating)
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const updateRating = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const { type, starCount, parentId, review, customerId, orderItemId } =
      req.body
    const data = await db.rating.update({
      where: { id },
      data: {
        type,
        starCount,
        parentId,
        customer: customerId ? { connect: { id: customerId } } : undefined,
        orderItem: orderItemId ? { connect: { id: orderItemId } } : undefined,
        review: review
          ? {
              upsert: {
                update: review,
                create: review,
              },
            }
          : undefined,
      },
      include: review
        ? { review: { include: { gallery: { include: { items: true } } } } }
        : undefined,
    })
    withFileURLs(req, data, EntityType.rating)
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
