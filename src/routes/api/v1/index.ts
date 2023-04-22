import { Router } from 'express'
import {
  createMerchant,
  deleteMerchants,
  getMerchant,
  getMerchants,
} from '~/routes/api/v1/merchants'
import {
  createSalon,
  deleteSalons,
  getSalon,
  getSalons,
  updateSalon,
} from '~/routes/api/v1/salons'
import {
  createDesignation,
  deleteDesignations,
  getDesignation,
  getDesignations,
} from '~/routes/api/v1/employees/designations'
import {
  createEmployee,
  deleteEmployees,
  getEmployee,
  getEmployees,
} from '~/routes/api/v1/employees'
import {
  createOptedServices,
  deleteOptedServices,
  getOptedService,
  getOptedServices,
  updateOptedService,
  updateOptedServices,
} from '~/routes/api/v1/salons/optedServices'
import {
  createAppointment,
  deleteAppointments,
  getAppointment,
  getAppointments,
  updateAppointment,
} from '~/routes/api/v1/appointments'
import {
  createTimeSlot,
  deleteTimeSlots,
  getTimeSlot,
  getTimeSlots,
} from '~/routes/api/v1/timeSlots'
import {
  createCoupon,
  deleteCoupons,
  getCoupon,
  getCoupons,
  updateCoupon,
} from '~/routes/api/v1/coupons'
import {
  createServiceCategory,
  deleteServiceCategories,
  getServiceCategories,
  getServiceCategory,
} from '~/routes/api/v1/services/categories'
import {
  createService,
  deleteServices,
  getService,
  getServices,
} from '~/routes/api/v1/services'
import {
  createCustomer,
  deleteCustomers,
  getCustomer,
  getCustomers,
  updateCustomer,
} from '~/routes/api/v1/customers'
import {
  createBanner,
  deleteBanners,
  getBanner,
  getBanners,
} from '~/routes/api/v1/banners'
import {
  createFile,
  deleteFiles,
  getFile,
  getFiles,
} from '~/routes/api/v1/files'
import {
  createRating,
  deleteRatings,
  getRating,
  getRatings,
  updateRating,
} from '~/routes/api/v1/ratings'
import {
  createServiceableCities,
  deleteServiceableCities,
  getServiceableCities,
  getServiceableCity,
} from '~/routes/api/v1/serviceableCities'
import {
  createOrder,
  deleteOrders,
  getOrder,
  getOrders,
  updateOrder,
} from '~/routes/api/v1/orders'
import {
  createOrderItem,
  deleteOrderItems,
  getOrderItem,
  getOrderItems,
  updateOrderItem,
  updateOrderItems,
} from '~/routes/api/v1/orders/[id]/items'
import {
  createTransaction,
  deleteTransactions,
  getTransaction,
  getTransactions,
  updateTransaction,
} from '~/routes/api/v1/orders/transactions'
import {
  createFilesCollection,
  deleteFilesCollections,
  getFilesCollection,
  getFilesCollections,
  updateFilesCollection,
} from '~/routes/api/v1/files/collections'
import { getSalonSummary } from '~/routes/api/v1/salons/[id]/summary'
import { loginUser } from '~/routes/api/v1/auth/login'
import { requestOTP } from '~/routes/api/v1/auth/otp'
import { refreshToken } from '~/routes/api/v1/auth/refresh'
import hasRole from '~/middlewares/hasRole'
import { Role } from '@prisma/client'
import { search } from '~/routes/api/v1/search'

const router = Router()

// Auth
router.route('/auth/login').post(loginUser)
router.route('/auth/otp').post(requestOTP)
router.route('/auth/refresh').get(refreshToken)

// Files Collections
router
  .route('/files/collections')
  .post(hasRole({ any: true }), createFilesCollection)
  .get(hasRole({ any: true }), getFilesCollections)
  .delete(hasRole({ anyOf: [Role.admin] }), deleteFilesCollections)
router
  .route('/files/collections/:id')
  .get(hasRole({ any: true }), getFilesCollection)
  .patch(hasRole({ anyOf: [Role.admin] }), updateFilesCollection)

// Files
router
  .route('/files')
  .post(hasRole({ any: true }), createFile)
  .get(hasRole({ any: true }), getFiles)
  .delete(hasRole({ anyOf: [Role.admin] }), deleteFiles)
router.route('/files/:id').get(hasRole({ any: true }), getFile)

// Categories
router
  .route('/services/categories')
  .get(hasRole({ any: true }), getServiceCategories)
  .post(hasRole({ anyOf: [Role.admin] }), createServiceCategory)
  .delete(hasRole({ anyOf: [Role.admin] }), deleteServiceCategories)
router
  .route('/services/categories/:id')
  .get(hasRole({ any: true }), getServiceCategory)

// Services
router
  .route('/services')
  .get(hasRole({ any: true }), getServices)
  .post(hasRole({ anyOf: [Role.admin] }), createService)
  .delete(hasRole({ anyOf: [Role.admin] }), deleteServices)
router.route('/services/:id').get(hasRole({ any: true }), getService)

// Serviceable Cities
router
  .route('/serviceableCities')
  .post(hasRole({ anyOf: [Role.admin] }), createServiceableCities)
  .get(hasRole({ any: true }), getServiceableCities)
  .delete(hasRole({ anyOf: [Role.admin] }), deleteServiceableCities)
router
  .route('/serviceableCities/:id')
  .get(hasRole({ any: true }), getServiceableCity)

