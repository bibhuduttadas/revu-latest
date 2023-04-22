import asyncHandler from '~/middlewares/asyncHandler'
import { NextFunction, Request, Response } from 'express'
import {
  APIError,
  EntityType,
  ImageSize,
  IncludePaginationTotal,
  JWTPayload,
  SuccessJSON,
  SuccessJSONWithPagination,
  FileWithURL,
} from '~/utils/types'
import { db } from '~/index'
import { FileType, Prisma, Role } from '@prisma/client'
import { paginationTotalParam, thumbnailSize, uploadDir } from '~/constants'
import sharp from 'sharp'
import { deleteFilesFromFS, withFileURLs } from '~/utils/fileSystem'
import { Request as AuthenticatedRequest } from 'express-jwt'

export const createFile = asyncHandler(
  async (req: Request, res: Response<SuccessJSON>, next: NextFunction) => {
    const { title, type } = req.body
    const [file] = req.files as Express.Multer.File[]
    // Generate and save thumbnail
    if (file?.fieldname !== 'file') {
      throw new APIError('No file provided', 400)
    }
    const thumbnailPath = `${uploadDir[ImageSize.thumbnail]}/${file.filename}`
    await sharp(file.path)
      .resize(thumbnailSize.width, thumbnailSize.height)
      .toFile(thumbnailPath)
    const data = await db.file.create({
      data: {
        name: file.filename,
        title,
        type,
        mimeType: file.mimetype,
      },
    })
    withFileURLs(req, data, EntityType.file)
    return res.status(201).json({
      success: true,
      data,
    })
  }
)

export const getFiles = asyncHandler(
  async (
    req: AuthenticatedRequest<JWTPayload>,
    res: Response<SuccessJSONWithPagination>,
    next: NextFunction
  ) => {
    const { type, mimeTypes, page, perPage, include } =
      req.query as unknown as {
        type?: FileType
        mimeTypes?: string[]
        page: number
        perPage: number
        include?: IncludePaginationTotal[]
      }
    const where: Prisma.FileWhereInput = {
      type,
      mimeType: mimeTypes ? { in: mimeTypes } : undefined,
      createdBy:
        req.auth?.role !== Role.admin ? { id: req.auth?.id } : undefined,
    }
    let data: FileWithURL[]
    let total
    const recordsQuery = db.file.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
    })
    if (include?.includes(paginationTotalParam)) {
      const [count, records] = await db.$transaction([
        db.file.count({ where }),
        recordsQuery,
      ])
      total = count
      data = records
    } else {
      data = await recordsQuery
    }
    withFileURLs(req, data, EntityType.file)
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

export const deleteFiles = asyncHandler(
  async (
    req: AuthenticatedRequest<JWTPayload>,
    res: Response<SuccessJSON>,
    next: NextFunction
  ) => {
    const { ids } = req.query as unknown as {
      ids: number[]
    }
    const where: Prisma.FileWhereInput = {
      id: { in: ids },
      createdBy:
        req.auth?.role !== Role.admin ? { id: req.auth?.id } : undefined,
    }
    const filesToDelete = await db.file.findMany({
      where,
      select: {
        name: true,
        type: true,
      },
    })
    const data = await db.file.deleteMany({ where })
    filesToDelete.forEach(({ name, type }) => {
      deleteFilesFromFS(name, ImageSize.full)
      deleteFilesFromFS(name, ImageSize.thumbnail)
    })
    return res.status(200).json({
      success: true,
      data,
    })
  }
)

export const getFile = asyncHandler(
  async (
    req: AuthenticatedRequest<JWTPayload>,
    res: Response<SuccessJSON>,
    next: NextFunction
  ) => {
    const id = Number(req.params.id)
    const data = await db.file.findUniqueOrThrow({ where: { id } })
    withFileURLs(req, data, EntityType.file)
    return res.status(200).json({
      success: true,
      data,
    })
  }
)
