import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Request, Response } from 'express'
import { SuccessJSON } from '~/utils/types'
import { db } from '~/index'
import { OrderItem, Prisma } from '@prisma/client'
import OrderItemCreateManyInput = Prisma.OrderItemCreateManyInput

export const createOrderItem = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const orderId = Number(req.params.id)
    const { appointmentSlotId, price, quantity, note } = req.body
    const data = await db.orderItem.create({
      data: {
        order: { connect: { id: orderId } },
        appointmentSlotId,
        price,
        quantity,
        note,
      },
    })
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getOrderItems = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const orderId = Number(req.params.id)
    const { appointmentSlotIds } = req.query as unknown as {
      appointmentSlotIds?: number[]
    }
    const where: Prisma.OrderItemWhereInput = {
      orderId,
      appointmentSlotId: appointmentSlotIds
        ? { in: appointmentSlotIds }
        : undefined,
    }
    const data = await db.orderItem.findMany({ where })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const updateOrderItems = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const orderId = Number(req.params.id)
    const items: OrderItemCreateManyInput = req.body.map(
      ({ appointmentSlotId, price, quantity, note }: OrderItem) => {
        return {
          orderId,
          appointmentSlotId,
          price,
          quantity,
          note,
        }
      }
    )
    const [, , data] = await db.$transaction([
      db.orderItem.deleteMany({ where: { orderId } }),
      db.orderItem.createMany({ data: items }),
      db.orderItem.findMany({ where: { orderId } }),
    ])
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const deleteOrderItems = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const orderId = Number(req.params.id)
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.orderItem.deleteMany({
      where: { id: { in: ids }, orderId },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getOrderItem = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const data = await db.orderItem.findUniqueOrThrow({
      where: { id },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const updateOrderItem = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const orderId = Number(req.params.orderId)
    const { appointmentSlotId, price, quantity, note } = req.body
    const data = await db.orderItem.update({
      where: { id },
      data: {
        orderId,
        appointmentSlotId,
        price,
        quantity,
        note,
      },
    })
    return res.status(201).json({
      success: true,
      data,
    })
  }
)
