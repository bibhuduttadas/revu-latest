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
import {
  ApplicableSex,
  Prisma,
  ServiceStyleType,
  ServiceType,
} from '@prisma/client'
import { withFileURLs } from '~/utils/fileSystem'
import { getApplicableSexFilter } from '~/utils/db'

enum includeParam {
  categories = 'categories',
  image = 'image',
}

export const createService = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const {
      name,
      type,
      description,
      defaultPrice,
      defaultDurationSeconds,
      imageId,
      applicableSex,
      styles,
      categoryIds,
    } = req.body
    const { include } = req.query as unknown as {
      include?: `${includeParam}`[]
    }
    const data = await db.service.create({
      data: {
        name,
        type,
        description,
        defaultPrice,
        defaultDurationSeconds,
        imageId,
        applicableSex,
        styles,
        categories: categoryIds
          ? { connect: categoryIds.map((id: number) => ({ id })) }
          : undefined,
      },
      include: {
        categories: include?.includes(includeParam.categories) ?? false,
        image: true,
      },
    })
    withFileURLs(req, data, EntityType.service)
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getServices = asyncHandler(
  async (
    req: Request,
    res: Response<SuccessJSONWithPagination>,
    next: NextFunction
  ) => {
    const { categoryIds, applicableSex, type, styles, page, perPage, include } =
      req.query as unknown as {
        categoryIds?: number[]
        applicableSex?: ApplicableSex
        type?: ServiceType
        styles?: ServiceStyleType[]
        page: number
        perPage: number
        include?: (`${includeParam}` | IncludePaginationTotal)[]
      }
    const where: Prisma.ServiceWhereInput = {
      categories: categoryIds
        ? { some: { id: { in: categoryIds } } }
        : undefined,
      applicableSex: getApplicableSexFilter(applicableSex),
      type,
      styles: styles ? { hasEvery: styles } : undefined,
    }
    const includeImage = include?.includes(includeParam.image) ?? false
    const recordsQuery = db.service.findMany({
      where,
      include: {
        categories: include?.includes(includeParam.categories) ?? false,
        image: includeImage,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })
    let data
    let total = undefined
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.service.count({ where }),
        recordsQuery,
      ])
      total = count
      data = records
    } else {
      data = await recordsQuery
    }
    if (includeImage) {
      withFileURLs(req, data, EntityType.service)
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

export const deleteServices = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.service.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getService = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const { include } = req.query as unknown as {
      include?: `${includeParam}`[]
    }
    const data = await db.service.findUniqueOrThrow({
      where: { id },
      include: {
        categories: include?.includes(includeParam.categories) ?? false,
        image: true,
      },
    })
    withFileURLs(req, data, EntityType.service)
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
