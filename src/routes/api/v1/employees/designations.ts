import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Request, Response } from 'express'
import {
  IncludePaginationTotal,
  SuccessJSON,
  SuccessJSONWithPagination,
} from '~/utils/types'
import { db } from '~/index'
import { paginationTotalParam } from '~/constants'
import { ApplicableSex, Prisma } from '@prisma/client'
import { getApplicableSexFilter } from '~/utils/db'

export const createDesignation = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { title, description, applicableSex } = req.body
    const data = await db.employeeDesignation.create({
      data: {
        title,
        description,
        applicableSex,
      },
    })
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getDesignations = asyncHandler(
  async (
    req: Request,
    res: Response<SuccessJSONWithPagination>,
    next: NextFunction
  ) => {
    const { applicableSex, page, perPage, include } = req.query as unknown as {
      applicableSex?: ApplicableSex
      page: number
      perPage: number
      include?: IncludePaginationTotal[]
    }
    const where: Prisma.EmployeeDesignationWhereInput = {
      applicableSex: getApplicableSexFilter(applicableSex),
    }
    const recordsQuery = db.employeeDesignation.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
    })
    let data
    let total = undefined
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.employeeDesignation.count({ where }),
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

export const deleteDesignations = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.employeeDesignation.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getDesignation = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const data = await db.employeeDesignation.findUniqueOrThrow({
      where: { id },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
