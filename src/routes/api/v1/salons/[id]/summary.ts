import asyncHandler from '~/middlewares/asyncHandler'
import type { NextFunction, Request, Response } from 'express'
import { SalonSummary, starCounts, SuccessJSON } from '~/utils/types'
import { db } from '~/index'
import { Prisma, RatingType } from '@prisma/client'

export const getSalonSummary = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const { fromDate, toDate } = req.query as unknown as {
      fromDate?: Date
      toDate?: Date
    }
    const salon = await db.salon.findUniqueOrThrow({
      where: { id },
      include: { address: true },
    })
    const data: SalonSummary = {
      salon,
      appointments: null,
      orders: {},
      customers: {},
      ratings: {
        counts: {},
        averages: {},
      },
    }
    let ordersWhere: Prisma.OrderWhereInput = {
      appointment: { salonId: id },
    }
    let customersWhere: Prisma.CustomerWhereInput = {
      appointments: { some: { salonId: id } },
    }
    let ratingsWhere: Prisma.RatingWhereInput = {
      orderItem: {
        appointmentSlot: { appointment: { salonId: id } },
      },
    }
    data.orders.total = await db.order.count({ where: ordersWhere })
    data.customers.total = await db.customer.count({ where: customersWhere })
    if (fromDate || toDate) {
      ordersWhere = {
        appointment: ordersWhere.appointment,
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      }
      customersWhere = {
        appointments: {
          some: {
            salonId: id,
            createdAt: {
              gte: fromDate,
              lte: toDate,
            },
          },
        },
      }
      ratingsWhere = {
        orderItem: {
          appointmentSlot: ratingsWhere.orderItem?.appointmentSlot,
          order: {
            createdAt: {
              gte: fromDate,
              lte: toDate,
            },
          },
        },
      }
    }
    data.orders.new = await db.order.count({ where: ordersWhere })
    data.customers.new = await db.customer.count({ where: customersWhere })
    const ratingTypes = Object.values(RatingType)
    const ratingCounts = await db.$transaction(
      starCounts.map((starCount, index) =>
        db.rating.count({
          where: {
            ...ratingsWhere,
            starCount: index + 1,
          },
        })
      )
    )
    const ratingAverages = await db.$transaction(
      ratingTypes.map((type) =>
        db.rating.aggregate({
          _avg: { starCount: true },
          where: { ...ratingsWhere, type },
        })
      )
    )
    starCounts.forEach((starCount, index) => {
      data.ratings.counts[starCount] = ratingCounts[index]
    })
    ratingTypes.forEach((type, index) => {
      data.ratings.averages[type] = ratingAverages[index]._avg.starCount
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
