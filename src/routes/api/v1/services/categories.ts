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
import { ApplicableSex } from '@prisma/client'
import { withFileURLs } from '~/utils/fileSystem'
import { getApplicableSexFilter } from '~/utils/db'

enum includeParam {
  children = 'children',
  image = 'image',
}

export const createServiceCategory = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { name, bgColor, applicableSex, imageId, parentId } = req.body
    const data = await db.serviceCategory.create({
      data: {
        name,
        bgColor,
        applicableSex,
        imageId,
        parentId,
      },
      include: { image: true },
    })
    withFileURLs(req, data, EntityType.service)
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getServiceCategories = asyncHandler(
  async (
    req: Request,
    res: Response<SuccessJSONWithPagination>,
    next: NextFunction
  ) => {
    const {
      parentId,
      servicesIds,
      salonIds,
      applicableSex,
      page,
      perPage,
      include,
    } = req.query as unknown as {
      parentId?: number
      salonIds?: number[]
      servicesIds?: number[]
      applicableSex?: ApplicableSex
      page: number
      perPage: number
      include?: (`${includeParam}` | IncludePaginationTotal)[]
    }
    const where = {
      parentId: parentId === 0 ? null : parentId,
      applicableSex: getApplicableSexFilter(applicableSex),
      providerSalons: salonIds ? { some: { id: { in: salonIds } } } : undefined,
      services: servicesIds ? { some: { id: { in: servicesIds } } } : undefined,
    }
    const includeImage = include?.includes(includeParam.image) ?? false
    const recordsQuery = db.serviceCategory.findMany({
      where,
      include: {
        children: include?.includes(includeParam.children) ?? false,
        image: includeImage,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })
    let data
    let total
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.serviceCategory.count({ where }),
        recordsQuery,
      ])
      total = count
      data = records
    } else {
      data = await recordsQuery
    }
    if (includeImage) {
      withFileURLs(req, data, EntityType.serviceCategory)
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

export const deleteServiceCategories = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.serviceCategory.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getServiceCategory = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const { include } = req.query as unknown as {
      include?: `${includeParam}`[]
    }
    const data = await db.serviceCategory.findUniqueOrThrow({
      where: { id },
      include: {
        children: include?.includes(includeParam.children) ? true : undefined,
        image: true,
      },
    })
    withFileURLs(req, data, EntityType.serviceCategory)
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
