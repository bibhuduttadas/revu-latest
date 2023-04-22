import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Request, Response } from 'express'
import {
  IncludePaginationTotal,
  SuccessJSON,
  SuccessJSONWithPagination,
} from '~/utils/types'
import { db } from '~/index'
import { paginationTotalParam } from '~/constants'
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client'

enum includeParam {
  items = 'items',
}

export const createOrder = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const {
      type,
      createdAt,
      appointmentId,
      items,
      total,
      discount,
      tax,
      paymentStatus,
      status,
    } = req.body
    const data = await db.order.create({
      data: {
        type,
        createdAt,
        appointmentId,
        items,
        total,
        discount,
        tax,
        paymentStatus,
        status,
      },
      include: items ? { items: true } : undefined,
    })
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getOrders = asyncHandler(
  async (
    req: Request,
    res: Response<SuccessJSONWithPagination>,
    next: NextFunction
  ) => {
    const {
      fromDate,
      toDate,
      appointmentId,
      paymentStatus,
      status,
      page,
      perPage,
      include,
    } = req.query as unknown as {
      fromDate?: Date
      toDate?: Date
      appointmentId?: number
      paymentStatus?: PaymentStatus
      status?: OrderStatus
      page: number
      perPage: number
      include?: (`${includeParam}` | IncludePaginationTotal)[]
    }
    const where: Prisma.OrderWhereInput = {
      createdAt:
        fromDate || toDate ? { gte: fromDate, lte: toDate } : undefined,
      appointmentId,
      paymentStatus,
      status,
    }
    const recordsQuery = db.order.findMany({
      where,
      include: include?.includes(includeParam.items)
        ? { items: true }
        : undefined,
      skip: (page - 1) * perPage,
      take: perPage,
    })
    let data
    let total = undefined
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.order.count({ where }),
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

export const deleteOrders = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.order.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getOrder = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const { include } = req.query as unknown as {
      include?: `${includeParam}`[]
    }
    const data = await db.order.findUniqueOrThrow({
      where: { id },
      include: include?.includes(includeParam.items)
        ? { items: true }
        : undefined,
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const updateOrder = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const {
      type,
      createdAt,
      appointmentId,
      total,
      discount,
      tax,
      paymentStatus,
      status,
    } = req.body
    const data = await db.order.update({
      where: { id },
      data: {
        type,
        createdAt,
        appointmentId,
        total,
        discount,
        tax,
        paymentStatus,
        status,
      },
    })
    return res.status(201).json({
      success: true,
      data,
    })
  }
)
