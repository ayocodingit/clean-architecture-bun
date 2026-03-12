import { Context } from 'hono'
import statusCode from '../../../../pkg/statusCode'
import Usecase from '../../usecase/usecase'

class Handler {
    constructor(private usecase: Usecase) {}

    public Upload = async (c: Context) => {
        try {
            const body = await c.req.parseBody()
            const file = body['file'] as File

            const result = await this.usecase.Upload(file)

            return c.json(
                { data: result, message: 'UPLOADED' },
                statusCode.CREATED as any
            )
        } catch (error) {
            throw error
        }
    }
}

export default Handler
