import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Request, Response } from 'express'
import {
  EntityType,
  SuccessJSON,
  SuccessJSONWithPagination,
} from '~/utils/types'
import { ApplicableSex, Prisma } from '@prisma/client'
import { db } from '~/index'
import { withFileURLs } from '~/utils/fileSystem'
import { getApplicableSexFilter } from '~/utils/db'
import QueryMode = Prisma.QueryMode

export enum includeParam {
  image = 'image',
}

export const search = asyncHandler(
  async (
    req: Request,
    res: Response<SuccessJSONWithPagination>,
    next: NextFunction
  ) => {
    const { query, applicableSex, city, page, perPage, include } =
      req.query as unknown as {
        query: string
        city: string
        applicableSex?: ApplicableSex
        page: number
        perPage: number
        include?: `${includeParam}`[]
      }
    const includeImage = include?.includes(includeParam.image) ?? false
    const salons = await db.salon.findMany({
      where: {
        name: { contains: query, mode: QueryMode.insensitive },
        applicableSex: getApplicableSexFilter(applicableSex),
        address: city ? { city } : undefined,
      },
      include: {
        coverImage: includeImage,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })
    const services = await db.service.findMany({
      where: {
        applicableSex: getApplicableSexFilter(applicableSex),
        name: { contains: query, mode: QueryMode.insensitive },
      },
      include: {
        image: includeImage,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })
    if (includeImage) {
      withFileURLs(req, salons, EntityType.salon)
      withFileURLs(req, services, EntityType.service)
    }
    return res.status(200).json({
      success: true,
      data: {
        query,
        salons,
        services,
      },
      _pagination: {
        page,
        perPage,
      },
    })
  }
)
