import { NextFunction, Request, Response } from 'express'
import {
  EntityType,
  IncludePaginationTotal,
  SuccessJSON,
  SuccessJSONWithPagination,
} from '~/utils/types'
import asyncHandler from '~/middlewares/asyncHandler'
import { db } from '~/index'
import {
  ApplicableSex,
  Prisma,
  Salon,
  SalonCategorizationCriteria,
} from '@prisma/client'
import { defaultNearbyDistance, paginationTotalParam } from '~/constants'
import { withFileURLs } from '~/utils/fileSystem'
import { getApplicableSexFilter } from '~/utils/db'

export enum includeParam {
  address = 'address',
  employees = 'employees',
  coverImage = 'coverImage',
  imageGallery = 'imageGallery',
  salonCategories = 'salonCategories',
  serviceCategories = 'serviceCategories',
  optedServices = 'optedServices',
  startPrice = 'startPrice',
  averageRating = 'averageRating',
  ratingsCount = 'ratingsCount',
  reviewsCount = 'reviewsCount',
}

export const createSalon = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const {
      name,
      about,
      applicableSex,
      openHours,
      website,
      ownerId,
      address,
      pan,
      gst,
      coverImageId,
      imageGalleryId,
      bankAccount,
      salonCategories,
    } = req.body
    const { include } = req.query as unknown as {
      include?: `${includeParam}`[]
    }
    const includeImageGallery =
      include?.includes(includeParam.imageGallery) || !!imageGalleryId
        ? { include: { items: true } }
        : undefined
    const includeCoverImage =
      include?.includes(includeParam.coverImage) || !!coverImageId
    const data = await db.salon.create({
      data: {
        name,
        about,
        applicableSex,
        openHours,
        website,
        pan,
        gst,
        owner: { connect: { id: ownerId } },
        coverImage: coverImageId
          ? { connect: { id: coverImageId } }
          : undefined,
        imageGallery: imageGalleryId
          ? { connect: { id: imageGalleryId } }
          : undefined,
        address: address ? { create: address } : undefined,
        bankAccount: bankAccount ? { create: bankAccount } : undefined,
        salonCategories: salonCategories?.length
          ? {
              createMany: {
                data: salonCategories,
              },
            }
          : undefined,
      },
      include: {
        coverImage: includeCoverImage,
        imageGallery: includeImageGallery,
        address: !!address,
        bankAccount: !!bankAccount,
        salonCategories:
          include?.includes(includeParam.salonCategories) ||
          salonCategories?.length,
        optedServices:
          include?.includes(includeParam.optedServices) ?? undefined,
      },
    })
    if (includeCoverImage || includeImageGallery) {
      withFileURLs(req, data, EntityType.salon)
    }
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getSalons = asyncHandler(
  async (req: Request, res: Response<SuccessJSONWithPagination>, next) => {
    const {
      applicableSex,
      city,
      customerLatLong,
      nearByDistance,
      servicesIds,
      wishListedByCustomerId,
      salonCategoriesCriteria,
      include,
      page,
      perPage,
    } = req.query as unknown as {
      applicableSex?: ApplicableSex
      city?: string
      nearByDistance?: number
      customerLatLong?: string[]
      servicesIds?: number[]
      wishListedByCustomerId?: number
      salonCategoriesCriteria?: SalonCategorizationCriteria[]
      page: number
      perPage: number
      include?: (`${includeParam}` | IncludePaginationTotal)[]
    }
    let nearBySalonIds: number[] | undefined
    if (customerLatLong) {
      nearBySalonIds = await getNearBySalonIds(
        Number(customerLatLong[0]),
        Number(customerLatLong[1]),
        nearByDistance ?? defaultNearbyDistance,
        perPage
      )
    }
    const where: Prisma.SalonWhereInput = {
      id: nearBySalonIds ? { in: nearBySalonIds } : undefined,
      applicableSex: getApplicableSexFilter(applicableSex),
      salonCategories: salonCategoriesCriteria?.length
        ? { some: { criteria: { in: salonCategoriesCriteria } } }
        : undefined,
      optedServices: servicesIds?.length
        ? { some: { serviceId: { in: servicesIds } } }
        : undefined,
      wishListedByCustomers: wishListedByCustomerId
        ? { some: { id: wishListedByCustomerId } }
        : undefined,
      address: city ? { city } : undefined,
    }
    const includeCoverImage =
      include?.includes(includeParam.coverImage) ?? undefined
    const includeImageGallery = include?.includes(includeParam.imageGallery)
      ? { include: { items: true } }
      : undefined
    const recordsQuery = db.salon.findMany({
      where,
      include: {
        coverImage: includeCoverImage,
        imageGallery: includeImageGallery,
        employees: include?.includes(includeParam.employees) ?? false,
        address: include?.includes(includeParam.address) ?? false,
        salonCategories:
          include?.includes(includeParam.salonCategories) ||
          !!salonCategoriesCriteria,
        optedServices: !!(
          servicesIds || include?.includes(includeParam.optedServices)
        ),
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })
    let data: any[]
    let total
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.salon.count({ where }),
        recordsQuery,
      ])
      total = count
      data = records
    } else {
      data = await recordsQuery
    }
    if (include?.includes(includeParam.startPrice)) {
      const prices = await db.optedService.groupBy({
        by: ['salonId'],
        _min: { price: true },
        where: { salonId: { in: data.map((salon) => salon.id) } },
      })
      prices.forEach((price) => {
        const index = (data as Salon[]).findIndex(
          (salon) => salon.id === price.salonId
        )
        data[index][includeParam.startPrice] =
          index > -1 ? price._min.price : null
      })
    }
    if (includeCoverImage || includeImageGallery) {
      withFileURLs(req, data, EntityType.salon)
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

export const deleteSalons = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const data = await db.salon.deleteMany({
      where: { id: { in: ids } },
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getSalon = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const { include } = req.query as {
      include?: `${includeParam}`[]
    }
    const includeAvgRating =
      include?.includes(includeParam.averageRating) ?? false
    const includeRatingsCount =
      include?.includes(includeParam.ratingsCount) ?? false
    const includeCoverImage =
      include?.includes(includeParam.coverImage) ?? undefined
    const includeImageGallery = include?.includes(includeParam.imageGallery)
    const data: Record<string, any> = await db.salon.findUniqueOrThrow({
      include: {
        coverImage: includeCoverImage,
        imageGallery: includeImageGallery,
        employees: include?.includes(includeParam.employees) ?? undefined,
        address: include?.includes(includeParam.address) ?? undefined,
        serviceCategories:
          include?.includes(includeParam.serviceCategories) ?? undefined,
        salonCategories:
          include?.includes(includeParam.salonCategories) ?? undefined,
        optedServices:
          include?.includes(includeParam.optedServices) ?? undefined,
      },
      where: { id },
    })
    if (includeAvgRating || includeRatingsCount) {
      const { _avg, _count } = await db.rating.aggregate({
        _avg: includeAvgRating ? { starCount: true } : undefined,
        _count: includeRatingsCount ? { starCount: true } : undefined,
        where: {
          orderItem: {
            appointmentSlot: { appointment: { salonId: id } },
          },
        },
      })
      if (includeAvgRating) {
        data[includeParam.averageRating] = _avg?.starCount
      }
      if (includeRatingsCount) {
        data[includeParam.ratingsCount] = _count?.starCount
      }
    }
    if (include?.includes(includeParam.reviewsCount)) {
      data[includeParam.reviewsCount] = await db.review.count({
        where: {
          rating: {
            orderItem: {
              appointmentSlot: { appointment: { salonId: id } },
            },
          },
        },
      })
    }
    if (include?.includes(includeParam.startPrice)) {
      const minPrice = await db.optedService.aggregate({
        where: { salonId: id },
        _min: { price: true },
      })
      data[includeParam.startPrice] = minPrice._min.price
    }
    if (includeCoverImage || includeImageGallery) {
      withFileURLs(req, data, EntityType.salon)
    }
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const updateSalon = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const id = Number(req.params.id)
    const { include } = req.query as {
      include?: `${includeParam}`[]
    }
    const {
      name,
      about,
      applicableSex,
      openHours,
      website,
      ownerId,
      coverImageId,
      imageGalleryId,
      address,
      bankAccount,
      pan,
      gst,
      salonCategories,
    } = req.body
    const includeCoverImage =
      include?.includes(includeParam.coverImage) || !!coverImageId
    const includeImageGallery =
      include?.includes(includeParam.imageGallery) || !!imageGalleryId
        ? { include: { items: true } }
        : undefined
    const data = await db.salon.update({
      where: { id },
      data: {
        name,
        about,
        applicableSex,
        openHours,
        website,
        owner: ownerId ? { connect: { id: ownerId } } : undefined,
        coverImage: coverImageId
          ? { connect: { id: coverImageId } }
          : undefined,
        imageGallery: imageGalleryId
          ? { connect: { id: imageGalleryId } }
          : undefined,
        address: address ? { update: address } : undefined,
        pan,
        gst,
        bankAccount: bankAccount ? { update: bankAccount } : undefined,
        salonCategories: salonCategories?.length
          ? {
              deleteMany: {
                salonId: id,
              },
              createMany: {
                data: salonCategories,
              },
            }
          : undefined,
      },
      include: {
        coverImage: includeCoverImage,
        imageGallery: includeImageGallery,
        address: true,
        bankAccount: !!bankAccount,
        salonCategories:
          include?.includes(includeParam.salonCategories) || !!salonCategories,
        optedServices:
          include?.includes(includeParam.optedServices) ?? undefined,
      },
    })
    if (includeCoverImage || includeImageGallery) {
      withFileURLs(req, data, EntityType.salon)
    }
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getNearBySalonIds = async (
  lat: number,
  lon: number,
  distance = defaultNearbyDistance,
  limit = 100
) => {
  const rows = await db.$queryRaw<{ id: number }[]>`
      WITH distances AS (SELECT "Salon".id,
                                (6371000 * acos(
                                                cos(radians(${lat})) * cos(radians(A.latitude)) *
                                                cos(radians(A.longitude) - radians(${lon})) +
                                                sin(radians(${lat})) * sin(radians(A.latitude))
                                    )) AS distance
                         FROM "Salon"
                                  INNER JOIN "Address" AS A on "Salon"."addressId" = A."id")
      SELECT id
      FROM distances
      WHERE distance < ${distance}
      ORDER BY distance
      LIMIT ${limit};`
  return rows.map((row) => row.id)
}
