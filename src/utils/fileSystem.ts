import { Request } from 'express'
import { EntityType, ImageSize, FileWithURL } from '~/utils/types'
import fs from 'fs'
import { serverURL, uploadDir } from '~/constants'

export function getFileURL(fileName: string, size = ImageSize.full) {
  const path = uploadDir[size].replace('uploads/', '')
  return `${serverURL.origin}/${path}/${fileName}`
}

function addImageURLs(file: FileWithURL | undefined) {
  if (!file) {
    return
  }
  file.url = getFileURL(file.name)
  file.thumbnailURL = getFileURL(file.name, ImageSize.thumbnail)
}

function maybeAddImageURLs(data: any, property: string | null) {
  if (Array.isArray(data)) {
    data.forEach((item: any) => {
      addImageURLs(property ? item[property] : item)
    })
  } else {
    addImageURLs(property ? data[property] : data)
  }
}

function maybeAddImageCollectionURLs(data: any, property: string | null) {
  if (Array.isArray(data)) {
    data.forEach((collectionItem: any) => {
      const collection = property ? collectionItem[property] : collectionItem
      if (collection?.items) {
        collection.items.forEach((item: any) => addImageURLs(item))
      }
    })
  } else {
    const collection = property ? data[property] : data
    if (collection?.items) {
      collection.items.forEach((item: any) => addImageURLs(item))
    }
  }
}

export function withFileURLs(req: Request, data: any, type: EntityType) {
  switch (type) {
    case EntityType.customer:
    case EntityType.employee:
    case EntityType.merchant:
      maybeAddImageURLs(data, 'profileImage')
      break
    case EntityType.service:
    case EntityType.serviceCategory:
    case EntityType.servicePackage:
    case EntityType.banner:
      maybeAddImageURLs(data, 'image')
      break
    case EntityType.optedService:
      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          withFileURLs(req, item.service, EntityType.service)
        })
      } else {
        withFileURLs(req, data.service, EntityType.service)
      }
      break
    case EntityType.file:
      maybeAddImageURLs(data, null)
      break
    case EntityType.filesCollection:
      maybeAddImageCollectionURLs(data, null)
      break
    case EntityType.salon:
      maybeAddImageURLs(data, 'coverImage')
      maybeAddImageCollectionURLs(data, 'imageGallery')
      break
    case EntityType.rating:
      if (data.review) {
        maybeAddImageCollectionURLs(data.review, 'gallery')
      }
      break
  }
}

export function deleteFilesFromFS(name: string, size: ImageSize) {
  fs.unlink(`${uploadDir[size]}/${name}`, (err) => {
    if (err) {
      console.error(err)
    }
  })
}
