import { File, OptedService, Prisma, RatingType, Salon } from '@prisma/client'
import { Capability, paginationTotalParam, ResourceEntity } from '~/constants'
import { User } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'

export interface SuccessJSON<
  Data = Record<string, any> | Record<string, any>[]
> {
  success: true
  data: Data
}

export interface BatchSuccessJSON<Data = Prisma.BatchPayload> {
  success: true
  data?: Data
}

export interface Pagination {
  page: number
  perPage: number
  total?: number
}

export interface SuccessJSONWithPagination<Data = any>
  extends SuccessJSON<Data> {
  _pagination: Pagination
}

export interface SuccessJSONWithPaginationAggregation<Data = any>
  extends SuccessJSONWithPagination<Data> {
  _aggregation?: Record<string, any>
}

export interface ErrorJSON<ErrorData = any> {
  success: false
  error: {
    code?: number | string
    message: string
    data?: ErrorData
  }
}

export const starCounts = [
  'oneStar',
  'twoStar',
  'threeStar',
  'fourStar',
  'fiveStar',
]

export interface SalonSummary {
  salon: Salon
  appointments: number | null
  orders: {
    new?: number | null
    total?: number | null
  }
  customers: {
    new?: number | null
    total?: number | null
  }
  ratings: {
    counts: {
      [ratingType in typeof starCounts[number]]?: number | null
    }
    averages: {
      [ratingType in keyof typeof RatingType]?: number | null
    }
  }
}

export type IncludePaginationTotal = typeof paginationTotalParam

export interface OTPResponseData {
  otp: string
  expiresAt?: Date
}

export interface LoginResponseData {
  accessToken: {
    token: string
    expiresAt: Date
  }
  refreshToken: {
    token: string
    expiresAt?: Date
  }
}

export type AuthRefreshResponseData = Omit<LoginResponseData, 'refreshToken'>

export enum ImageSize {
  full = 'full',
  thumbnail = 'thumbnail',
}

export enum EntityType {
  merchant,
  employee,
  customer,
  salon,
  salonSummary,
  timeSlot,
  serviceCategory,
  service,
  servicePackage,
  optedService,
  appointment,
  order,
  orderItem,
  transaction,
  banner,
  file,
  filesCollection,
  rating,
  coupon,
  serviceableCity,
}

export type FileWithURL = File & {
  url?: string
  thumbnailURL?: string
}

export type OptedServiceWithExtraFields = OptedService & {
  averageDuration?: number | null
  startPrice?: number | Decimal
}

export type JWTPayload = Pick<User, 'id' | 'role'>

export type RoleCapabilities = Record<Capability, Set<ResourceEntity>>

export class APIError extends Error {
  status: number
  code?: string | number

  constructor(message: string, statusCode = 400, code?: string | number) {
    super(message)
    this.status = statusCode
    this.code = code
  }
}
