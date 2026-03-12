import { Context } from 'elysia'
import statusCode from '../../../../pkg/statusCode'
import Usecase from '../../usecase/usecase'

class Handler {
    constructor(private usecase: Usecase) {}

    public Upload = async (ctx: Context) => {
        try {
            const body = ctx.body as { file: File }
            const file = body.file

            const result = await this.usecase.Upload(file)

            ctx.set.status = statusCode.CREATED
            return { data: result, message: 'UPLOADED' }
        } catch (error) {
            throw error
        }
    }
}

export default Handler
