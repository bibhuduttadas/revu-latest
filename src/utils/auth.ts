import { randomBytes, scryptSync } from 'crypto'
import jwt from 'jsonwebtoken'
import { apiRoot, serverURL } from '~/constants'

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const buffer = scryptSync(password, salt, 64)
  return `${buffer.toString('hex')}:${salt}`
}

export function comparePassword(
  storedPassword: string,
  suppliedPassword: string
) {
  const [hash, salt] = storedPassword.split(':')
  if (!salt) {
    return false
  }
  const buffer = scryptSync(suppliedPassword, salt, 64)
  return buffer.toString('hex') === hash
}

export function getJWT(payload: string | Buffer | object) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    issuer: serverURL.origin,
    audience: `${serverURL.origin}${apiRoot}`,
  })
}

export function getTokenExpiry(isRefresh = false) {
  const now = new Date()
  if (isRefresh) {
    return new Date(now.setFullYear(now.getFullYear() + 1))
  }
  return new Date(now.setHours(now.getHours() + 1))
}
