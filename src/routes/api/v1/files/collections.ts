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
import { withFileURLs } from '~/utils/fileSystem'

enum includeParam {
  items = 'items',
}

export const createFilesCollection = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { title, description, itemsIds } = req.body
    const data = await db.filesCollection.create({
      data: {
        title,
        description,
        items: { connect: itemsIds.map((id: number) => ({ id })) },
      },
      include: { items: true },
    })
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getFilesCollections = asyncHandler(
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
    let data
    let total
    const includeItems = include?.includes(includeParam.items) ?? false
    const recordsQuery = db.filesCollection.findMany({
      include: { items: includeItems },
      skip: (page - 1) * perPage,
      take: perPage,
    })
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.filesCollection.count(),
        recordsQuery,
      ])
      total = count
      data = records
    } else {
      data = await recordsQuery
    }
    if (includeItems) {
      withFileURLs(req, data, EntityType.filesCollection)
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

export const deleteFilesCollections = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.filesCollection.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getFilesCollection = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const data = await db.filesCollection.findUniqueOrThrow({
      where: { id },
      include: { items: true },
    })
    withFileURLs(req, data, EntityType.filesCollection)
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const updateFilesCollection = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const { title, description, itemsIds } = req.body
    const data = await db.filesCollection.update({
      where: { id },
      data: {
        title,
        description,
        items: { set: itemsIds.map((id: number) => ({ id })) },
      },
      include: { items: true },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
