import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Request, Response } from 'express'
import {
  IncludePaginationTotal,
  SuccessJSON,
  SuccessJSONWithPagination,
} from '~/utils/types'
import { db } from '~/index'
import { paginationTotalParam } from '~/constants'
import { AppointmentStatus, Prisma } from '@prisma/client'
import { randomInt } from 'crypto'
import { getRandomIdForTime } from '~/utils/common'

enum includeParam {
  appointmentSlots = 'appointmentSlots',
}

export const createAppointment = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const {
      appointmentId,
      customerId,
      salonId,
      startsAt,
      endsAt,
      appointmentSlots,
    } = req.body
    const data = await db.appointment.create({
      data: {
        appointmentId: appointmentId ?? getRandomIdForTime('AP'),
        customerId,
        salonId,
        appointmentSlots: appointmentSlots
          ? { createMany: { data: appointmentSlots } }
          : undefined,
        startsAt,
        endsAt,
        otp: randomInt(100000, 999999).toString(),
      },
      include: { appointmentSlots: !!appointmentSlots?.length },
    })
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getAppointments = asyncHandler(
  async (
    req: Request,
    res: Response<SuccessJSONWithPagination>,
    next: NextFunction
  ) => {
    const {
      salonId,
      employeeId,
      fromDate,
      toDate,
      status,
      page,
      perPage,
      include,
    } = req.query as unknown as {
      salonId?: number
      employeeId?: number
      fromDate?: Date
      toDate?: Date
      status?: AppointmentStatus
      page: number
      perPage: number
      include?: (`${includeParam}` | IncludePaginationTotal)[]
    }
    const where: Prisma.AppointmentWhereInput = {
      salonId,
      appointmentSlots: employeeId ? { some: { employeeId } } : undefined,
      startsAt:
        fromDate || toDate
          ? {
              gte: fromDate,
              lte: toDate,
            }
          : undefined,
      status,
    }
    const recordsQuery = db.appointment.findMany({
      where,
      include: include?.includes(includeParam.appointmentSlots)
        ? { appointmentSlots: true }
        : undefined,
      skip: (page - 1) * perPage,
      take: perPage,
    })
    let data
    let total
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.appointment.count({ where }),
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

export const deleteAppointments = asyncHandler(
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

export const getAppointment = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const { include } = req.query as unknown as {
      include?: `${includeParam}`[]
    }
    const data = await db.appointment.findUniqueOrThrow({
      where: { id },
      include: include?.includes(includeParam.appointmentSlots)
        ? { appointmentSlots: true }
        : undefined,
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const updateAppointment = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const {
      appointmentId,
      customerId,
      salonId,
      startsAt,
      endsAt,
      appointmentSlots,
      status,
    } = req.body
    const data = await db.appointment.update({
      where: { id },
      data: {
        appointmentId: appointmentId ?? getRandomIdForTime('AP'),
        customerId,
        salonId,
        startsAt,
        endsAt,
        appointmentSlots: {
          deleteMany: { appointmentId: id },
          createMany: {
            data: appointmentSlots,
          },
        },
        status,
      },
      include: { appointmentSlots: !!appointmentSlots?.length },
    })
    return res.status(201).json({
      success: true,
      data,
    })
  }
)
