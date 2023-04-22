import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Request, Response } from 'express'
import {
  IncludePaginationTotal,
  SuccessJSON,
  SuccessJSONWithPagination,
} from '~/utils/types'
import { db } from '~/index'
import { paginationTotalParam } from '~/constants'
import { Prisma, TimeSlotAvailability } from '@prisma/client'
import TimeSlotWhereInput = Prisma.TimeSlotWhereInput

export const createTimeSlot = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { employeeId, start, end, availability, note } = req.body
    const data = await db.timeSlot.create({
      data: {
        employeeId,
        start,
        end,
        availability,
        note,
      },
    })
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getTimeSlots = asyncHandler(
  async (
    req: Request,
    res: Response<SuccessJSONWithPagination>,
    next: NextFunction
  ) => {
    const {
      availabilities,
      optedServicesIds,
      employeeIds,
      salonId,
      page,
      perPage,
      include,
    } = req.query as unknown as {
      availabilities?: TimeSlotAvailability[]
      optedServicesIds?: number[]
      salonId?: number
      employeeIds?: number[]
      page: number
      perPage: number
      include?: IncludePaginationTotal[]
    }
    const where: TimeSlotWhereInput = {
      employee:
        salonId || optedServicesIds?.length || employeeIds?.length
          ? {
              optedServices: { some: { id: { in: optedServicesIds } } },
              id: employeeIds ? { in: employeeIds } : undefined,
            }
          : undefined,
      availability: availabilities ? { in: availabilities } : undefined,
    }
    const recordsQuery = db.timeSlot.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
    })
    let data
    let total = undefined
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.timeSlot.count({ where }),
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

export const deleteTimeSlots = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.timeSlot.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getTimeSlot = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const data = await db.timeSlot.findUniqueOrThrow({
      where: { id },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
