import { Context } from 'elysia'
import Error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import Jwt from '../../../pkg/jwt'

export const VerifyAuth = (jwt: Jwt) => {
    return async (ctx: any) => {
        const authorization = ctx.request.headers.get('authorization')

        if (!authorization) {
            throw new Error(
                statusCode.UNAUTHORIZED,
                statusCode[statusCode.UNAUTHORIZED]
            )
        }

        const [_, token] = authorization.split('Bearer ')

        if (!token) {
            throw new Error(
                statusCode.UNAUTHORIZED,
                statusCode[statusCode.UNAUTHORIZED]
            )
        }

        const decode = jwt.Verify(token)
        if (!decode) {
            throw new Error(
                statusCode.UNAUTHORIZED,
                statusCode[statusCode.UNAUTHORIZED]
            )
        }

        ctx.user = decode
    }
}
