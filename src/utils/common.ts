export function findMatchingKey<T>(obj: Record<string, T>, value: T) {
  const index = Object.values(obj).indexOf(value)
  return index > -1 ? Object.keys(obj)[index] : undefined
}

export function excludeKey<T, Key extends keyof T>(
  object: T,
  ...keys: Key[]
): Omit<T, Key> {
  for (const key of keys) {
    delete object[key]
  }
  return object
}

export function includesAny<T = string | number>(arr: T[], values: T[]) {
  for (const value of values) {
    if (arr.includes(value)) {
      return true
    }
  }
  return false
}

export function includesAll<T = string | number>(arr: T[], values: T[]) {
  if (arr.length < values.length) {
    return false
  }
  for (const value of values) {
    if (!arr.includes(value)) {
      return false
    }
  }
  return true
}

export function getRandomIdForTime(prefix: string, dateTime = new Date()) {
  const year = dateTime.getFullYear()
  const month = (dateTime.getMonth() + 1).toString().padStart(2, '0')
  const date = dateTime.getDate().toString().padStart(2, '0')
  const id = Math.random().toString(36).slice(6)
  return `${prefix}${year}${month}${date}${id}`
}
