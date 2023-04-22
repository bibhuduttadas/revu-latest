import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Request, Response } from 'express'
import {
  IncludePaginationTotal,
  SuccessJSON,
  SuccessJSONWithPagination,
} from '~/utils/types'
import { db } from '~/index'
import { Prisma, TransactionStatus } from '@prisma/client'
import { paginationTotalParam } from '~/constants'

export const createTransaction = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { transactionId, orderId, channel, amount, isReverse, note, status } =
      req.body
    const data = await db.transaction.create({
      data: {
        transactionId,
        channel,
        amount,
        orderId,
        isReverse,
        note,
        status,
      },
    })
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getTransactions = asyncHandler(
  async (
    req: Request,
    res: Response<SuccessJSONWithPagination>,
    next: NextFunction
  ) => {
    const { orderId, fromDate, toDate, isReverse, page, perPage, include } =
      req.query as unknown as {
        orderId?: number
        fromDate?: Date
        toDate?: Date
        isReverse?: boolean
        status?: TransactionStatus
        page: number
        perPage: number
        include?: IncludePaginationTotal[]
      }
    const where: Prisma.TransactionWhereInput = {
      orderId,
      createdAt:
        fromDate || toDate
          ? {
              gte: fromDate,
              lte: toDate,
            }
          : undefined,
      isReverse,
    }
    const recordsQuery = db.transaction.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
    })
    let data
    let total = undefined
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.transaction.count({ where }),
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

export const deleteTransactions = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.transaction.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getTransaction = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const data = await db.transaction.findUniqueOrThrow({
      where: { id },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const updateTransaction = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const {
      orderId,
      transactionId,
      channel,
      amount,
      isReverse,
      note,
      status,
      createdAt,
    } = req.body
    const data = await db.transaction.update({
      where: { id },
      data: {
        transactionId,
        channel,
        amount,
        orderId,
        isReverse,
        note,
        status,
        createdAt,
      },
    })
    return res.status(201).json({
      success: true,
      data,
    })
  }
)
