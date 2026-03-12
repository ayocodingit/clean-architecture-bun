import { Context, Next } from 'hono'
import Error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import Jwt from '../../../pkg/jwt'

export const VerifyAuth = (jwt: Jwt) => {
    return async (c: Context, next: Next) => {
        const authorization = c.req.header('authorization')

        if (!authorization) {
            throw new Error(
                statusCode.UNAUTHORIZED,
                statusCode[statusCode.UNAUTHORIZED]
            )
        }

        const [_, token] = authorization.split('Bearer ')

        const decode = jwt.Verify(token)
        if (!decode) {
            throw new Error(
                statusCode.UNAUTHORIZED,
                statusCode[statusCode.UNAUTHORIZED]
            )
        }
        c.set('user', decode)
        await next()
    }
}
