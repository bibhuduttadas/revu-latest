import { expressjwt } from 'express-jwt'
import { apiRoot, serverURL } from '~/constants'

export default expressjwt({
  secret: process.env.ACCESS_TOKEN_SECRET!,
  issuer: serverURL.origin,
  audience: `${serverURL.origin}${apiRoot}`,
  algorithms: ['HS256'],
}).unless({
  path: [
    `${apiRoot}/auth/login`,
    `${apiRoot}/auth/otp`,
    {
      url: `${apiRoot}/customers`,
      method: 'POST',
    },
    {
      url: `${apiRoot}/merchants`,
      method: 'POST',
    },
  ],
})
