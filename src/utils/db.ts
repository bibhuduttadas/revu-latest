import { ApplicableSex, Prisma } from '@prisma/client'
import EnumApplicableSexFilter = Prisma.EnumApplicableSexFilter

export function prepareOrderBy(sortBy?: string[]) {
  if (!sortBy) {
    return undefined
  }
  const sortFields: Record<string, Prisma.SortOrder>[] = []
  sortBy.forEach((field) => {
    const matches = field.match(/^([+-])?(\w+)$/)
    if (matches?.length === 3 && matches[2]) {
      const [, sign, sortField] = matches
      sortFields.push({
        [sortField]:
          sign === '-' ? Prisma.SortOrder.desc : Prisma.SortOrder.asc,
      })
    }
  })
  return sortFields
}

export function getApplicableSexFilter(applicableSex?: ApplicableSex) {
  if (!applicableSex) {
    return undefined
  }
  return applicableSex === ApplicableSex.male ||
    applicableSex === ApplicableSex.female
    ? { in: [applicableSex, ApplicableSex.unisex] }
    : applicableSex
}
