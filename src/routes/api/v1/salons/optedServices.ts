import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Request, Response } from 'express'
import {
  EntityType,
  IncludePaginationTotal,
  OptedServiceWithExtraFields,
  Pagination,
  SuccessJSON,
  SuccessJSONWithPaginationAggregation,
} from '~/utils/types'
import { db } from '~/index'
import { defaultNearbyDistance, paginationTotalParam } from '~/constants'
import { getNearBySalonIds } from '~/routes/api/v1/salons/index'
import {
  ApplicableSex,
  OptedService,
  OptedServiceAvailability,
  Prisma,
  PrismaPromise,
  ServiceStyleType,
  ServiceType,
} from '@prisma/client'
import { withFileURLs } from '~/utils/fileSystem'
import { getApplicableSexFilter } from '~/utils/db'

enum includeParam {
  service = 'service',
  averageDuration = 'averageDuration',
  startPrice = 'startPrice',
}

export const createOptedServices = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    let data = {}
    if (req.body.length) {
      data = await db.$transaction(
        (req.body as OptedService[]).map(
          ({ salonId, serviceId, price, durationSeconds, availability }) =>
            db.optedService.create({
              data: {
                salonId,
                serviceId,
                price,
                durationSeconds,
                availability,
              },
              include: { service: true },
            })
        )
      )
    }
    withFileURLs(req, data, EntityType.optedService)
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getOptedServices = asyncHandler(
  async (
    req: Request,
    res: Response<SuccessJSONWithPaginationAggregation>,
    next: NextFunction
  ) => {
    const {
      availability,
      customerLatLong,
      nearByDistance,
      categoryIds,
      salonIds,
      designationIds,
      applicableSex,
      type,
      styles,
      page,
      perPage,
      include,
    } = req.query as unknown as {
      availability?: OptedServiceAvailability
      customerLatLong?: string[]
      nearByDistance?: number
      categoryIds?: number[]
      salonIds?: number[]
      designationIds?: number
      applicableSex?: ApplicableSex
      type?: ServiceType
      styles?: ServiceStyleType[]
      groupBy?: 'type'
      page: number
      perPage: number
      include?: (`${includeParam}` | IncludePaginationTotal)[]
    }
    let combinedSalonIds = salonIds
    if (customerLatLong) {
      const nearbySalonIds = await getNearBySalonIds(
        Number(customerLatLong[0]),
        Number(customerLatLong[1]),
        nearByDistance ?? defaultNearbyDistance
      )
      combinedSalonIds = Array.from(
        new Set(
          combinedSalonIds
            ? combinedSalonIds.concat(nearbySalonIds)
            : nearbySalonIds
        )
      )
    }
    const where: Prisma.OptedServiceWhereInput = {
      availability,
      service: {
        applicableSex: getApplicableSexFilter(applicableSex),
        type,
        categories: categoryIds
          ? { some: { id: { in: categoryIds } } }
          : undefined,
        styles: styles ? { hasEvery: styles } : undefined,
      },
      providerEmployees: designationIds
        ? { some: { designationId: { in: designationIds } } }
        : undefined,
      salon: combinedSalonIds ? { id: { in: combinedSalonIds } } : undefined,
    }
    const includePaginationTotal =
      include?.includes(paginationTotalParam) ?? false
    const includeAverageDuration =
      include?.includes(includeParam.averageDuration) ?? false
    const includeStartPrice =
      include?.includes(includeParam.startPrice) ?? false
    const includeService = include?.includes(includeParam.service) ?? false
    const recordsQuery = db.optedService.findMany({
      where,
      include: includeService
        ? { service: { include: { image: true } } }
        : undefined,
      skip: (page - 1) * perPage,
      take: perPage,
    })
    let total = undefined
    let data: OptedServiceWithExtraFields[]
    if (includePaginationTotal) {
      const [count, records] = await db.$transaction([
        db.optedService.count({ where }),
        recordsQuery,
      ])
      total = count
      data = records
    } else {
      data = await recordsQuery
    }
    if (includeAverageDuration || includeStartPrice) {
      data.forEach((optedService, index) => {
        const matchingServices = data.filter(
          (s) => s.serviceId === optedService.serviceId
        )
        if (includeAverageDuration) {
          const uniqDurations = new Map()
          matchingServices.forEach((s) => {
            const count = uniqDurations.has(s.durationSeconds)
              ? uniqDurations.get(s.durationSeconds)
              : 0
            uniqDurations.set(s.durationSeconds, count + 1)
          })
          let averageDuration = 0
          let maxFreq = 0
          uniqDurations.forEach((freq, duration) => {
            if (freq > maxFreq) {
              maxFreq = freq
              averageDuration = duration
            }
          })
          data[index].averageDuration = averageDuration
        }
        if (includeStartPrice) {
          let startPrice = matchingServices[0].price
          matchingServices.forEach((s) => {
            if (startPrice > s.price) {
              startPrice = s.price
            }
          })
          data[index].startPrice = startPrice
        }
      })
    }
    if (includeService) {
      withFileURLs(req, data, EntityType.optedService)
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

export const updateOptedServices = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const optedServices: OptedService[] = req.body
    const queries: PrismaPromise<any>[] = []
    const keepOnlyHavingSalonIds: number[] = []
    const keepOnlyHavingServicesIds: number[] = []
    let data
    if (optedServices.length) {
      optedServices.forEach(
        ({ salonId, serviceId, price, durationSeconds, availability }) => {
          queries.push(
            db.optedService.upsert({
              where: {
                salonId_serviceId: {
                  salonId,
                  serviceId,
                },
              },
              update: {
                price,
                durationSeconds,
                availability,
              },
              create: {
                salonId,
                serviceId,
                price,
                durationSeconds,
                availability,
              },
            })
          )
          keepOnlyHavingSalonIds.push(salonId)
          keepOnlyHavingServicesIds.push(serviceId)
        }
      )
      queries.push(
        db.optedService.deleteMany({
          where: {
            salonId: { notIn: keepOnlyHavingSalonIds },
            serviceId: { notIn: keepOnlyHavingServicesIds },
          },
        })
      )
      data = await db.$transaction(queries)
      data.pop()
    } else {
      data = []
    }
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const deleteOptedServices = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.optedService.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getOptedService = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const data = await db.optedService.findUniqueOrThrow({
      where: { id },
      include: { service: { include: { image: true } } },
    })
    withFileURLs(req, data, EntityType.optedService)
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const updateOptedService = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const { serviceId, salonId, price, durationSeconds, availability } =
      req.body
    const data = await db.optedService.update({
      where: { id },
      data: {
        serviceId,
        salonId,
        price,
        durationSeconds,
        availability,
      },
      include: { service: { include: { image: true } } },
    })
    return res.status(201).json({
      success: true,
      data,
    })
  }
)
