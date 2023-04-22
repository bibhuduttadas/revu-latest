import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Request, Response } from 'express'
import {
  APIError,
  EntityType,
  IncludePaginationTotal,
  SuccessJSON,
  SuccessJSONWithPagination,
} from '~/utils/types'
import { db } from '~/index'
import { ApplicableSex, BannerActionType, Prisma } from '@prisma/client'
import { paginationTotalParam } from '~/constants'
import { withFileURLs } from '~/utils/fileSystem'
import { getApplicableSexFilter } from '~/utils/db'

enum includeParam {
  image = 'image',
}

export const createBanner = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { imageId, applicableSex, actionType, resourceId, resourceURI } =
      req.body
    if (!resourceId && !resourceURI) {
      throw new APIError(
        'At least one of `resourceId` and `resourceURI` is required.',
        400
      )
    }
    if (actionType === BannerActionType.salon && resourceId) {
      try {
        await db.salon.findUniqueOrThrow({
          where: { id: resourceId },
        })
      } catch (e) {
        throw new APIError('Invalid resource id provided for salon', 401)
      }
    }
    const includeImage = !!imageId
    const data = await db.banner.create({
      data: {
        applicableSex,
        actionType,
        resourceId,
        resourceURI,
        imageId,
      },
      include: { image: includeImage },
    })
    if (includeImage) {
      withFileURLs(req, data, EntityType.banner)
    }
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getBanners = asyncHandler(
  async (
    req: Request,
    res: Response<SuccessJSONWithPagination>,
    next: NextFunction
  ) => {
    const { actionType, applicableSex, page, perPage, include } =
      req.query as unknown as {
        actionType?: BannerActionType
        applicableSex?: ApplicableSex
        page: number
        perPage: number
        include?: (`${includeParam}` | IncludePaginationTotal)[]
      }
    const where: Prisma.BannerWhereInput = {
      actionType,
      applicableSex: getApplicableSexFilter(applicableSex),
    }
    const includeImage = include?.includes(includeParam.image) ?? false
    let data
    let total
    const recordsQuery = db.banner.findMany({
      include: { image: includeImage },
      skip: (page - 1) * perPage,
      take: perPage,
    })
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.banner.count({ where }),
        recordsQuery,
      ])
      total = count
      data = records
    } else {
      data = await recordsQuery
    }
    if (includeImage) {
      withFileURLs(req, data, EntityType.banner)
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

export const deleteBanners = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.banner.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getBanner = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const data = await db.banner.findUniqueOrThrow({
      where: { id },
      include: { image: true },
    })
    withFileURLs(req, data, EntityType.banner)
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
