import { db } from '~/index'
import { Prisma, Role } from '@prisma/client'
import asyncHandler from '~/middlewares/asyncHandler'
import type { NextFunction, Request, Response } from 'express'
import {
  EntityType,
  IncludePaginationTotal,
  SuccessJSON,
  SuccessJSONWithPagination,
} from '~/utils/types'
import { paginationTotalParam } from '~/constants'
import { excludeKey } from '~/utils/common'
import { withFileURLs } from '~/utils/fileSystem'
import { hashPassword } from '~/utils/auth'

enum includeParam {
  profile = 'profile',
  optedServices = 'optedServices',
  averageRating = 'averageRating',
}

export const createEmployee = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const {
      firstName,
      lastName,
      gender,
      mobile,
      password,
      email,
      profileImageId,
      experienceYears,
      designationId,
      salonId,
      optedServicesIds,
    } = req.body
    const result = await db.employee.create({
      data: {
        user: {
          create: {
            firstName,
            lastName,
            gender,
            mobile,
            profileImageId,
            password: password ? hashPassword(password) : undefined,
            email,
            role: Role.employee,
          },
        },
        experienceYears,
        designation: { connect: { id: designationId } },
        salon: { connect: { id: salonId } },
        optedServices: optedServicesIds
          ? { connect: optedServicesIds.map((id: number) => ({ id })) }
          : undefined,
      },
      include: {
        user: { include: { profileImage: true } },
        optedServices: !!optedServicesIds?.length,
      },
    })
    const { user, ...employee } = result
    const data = {
      ...excludeKey(user, 'password', 'loginOTP', 'loginOTPExpiresAt'),
      ...employee,
    }
    withFileURLs(req, data, EntityType.employee)
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getEmployees = asyncHandler(
  async (
    req: Request,
    res: Response<SuccessJSONWithPagination>,
    next: NextFunction
  ) => {
    const { salonId, designationIds, page, perPage, include } =
      req.query as unknown as {
        salonId?: number
        designationIds?: number[]
        page: number
        perPage: number
        include?: (`${includeParam}` | IncludePaginationTotal)[]
      }
    const where: Prisma.EmployeeWhereInput = {
      salonId,
      designationId: { in: designationIds },
    }
    const includeProfile = include?.includes(includeParam.profile) ?? false
    const recordsQuery = db.employee.findMany({
      where,
      include: {
        user: includeProfile ? { include: { profileImage: true } } : false,
        optedServices: include?.includes(includeParam.optedServices) ?? false,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })
    let data: any[]
    let total = undefined
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.employee.count({ where }),
        recordsQuery,
      ])
      total = count
      data = records
    } else {
      data = await recordsQuery
    }
    if (includeProfile) {
      data = data.map(({ user, ...rest }) => ({
        ...excludeKey(user, 'password', 'loginOTP', 'loginOTPExpiresAt'),
        ...rest,
      }))
      withFileURLs(req, data, EntityType.employee)
    }
    if (include?.includes(includeParam.averageRating)) {
      const ratingsAggregates = await db.$transaction(
        data.map((employee) =>
          db.rating.aggregate({
            _avg: { starCount: true },
            where: {
              orderItem: {
                appointmentSlot: { employeeId: employee.id },
              },
            },
          })
        )
      )
      data.forEach((employee, index) => {
        data[index].averageRating = ratingsAggregates[index]._avg.starCount
      })
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

export const deleteEmployees = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.employee.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getEmployee = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const result = await db.employee.findUniqueOrThrow({
      where: { id },
      include: {
        user: { include: { profileImage: true } },
        optedServices: true,
      },
    })
    const { user, ...employee } = result
    const ratingsAggregate = await db.rating.aggregate({
      _avg: { starCount: true },
      where: {
        orderItem: {
          appointmentSlot: { employeeId: id },
        },
      },
    })
    const appointmentsCount = await db.appointmentSlot.count({
      where: { employeeId: id },
    })
    const data = {
      ...excludeKey(user, 'password', 'loginOTP', 'loginOTPExpiresAt'),
      ...employee,
      averageRating: ratingsAggregate._avg.starCount,
      appointmentsCount,
    }
    withFileURLs(req, data, EntityType.employee)
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