// Merchants
router
  .route('/merchants')
  .get(hasRole({ anyOf: [Role.admin, Role.merchant] }), getMerchants)
  .post(createMerchant)
  .delete(hasRole({ anyOf: [Role.admin] }), deleteMerchants)
router
  .route('/merchants/:id')
  .get(hasRole({ anyOf: [Role.admin, Role.merchant] }), getMerchant)

// Employee Designations
router
  .route('/employees/designations')
  .get(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    getDesignations
  )
  .post(hasRole({ anyOf: [Role.admin, Role.merchant] }), createDesignation)
  .delete(hasRole({ anyOf: [Role.admin] }), deleteDesignations)
router
  .route('/employees/designations/:id')
  .get(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    getDesignation
  )

// Employees
router
  .route('/employees')
  .get(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    getEmployees
  )
  .post(hasRole({ any: true }), createEmployee)
  .delete(hasRole({ anyOf: [Role.admin] }), deleteEmployees)
router
  .route('/employees/:id')
  .get(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    getEmployee
  )

// Customers
router
  .route('/customers')
  .get(hasRole({ any: true }), getCustomers)
  .post(createCustomer)
  .delete(hasRole({ anyOf: [Role.admin, Role.merchant] }), deleteCustomers)
router
  .route('/customers/:id')
  .get(hasRole({ any: true }), getCustomer)
  .patch(hasRole({ anyOf: [Role.admin, Role.customer] }), updateCustomer)

// Salons Summary
router
  .route('/salons/:id/summary')
  .get(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    getSalonSummary
  )

// Opted Services
router
  .route('/salons/optedServices')
  .get(hasRole({ any: true }), getOptedServices)
  .post(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    createOptedServices
  )
  .put(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    updateOptedServices
  )
  .delete(hasRole({ anyOf: [Role.admin, Role.merchant] }), deleteOptedServices)
router
  .route('/salons/optedServices/:id')
  .get(hasRole({ any: true }), getOptedService)
  .patch(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    updateOptedService
  )

// Salons
router
  .route('/salons')
  .post(hasRole({ anyOf: [Role.admin, Role.merchant] }), createSalon)
  .get(hasRole({ any: true }), getSalons)
  .delete(hasRole({ anyOf: [Role.admin, Role.merchant] }), deleteSalons)
router
  .route('/salons/:id')
  .get(hasRole({ any: true }), getSalon)
  .patch(hasRole({ anyOf: [Role.admin, Role.merchant] }), updateSalon)

// Search Salons and Services
router.route('/search').get(hasRole({ any: true }), search)

// Time Slots
router
  .route('/timeSlots')
  .get(hasRole({ any: true }), getTimeSlots)
  .post(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    createTimeSlot
  )
  .delete(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    deleteTimeSlots
  )
router.route('/timeSlots/:id').get(hasRole({ any: true }), getTimeSlot)

// Appointments
router
  .route('/appointments')
  .get(hasRole({ any: true }), getAppointments)
  .post(hasRole({ any: true }), createAppointment)
  .delete(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    deleteAppointments
  )
router
  .route('/appointments/:id')
  .get(hasRole({ any: true }), getAppointment)
  .patch(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    updateAppointment
  )

// Transactions
router
  .route('/orders/transactions')
  .get(hasRole({ any: true }), getTransactions)
  .post(hasRole({ any: true }), createTransaction)
  .delete(hasRole({ anyOf: [Role.admin, Role.merchant] }), deleteTransactions)
router
  .route('/orders/transactions/:id')
  .get(hasRole({ any: true }), getTransaction)
  .patch(hasRole({ anyOf: [Role.admin, Role.merchant] }), updateTransaction)

// Orders
router
  .route('/orders')
  .get(hasRole({ any: true }), getOrders)
  .post(hasRole({ any: true }), createOrder)
  .delete(hasRole({ anyOf: [Role.admin, Role.merchant] }), deleteOrders)
router
  .route('/orders/:id')
  .get(hasRole({ any: true }), getOrder)
  .patch(hasRole({ any: true }), updateOrder)

// Order Items
router
  .route('/orders/:id/items')
  .get(hasRole({ any: true }), getOrderItems)
  .post(hasRole({ any: true }), createOrderItem)
  .put(hasRole({ any: true }), updateOrderItems)
  .delete(hasRole({ anyOf: [Role.admin, Role.merchant] }), deleteOrderItems)
router
  .route('/orders/:orderId/items/:id')
  .get(hasRole({ any: true }), getOrderItem)
  .patch(hasRole({ any: true }), updateOrderItem)

// Coupons
router
  .route('/coupons')
  .get(hasRole({ any: true }), getCoupons)
  .post(hasRole({ anyOf: [Role.admin] }), createCoupon)
  .delete(hasRole({ anyOf: [Role.admin] }), deleteCoupons)
router
  .route('/coupons/:id')
  .get(hasRole({ any: true }), getCoupon)
  .patch(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    updateCoupon
  )

// Ratings
router
  .route('/ratings')
  .get(hasRole({ any: true }), getRatings)
  .post(hasRole({ any: true }), createRating)
  .delete(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    deleteRatings
  )
router
  .route('/ratings/:id')
  .get(hasRole({ any: true }), getRating)
  .patch(hasRole({ any: true }), updateRating)

// Banners
router
  .route('/banners')
  .get(hasRole({ any: true }), getBanners)
  .post(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    createBanner
  )
  .delete(
    hasRole({ anyOf: [Role.admin, Role.merchant, Role.employee] }),
    deleteBanners
  )
router.route('/banners/:id').get(hasRole({ any: true }), getBanner)

export default router
