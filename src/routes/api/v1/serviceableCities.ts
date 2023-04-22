import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Request, Response } from 'express'
import { SuccessJSON } from '~/utils/types'
import { db } from '~/index'

export const createServiceableCities = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const cities = req.body
    const data = await db.serviceableCity.createMany({
      data: cities,
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getServiceableCities = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const data = await db.serviceableCity.findMany()
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const deleteServiceableCities = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.serviceableCity.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getServiceableCity = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const data = await db.serviceableCity.findUniqueOrThrow({
      where: { id },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
