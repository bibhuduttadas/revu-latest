import { ImageSize } from '~/utils/types'

export const serverURL = new URL(process.env.SERVER_URL!)
export const apiRoot = '/api/v1'

export const thumbnailSize = {
  width: 240, // 240px
  height: 240, // 240px
}
export const uploadDir = {
  [ImageSize.full]: 'uploads/images',
  [ImageSize.thumbnail]: 'uploads/images/thumbnails',
}
export const maxUploadFileSize = 5 * 1024 * 1024 // 5MB
export const defaultNearbyDistance = 12 * 1000 // 12km
export const otpExpiration = 5 * 60 // 5m

export const paginationTotalParam = '_pagination.total'

export enum PrismaErrorCode {
  dbAuthenticationFailed = 'P1000',
  operationTimedOut = 'P1008',
  userAccessDenied = 'P1010',
  dbProviderInvalidURI = 'P1013',
  searchedRecordNotExist = 'P2001',
  uniqueConstraintFailed = 'P2002',
  foreignKeyConstraintFailed = 'P2003',
  dataValidationError = 'P2007',
  queryParseFailed = 'P2008',
  nullConstraintViolation = 'P2011',
  missingRequiredValue = 'P2012',
  relatedRecordNotFound = 'P2015',
  dependingRecordNotFound = 'P2025',
}

export enum ErrorCode {
  recordNotFound = 'recordNotFound',
  validationError = 'validationError',
  unauthorized = 'unauthorized',
}

export enum ResourceEntity {
  file = 'file',
  fileCollection = 'fileCollection',
  serviceCategory = 'serviceCategory',
  service = 'service',
  serviceableCity = 'serviceableCity',
  merchant = 'merchant',
  salon = 'salon',
  optedService = 'optedService',
  salonSummary = 'salonSummary',
  timeSlot = 'timeSlot',
  employeeDesignation = 'employeeDesignation',
  employee = 'employee',
  customer = 'customer',
  appointment = 'appointment',
  order = 'order',
  orderItem = 'orderItem',
  transaction = 'transaction',
  rating = 'rating',
  banner = 'banner',
  coupon = 'coupon',
}

export enum Capability {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
}
